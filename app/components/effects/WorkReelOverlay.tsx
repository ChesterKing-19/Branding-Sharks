'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useVideoState } from './useVideoState';
import { VideoControls } from './VideoControls';
import './FlexCarousel.css';

export interface WorkReelItem {
  title?: string;
  alt?: string;
  src: string;
  videoSrc: string;
  poster?: string;
}

interface WorkReelOverlayProps {
  item: WorkReelItem;
  onClose: () => void;
}

/**
 * Standalone fullscreen reel player (no carousel engine required).
 * Shares player chrome + styles with FlexCarouselReel: portalled to
 * document.body, statically centered via CSS, closes on backdrop press
 * or Escape. Used by the mobile Work spiral; desktop keeps its
 * morphing FlexCarouselReel.
 */
export function WorkReelOverlay({ item, onClose }: WorkReelOverlayProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const downRef = useRef<{ onVideo: boolean } | null>(null);
  const closedRef = useRef(false);
  const [mounted, setMounted] = useState(false);
  const ui = useVideoState();
  const { setVideoNode } = ui;

  const setVideoEl = useCallback(
    (el: HTMLVideoElement | null) => {
      videoRef.current = el;
      setVideoNode(el);
    },
    [setVideoNode]
  );

  const requestClose = useCallback(() => {
    if (closedRef.current) return;
    closedRef.current = true;
    videoRef.current?.pause();
    onClose();
  }, [onClose]);

  useEffect(() => {
    setMounted(true);
    closedRef.current = false;

    document.body.dataset.reelOpen = '';
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const inPlayer = (target: EventTarget | null) =>
      !!(target as HTMLElement | null)?.closest('video, .vui-bar, .vui-center');

    const onPointerDown = (e: PointerEvent) => {
      downRef.current = { onVideo: inPlayer(e.target) };
    };
    const onPointerUp = (e: PointerEvent) => {
      const down = downRef.current;
      downRef.current = null;
      if (!down || down.onVideo) return;
      if (inPlayer(e.target)) return;
      requestClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') requestClose();
    };

    window.addEventListener('pointerdown', onPointerDown, { capture: true });
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('keydown', onKey);

    return () => {
      window.removeEventListener('pointerdown', onPointerDown, { capture: true });
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('keydown', onKey);
      videoRef.current?.pause();
      delete document.body.dataset.reelOpen;
      document.body.style.overflow = prevOverflow;
    };
  }, [item.videoSrc, requestClose]);

  if (!mounted || typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="flex-reel-layer"
      role="dialog"
      aria-modal="true"
      aria-label={item.title ?? item.alt ?? 'Showreel'}
      onPointerMove={ui.poke}
      onTouchStart={ui.poke}
      onFocusCapture={ui.poke}
    >
      <div className="flex-reel-backdrop" />
      <div ref={boxRef} className="flex-reel-box">
        <video
          ref={setVideoEl}
          key={item.videoSrc}
          className="flex-reel-video"
          src={item.videoSrc}
          poster={item.poster ?? item.src}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          tabIndex={0}
          aria-label={item.alt ?? item.title ?? 'Showreel'}
          onClick={ui.toggle}
          onKeyDown={(e) => {
            if (e.key === ' ' || e.key === 'k' || e.key === 'K') {
              e.preventDefault();
              ui.toggle();
            }
          }}
        />
        <VideoControls state={ui} title={item.title ?? 'Showreel'} onClose={requestClose} />
      </div>
    </div>,
    document.body
  );
}
