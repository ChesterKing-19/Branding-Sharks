"use client";

export function Arrow() {
  return (
    <span aria-hidden="true" className="arrow">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M7 17 17 7" />
        <path d="M17 7H8" />
        <path d="M17 7v9" />
      </svg>
    </span>
  );
}