"use client";
import { useState, useEffect } from "react";

export interface MousePosition {
  x: number;          // px from left
  y: number;          // px from top
  normX: number;      // -1 to 1 (left to right)
  normY: number;      // -1 to 1 (top to bottom)
}

export function useMousePosition(): MousePosition {
  const [pos, setPos] = useState<MousePosition>({ x: 0, y: 0, normX: 0, normY: 0 });

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      setPos({
        x: e.clientX,
        y: e.clientY,
        normX: (e.clientX / window.innerWidth - 0.5) * 2,
        normY: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener("mousemove", handle, { passive: true });
    return () => window.removeEventListener("mousemove", handle);
  }, []);

  return pos;
}
