"use client";
import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Loader2,
  Shuffle,
} from "lucide-react";
import { TrackSelect } from "./dropdown";
import { formatTime, shuffleArray } from "../utils/music";
interface AudioTrack {
  id: string;
  name: string;
  artist?: string;
  description?: string;
  file_path: string;
  url: string;
}
interface AudioSource {
  url: string;
  name: string;
  artist?: string;
  description?: string;
  index: number;
}
interface AudioVisualizerProps {
  analyser: AnalyserNode | null;
  audioContext: AudioContext | null;
  isPlaying: boolean;
  barCount?: number;
}
const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  analyser,
  audioContext,
  isPlaying,
  barCount = 48,
}) => {
  const [frequencyData, setFrequencyData] = useState<number[]>(
    new Array(barCount).fill(0)
  );
  const animationRef = useRef<number | null>(null);
  const BAR_COLOR = "#9B7653";
  useEffect(() => {
    if (!analyser || !audioContext) return;
    const updateFrequencyData = () => {
      if (!analyser) return;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray);
      const usableLength = Math.floor(bufferLength * 0.4);
      const sampledData: number[] = [];
      for (let i = 0; i < barCount; i++) {
        const logIndex = Math.pow(usableLength, i / barCount);
        const index = Math.min(Math.floor(logIndex), usableLength - 1);
        let sum = 0;
        const range = Math.max(1, Math.floor(usableLength / barCount / 2));
        const start = Math.max(0, index - range);
        const end = Math.min(usableLength, index + range);
        for (let j = start; j < end; j++) {
          sum += dataArray[j];
        }
        const avg = sum / (end - start);
        const normalized = avg / 255;
        const boosted = Math.pow(normalized, 0.7) * 100;
        sampledData.push(boosted);
      }
      setFrequencyData(sampledData);
      animationRef.current = requestAnimationFrame(updateFrequencyData);
    };
    if (isPlaying) {
      if (audioContext.state === "suspended") {
        audioContext.resume();
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
  }, [isPlaying, barCount, analyser, audioContext]);
  return (
    <>
      {frequencyData.map((value, index) => (
        <div
          key={index}
          className="flex-1 min-w-0 rounded-t-[1px]"
          style={{
            height: `${Math.min(Math.max(value * 2, 2), 200)}px`,
            backgroundColor: BAR_COLOR,
            opacity: 0.6 + value / 200,
          }}
        />
      ))}
    </>
  );
};
export const MusicPlayer: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const isAudioConnectedRef = useRef(false);
  const [tracks, setTracks] = useState<AudioTrack[]>([]);
  const [loadingTracks, setLoadingTracks] = useState(true);
  const [audioSource, setAudioSource] = useState<AudioSource | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(-1);
  const [shuffleEnabled, setShuffleEnabled] = useState(false);
  const [shuffleOrder, setShuffleOrder] = useState<number[]>([]);
  const [playQueue, setPlayQueue] = useState<number[]>([]);
  const [playHistory, setPlayHistory] = useState<number[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [audioConnected, setAudioConnected] = useState(false);
  const initializeAudioContext = useCallback(() => {
    if (!audioRef.current || isAudioConnectedRef.current) return;
    try {
      const AudioContextClass =
        window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContextClass();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 1024;
      analyserRef.current.smoothingTimeConstant = 0.4;
      analyserRef.current.minDecibels = -90;
      analyserRef.current.maxDecibels = -10;
      sourceRef.current = audioContextRef.current.createMediaElementSource(
        audioRef.current
      );
      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);
      isAudioConnectedRef.current = true;
      setAudioConnected(true);
    } catch (err) {
      console.error("Failed to initialize audio context:", err);
    }
  }, []);
  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const res = await fetch("/api/audio-tracks");
        const data = await res.json();
        if (res.ok) {
          setTracks(data);
        } else {
          console.error("Failed to fetch tracks:", data.error);
        }
      } catch (err) {
        console.error("Failed to fetch tracks:", err);
      } finally {
        setLoadingTracks(false);
      }
    };
    fetchTracks();
  }, []);
  const generateShuffleOrder = useCallback((): number[] => {
    const indices = tracks.map((_, i) => i);
    return shuffleArray(indices);
  }, [tracks]);
  const getQueueFromShuffleOrder = useCallback(
    (currentIndex: number, order: number[]): number[] => {
      if (order.length === 0) return [];
      const positionInOrder = order.indexOf(currentIndex);
      if (positionInOrder === -1) {
        return order.filter((i) => i !== currentIndex);
      }
      const afterCurrent = order.slice(positionInOrder + 1);
      const beforeCurrent = order.slice(0, positionInOrder);
      return [...afterCurrent, ...beforeCurrent];
    },
    []
  );
  const loadTrack = useCallback(
    (index: number) => {
      if (index < 0 || index >= tracks.length) return;
      setIsAudioReady(false);
      setCurrentTime(0);
      setDuration(0);
      setCurrentTrackIndex(index);
      const track = tracks[index];
      setAudioSource({
        url: track.url,
        name: track.name,
        artist: track.artist,
        description: track.description,
        index,
      });
    },
    [tracks]
  );
  const handleTrackSelect = useCallback(
    (selectedId: string) => {
      setError(null);
      setIsAudioReady(false);
      if (!selectedId) {
        setAudioSource(null);
        setCurrentTrackIndex(-1);
        setPlayQueue([]);
        setPlayHistory([]);
        return;
      }
      const index = tracks.findIndex((t) => t.id === selectedId);
      if (index !== -1) {
        if (shuffleEnabled && shuffleOrder.length > 0) {
          setPlayQueue(getQueueFromShuffleOrder(index, shuffleOrder));
        }
        setPlayHistory([]);
        loadTrack(index);
      }
    },
    [tracks, shuffleEnabled, shuffleOrder, getQueueFromShuffleOrder, loadTrack]
  );
  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };
  const playPrevious = useCallback(() => {
    if (tracks.length === 0) return;
    if (audioRef.current && currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }
    if (playHistory.length > 0) {
      const newHistory = [...playHistory];
      const previousIndex = newHistory.pop()!;
      setPlayHistory(newHistory);
      setPlayQueue((prev) => [currentTrackIndex, ...prev]);
      loadTrack(previousIndex);
    } else {
      const newIndex =
        currentTrackIndex <= 0 ? tracks.length - 1 : currentTrackIndex - 1;
      loadTrack(newIndex);
    }
  }, [tracks.length, currentTime, playHistory, currentTrackIndex, loadTrack]);
  const playNext = useCallback(() => {
    if (tracks.length === 0) return;
    if (currentTrackIndex >= 0) {
      setPlayHistory((prev) => [...prev, currentTrackIndex]);
    }
    if (shuffleEnabled) {
      let queue = [...playQueue];
      if (queue.length === 0 && shuffleOrder.length > 0) {
        queue = getQueueFromShuffleOrder(currentTrackIndex, shuffleOrder);
      }
      const nextIndex = queue.shift()!;
      setPlayQueue(queue);
      loadTrack(nextIndex);
    } else {
      const newIndex =
        currentTrackIndex >= tracks.length - 1 ? 0 : currentTrackIndex + 1;
      loadTrack(newIndex);
    }
  }, [
    shuffleEnabled,
    playQueue,
    shuffleOrder,
    getQueueFromShuffleOrder,
    loadTrack,
    currentTrackIndex,
    tracks.length,
  ]);
  const toggleShuffle = useCallback(() => {
    setShuffleEnabled((prev) => {
      const newShuffleEnabled = !prev;
      if (newShuffleEnabled) {
        let order = shuffleOrder;
        if (order.length === 0 || order.length !== tracks.length) {
          order = generateShuffleOrder();
          setShuffleOrder(order);
        }
        setPlayQueue(getQueueFromShuffleOrder(currentTrackIndex, order));
      } else {
        setPlayQueue([]);
      }
      setPlayHistory([]);
      return newShuffleEnabled;
    });
  }, [
    generateShuffleOrder,
    getQueueFromShuffleOrder,
    currentTrackIndex,
    shuffleOrder,
    tracks.length,
  ]);
  const handlePlay = useCallback(() => {
    initializeAudioContext();
    setIsPlaying(true);
  }, [initializeAudioContext]);
  const handlePause = () => setIsPlaying(false);
  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    if (tracks.length > 0) {
      playNext();
    }
  }, [tracks.length, playNext]);
  const handleCanPlay = useCallback(() => {
    setIsAudioReady(true);
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
    if (audioRef.current && currentTrackIndex >= 0) {
      audioRef.current.play();
    }
  }, [currentTrackIndex]);
  const handleTimeUpdate = () => {
    if (audioRef.current && !isDragging) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };
  const handleError = () => {
    setError("Failed to load audio file. Please try another track.");
    setIsAudioReady(false);
  };
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !audioRef.current || !duration) return;
    const rect = progressRef.current.getBoundingClientRect();
    const percent = Math.max(
      0,
      Math.min(1, (e.clientX - rect.left) / rect.width)
    );
    const newTime = percent * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };
  const handleSeekStart = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleSeek(e);
  };
  const handleSeekMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !progressRef.current || !audioRef.current || !duration)
        return;
      const rect = progressRef.current.getBoundingClientRect();
      const percent = Math.max(
        0,
        Math.min(1, (e.clientX - rect.left) / rect.width)
      );
      const newTime = percent * duration;
      setCurrentTime(newTime);
    },
    [isDragging, duration]
  );
  const handleSeekEnd = useCallback(() => {
    if (isDragging && audioRef.current) {
      audioRef.current.currentTime = currentTime;
    }
    setIsDragging(false);
  }, [isDragging, currentTime]);
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleSeekMove);
      window.addEventListener("mouseup", handleSeekEnd);
      return () => {
        window.removeEventListener("mousemove", handleSeekMove);
        window.removeEventListener("mouseup", handleSeekEnd);
      };
    }
  }, [isDragging, handleSeekMove, handleSeekEnd]);
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <div className="bg-background border border-foreground/20 rounded-lg overflow-hidden">
        <div className="border-b border-foreground/20 px-4 py-3">
          <h2 className="text-foreground text-sm sm:text-base font-normal">
            {">"} audio_visualizer
          </h2>
        </div>
        <div className="p-4 space-y-4">
          {error && (
            <div className="bg-red/10 border border-red/30 rounded px-3 py-2 text-red text-xs sm:text-sm">
              {error}
            </div>
          )}
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
              <TrackSelect
                tracks={tracks}
                value={
                  currentTrackIndex >= 0 ? tracks[currentTrackIndex]?.id : ""
                }
                onChange={handleTrackSelect}
                disabled={tracks.length === 0}
              />
            )}
          </div>
          {audioSource && (
            <>
              <audio
                ref={audioRef}
                src={audioSource.url}
                crossOrigin="anonymous"
                onPlay={handlePlay}
                onPause={handlePause}
                onEnded={handleEnded}
                onCanPlay={handleCanPlay}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onError={handleError}
                className="hidden"
              />
              <div className="w-full h-[200px] flex items-end gap-[1px] rounded overflow-hidden border border-foreground/10">
                {isAudioReady && audioConnected ? (
                  <AudioVisualizer
                    analyser={analyserRef.current}
                    audioContext={audioContextRef.current}
                    isPlaying={isPlaying}
                    barCount={48}
                  />
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <span className="text-gray text-xs sm:text-sm animate-pulse">
                      {isAudioReady
                        ? "press play to start visualizer"
                        : "loading audio..."}
                    </span>
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <div
                  ref={progressRef}
                  className="relative w-full h-1 bg-foreground/20 rounded-full cursor-pointer group"
                  onMouseDown={handleSeekStart}
                >
                  <div
                    className="absolute left-0 top-0 h-full bg-yellow rounded-full transition-all duration-75"
                    style={{ width: `${progressPercent}%` }}
                  />
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-yellow rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                    style={{ left: `calc(${progressPercent}% - 6px)` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] sm:text-xs text-gray">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
              <div className="flex items-center justify-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={toggleShuffle}
                  className={`p-2 transition-colors ${
                    shuffleEnabled
                      ? "text-yellow"
                      : "text-foreground hover:text-yellow"
                  }`}
                  aria-label={shuffleEnabled ? "Shuffle on" : "Shuffle off"}
                >
                  <Shuffle className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={playPrevious}
                  disabled={tracks.length <= 1}
                  className="p-2 text-foreground hover:text-yellow disabled:text-gray disabled:cursor-not-allowed transition-colors"
                  aria-label="Previous track"
                >
                  <SkipBack className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={togglePlayPause}
                  disabled={!isAudioReady}
                  className="p-3 bg-yellow/10 border border-yellow/30 rounded-full text-yellow hover:bg-yellow/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6 ml-0.5" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={playNext}
                  disabled={tracks.length <= 1}
                  className="p-2 text-foreground hover:text-yellow disabled:text-gray disabled:cursor-not-allowed transition-colors"
                  aria-label="Next track"
                >
                  <SkipForward className="w-5 h-5" />
                </button>
                <div className="w-8" />
              </div>
              <div className="text-center space-y-2">
                <div className="text-xs sm:text-sm">
                  <span className="text-green">{audioSource.name}</span>
                  {audioSource.artist && (
                    <span className="text-gray"> - {audioSource.artist}</span>
                  )}
                </div>
                {audioSource.description && (
                  <div className="text-gray/70 text-xs italic px-4">
                    "{audioSource.description}"
                  </div>
                )}
              </div>
            </>
          )}
          {!audioSource && (
            <div className="py-8 text-center">
              <div className="text-gray text-xs sm:text-sm">
                select a track to start listening
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default MusicPlayer;
