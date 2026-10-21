"use client";

import { useEffect, useState } from "react";
import { formatMoney } from "@/lib/api";

// Mostra um valor em R$ contando de zero até o número final
export default function AnimatedMoney({
  value,
  duration = 900,
}: {
  value: number;
  duration?: number;
}) {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let frame = 0;
    const start = performance.now();

    function tick(now: number) {
      const progress = reduceMotion
        ? 1
        : Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // desacelera no final
      setShown(value * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);

  return <>{formatMoney(shown)}</>;
}
