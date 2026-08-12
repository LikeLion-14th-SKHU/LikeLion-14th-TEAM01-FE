import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from './usePrefersReduceMotion';

interface Options {
  charsPerSecond?: number;
  enabled?: boolean;
  punctuationPause?: number;
}

interface Result {
  text: string;
  isTyping: boolean;
  skip: () => void;
}

const PAUSE_CHARS = new Set(['.', '?', '!', ',', '…', '"']);

export function useTypewriter(source: string, options: Options = {}): Result {
  const { charsPerSecond = 34, enabled = true, punctuationPause = 160 } = options;
  const reduced = usePrefersReducedMotion();
  const instant = !enabled || reduced;

  const [count, setCount] = useState(instant ? source.length : 0);
  const frame = useRef<number | null>(null);
  const lastTick = useRef(0);
  const holdUntil = useRef(0);
  const skipped = useRef(false);

  useEffect(() => {
    if (source.length === 0) {
      setCount(0);
      skipped.current = false;
    }
  }, [source.length === 0]);

  useEffect(() => {
    if (instant || skipped.current) {
      setCount(source.length);
      return;
    }
    const interval = 1000 / charsPerSecond;

    const step = (now: number) => {
      if (lastTick.current === 0) lastTick.current = now;
      if (now >= holdUntil.current) {
        const elapsed = now - lastTick.current;
        const advance = Math.floor(elapsed / interval);
        if (advance > 0) {
          lastTick.current = now;
          setCount((prev) => {
            const next = Math.min(source.length, prev + advance);
            const justTyped = source[next - 1];
            if (justTyped && PAUSE_CHARS.has(justTyped)) holdUntil.current = now + punctuationPause;
            return next;
          });
        }
      }
      frame.current = requestAnimationFrame(step);
    };

    frame.current = requestAnimationFrame(step);
    return () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
      frame.current = null;
      lastTick.current = 0;
    };
  }, [source, charsPerSecond, instant, punctuationPause]);

  const skip = () => {
    skipped.current = true;
    setCount(source.length);
  };

  return {
    text: source.slice(0, count),
    isTyping: !instant && count < source.length,
    skip,
  };
}
