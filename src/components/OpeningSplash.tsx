import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { pickOpeningQuote } from "../data/openingQuotes";
import { ReadabilityBlob } from "./ReadabilityBlob";
import { Starfield } from "./Starfield";

const DISPLAY_MS = 12000;
const QUOTE_FADE_MS = 1100;
const FADE_OUT_MS = 900;

interface OpeningSplashProps {
  onComplete: () => void;
}

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false,
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

export function OpeningSplash({ onComplete }: OpeningSplashProps) {
  const quote = useMemo(() => pickOpeningQuote(), []);
  const reduced = useReducedMotion();
  const displayMs = reduced ? 4000 : DISPLAY_MS;
  const quoteFadeMs = reduced ? 200 : QUOTE_FADE_MS;
  const fadeOutMs = reduced ? 280 : FADE_OUT_MS;

  const [overlayFading, setOverlayFading] = useState(false);
  const [quoteVisible, setQuoteVisible] = useState(false);
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const doneTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const quoteInTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
    if (doneTimerRef.current) clearTimeout(doneTimerRef.current);
    if (quoteInTimerRef.current) clearTimeout(quoteInTimerRef.current);
    fadeTimerRef.current = null;
    doneTimerRef.current = null;
    quoteInTimerRef.current = null;
  }, []);

  const beginFadeOut = useCallback(() => {
    setOverlayFading((prev) => {
      if (prev) return prev;
      clearTimers();
      doneTimerRef.current = setTimeout(() => onComplete(), fadeOutMs);
      return true;
    });
  }, [clearTimers, fadeOutMs, onComplete]);

  useEffect(() => {
    quoteInTimerRef.current = setTimeout(() => setQuoteVisible(true), 80);

    fadeTimerRef.current = setTimeout(() => beginFadeOut(), displayMs);

    return () => clearTimers();
  }, [beginFadeOut, clearTimers, displayMs]);

  const handleContinue = () => {
    if (overlayFading) return;
    beginFadeOut();
  };

  return (
    <div
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center bg-void px-6 transition-opacity ease-out ${
        overlayFading ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      style={{ transitionDuration: `${fadeOutMs}ms` }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="opening-splash-title"
      aria-describedby="opening-splash-quote"
    >
      <Starfield fastDrift seed={0x51a5_0e0e} starCount={180} />
      <div
        className={`star-burst pointer-events-none absolute inset-0 flex items-center justify-center ${
          reduced ? "star-burst--still" : ""
        }`}
        aria-hidden
      >
        <div className="star-burst-rays-wrap">
          <div className="star-burst-rays" />
        </div>
        <div className="star-burst-glow" />
        <div className="star-burst-flash" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-2xl flex-1 flex-col items-center justify-center px-4 sm:px-6">
        <div
          className={`w-full transition-all ease-out ${
            quoteVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-4 opacity-0"
          }`}
          style={{ transitionDuration: `${quoteFadeMs}ms` }}
        >
          <ReadabilityBlob className="w-full">
            <div className="px-6 py-10 text-center sm:px-12 sm:py-12">
            <p
              id="opening-splash-title"
              className="font-display text-xs font-semibold tracking-[0.35em] text-accent/80 uppercase"
            >
              Quantum Tarot
            </p>
            <blockquote className="mt-8">
              <p
                id="opening-splash-quote"
                className="text-lg leading-relaxed text-star/95 italic sm:text-xl sm:leading-relaxed"
              >
                &ldquo;{quote.text}&rdquo;
              </p>
              <footer className="mt-6 text-sm text-star/65">
                <cite className="font-display font-medium tracking-wide text-accent not-italic">
                  {quote.author}
                </cite>
                {quote.role ? (
                  <span className="mt-1 block text-xs text-star/50">
                    {quote.role}
                  </span>
                ) : null}
              </footer>
            </blockquote>
            </div>
          </ReadabilityBlob>
        </div>
      </div>

      <button
        type="button"
        onClick={handleContinue}
        disabled={overlayFading}
        className={`relative z-10 mb-10 font-display text-xs font-semibold tracking-[0.2em] uppercase transition-all ease-out ${
          quoteVisible ? "opacity-100" : "pointer-events-none opacity-0"
        } rounded-full border border-accent/40 bg-white/5 px-8 py-3 text-accent shadow-[0_0_24px_rgba(167,139,250,0.15)] hover:border-accent/70 hover:bg-accent/10 hover:shadow-[0_0_32px_rgba(167,139,250,0.25)] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 disabled:opacity-40`}
        style={{ transitionDuration: `${quoteFadeMs}ms` }}
      >
        Continue
      </button>

      <style>{`
        .star-burst-rays-wrap {
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: burst-spin 52s linear infinite;
        }
        .star-burst-rays {
          width: min(140vmax, 900px);
          height: min(140vmax, 900px);
          background: repeating-conic-gradient(
            from 0deg,
            transparent 0deg 7deg,
            rgba(167, 139, 250, 0.14) 7deg 8.5deg,
            transparent 8.5deg 15deg,
            rgba(251, 191, 36, 0.08) 15deg 16deg
          );
          mask-image: radial-gradient(
            circle,
            rgba(0, 0, 0, 0.85) 0%,
            rgba(0, 0, 0, 0.35) 28%,
            transparent 52%
          );
          animation: burst-breathe 8.5s ease-in-out infinite;
        }
        .star-burst-glow {
          position: absolute;
          width: min(70vmax, 480px);
          height: min(70vmax, 480px);
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(167, 139, 250, 0.35) 0%,
            rgba(99, 102, 241, 0.12) 35%,
            transparent 68%
          );
          animation: burst-glow 7.5s ease-in-out infinite;
        }
        .star-burst-flash {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #fff;
          box-shadow:
            0 0 20px 6px rgba(255, 255, 255, 0.9),
            0 0 60px 20px rgba(167, 139, 250, 0.55),
            0 0 120px 40px rgba(99, 102, 241, 0.25);
          animation: burst-core 5.5s ease-in-out infinite;
        }
        .star-burst--still .star-burst-rays-wrap,
        .star-burst--still .star-burst-rays,
        .star-burst--still .star-burst-glow,
        .star-burst--still .star-burst-flash {
          animation: none;
        }
        .star-burst--still .star-burst-glow {
          opacity: 0.5;
        }
        @keyframes burst-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes burst-breathe {
          0%, 100% { transform: scale(0.82); opacity: 0.55; }
          50% { transform: scale(1); opacity: 0.95; }
        }
        @keyframes burst-glow {
          0%, 100% { transform: scale(0.9); opacity: 0.45; }
          50% { transform: scale(1.08); opacity: 0.75; }
        }
        @keyframes burst-core {
          0%, 100% { transform: scale(1); opacity: 0.85; }
          50% { transform: scale(1.35); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
