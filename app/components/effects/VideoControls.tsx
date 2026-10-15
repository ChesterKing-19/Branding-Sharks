'use client';

import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react';
import { formatTime, type VideoState } from './useVideoState';

interface VideoControlsProps {
  state: VideoState;
  title: string;
  onClose: () => void;
}

/**
 * Bespoke minimal player chrome: center play/pause toggle + bottom bar
 * (play/pause, seek slider, time readout, mute/volume, close). Brand tokens only.
 */
export function VideoControls({ state, title, onClose }: VideoControlsProps) {
  const { playing, time, duration, buffered, waiting, idle, muted, volume, toggle, seek, toggleMute, setVolume } = state;
  const level = muted ? 0 : volume;
  const chromeHidden = idle && playing;
  // Spinner only for initial load — never over a playable frame.
  const loading = waiting && !playing && !(duration > 0);
  const progress = duration > 0 ? Math.min(1, time / duration) : 0;
  const bufferedPct = duration > 0 ? Math.min(1, buffered / duration) : 0;

  const dropFocus = (e: ReactPointerEvent<HTMLDivElement>) => {
    const active = document.activeElement;
    if (active instanceof HTMLElement && e.currentTarget.contains(active)) {
      active.blur();
    }
  };

  return (
    <>
      {/* Center toggle */}
      <button
        type="button"
        className="vui-center"
        data-hidden={chromeHidden || (playing && !loading) ? '' : undefined}
        onClick={(e) => {
          e.stopPropagation();
          toggle();
        }}
        aria-label={playing ? `Pause ${title}` : `Play ${title}`}
      >
        {loading ? (
          <span className="vui-spinner" aria-hidden="true" />
        ) : playing ? (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" />
            <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 5.5v13a1 1 0 0 0 1.53.85l10.2-6.5a1 1 0 0 0 0-1.7L9.53 4.65A1 1 0 0 0 8 5.5Z" fill="currentColor" />
          </svg>
        )}
      </button>

      {/* Bottom bar */}
      <div className="vui-bar" data-hidden={chromeHidden ? '' : undefined}>
        <button
          type="button"
          className="vui-btn"
          onClick={(e) => {
            e.stopPropagation();
            toggle();
          }}
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {playing ? (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" />
              <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8 5.5v13a1 1 0 0 0 1.53.85l10.2-6.5a1 1 0 0 0 0-1.7L9.53 4.65A1 1 0 0 0 8 5.5Z" fill="currentColor" />
            </svg>
          )}
        </button>
        <span className="vui-time">{formatTime(time)}</span>
        <input
          type="range"
          className="vui-seek"
          min={0}
          max={duration || 0}
          step={0.1}
          value={Math.min(time, duration || 0)}
          onChange={(e) => seek(Number(e.target.value))}
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          aria-label={`Seek ${title}`}
          aria-valuetext={`${formatTime(time)} of ${formatTime(duration)}`}
          style={{ '--vui-progress': progress, '--vui-buffered': bufferedPct } as CSSProperties}
        />
        <span className="vui-time">{formatTime(duration)}</span>
        <div className="vui-volume" onPointerUp={dropFocus} onPointerLeave={dropFocus}>
          <button
            type="button"
            className="vui-btn vui-mute"
            onClick={(e) => {
              e.stopPropagation();
              toggleMute();
            }}
            onPointerDown={(e) => e.stopPropagation()}
            aria-label={muted ? `Unmute ${title}` : `Mute ${title}`}
            aria-pressed={muted}
          >
            {muted ? (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 9v6h4l5 4V5L8 9H4Z" fill="currentColor" />
                <path
                  d="M16.5 9.5l4 5M20.5 9.5l-4 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 9v6h4l5 4V5L8 9H4Z" fill="currentColor" />
                <path
                  d="M16 9a4 4 0 0 1 0 6M18.6 6.6a8 8 0 0 1 0 10.8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>
          <input
            type="range"
            className="vui-vol"
            min={0}
            max={1}
            step={0.01}
            value={level}
            onChange={(e) => setVolume(Number(e.target.value))}
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            aria-label={`Volume ${title}`}
            aria-valuetext={`${Math.round(level * 100)}%`}
            style={{ '--vui-volume': level } as CSSProperties}
          />
        </div>
        <button
          type="button"
          className="vui-btn"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          aria-label={`Close ${title} player`}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </>
  );
}
