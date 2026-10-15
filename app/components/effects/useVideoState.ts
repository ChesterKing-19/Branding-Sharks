'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface VideoState {
  playing: boolean;
  time: number;
  duration: number;
  buffered: number;
  waiting: boolean;
  idle: boolean;
  muted: boolean;
  volume: number;
  /** Callback ref for the <video> element. Attaches listeners on mount. */
  setVideoNode: (node: HTMLVideoElement | null) => void;
  toggle: () => void;
  seek: (to: number) => void;
  toggleMute: () => void;
  setVolume: (value: number) => void;
  poke: () => void;
}

export const formatTime = (s: number): string => {
  if (!Number.isFinite(s) || s < 0) s = 0;
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, '0')}`;
};

const IDLE_MS = 2500;

/**
 * Drives bespoke player UI from a native <video> element.
 * Listeners attach via the `setVideoNode` callback ref, so they survive
 * portal-gated mounting (the node may appear after first commit).
 * `poke()` (pointer move / touch / focus) reveals the chrome;
 * it auto-hides after IDLE_MS while playing.
 */
export function useVideoState(): VideoState {
  const [node, setNode] = useState<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [waiting, setWaiting] = useState(true);
  const [idle, setIdle] = useState(false);
  const [muted, setMuted] = useState(true);
  const [volume, setVolumeState] = useState(1);
  const idleTimer = useRef(0);
  const nodeRef = useRef<HTMLVideoElement | null>(null);
  nodeRef.current = node;

  const poke = useCallback(() => {
    setIdle(false);
    window.clearTimeout(idleTimer.current);
    const v = nodeRef.current;
    if (v && !v.paused && !v.ended) {
      idleTimer.current = window.setTimeout(() => setIdle(true), IDLE_MS);
    }
  }, []);

  const setVideoNode = useCallback((next: HTMLVideoElement | null) => {
    setNode(next);
  }, []);

  useEffect(() => {
    const v = node;
    if (!v) return;
    // Sync state in case the node arrived already playing / with metadata.
    setPlaying(!v.paused && !v.ended);
    setTime(v.currentTime || 0);
    setDuration(v.duration || 0);
    setWaiting(v.readyState < 3);
    // Autoplay must start muted (browser policy); the chrome exposes unmute.
    v.muted = true;
    setMuted(true);
    setVolumeState(v.volume);
    if (v.paused) void v.play().catch(() => {});
    const onPlay = () => {
      setPlaying(true);
      poke();
    };
    const onPause = () => {
      setPlaying(false);
      window.clearTimeout(idleTimer.current);
      setIdle(false);
    };
    const onTime = () => setTime(v.currentTime || 0);
    const onMeta = () => {
      setDuration(v.duration || 0);
      setTime(v.currentTime || 0);
    };
    const onProgress = () => {
      try {
        const n = v.buffered.length;
        setBuffered(n ? v.buffered.end(n - 1) : 0);
      } catch {
        setBuffered(0);
      }
    };
    const onWait = () => setWaiting(true);
    const onReady = () => setWaiting(false);
    const onVolume = () => {
      setMuted(v.muted);
      setVolumeState(v.volume);
    };
    v.addEventListener('play', onPlay);
    v.addEventListener('pause', onPause);
    v.addEventListener('timeupdate', onTime);
    v.addEventListener('loadedmetadata', onMeta);
    v.addEventListener('durationchange', onMeta);
    v.addEventListener('progress', onProgress);
    v.addEventListener('waiting', onWait);
    v.addEventListener('playing', onReady);
    v.addEventListener('canplay', onReady);
    v.addEventListener('volumechange', onVolume);
    return () => {
      v.removeEventListener('play', onPlay);
      v.removeEventListener('pause', onPause);
      v.removeEventListener('timeupdate', onTime);
      v.removeEventListener('loadedmetadata', onMeta);
      v.removeEventListener('durationchange', onMeta);
      v.removeEventListener('progress', onProgress);
      v.removeEventListener('waiting', onWait);
      v.removeEventListener('playing', onReady);
      v.removeEventListener('canplay', onReady);
      v.removeEventListener('volumechange', onVolume);
      window.clearTimeout(idleTimer.current);
    };
  }, [node, poke]);

  const toggle = useCallback(() => {
    const v = nodeRef.current;
    if (!v) return;
    if (v.paused || v.ended) void v.play().catch(() => {});
    else v.pause();
    poke();
  }, [poke]);

  const seek = useCallback(
    (to: number) => {
      const v = nodeRef.current;
      if (!v || !Number.isFinite(v.duration)) return;
      v.currentTime = Math.min(Math.max(0, to), v.duration);
      setTime(v.currentTime);
      poke();
    },
    [poke]
  );

  const toggleMute = useCallback(() => {
    const v = nodeRef.current;
    if (!v) return;
    if (v.muted || v.volume === 0) {
      if (v.volume === 0) v.volume = 1;
      v.muted = false;
    } else {
      v.muted = true;
    }
    poke();
  }, [poke]);

  const setVolume = useCallback(
    (value: number) => {
      const v = nodeRef.current;
      if (!v) return;
      const next = Math.min(1, Math.max(0, value));
      v.volume = next;
      v.muted = next === 0;
      poke();
    },
    [poke]
  );

  return {
    playing,
    time,
    duration,
    buffered,
    waiting,
    idle,
    muted,
    volume,
    setVideoNode,
    toggle,
    seek,
    toggleMute,
    setVolume,
    poke,
  };
}
