"use client";

import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { motion } from "motion/react";
import type { CSSProperties } from "react";
import type { HTMLMotionProps } from "motion/react";

const styles: { wrapper: CSSProperties; srOnly: CSSProperties } = {
  wrapper: {
    display: "inline-block",
    whiteSpace: "pre-wrap",
  },
  srOnly: {
    position: "absolute",
    width: "1px",
    height: "1px",
    padding: 0,
    margin: "-1px",
    overflow: "hidden",
    clip: "rect(0,0,0,0)",
    border: 0,
    visibility: "hidden",
  },
};

interface DecryptedTextProps
  extends Omit<HTMLMotionProps<"span">, "className" | "children" | "ref"> {
  text: string;
  speed?: number;
  maxIterations?: number;
  delay?: number;
  sequential?: boolean;
  revealDirection?: "start" | "end" | "center";
  useOriginalCharsOnly?: boolean;
  characters?: string;
  className?: string;
  parentClassName?: string;
  encryptedClassName?: string;
  animateOn?: "view" | "hover" | "inViewHover" | "click";
  clickMode?: "once" | "toggle";
}

export default function DecryptedText({
  text,
  speed = 50,
  maxIterations = 10,
  delay = 0,
  sequential = false,
  revealDirection = "start",
  useOriginalCharsOnly = false,
  characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+",
  className = "",
  parentClassName = "",
  encryptedClassName = "",
  animateOn = "hover",
  clickMode = "once",
  ...props
}: DecryptedTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const [isAnimating, setIsAnimating] = useState(false);
  const [revealedIndices, setRevealedIndices] = useState(new Set<number>());
  const [isDecrypted, setIsDecrypted] = useState(animateOn !== "click");
  const hasAnimatedRef = useRef(false);
  const [direction, setDirection] = useState<"forward" | "reverse">("forward");

  const containerRef = useRef<HTMLSpanElement>(null);
  const orderRef = useRef<number[]>([]);
  const pointerRef = useRef(0);
  const revealedRef = useRef<Set<number>>(new Set<number>());
  const intervalRef = useRef<number | undefined>(undefined);
  const startTimerRef = useRef<number | undefined>(undefined);

  const commitRevealed = useCallback((next: Set<number>, nextDisplay?: string) => {
    revealedRef.current = next;
    setRevealedIndices(next);
    if (nextDisplay !== undefined) setDisplayText(nextDisplay);
  }, []);

  const availableChars = useMemo(() => {
    return useOriginalCharsOnly
      ? Array.from(new Set(text.split(""))).filter((char) => char !== " ")
      : characters.split("");
  }, [useOriginalCharsOnly, text, characters]);

  const shuffleText = useCallback(
    (originalText: string, currentRevealed: Set<number>) => {
      return originalText
        .split("")
        .map((char, i) => {
          if (char === " ") return " ";
          if (currentRevealed.has(i)) return originalText[i];
          return availableChars[Math.floor(Math.random() * availableChars.length)];
        })
        .join("");
    },
    [availableChars]
  );

  const computeOrder = useCallback(
    (len: number) => {
      const order: number[] = [];
      if (len <= 0) return order;
      if (revealDirection === "start") {
        for (let i = 0; i < len; i++) order.push(i);
        return order;
      }
      if (revealDirection === "end") {
        for (let i = len - 1; i >= 0; i--) order.push(i);
        return order;
      }
      const middle = Math.floor(len / 2);
      let offset = 0;
      while (order.length < len) {
        if (offset % 2 === 0) {
          const idx = middle + offset / 2;
          if (idx >= 0 && idx < len) order.push(idx);
        } else {
          const idx = middle - Math.ceil(offset / 2);
          if (idx >= 0 && idx < len) order.push(idx);
        }
        offset++;
      }
      return order.slice(0, len);
    },
    [revealDirection]
  );

  const fillAllIndices = useCallback(() => {
    const s = new Set<number>();
    for (let i = 0; i < text.length; i++) s.add(i);
    return s;
  }, [text]);

  const removeRandomIndices = useCallback((set: Set<number>, count: number) => {
    const arr = Array.from(set);
    for (let i = 0; i < count && arr.length > 0; i++) {
      const idx = Math.floor(Math.random() * arr.length);
      arr.splice(idx, 1);
    }
    return new Set<number>(arr);
  }, []);

  const encryptInstantly = useCallback(() => {
    const emptySet = new Set<number>();
    commitRevealed(emptySet, shuffleText(text, emptySet));
    setIsDecrypted(false);
  }, [text, shuffleText, commitRevealed]);

  const triggerDecrypt = useCallback(() => {
    if (sequential) {
      orderRef.current = computeOrder(text.length);
      pointerRef.current = 0;
      commitRevealed(new Set<number>());
    } else {
      commitRevealed(new Set<number>());
    }
    setDirection("forward");
    setIsAnimating(true);
  }, [sequential, computeOrder, text.length, commitRevealed]);

  const triggerReverse = useCallback(() => {
    const all = fillAllIndices();
    if (sequential) {
      orderRef.current = computeOrder(text.length).slice().reverse();
      pointerRef.current = 0;
      commitRevealed(all, shuffleText(text, all));
    } else {
      commitRevealed(all, shuffleText(text, all));
    }
    setDirection("reverse");
    setIsAnimating(true);
  }, [sequential, computeOrder, fillAllIndices, shuffleText, text.length, commitRevealed]);

  useEffect(() => {
    if (!isAnimating) return;

    let currentIteration = 0;

    const getNextIndex = (revealedSet: Set<number>) => {
      const textLength = text.length;
      switch (revealDirection) {
        case "start":
          return revealedSet.size;
        case "end":
          return textLength - 1 - revealedSet.size;
        case "center": {
          const middle = Math.floor(textLength / 2);
          const offset = Math.floor(revealedSet.size / 2);
          const nextIndex =
            revealedSet.size % 2 === 0 ? middle + offset : middle - offset - 1;

          if (nextIndex >= 0 && nextIndex < textLength && !revealedSet.has(nextIndex)) {
            return nextIndex;
          }

          for (let i = 0; i < textLength; i++) {
            if (!revealedSet.has(i)) return i;
          }
          return 0;
        }
        default:
          return revealedSet.size;
      }
    };

    const finish = (decrypted: boolean) => {
      clearInterval(intervalRef.current);
      setIsAnimating(false);
      setIsDecrypted(decrypted);
    };

    intervalRef.current = window.setInterval(() => {
      if (sequential) {
        if (direction === "forward") {
          if (revealedRef.current.size < text.length) {
            const nextSet = new Set(revealedRef.current);
            nextSet.add(getNextIndex(revealedRef.current));
            commitRevealed(nextSet, shuffleText(text, nextSet));
          } else {
            finish(true);
          }
        } else if (pointerRef.current < orderRef.current.length) {
          const idxToRemove = orderRef.current[pointerRef.current++];
          const nextSet = new Set(revealedRef.current);
          nextSet.delete(idxToRemove);
          commitRevealed(nextSet, shuffleText(text, nextSet));
          if (nextSet.size === 0) finish(false);
        } else {
          finish(false);
        }
      } else if (direction === "forward") {
        currentIteration++;
        if (currentIteration >= maxIterations) {
          finish(true);
          setDisplayText(text);
        } else {
          setDisplayText(shuffleText(text, revealedRef.current));
        }
      } else {
        let currentSet = revealedRef.current;
        if (currentSet.size === 0) {
          currentSet = fillAllIndices();
          revealedRef.current = currentSet;
        }
        const removeCount = Math.max(
          1,
          Math.ceil(text.length / Math.max(1, maxIterations))
        );
        const nextSet = removeRandomIndices(currentSet, removeCount);
        currentIteration++;
        if (nextSet.size === 0 || currentIteration >= maxIterations) {
          finish(false);
          const finalSet = new Set<number>();
          commitRevealed(finalSet, shuffleText(text, finalSet));
        } else {
          commitRevealed(nextSet, shuffleText(text, nextSet));
        }
      }
    }, speed);

    return () => clearInterval(intervalRef.current);
  }, [
    isAnimating,
    text,
    speed,
    maxIterations,
    sequential,
    revealDirection,
    shuffleText,
    direction,
    fillAllIndices,
    removeRandomIndices,
    commitRevealed,
  ]);

  const handleClick = () => {
    if (animateOn !== "click") return;

    if (clickMode === "once") {
      if (isDecrypted) return;
      setDirection("forward");
      triggerDecrypt();
    }

    if (clickMode === "toggle") {
      if (isDecrypted) {
        triggerReverse();
      } else {
        setDirection("forward");
        triggerDecrypt();
      }
    }
  };

  const triggerHoverDecrypt = useCallback(() => {
    if (isAnimating) return;

    const emptySet = new Set<number>();
    commitRevealed(emptySet, shuffleText(text, emptySet));
    setIsDecrypted(false);
    setDirection("forward");
    setIsAnimating(true);
  }, [isAnimating, text, shuffleText, commitRevealed]);

  const resetToPlainText = useCallback(() => {
    clearInterval(intervalRef.current);
    setIsAnimating(false);
    commitRevealed(new Set<number>(), text);
    setIsDecrypted(true);
    setDirection("forward");
  }, [text, commitRevealed]);

  useEffect(() => {
    if (animateOn !== "view" && animateOn !== "inViewHover") return;

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAnimatedRef.current) {
          hasAnimatedRef.current = true;
          encryptInstantly();
          if (delay > 0) {
            startTimerRef.current = window.setTimeout(() => triggerDecrypt(), delay);
          } else {
            triggerDecrypt();
          }
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const currentRef = containerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      clearTimeout(startTimerRef.current);
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [animateOn, triggerDecrypt, encryptInstantly, delay]);

  useEffect(() => {
    if (animateOn === "click") {
      encryptInstantly();
    } else {
      setDisplayText(text);
      setIsDecrypted(true);
    }
    commitRevealed(new Set<number>());
    setDirection("forward");
  }, [animateOn, text, encryptInstantly, commitRevealed]);

  const animateProps:
    | { onMouseEnter: () => void; onMouseLeave: () => void }
    | { onClick: () => void }
    | Record<string, never> =
    animateOn === "hover" || animateOn === "inViewHover"
      ? {
          onMouseEnter: triggerHoverDecrypt,
          onMouseLeave: resetToPlainText,
        }
      : animateOn === "click"
        ? {
            onClick: handleClick,
          }
        : {};

  return (
    <motion.span
      className={parentClassName}
      ref={containerRef}
      style={styles.wrapper}
      {...animateProps}
      {...props}
    >
      <span style={styles.srOnly}>{displayText}</span>

      <span aria-hidden="true">
        {displayText.split("").map((char, index) => {
          const isRevealedOrDone =
            revealedIndices.has(index) || (!isAnimating && isDecrypted);

          return (
            <span key={index} className={isRevealedOrDone ? className : encryptedClassName}>
              {char}
            </span>
          );
        })}
      </span>
    </motion.span>
  );
}