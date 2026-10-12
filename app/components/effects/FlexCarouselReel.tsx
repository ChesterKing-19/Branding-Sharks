'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { FlexCarouselItem, FocusRect } from './FlexCarousel';
import { useVideoState } from './useVideoState';
import { VideoControls } from './VideoControls';

interface EngineHandle {
  getFocus: () => FocusRect | null;
  close: () => void;
  setFocusCardHidden: (hidden: boolean) => void;
}

interface FlexCarouselReelProps {
  item: FlexCarouselItem;
  engineRef: { current: EngineHandle | null };
  /** Ref of the carousel container, for container→viewport mapping. */
  hostRef: { current: HTMLElement | null };
  onClose: () => void;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const DEV = process.env.NODE_ENV !== 'production';

/**
 * Inline zoom-to-play reel. Portalled to document.body so no ancestor
 * can clip or contain it; morphs from the card rect to the reel aspect
 * each frame in viewport coordinates, using the engine's own eased
 * focus amount. Presses starting outside the <video> (tap or drag)
 * close back to the carousel; Escape closes.
 */
export function FlexCarouselReel({ item, engineRef, hostRef, onClose }: FlexCarouselReelProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const downRef = useRef<{ onVideo: boolean } | null>(null);
  const closedRef = useRef(false);
  const [mounted, setMounted] = useState(false);
  const ui = useVideoState();
  const { setVideoNode } = ui;

  // The <video> mounts a render after this effect first runs (portal
  // gate), so the callback ref — not the mount effect — owns the node.
  const setVideoEl = useCallback(
    (el: HTMLVideoElement | null) => {
      videoRef.current = el;
      setVideoNode(el);
    },
    [setVideoNode]
  );

  const requestClose = useCallback(() => {
    videoRef.current?.pause();
    engineRef.current?.close();
    onClose();
  }, [engineRef, onClose]);

  const aspect = item.videoAspect ?? 9 / 16;

  useEffect(() => {
    setMounted(true);
    closedRef.current = false;
    let raf = 0;
    const mountAt = performance.now();
    let positioned = false;
    let warned = false;
    if (DEV) console.info(`[reel] overlay mounted: ${item.title ?? item.videoSrc}`);
    // Melt the canvas card out while the video plays over it.
    engineRef.current?.setFocusCardHidden(true);

    // Small touch screens: skip the morph entirely and render statically
    // centered via CSS. No engine rects, offsets, or toolbar math — a
    // centered player cannot misplace on dynamic mobile viewports.
    const staticMode =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(pointer: coarse)').matches &&
      Math.min(window.innerWidth, window.innerHeight) < 600;
    if (staticMode && DEV) console.info('[reel] static centered mode (touch small-screen)');

    const close = () => {
      if (closedRef.current) return;
      closedRef.current = true;
      videoRef.current?.pause();
      engineRef.current?.close();
      onClose();
    };

    // Fullscreen stage state: dim/blur painted by CSS, scroll locked,
    // floating scroll-to-top parked (see FlexCarousel.css).
    document.body.dataset.reelOpen = '';
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Player chrome lives beside <video> (not inside it), and React
    // stopPropagation doesn't restrain native window listeners — so the
    // close check must exempt the whole chrome explicitly.
    const inPlayer = (target: EventTarget | null) =>
      !!(target as HTMLElement | null)?.closest('video, .vui-bar, .vui-center');

    const onPointerDown = (e: PointerEvent) => {
      downRef.current = { onVideo: inPlayer(e.target) };
    };
    // Press starting outside the player closes back to the carousel.
    // Taps and drags both count (mirrors the engine: drag while zoomed
    // closes); player interactions (seek/volume/buttons) never close.
    const onPointerUp = (e: PointerEvent) => {
      const down = downRef.current;
      downRef.current = null;
      if (!down || down.onVideo) return;
      if (inPlayer(e.target)) return;
      close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };

    const paint = (x: number, y: number, w: number, h: number, opacity: number) => {
      const box = boxRef.current;
      const backdrop = backdropRef.current;
      if (!box) return;
      box.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
      box.style.width = `${w.toFixed(1)}px`;
      box.style.height = `${h.toFixed(1)}px`;
      box.style.opacity = opacity < 0.02 ? '0' : String(Math.min(1, opacity));
      if (backdrop) backdrop.style.opacity = opacity < 0.02 ? '0' : String(Math.min(1, opacity));
    };

    const targetSize = () => {
      // visualViewport tracks iOS Safari's dynamic toolbar in real time;
      // window dimensions include area hidden behind it.
      const vv = window.visualViewport;
      const vw = vv ? vv.width : window.innerWidth;
      const vh = vv ? vv.height : window.innerHeight;
      const maxW = vw * 0.94;
      const maxH = vh * 0.94;
      let tw = maxW;
      let th = tw / aspect;
      if (th > maxH) {
        th = maxH;
        tw = th * aspect;
      }
      return { tw, th, vw, vh, ox: vv ? vv.offsetLeft : 0, oy: vv ? vv.offsetTop : 0 };
    };

    // A misplaced frame self-corrects next tick instead of sticking
    // off-screen (mobile toolbars shift the viewport while open).
    const clampToView = (
      x: number,
      y: number,
      w: number,
      h: number,
      vw: number,
      vh: number,
      vox: number,
      voy: number
    ) => {
      const m = 8;
      const maxX = vox + vw - w - m;
      const maxY = voy + vh - h - m;
      return {
        x: Math.min(Math.max(x, vox + m), Math.max(vox + m, maxX)),
        y: Math.min(Math.max(y, voy + m), Math.max(voy + m, maxY)),
      };
    };

    const tick = () => {
      raf = 0;
      const engine = engineRef.current;
      const box = boxRef.current;
      const focus = engine?.getFocus() ?? null;
      if (!box) return;
      if (!focus) {
        // Failsafe: never stay invisible. If geometry never arrives,
        // center the player at target size so the reel is always usable.
        if (performance.now() - mountAt > 1000) {
          if (!warned) {
            warned = true;
            if (DEV) console.warn('[reel] no focus geometry after 1s, using centered fallback');
          }
          const { tw, th, vw, vh, ox: vox, oy: voy } = targetSize();
          // Center within the *visible* viewport (vox/voy offset included).
          paint(vox + (vw - tw) / 2, voy + (vh - th) / 2, tw, th, 1);
          return;
        }
        // Engine hasn't drawn the focused frame yet (first ticks) — retry.
        // A real close unmounts us via the parent's focusOpen state.
        raf = requestAnimationFrame(tick);
        return;
      }
      // Viewport coordinates: engine rect is container-relative.
      const host = hostRef.current?.getBoundingClientRect();
      const ox = host ? host.left : 0;
      const oy = host ? host.top : 0;
      const t = focus.amount;
      const c = focus.rect;
      // Morph origin in viewport space (fixes off-screen start on scrolled pages).
      const sx = c.x + ox;
      const sy = c.y + oy;
      const { tw, th, vw, vh, ox: vox, oy: voy } = targetSize();
      const tx = sx - tw / 2;
      const ty = sy - th / 2;
      const w = lerp(c.w, tw, t);
      const h = lerp(c.h, th, t);
      const clamped = clampToView(lerp(sx - c.w / 2, tx, t), lerp(sy - c.h / 2, ty, t), w, h, vw, vh, vox, voy);
      const { x, y } = clamped;
      paint(x, y, w, h, t * 1.5);
      if (!positioned) {
        positioned = true;
        if (DEV) console.info(`[reel] first positioned frame: ${item.title ?? item.videoSrc}`);
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('pointerdown', onPointerDown, { capture: true });
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('keydown', onKey);
    // Static mode needs no positioning loop: CSS centers the player and
    // fades the backdrop. Listeners above still handle close.
    if (!staticMode) raf = requestAnimationFrame(tick);
    videoRef.current?.focus({ preventScroll: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointerdown', onPointerDown, { capture: true });
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('keydown', onKey);
      videoRef.current?.pause();
      // Always restore the card, even if the engine closed beneath us.
      engineRef.current?.setFocusCardHidden(false);
      delete document.body.dataset.reelOpen;
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.videoSrc]);

  if (!mounted || typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="flex-reel-layer"
      onPointerMove={ui.poke}
      onTouchStart={ui.poke}
      onFocusCapture={ui.poke}
    >
      <div ref={backdropRef} className="flex-reel-backdrop" />
      <div ref={boxRef} className="flex-reel-box">
        <video
          ref={setVideoEl}
          key={item.videoSrc}
          className="flex-reel-video"
          src={item.videoSrc}
          poster={item.poster ?? item.src}
          autoPlay
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
        <VideoControls
          state={ui}
          title={item.title ?? 'Showreel'}
          onClose={requestClose}
        />
      </div>
    </div>,
    document.body
  );
}
