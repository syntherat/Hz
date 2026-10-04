"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";

export function FrameRate({ scale = 1 }: { scale?: number }) {
  const [fps, setFps] = useState(60);

  useEffect(() => {
    let frames = 0;
    let last = performance.now();
    const tick = () => {
      frames++;
      const now = performance.now();
      if (now - last >= 500) {
        setFps((frames * 1000) / (now - last));
        frames = 0;
        last = now;
      }
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);

  return (
    <span className="tabular-nums">
      {(fps * scale).toFixed(1)} Hz{scale !== 1 ? ` · ${scale}×` : ""}
    </span>
  );
}
