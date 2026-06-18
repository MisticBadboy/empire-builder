import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/useGameStore';

export function useGameLoop() {
  const tick = useGameStore((s) => s.tick);
  const save = useGameStore((s) => s.save);
  const lastTick = useRef(Date.now());
  const saveTimer = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const delta = (now - lastTick.current) / 1000;
      lastTick.current = now;

      // Cap delta to prevent huge jumps
      const clampedDelta = Math.min(delta, 1);
      tick(clampedDelta);

      // Auto-save every 10 seconds
      saveTimer.current += clampedDelta;
      if (saveTimer.current >= 10) {
        saveTimer.current = 0;
        save();
      }
    }, 100); // 10 ticks per second

    return () => clearInterval(interval);
  }, [tick, save]);
}
