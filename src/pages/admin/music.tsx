import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { AudioTrack } from '../../types/audio';
import { Upload, Trash2, Music, Loader2 } from 'lucide-react';

export default function MusicAdmin() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tracks, setTracks] = useState<AudioTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [artist, setArtist] = useState('');
  const [file, setFile] = useState<File | null>(null);

  // Fetch existing tracks
  useEffect(() => {
    fetchTracks();
  }, []);

  const fetchTracks = async () => {
    try {
      const res = await fetch('/api/audio-tracks');
      const data = await res.json();
      if (res.ok) {
        setTracks(data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to fetch tracks');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      if (!selectedFile.type.match(/audio\/(mpeg|wav|mp3)/)) {
        setError('Please select an MP3 or WAV file');
        return;
      }
      setFile(selectedFile);
      // Auto-fill name from filename if empty
      if (!name) {
        const fileName = selectedFile.name.replace(/\.(mp3|wav)$/i, '');
        setName(fileName);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!file || !name) {
      setError('Please provide a name and select a file');
      return;
    }

    setUploading(true);

    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${name.replace(/[^a-zA-Z0-9]/g, '_')}.${fileExt}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('audio')
        .upload(fileName, file);

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      // Create database record
      const res = await fetch('/api/audio-tracks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          artist: artist || null,
          file_path: fileName,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }

      // Success
      setSuccess(`Track "${name}" uploaded successfully!`);
      setName('');
      setArtist('');
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      fetchTracks();
    } catch (err: any) {
      setError(err.message || 'Failed to upload track');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (track: AudioTrack) => {
    if (!confirm(`Delete "${track.name}"?`)) return;

    try {
      const res = await fetch('/api/audio-tracks', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: track.id, file_path: track.file_path }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }

      setSuccess(`Track "${track.name}" deleted`);
      fetchTracks();
    } catch (err: any) {
      setError(err.message || 'Failed to delete track');
    }
  };

  return (
    <div 
      className="bg-background p-4 sm:p-8 overflow-y-auto"
      style={{ minHeight: '100vh', height: 'auto' }}
    >
      <div className="max-w-2xl mx-auto pb-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-foreground text-xl sm:text-2xl mb-2">
            {'>'} music_admin
          </h1>
          <p className="text-gray text-sm">
            Upload and manage audio tracks for the visualizer
          </p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-4 bg-red/10 border border-red/30 rounded px-4 py-3 text-red text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 bg-green/10 border border-green/30 rounded px-4 py-3 text-green text-sm">
            {success}
          </div>
        )}

        {/* Upload Form */}
        <div className="bg-background border border-foreground/20 rounded-lg p-4 sm:p-6 mb-8">
          <h2 className="text-foreground text-sm sm:text-base mb-4">
            Upload New Track
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-gray text-xs sm:text-sm mb-1">
                Track Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-background border border-foreground/30 rounded px-3 py-2 text-foreground text-sm focus:outline-none focus:border-yellow"
                placeholder="Enter track name"
              />
            </div>

            {/* Artist */}
            <div>
              <label className="block text-gray text-xs sm:text-sm mb-1">
                Artist (optional)
              </label>
              <input
                type="text"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                className="w-full bg-background border border-foreground/30 rounded px-3 py-2 text-foreground text-sm focus:outline-none focus:border-yellow"
                placeholder="Enter artist name"
              />
            </div>

            {/* File */}
            <div>
              <label className="block text-gray text-xs sm:text-sm mb-1">
                Audio File *
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".mp3,.wav,audio/mpeg,audio/wav"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-background border border-foreground/30 rounded px-3 py-3 text-left hover:border-yellow focus:outline-none focus:border-yellow transition-colors"
              >
                {file ? (
                  <span className="text-green text-sm">{file.name}</span>
                ) : (
                  <span className="text-gray text-sm flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Click to select MP3 or WAV file
                  </span>
                )}
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={uploading || !file || !name}
              className="w-full bg-yellow/10 border border-yellow/30 rounded px-4 py-3 text-yellow text-sm hover:bg-yellow/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload Track
                </>
              )}
            </button>
          </form>
        </div>

        {/* Tracks List */}
        <div className="bg-background border border-foreground/20 rounded-lg p-4 sm:p-6">
          <h2 className="text-foreground text-sm sm:text-base mb-4">
            Existing Tracks ({tracks.length})
          </h2>

          {loading ? (
            <div className="text-gray text-sm text-center py-8">
              Loading tracks...
            </div>
          ) : tracks.length === 0 ? (
            <div className="text-gray text-sm text-center py-8">
              No tracks uploaded yet
            </div>
          ) : (
            <div className="space-y-2">
              {tracks.map((track) => (
                <div
                  key={track.id}
                  className="flex items-center justify-between gap-4 p-3 border border-foreground/10 rounded"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Music className="w-4 h-4 text-yellow shrink-0" />
                    <div className="min-w-0">
                      <div className="text-foreground text-sm truncate">
                        {track.name}
                      </div>
                      {track.artist && (
                        <div className="text-gray text-xs truncate">
                          {track.artist}
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(track)}
                    className="p-2 text-red hover:bg-red/10 rounded transition-colors shrink-0"
                    title="Delete track"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Back link */}
        <div className="mt-8 text-center">
          <a href="/" className="text-gray text-sm hover:text-yellow transition-colors">
            ← Back to terminal
          </a>
        </div>
      </div>
    </div>
  );
}
