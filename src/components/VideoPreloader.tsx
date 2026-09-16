'use client';

import React, { useState, useEffect, useRef } from 'react';

interface VideoPreloaderProps {
  onFinish?: () => void;
  minDisplayTime?: number;
}

export default function VideoPreloader({
  onFinish,
  minDisplayTime = 1800,
}: VideoPreloaderProps) {
  const [isMounted, setIsMounted] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const finishTriggered = useRef(false);

  const handleFinish = () => {
    if (finishTriggered.current) return;
    finishTriggered.current = true;

    // Trigger smooth curtain / fade exit
    setIsExiting(true);

    if (onFinish) {
      onFinish();
    }

    // Completely unmount from DOM after exit animation finishes
    setTimeout(() => {
      setIsMounted(false);
      try {
        sessionStorage.setItem('nahari_loader_seen', 'true');
      } catch {
        // Ignore storage errors in incognito/private mode
      }
    }, 600);
  };

  // Check synchronously on initial client render before paint
  useEffect(() => {
    try {
      if (sessionStorage.getItem('nahari_loader_seen') === 'true') {
        setIsMounted(false);
        if (onFinish) onFinish();
        return;
      }
    } catch {
      // Storage unavailable
    }

    // Lock page scroll during preloader
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Fallback safe timer: if video fails to play or loads slow, don't trap the user
    const maxTimer = setTimeout(() => {
      handleFinish();
    }, 6500);

    return () => {
      document.body.style.overflow = prevOverflow;
      clearTimeout(maxTimer);
    };
  }, []);

  useEffect(() => {
    if (!isMounted) {
      document.body.style.overflow = '';
    }
  }, [isMounted]);

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      const pct = Math.min(
        100,
        Math.round((videoRef.current.currentTime / videoRef.current.duration) * 100)
      );
      setProgress(pct);
    }
  };

  if (!isMounted) return null;

  return (
    <div
      className={`preloader-overlay ${isExiting ? 'preloader-exit' : ''}`}
      aria-label="Nahari King Loading Screen"
      role="dialog"
      aria-modal="true"
    >
      <div className="preloader-bg-ambient" />

      {/* Top Gold Progress Track */}
      <div className="preloader-progress-track">
        <div
          className="preloader-progress-bar"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Main Video Stage with responsive framing */}
      <div className="preloader-video-stage">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          onCanPlayThrough={() => setVideoLoaded(true)}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleFinish}
          className={`preloader-video ${videoLoaded ? 'video-visible' : ''}`}
        >
          <source src="/loader.mp4" type="video/mp4" />
        </video>

        {/* Ambient Top & Bottom Gold Vignette */}
        <div className="preloader-vignette" />
      </div>

      {/* Top Mobile Skip Header for Immediate Thumb Access */}
      <div className="preloader-top-bar">
        <div className="preloader-brand-mini">
          <span className="brand-crest">👑</span>
          <span className="brand-text">Nahari King</span>
        </div>

        <button
          type="button"
          onClick={handleFinish}
          className="preloader-skip-pill"
          aria-label="Skip loader animation"
        >
          <span>Skip</span>
          <svg viewBox="0 0 20 20" fill="none" className="skip-arrow">
            <path
              d="M4.167 10h11.666M10.833 5l5 5-5 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Bottom Bar with Brand and Skip CTA */}
      <div className="preloader-bottom-bar">
        <div className="preloader-brand">
          <span className="brand-crest">👑</span>
          <span className="brand-text">Nahari King</span>
          <span className="brand-divider">·</span>
          <span className="brand-sub">Delhi Ka Asli Swad</span>
        </div>

        <button
          type="button"
          onClick={handleFinish}
          className="preloader-skip-btn"
          aria-label="Skip intro animation"
        >
          <span>Skip Intro</span>
          <svg viewBox="0 0 20 20" fill="none" className="skip-arrow">
            <path
              d="M4.167 10h11.666M10.833 5l5 5-5 5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <style jsx>{`
        .preloader-overlay {
          position: fixed;
          inset: 0;
          width: 100vw;
          width: 100dvw;
          height: 100vh;
          height: 100dvh;
          z-index: 2147483647;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #080605;
          overflow: hidden;
          transition:
            opacity 550ms cubic-bezier(0.16, 1, 0.3, 1),
            transform 550ms cubic-bezier(0.16, 1, 0.3, 1),
            filter 550ms ease;
          will-change: opacity, transform;
          -webkit-tap-highlight-color: transparent;
        }

        .preloader-overlay.preloader-exit {
          opacity: 0;
          transform: scale(1.02);
          filter: blur(8px);
          pointer-events: none;
        }

        .preloader-bg-ambient {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.1) 0%, rgba(122, 12, 14, 0.05) 50%, transparent 75%),
            #080605;
          pointer-events: none;
        }

        /* Top Slim Gold Progress Track */
        .preloader-progress-track {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2.5px;
          background: rgba(255, 255, 255, 0.08);
          z-index: 25;
          overflow: hidden;
        }

        .preloader-progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #9E7D23, #D4AF37, #FCE8A6);
          box-shadow: 0 0 10px rgba(212, 175, 55, 0.6);
          transition: width 150ms linear;
        }

        /* Video Stage */
        .preloader-video-stage {
          position: relative;
          width: 100vw;
          width: 100dvw;
          height: 100vh;
          height: 100dvh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .preloader-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center center;
          opacity: 0;
          transform: translateZ(0);
          will-change: opacity, transform;
          transition: opacity 400ms ease;
        }

        .preloader-video.video-visible {
          opacity: 1;
        }

        .preloader-vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle at 50% 50%,
            transparent 35%,
            rgba(8, 6, 5, 0.35) 70%,
            rgba(8, 6, 5, 0.95) 100%
          );
          pointer-events: none;
        }

        /* Top Mobile Skip Bar */
        .preloader-top-bar {
          display: none;
          position: absolute;
          top: calc(14px + env(safe-area-inset-top, 0px));
          left: 0;
          right: 0;
          z-index: 20;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
        }

        .preloader-brand-mini {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px;
          background: rgba(18, 13, 10, 0.7);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(212, 175, 55, 0.25);
          border-radius: 999px;
          color: #f5eedf;
          font-size: 12px;
          font-weight: 700;
        }

        .preloader-brand-mini .brand-text {
          color: #D4AF37;
        }

        .preloader-skip-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          background: rgba(26, 18, 13, 0.75);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(212, 175, 55, 0.4);
          border-radius: 999px;
          color: #FAF7F2;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
        }

        .preloader-skip-pill .skip-arrow {
          width: 13px;
          height: 13px;
          color: #D4AF37;
        }

        /* Bottom Bar */
        .preloader-bottom-bar {
          position: absolute;
          bottom: calc(24px + env(safe-area-inset-bottom, 0px));
          left: 0;
          right: 0;
          z-index: 15;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 36px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .preloader-brand {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 18px;
          background: rgba(18, 13, 10, 0.75);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(212, 175, 55, 0.26);
          border-radius: 999px;
          color: #f5eedf;
          font-size: 13px;
          letter-spacing: 0.02em;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
        }

        .brand-crest {
          font-size: 14px;
        }

        .brand-text {
          font-weight: 800;
          color: #d4af37;
          letter-spacing: 0.03em;
        }

        .brand-divider {
          color: rgba(212, 175, 55, 0.4);
        }

        .brand-sub {
          color: rgba(245, 238, 223, 0.8);
          font-size: 12px;
        }

        .preloader-skip-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 20px;
          background: rgba(26, 18, 13, 0.8);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(212, 175, 55, 0.4);
          border-radius: 999px;
          color: #f7eedf;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.03em;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
          transition:
            background 200ms ease,
            border-color 200ms ease,
            transform 200ms ease,
            color 200ms ease;
        }

        .preloader-skip-btn:hover {
          background: rgba(42, 28, 19, 0.95);
          border-color: rgba(224, 170, 64, 0.8);
          color: #ffffff;
          transform: translateY(-1.5px);
        }

        .skip-arrow {
          width: 14px;
          height: 14px;
          transition: transform 200ms ease;
        }

        .preloader-skip-btn:hover .skip-arrow {
          transform: translateX(3px);
        }

        /* Mobile Responsive Adjustments (Phones & Tablets) */
        @media (max-width: 768px) {
          .preloader-video {
            /* Keep central emblem and crown in full sharp view on vertical aspect ratio */
            object-fit: cover;
            object-position: center 48%;
          }

          .preloader-top-bar {
            display: flex;
          }

          .preloader-bottom-bar {
            justify-content: center;
            bottom: calc(18px + env(safe-area-inset-bottom, 0px));
            padding: 0 16px;
          }

          /* On mobile, top bar has the quick skip button */
          .preloader-bottom-bar .preloader-skip-btn {
            display: none;
          }

          .preloader-brand {
            padding: 7px 16px;
            font-size: 12px;
          }

          .brand-sub {
            font-size: 11px;
          }
        }

        @media (max-width: 480px) {
          .preloader-brand {
            gap: 6px;
            padding: 6px 14px;
            font-size: 11.5px;
          }

          .brand-crest {
            font-size: 13px;
          }
        }

        /* Orientation Landscape on Mobile phones */
        @media (max-height: 500px) and (orientation: landscape) {
          .preloader-top-bar {
            top: 10px;
          }
          .preloader-bottom-bar {
            bottom: 10px;
          }
          .preloader-brand {
            padding: 5px 12px;
            font-size: 11px;
          }
        }
      `}</style>
    </div>
  );
}
