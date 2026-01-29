'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward, Loader2 } from 'lucide-react';

interface AudioTrack {
  id: string;
  name: string;
  artist?: string;
  file_path: string;
  url: string;
}

interface AudioSource {
  url: string;
  name: string;
  artist?: string;
  isBlob: boolean;
  index?: number;
}

interface AudioVisualizerProps {
  audioElement: HTMLAudioElement;
  isPlaying: boolean;
  barCount?: number;
  fftSize?: number;
  smoothingTimeConstant?: number;
}

// Custom Audio Visualizer Component
const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  audioElement,
  isPlaying,
  barCount = 48,
  fftSize = 1024,
  smoothingTimeConstant = 0.4,
}) => {
  const [frequencyData, setFrequencyData] = useState<number[]>(new Array(barCount).fill(0));
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const isConnectedRef = useRef(false);

  // Gold color from mocha theme
  const BAR_COLOR = '#9B7653';

  // Initialize Web Audio API
  useEffect(() => {
    if (!audioElement || isConnectedRef.current) return;

    try {
      // Create audio context
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContextClass();

      // Create analyser with lower smoothing for more reactive response
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = fftSize;
      analyserRef.current.smoothingTimeConstant = smoothingTimeConstant;
      analyserRef.current.minDecibels = -90;
      analyserRef.current.maxDecibels = -10;

      // Connect audio element to analyser
      sourceRef.current = audioContextRef.current.createMediaElementSource(audioElement);
      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);

      isConnectedRef.current = true;
    } catch (err) {
      console.error('Failed to initialize audio visualizer:', err);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [audioElement, fftSize, smoothingTimeConstant]);

  // Animation loop
  useEffect(() => {
    if (!analyserRef.current || !audioContextRef.current) return;

    const updateFrequencyData = () => {
      if (!analyserRef.current) return;

      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyserRef.current.getByteFrequencyData(dataArray);

      // Only use lower ~40% of frequency spectrum (cut off unused highs)
      const usableLength = Math.floor(bufferLength * 0.4);
      const sampledData: number[] = [];

      for (let i = 0; i < barCount; i++) {
        // Logarithmic distribution - more bars for lower frequencies
        const logIndex = Math.pow(usableLength, i / barCount);
        const index = Math.min(Math.floor(logIndex), usableLength - 1);
        
        // Sample a small range around the index for smoother results
        let sum = 0;
        const range = Math.max(1, Math.floor(usableLength / barCount / 2));
        const start = Math.max(0, index - range);
        const end = Math.min(usableLength, index + range);
        
        for (let j = start; j < end; j++) {
          sum += dataArray[j];
        }
        const avg = sum / (end - start);
        
        // Apply boost and normalize with exponential scaling for more dynamics
        const normalized = avg / 255;
        const boosted = Math.pow(normalized, 0.7) * 100;
        sampledData.push(boosted);
      }

      setFrequencyData(sampledData);
      animationRef.current = requestAnimationFrame(updateFrequencyData);
    };

    if (isPlaying) {
      // Resume audio context if suspended
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
      animationRef.current = requestAnimationFrame(updateFrequencyData);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, barCount]);

  return (
    <>
      {frequencyData.map((value, index) => (
        <div
          key={index}
          className="flex-1 min-w-0 rounded-t-[1px]"
          style={{
            height: `${Math.min(Math.max(value * 2, 2), 200)}px`,
            backgroundColor: BAR_COLOR,
            opacity: 0.6 + (value / 200),
          }}
        />
      ))}
    </>
  );
};

export const MusicPlayer: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [tracks, setTracks] = useState<AudioTrack[]>([]);
  const [loadingTracks, setLoadingTracks] = useState(true);
  const [audioSource, setAudioSource] = useState<AudioSource | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(-1);

  // Fetch tracks from Supabase on mount
  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const res = await fetch('/api/audio-tracks');
        const data = await res.json();
        if (res.ok) {
          setTracks(data);
        } else {
          console.error('Failed to fetch tracks:', data.error);
        }
      } catch (err) {
        console.error('Failed to fetch tracks:', err);
      } finally {
        setLoadingTracks(false);
      }
    };
    fetchTracks();
  }, []);

  // Cleanup blob URLs when source changes or component unmounts
  const cleanupBlobUrl = useCallback((source: AudioSource | null) => {
    if (source?.isBlob && source.url) {
      URL.revokeObjectURL(source.url);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupBlobUrl(audioSource);
    };
  }, []);

  // Load track by index
  const loadTrack = useCallback((index: number) => {
    if (index < 0 || index >= tracks.length) return;
    
    cleanupBlobUrl(audioSource);
    setIsAudioReady(false);
    setCurrentTrackIndex(index);
    
    const track = tracks[index];
    setAudioSource({
      url: track.url,
      name: track.name,
      artist: track.artist,
      isBlob: false,
      index,
    });
  }, [audioSource, cleanupBlobUrl, tracks]);

  // Handle preset file selection
  const handlePresetSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = event.target.value;
    setError(null);
    setIsAudioReady(false);
    
    if (!selectedId) {
      cleanupBlobUrl(audioSource);
      setAudioSource(null);
      setCurrentTrackIndex(-1);
      return;
    }

    const index = tracks.findIndex(t => t.id === selectedId);
    if (index !== -1) {
      loadTrack(index);
    }
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setError(null);
    setIsAudioReady(false);
    
    if (!file) {
      return;
    }

    // Validate file type
    const validTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/wave', 'audio/x-wav'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(mp3|wav)$/i)) {
      setError('Please upload an MP3 or WAV file');
      return;
    }

    // Cleanup previous blob URL if exists
    cleanupBlobUrl(audioSource);

    // Create blob URL
    const blobUrl = URL.createObjectURL(file);
    setAudioSource({
      url: blobUrl,
      name: file.name,
      isBlob: true,
    });
    setCurrentTrackIndex(-1);

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Clear current audio source
  const handleClear = () => {
    cleanupBlobUrl(audioSource);
    setAudioSource(null);
    setError(null);
    setIsPlaying(false);
    setIsAudioReady(false);
    setCurrentTrackIndex(-1);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Playback controls
  const togglePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  const playPrevious = () => {
    if (audioSource?.isBlob || tracks.length === 0) return;
    const newIndex = currentTrackIndex <= 0 ? tracks.length - 1 : currentTrackIndex - 1;
    loadTrack(newIndex);
  };

  const playNext = () => {
    if (audioSource?.isBlob || tracks.length === 0) return;
    const newIndex = currentTrackIndex >= tracks.length - 1 ? 0 : currentTrackIndex + 1;
    loadTrack(newIndex);
  };

  // Handle audio events
  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleEnded = () => {
    setIsPlaying(false);
    // Auto-play next track if not a blob
    if (!audioSource?.isBlob && tracks.length > 1) {
      playNext();
    }
  };
  const handleCanPlay = () => {
    setIsAudioReady(true);
    // Auto-play when track changes
    if (audioRef.current && currentTrackIndex >= 0) {
      audioRef.current.play();
    }
  };
  const handleError = () => {
    setError('Failed to load audio file. Please try another file.');
    setIsAudioReady(false);
  };

  // Trigger file input click
  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      {/* Card Container */}
      <div className="bg-background border border-foreground/20 rounded-lg overflow-hidden">
        {/* Header */}
        <div className="border-b border-foreground/20 px-4 py-3">
          <h2 className="text-foreground text-sm sm:text-base font-normal">
            {'>'} audio_visualizer
          </h2>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Error Display */}
          {error && (
            <div className="bg-red/10 border border-red/30 rounded px-3 py-2 text-red text-xs sm:text-sm">
              {error}
            </div>
          )}

          {/* Source Selection */}
          <div className="space-y-3">
            {/* Tracks Dropdown */}
            <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
              <label className="text-gray text-xs sm:text-sm shrink-0">
                track:
              </label>
              {loadingTracks ? (
                <div className="flex-1 flex items-center gap-2 text-gray text-xs sm:text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  loading tracks...
                </div>
              ) : (
                <select
                  className="flex-1 bg-background border border-foreground/30 rounded px-3 py-2 text-foreground text-xs sm:text-sm focus:outline-none focus:border-yellow transition-colors cursor-pointer"
                  onChange={handlePresetSelect}
                  value={audioSource?.isBlob === false && currentTrackIndex >= 0 ? tracks[currentTrackIndex]?.id : ''}
                  disabled={audioSource?.isBlob || tracks.length === 0}
                >
                  <option value="">{tracks.length === 0 ? '-- no tracks available --' : '-- select a track --'}</option>
                  {tracks.map((track) => (
                    <option key={track.id} value={track.id}>
                      {track.name}{track.artist ? ` - ${track.artist}` : ''}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 border-t border-foreground/10" />
              <span className="text-gray text-xs">or</span>
              <div className="flex-1 border-t border-foreground/10" />
            </div>

            {/* File Upload */}
            <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
              <label className="text-gray text-xs sm:text-sm shrink-0">
                upload:
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".mp3,.wav,audio/mpeg,audio/wav"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={triggerFileUpload}
                className="flex-1 bg-background border border-foreground/30 rounded px-3 py-2 text-foreground text-xs sm:text-sm text-left hover:border-yellow focus:outline-none focus:border-yellow transition-colors"
              >
                {audioSource?.isBlob ? (
                  <span className="text-green">{audioSource.name}</span>
                ) : (
                  <span className="text-gray">click to upload .mp3 or .wav</span>
                )}
              </button>
              {audioSource && (
                <button
                  onClick={handleClear}
                  className="px-3 py-2 text-red text-xs sm:text-sm border border-red/30 rounded hover:bg-red/10 transition-colors"
                >
                  clear
                </button>
              )}
            </div>
          </div>

          {/* Audio Player */}
          {audioSource && (
            <>
              {/* Hidden Audio Element */}
              <audio
                ref={audioRef}
                src={audioSource.url}
                crossOrigin="anonymous"
                onPlay={handlePlay}
                onPause={handlePause}
                onEnded={handleEnded}
                onCanPlay={handleCanPlay}
                onError={handleError}
                className="hidden"
              />

              {/* Custom Frequency Visualizer */}
              {isAudioReady && audioRef.current ? (
                <div className="w-full h-[200px] flex items-end gap-[1px] rounded overflow-hidden border border-foreground/10">
                  <AudioVisualizer
                    audioElement={audioRef.current}
                    isPlaying={isPlaying}
                    barCount={48}
                    fftSize={1024}
                    smoothingTimeConstant={0.4}
                  />
                </div>
              ) : (
                <div className="w-full h-[200px] rounded border border-foreground/10 flex items-center justify-center">
                  <span className="text-gray text-xs sm:text-sm animate-pulse">
                    loading audio...
                  </span>
                </div>
              )}

              {/* Playback Controls */}
              <div className="flex items-center justify-center gap-4 pt-2">
                {/* Previous */}
                <button
                  onClick={playPrevious}
                  disabled={audioSource.isBlob || tracks.length <= 1}
                  className="p-2 text-foreground hover:text-yellow disabled:text-gray disabled:cursor-not-allowed transition-colors"
                  title="Previous track"
                >
                  <SkipBack className="w-5 h-5" />
                </button>

                {/* Play/Pause */}
                <button
                  onClick={togglePlayPause}
                  disabled={!isAudioReady}
                  className="p-3 bg-yellow/10 border border-yellow/30 rounded-full text-yellow hover:bg-yellow/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6 ml-0.5" />
                  )}
                </button>

                {/* Next */}
                <button
                  onClick={playNext}
                  disabled={audioSource.isBlob || tracks.length <= 1}
                  className="p-2 text-foreground hover:text-yellow disabled:text-gray disabled:cursor-not-allowed transition-colors"
                  title="Next track"
                >
                  <SkipForward className="w-5 h-5" />
                </button>
              </div>

              {/* Track Name */}
              <div className="text-center text-xs sm:text-sm">
                <span className="text-green">{audioSource.name}</span>
                {audioSource.artist && (
                  <span className="text-gray"> - {audioSource.artist}</span>
                )}
              </div>
            </>
          )}

          {/* Empty State */}
          {!audioSource && (
            <div className="py-8 text-center">
              <div className="text-gray text-xs sm:text-sm">
                select a preset or upload an audio file to visualize
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
