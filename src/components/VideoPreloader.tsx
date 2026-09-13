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
    }, 7000);

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

  if (!isMounted) return null;

  return (
    <div
      className={`preloader-overlay ${isExiting ? 'preloader-exit' : ''}`}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 2147483647,
        backgroundColor: '#080605',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      aria-label="Website loading preview"
      role="dialog"
      aria-modal="true"
    >
      <div className="preloader-bg-ambient" />

      {/* Main Video Frame */}
      <div className="preloader-video-stage">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          onCanPlayThrough={() => setVideoLoaded(true)}
          onEnded={handleFinish}
          className={`preloader-video ${videoLoaded ? 'video-visible' : ''}`}
        >
          <source src="/loader.mp4" type="video/mp4" />
        </video>

        {/* Ambient Top & Bottom Gold Vignette */}
        <div className="preloader-vignette" />
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
          aria-label="Skip loader animation"
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
          z-index: 999999;
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
        }

        .preloader-overlay.preloader-exit {
          opacity: 0;
          transform: scale(1.025);
          filter: blur(8px);
          pointer-events: none;
        }

        .preloader-bg-ambient {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.08) 0%, transparent 65%),
            #080605;
          pointer-events: none;
        }

        .preloader-video-stage {
          position: relative;
          width: 100vw;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .preloader-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
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
            transparent 45%,
            rgba(8, 6, 5, 0.4) 75%,
            rgba(8, 6, 5, 0.95) 100%
          );
          pointer-events: none;
        }

        .preloader-bottom-bar {
          position: absolute;
          bottom: 28px;
          left: 0;
          right: 0;
          z-index: 10;
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
          padding: 8px 16px;
          background: rgba(18, 13, 10, 0.65);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(212, 175, 55, 0.22);
          border-radius: 999px;
          color: #f5eedf;
          font-size: 13px;
          letter-spacing: 0.02em;
        }

        .brand-crest {
          font-size: 14px;
        }

        .brand-text {
          font-weight: 700;
          color: #d4af37;
        }

        .brand-divider {
          color: rgba(212, 175, 55, 0.4);
        }

        .brand-sub {
          color: rgba(245, 238, 223, 0.7);
          font-size: 11.5px;
        }

        .preloader-skip-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 18px;
          background: rgba(26, 18, 13, 0.7);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(212, 175, 55, 0.35);
          border-radius: 999px;
          color: #f7eedf;
          font-size: 12.5px;
          font-weight: 600;
          letter-spacing: 0.03em;
          cursor: pointer;
          transition:
            background 200ms ease,
            border-color 200ms ease,
            transform 200ms ease,
            color 200ms ease;
        }

        .preloader-skip-btn:hover {
          background: rgba(42, 28, 19, 0.9);
          border-color: rgba(224, 170, 64, 0.7);
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

        @media (max-width: 640px) {
          .preloader-bottom-bar {
            padding: 0 18px;
            bottom: 20px;
          }

          .brand-sub {
            display: none;
          }

          .brand-divider {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
