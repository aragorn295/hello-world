"use client";

import { useEffect, useRef, useState } from "react";

export function Waveform({ analyser, active }: { analyser: AnalyserNode | null; active: boolean }) {
  const [levels, setLevels] = useState<number[]>(Array(32).fill(0.3));
  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (!analyser || !active) {
      setLevels(Array(32).fill(0.3));
      return;
    }
    const data = new Uint8Array(analyser.frequencyBinCount);
    const tick = () => {
      analyser.getByteFrequencyData(data);
      const bins = 32;
      const step = Math.floor(data.length / bins);
      const next: number[] = [];
      for (let i = 0; i < bins; i++) {
        let sum = 0;
        for (let j = 0; j < step; j++) sum += data[i * step + j] ?? 0;
        next.push(Math.max(0.12, Math.min(1, sum / step / 180)));
      }
      setLevels(next);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [analyser, active]);

  return (
    <div className="flex items-end justify-center gap-1 h-28 w-full px-6">
      {levels.map((l, i) => (
        <div
          key={i}
          className="flex-1 rounded-full bg-gradient-to-t from-brand-500 to-brand-700"
          style={{ height: `${Math.round(l * 100)}%`, minHeight: 8 }}
        />
      ))}
    </div>
  );
}
