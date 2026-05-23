"use client";

/**
 * SplitText — word-level masked reveal animation.
 *
 * Each word is wrapped in an overflow:hidden container.
 * The word slides up from below the mask on mount.
 * This is the signature effect on Linear, Vercel, Stripe hero sections —
 * the thing that makes typography feel like it's *materialising*, not just appearing.
 *
 * Usage:
 *   <SplitText
 *     text="Make carousels that actually"
 *     delay={0.2}           // start offset
 *     stagger={0.09}        // per-word stagger
 *     duration={0.72}
 *     className="font-black"
 *     style={{ fontSize: '...' }}
 *   />
 */

import { motion } from "framer-motion";
import { easeExpo } from "@/lib/motion";

interface SplitTextProps {
  text: string;
  delay?:    number;
  stagger?:  number;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
  /** If true, keeps words inline (default). Set false for block display. */
  inline?: boolean;
}

export function SplitText({
  text,
  delay   = 0,
  stagger = 0.09,
  duration = 0.75,
  className,
  style,
  inline = true,
}: SplitTextProps) {
  const words = text.split(" ");

  return (
    <span
      aria-label={text}
      className={className}
      style={{ ...(inline ? { display: "inline" } : {}), ...style }}
    >
      {words.map((word, i) => (
        <span
          key={i}
          style={{
            overflow: "hidden",
            display: "inline-block",
            // Slight negative margin-bottom compensates for the overflow clip
            verticalAlign: "bottom",
          }}
        >
          <motion.span
            style={{ display: "inline-block" }}
            initial={{ y: "115%", opacity: 0 }}
            animate={{ y: "0%",   opacity: 1 }}
            transition={{
              duration,
              delay: delay + i * stagger,
              ease: easeExpo as [number, number, number, number],
            }}
          >
            {word}
          </motion.span>
          {/* Preserve word spacing */}
          {i < words.length - 1 && " "}
        </span>
      ))}
    </span>
  );
}

/**
 * SplitLine — line-level variant for subtitles and smaller text.
 * Slightly different timing: longer stagger, more blur.
 */
export function SplitLine({
  lines,
  delay    = 0,
  stagger  = 0.12,
  duration = 0.65,
  className,
  style,
}: {
  lines:     string[];
  delay?:    number;
  stagger?:  number;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span aria-label={lines.join(" ")}>
      {lines.map((line, i) => (
        <span key={i} style={{ overflow: "hidden", display: "block" }}>
          <motion.span
            style={{ display: "block", ...style }}
            initial={{ y: "105%", opacity: 0, filter: "blur(4px)" }}
            animate={{ y: "0%",   opacity: 1, filter: "blur(0px)" }}
            transition={{
              duration,
              delay: delay + i * stagger,
              ease: easeExpo as [number, number, number, number],
            }}
            className={className}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
