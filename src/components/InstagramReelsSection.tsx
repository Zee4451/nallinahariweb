"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

type ReelVariant = "marrow" | "thaal" | "degh" | "nihari";

type Reel = {
  id: string;
  title: string;
  views: string;
  badge: string;
  duration: number;
  variant: ReelVariant;
  description: string;
  instagramUrl: string;
  videoSrc: string;
};

const reels: Reel[] = [
  {
    id: "best-nihari-offer",
    title: "Best Nihari in Indore with Special Offer",
    views: "580K",
    badge: "Special Offer",
    duration: 24,
    variant: "marrow",
    description: "Best non veg, best Nihari with best offer only at @thenahariking indore.",
    instagramUrl: "https://www.instagram.com/reel/DcqJao4zXWH/",
    videoSrc: "/reels/reel-1.mp4",
  },
  {
    id: "delhi-asli-swad",
    title: "Delhi Ka Asli Swad - Nalli Nihari",
    views: "860K",
    badge: "Trending",
    duration: 29,
    variant: "nihari",
    description: "Delhi ka asli swad right here in Indore opposite dargah gate, Nahari King.",
    instagramUrl: "https://www.instagram.com/reel/DcS9_mruNS6/",
    videoSrc: "/reels/reel-2.mp4",
  },
  {
    id: "grand-thaal-feast",
    title: "Indore Ki Best Nihari & Paye Ki Thaal",
    views: "1.2M",
    badge: "1M+ Views",
    duration: 31,
    variant: "thaal",
    description: "Indore ki best nihari & paye ki non veg thaal special festive offer spread.",
    instagramUrl: "https://www.instagram.com/reel/DbGksWkz7HK/",
    videoSrc: "/reels/reel-3.mp4",
  },
  {
    id: "non-veg-lovers-dhamaka",
    title: "Non-Veg Lovers Ke Liye Sabse Bada Dhamaka",
    views: "740K",
    badge: "Viral Hit",
    duration: 27,
    variant: "degh",
    description: "10 zaiqe se bharpoor nalli nihari feast for genuine royal meat connoisseurs.",
    instagramUrl: "https://www.instagram.com/reel/DSwdwWpjMOf/",
    videoSrc: "/reels/reel-4.mp4",
  },
];

const instagramUrl = "https://www.instagram.com/thenahariking/";

const formatTime = (seconds: number) => {
  const value = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(value / 60);
  const remainingSeconds = value % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

function IconInstagram({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="2.7" y="2.7" width="18.6" height="18.6" rx="5.2" />
      <circle cx="12" cy="12" r="4.15" />
      <circle cx="17.35" cy="6.65" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconPlay({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M8.05 5.31a1.75 1.75 0 0 1 2.66-1.49l9.17 5.94a1.75 1.75 0 0 1 0 2.96l-9.17 5.94a1.75 1.75 0 0 1-2.66-1.49V5.31Z" />
    </svg>
  );
}

function IconPause({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="6.5" y="5" width="4" height="14" rx="1.2" />
      <rect x="13.5" y="5" width="4" height="14" rx="1.2" />
    </svg>
  );
}

function IconVolume({ size = 20, muted = false }: { size?: number; muted?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M11 5.2 6.8 9H3.5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h3.3l4.2 3.8V5.2Z" fill="currentColor" stroke="none" />
      {!muted ? (
        <>
          <path d="M15.2 9.1a4.2 4.2 0 0 1 0 5.8" />
          <path d="M17.8 6.6a7.7 7.7 0 0 1 0 10.8" />
        </>
      ) : (
        <>
          <path d="m15.5 9.5 5 5" />
          <path d="m20.5 9.5-5 5" />
        </>
      )}
    </svg>
  );
}

function IconClose({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

function IconArrow({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function IconEye({ size = 15 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M2.8 12s3.2-5.2 9.2-5.2 9.2 5.2 9.2 5.2-3.2 5.2-9.2 5.2S2.8 12 2.8 12Z" />
      <circle cx="12" cy="12" r="2.4" />
    </svg>
  );
}

function IconUsers({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M16 18v-1.4a4.4 4.4 0 0 0-4.4-4.4H7.4A4.4 4.4 0 0 0 3 16.6V18" />
      <circle cx="9.8" cy="7.8" r="3.4" />
      <path d="M21 18v-1.2a4.1 4.1 0 0 0-3-3.94M15.7 4.35a3.4 3.4 0 0 1 0 6.9" />
    </svg>
  );
}

function ReelArtwork({ variant, label }: { variant: ReelVariant; label: string }) {
  const rawId = useId().replace(/[^a-zA-Z0-9]/g, "");
  const background = `nk-reel-bg-${rawId}`;
  const glow = `nk-reel-glow-${rawId}`;
  const gold = `nk-reel-gold-${rawId}`;

  const thaalBowls: Array<[number, number, string]> = [
    [320, 318, "#8e1719"],
    [425, 354, "#d19a2c"],
    [468, 445, "#3d6b35"],
    [425, 548, "#9a3b19"],
    [320, 590, "#7d1114"],
    [215, 548, "#c49b3d"],
    [172, 445, "#5f2b1c"],
    [215, 354, "#315f3a"],
  ];

  return (
    <svg
      className="nk-reel-art"
      viewBox="0 0 640 800"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={label}
    >
      <title>{label}</title>
      <defs>
        <linearGradient id={background} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4a0d10" />
          <stop offset="0.48" stopColor="#1d080a" />
          <stop offset="1" stopColor="#0b0506" />
        </linearGradient>
        <radialGradient id={glow} cx="50%" cy="43%" r="55%">
          <stop offset="0" stopColor="#f0c75f" stopOpacity="0.28" />
          <stop offset="0.45" stopColor="#7a0c0e" stopOpacity="0.16" />
          <stop offset="1" stopColor="#080405" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={gold} x1="150" y1="280" x2="490" y2="620" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#f5dc83" />
          <stop offset="0.5" stopColor="#d4af37" />
          <stop offset="1" stopColor="#85641d" />
        </linearGradient>
      </defs>

      <rect width="640" height="800" fill={`url(#${background})`} />
      <rect width="640" height="800" fill={`url(#${glow})`} />
      <path d="M0 0h640v126C512 208 174 102 0 224V0Z" fill="#7a0c0e" opacity="0.3" />
      <circle cx="520" cy="112" r="120" fill="#d4af37" opacity="0.05" />
      <circle cx="95" cy="690" r="180" fill="#d4af37" opacity="0.04" />

      <g fill="none" stroke="#d4af37" strokeWidth="2" opacity="0.15">
        <path d="M320 72 344 116 320 106 296 116 320 72Z" />
        <path d="M320 126v514M76 400h488" />
        <circle cx="320" cy="400" r="250" />
        <circle cx="320" cy="400" r="286" opacity="0.55" />
      </g>

      <rect x="24" y="24" width="592" height="752" fill="none" stroke="#d4af37" strokeWidth="2" opacity="0.28" />
      <path d="M24 70 62 24M616 70 578 24M24 730l38 46M616 730l-38 46" fill="none" stroke="#d4af37" strokeWidth="3" opacity="0.42" />

      {variant === "marrow" && (
        <g>
          <g fill="none" stroke="#f5d98d" strokeWidth="5" strokeLinecap="round" opacity="0.34">
            <path d="M248 292c-18-28 18-42 0-72" />
            <path d="M310 278c-18-28 18-42 0-72" />
            <path d="M374 292c-18-28 18-42 0-72" />
          </g>
          <ellipse cx="320" cy="570" rx="222" ry="106" fill="#050303" opacity="0.45" />
          <ellipse cx="320" cy="542" rx="214" ry="104" fill="#ead9b7" />
          <ellipse cx="320" cy="536" rx="184" ry="86" fill="#fff3d2" />
          <ellipse cx="320" cy="534" rx="158" ry="68" fill="#c9a34b" opacity="0.4" />
          <g transform="rotate(-17 320 470)">
            <ellipse cx="320" cy="518" rx="190" ry="48" fill="#080505" opacity="0.34" />
            <rect x="150" y="422" width="340" height="82" rx="41" fill="#ead9b7" stroke="#b99b5d" strokeWidth="3" />
            <circle cx="177" cy="463" r="43" fill="#f2e2bd" stroke="#b99b5d" strokeWidth="3" />
            <circle cx="463" cy="463" r="43" fill="#f2e2bd" stroke="#b99b5d" strokeWidth="3" />
            <rect x="254" y="440" width="132" height="46" rx="23" fill="#841316" />
            <ellipse cx="304" cy="456" rx="38" ry="12" fill="#c73937" opacity="0.72" />
            <ellipse cx="344" cy="470" rx="30" ry="8" fill="#f07a54" opacity="0.36" />
          </g>
          <g fill="#315f32">
            <ellipse cx="226" cy="548" rx="24" ry="9" transform="rotate(-22 226 548)" />
            <ellipse cx="420" cy="520" rx="26" ry="9" transform="rotate(18 420 520)" />
            <circle cx="384" cy="564" r="7" fill="#d8432f" />
            <circle cx="258" cy="516" r="6" fill="#d8432f" />
          </g>
          <path d="M184 332c44-22 88-22 132 0M324 332c44-22 88-22 132 0" fill="none" stroke="#d4af37" strokeWidth="2" opacity="0.24" />
        </g>
      )}

      {variant === "thaal" && (
        <g>
          <g fill="none" stroke="#f5d98d" strokeWidth="5" strokeLinecap="round" opacity="0.28">
            <path d="M272 260c-18-28 18-42 0-72" />
            <path d="M368 260c-18-28 18-42 0-72" />
          </g>
          <ellipse cx="320" cy="610" rx="244" ry="90" fill="#050303" opacity="0.48" />
          <circle cx="320" cy="454" r="204" fill="#8b6b1c" />
          <circle cx="320" cy="454" r="194" fill="url(#gold)" />
          <circle cx="320" cy="454" r="176" fill="#f0dfb5" />
          <circle cx="320" cy="454" r="154" fill="#fff5d8" />
          <circle cx="320" cy="454" r="136" fill="#e3c46f" opacity="0.3" />
          {thaalBowls.map(([x, y, color], index) => (
            <g key={`${x}-${index}`}>
              <circle cx={x} cy={y} r="39" fill="#8f6d20" />
              <circle cx={x} cy={y} r="32" fill="#f3e4bd" />
              <circle cx={x} cy={y} r="25" fill={color} />
              <path d={`M${x - 13} ${y + 2}c8-8 18-8 26 0`} fill="none" stroke="#f7d98a" strokeWidth="3" opacity="0.55" />
            </g>
          ))}
          <path d="M320 346c48 18 70 51 56 88-14 38-82 51-116 18-28-27-8-88 60-106Z" fill="#7e1719" />
          <path d="M291 390c13-21 38-29 61-16M284 424c28 18 64 18 88-4" fill="none" stroke="#e79b45" strokeWidth="7" strokeLinecap="round" opacity="0.72" />
          <g fill="#315f35">
            <ellipse cx="301" cy="378" rx="18" ry="7" transform="rotate(-24 301 378)" />
            <ellipse cx="354" cy="414" rx="18" ry="7" transform="rotate(22 354 414)" />
            <circle cx="333" cy="365" r="5" fill="#f2d37c" />
          </g>
        </g>
      )}

      {variant === "degh" && (
        <g>
          <g fill="none" stroke="#f5d98d" strokeWidth="5" strokeLinecap="round" opacity="0.36">
            <path d="M254 286c-20-32 20-46 0-80" />
            <path d="M320 270c-20-32 20-46 0-80" />
            <path d="M386 286c-20-32 20-46 0-80" />
          </g>
          <ellipse cx="320" cy="624" rx="230" ry="70" fill="#050303" opacity="0.5" />
          <path d="M188 430h264l-18 144c-6 48-54 70-134 70s-128-22-134-70l-18-144Z" fill="#171312" stroke="url(#gold)" strokeWidth="5" />
          <path d="M194 462c70 28 182 28 252 0" fill="none" stroke="#d4af37" strokeWidth="2" opacity="0.42" />
          <path d="M176 414c22-28 62-40 144-40s122 12 144 40" fill="none" stroke="#d4af37" strokeWidth="10" strokeLinecap="round" />
          <ellipse cx="320" cy="414" rx="150" ry="38" fill="#38261e" stroke="#d4af37" strokeWidth="4" />
          <ellipse cx="320" cy="410" rx="122" ry="27" fill="#7a0c0e" />
          <path d="M180 438c-42 8-52 30-24 55M460 438c42 8 52 30 24 55" fill="none" stroke="#d4af37" strokeWidth="8" strokeLinecap="round" />
          <path d="M205 482c62 30 168 30 230 0" fill="none" stroke="#a37a25" strokeWidth="4" strokeDasharray="10 9" opacity="0.8" />
          <path d="M320 344v-36M288 318h64" stroke="#d4af37" strokeWidth="8" strokeLinecap="round" />
          <circle cx="320" cy="302" r="22" fill="url(#gold)" />
          <path d="M250 516c38 19 102 19 140 0" fill="none" stroke="#e2b753" strokeWidth="3" opacity="0.35" />
          <path d="M230 548c50 23 130 23 180 0" fill="none" stroke="#e2b753" strokeWidth="3" opacity="0.25" />
        </g>
      )}

      {variant === "nihari" && (
        <g>
          <g fill="none" stroke="#f5d98d" strokeWidth="5" strokeLinecap="round" opacity="0.34">
            <path d="M266 292c-20-30 18-44 0-76" />
            <path d="M338 292c-20-30 18-44 0-76" />
          </g>
          <ellipse cx="320" cy="602" rx="220" ry="76" fill="#050303" opacity="0.48" />
          <path d="M148 438h344l-20 112c-8 46-58 68-132 68s-124-22-132-68l-20-112Z" fill="#f0dfb6" stroke="url(#gold)" strokeWidth="5" />
          <path d="M168 448h304l-8 42H176l-8-42Z" fill="#c49b3d" />
          <ellipse cx="320" cy="444" rx="160" ry="48" fill="#7d1718" />
          <ellipse cx="320" cy="438" rx="136" ry="37" fill="#9d211f" />
          <path d="M224 430c34-20 72 12 106-8 36-21 66 4 90-10" fill="none" stroke="#d97735" strokeWidth="9" strokeLinecap="round" opacity="0.72" />
          <g fill="#4a1715" stroke="#c46231" strokeWidth="2">
            <path d="M252 418c24-8 40 4 34 25-22 10-45-3-34-25Z" />
            <path d="M354 416c24-8 42 6 34 28-24 10-46-4-34-28Z" />
            <path d="M300 442c19-5 34 5 30 22-19 8-38-3-30-22Z" />
          </g>
          <g fill="#f0bd3e" opacity="0.72">
            <circle cx="246" cy="452" r="5" />
            <circle cx="386" cy="447" r="4" />
            <circle cx="322" cy="458" r="3" />
          </g>
          <g fill="#315f35">
            <ellipse cx="272" cy="426" rx="23" ry="8" transform="rotate(-20 272 426)" />
            <ellipse cx="374" cy="454" rx="24" ry="8" transform="rotate(18 374 454)" />
            <ellipse cx="318" cy="418" rx="20" ry="7" transform="rotate(-8 318 418)" />
          </g>
          <path d="M208 508c54 25 170 25 224 0" fill="none" stroke="#b88620" strokeWidth="3" opacity="0.38" />
        </g>
      )}

      <g fill="none" stroke="#f5d98d" strokeWidth="2" opacity="0.18">
        <path d="M96 210c26 0 26 32 0 32M544 556c26 0 26 32 0 32" />
      </g>
    </svg>
  );
}

export default function InstagramReelsSection() {
  const [selectedReel, setSelectedReel] = useState<Reel | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [canScrollBack, setCanScrollBack] = useState(false);
  const [canScrollForward, setCanScrollForward] = useState(true);

  const trackRef = useRef<HTMLDivElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const modalVideoRef = useRef<HTMLVideoElement | null>(null);

  const updateScrollState = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setCanScrollBack(track.scrollLeft > 4);
    setCanScrollForward(track.scrollLeft + track.clientWidth < track.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateScrollState();
    window.addEventListener("resize", updateScrollState);
    return () => window.removeEventListener("resize", updateScrollState);
  }, [updateScrollState]);

  const openReel = useCallback((reel: Reel) => {
    previouslyFocusedRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setProgress(0);
    setIsPlaying(true);
    setSelectedReel(reel);
    window.requestAnimationFrame(() => closeButtonRef.current?.focus());
  }, []);

  const closeReel = useCallback(() => {
    if (modalVideoRef.current) {
      modalVideoRef.current.pause();
    }
    setSelectedReel(null);
    setIsPlaying(false);
    window.requestAnimationFrame(() => {
      if (previouslyFocusedRef.current?.isConnected) {
        previouslyFocusedRef.current.focus();
      }
    });
  }, []);

  // Sync play/pause with video element
  useEffect(() => {
    const video = modalVideoRef.current;
    if (!video) return;

    if (isPlaying) {
      const promise = video.play();
      if (promise !== undefined) {
        promise.catch(() => {
          // Auto-play was prevented; fallback
          setIsPlaying(false);
        });
      }
    } else {
      video.pause();
    }
  }, [isPlaying, selectedReel]);

  // Sync volume and mute with video element
  useEffect(() => {
    const video = modalVideoRef.current;
    if (!video) return;
    video.volume = volume;
    video.muted = isMuted;
  }, [volume, isMuted, selectedReel]);

  useEffect(() => {
    if (!selectedReel) return;

    const root = modalRef.current;
    if (!root) return;

    const previousOverflow = document.body.style.overflow;
    const previousFocus =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeReel();
        return;
      }

      if (event.key !== "Tab" || !root) return;

      const focusableElements = Array.from(
        root.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((element) => !element.hasAttribute("aria-hidden"));

      if (!focusableElements.length) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    const focusTimer = window.setTimeout(() => closeButtonRef.current?.focus(), 0);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [closeReel, selectedReel]);

  const scrollCarousel = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    const amount = Math.max(280, track.clientWidth * 0.82);
    track.scrollBy({ left: direction * amount, behavior: "smooth" });
  };

  const toggleMuted = () => {
    setIsMuted((current) => {
      if (!current && volume === 0) setVolume(0.8);
      return !current;
    });
  };

  const progressPercent = selectedReel
    ? Math.min(100, (progress / selectedReel.duration) * 100)
    : 0;

  return (
    <section className="nk-reels" aria-labelledby="nk-reels-title">
      <style>{`
        .nk-reels {
          position: relative;
          width: 100%;
          min-width: 0;
          overflow: hidden;
          color: #f8ead2;
          color-scheme: dark;
          font-family: Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          background:
            radial-gradient(circle at 12% 8%, rgba(122, 12, 14, 0.24), transparent 28%),
            radial-gradient(circle at 88% 92%, rgba(212, 175, 55, 0.08), transparent 24%),
            #18090b;
        }

        .nk-reels *,
        .nk-reels *::before,
        .nk-reels *::after {
          box-sizing: border-box;
        }

        .nk-reels ::selection {
          color: #18090b;
          background: #d4af37;
        }

        .nk-reels a,
        .nk-reels button,
        .nk-reels input {
          -webkit-tap-highlight-color: transparent;
        }

        .nk-shell {
          width: min(1280px, 100%);
          min-width: 0;
          margin: 0 auto;
          padding: clamp(48px, 7vw, 96px) clamp(16px, 4vw, 48px) clamp(56px, 7vw, 96px);
        }

        .nk-header {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 28px;
          align-items: end;
        }

        .nk-brand-lockup {
          display: flex;
          min-width: 0;
          gap: 18px;
          align-items: center;
        }

        .nk-crest-wrap {
          position: relative;
          flex: 0 0 auto;
          width: 76px;
          height: 76px;
          display: grid;
          place-items: center;
          border: 1.5px solid rgba(212, 175, 55, 0.45);
          border-radius: 50%;
          background: linear-gradient(145deg, rgba(212, 175, 55, 0.15), rgba(122, 12, 14, 0.15));
          box-shadow: 0 0 25px rgba(212, 175, 55, 0.25), 0 10px 24px rgba(0, 0, 0, 0.4);
          padding: 3px;
        }

        .nk-crest-wrap::before {
          content: "";
          position: absolute;
          inset: 3px;
          border: 1px solid rgba(212, 175, 55, 0.25);
          border-radius: inherit;
          pointer-events: none;
        }

        .nk-crest {
          position: relative;
          width: 72px;
          height: 88px;
          filter: drop-shadow(0 6px 10px rgba(0, 0, 0, 0.34));
        }

        .nk-kicker,
        .nk-eyebrow {
          margin: 0 0 8px;
          color: #d9b85d;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.2em;
          line-height: 1.2;
          text-transform: uppercase;
        }

        .nk-display-title {
          max-width: 760px;
          margin: 0;
          color: #fff5dc;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(2.35rem, 5.4vw, 5.1rem);
          font-weight: 500;
          letter-spacing: -0.055em;
          line-height: 0.94;
          text-wrap: balance;
        }

        .nk-display-title em {
          color: #d4af37;
          font-style: italic;
          font-weight: 400;
        }

        .nk-brand-intro {
          max-width: 650px;
          margin: 16px 0 0;
          color: #cbb394;
          font-size: clamp(0.94rem, 1.5vw, 1.06rem);
          line-height: 1.7;
        }

        .nk-social-panel {
          min-width: 270px;
          padding: 18px;
          border: 1px solid rgba(212, 175, 55, 0.28);
          border-radius: 20px;
          background: linear-gradient(145deg, rgba(255, 244, 218, 0.08), rgba(122, 12, 14, 0.14));
          box-shadow: 0 22px 60px rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(14px);
        }

        .nk-profile-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(212, 175, 55, 0.15);
        }

        .nk-profile-avatar-wrap {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          padding: 2px;
          background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
          box-shadow: 0 0 14px rgba(220, 39, 67, 0.35);
          flex-shrink: 0;
        }

        .nk-profile-avatar {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          border: 1.5px solid #140809;
          display: block;
        }

        .nk-profile-meta {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }

        .nk-handle {
          min-width: 0;
          display: inline-flex;
          gap: 6px;
          align-items: center;
          color: #f8ead2;
          font-size: 0.92rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          text-decoration: none;
          overflow-wrap: anywhere;
        }

        .nk-handle svg {
          flex: 0 0 auto;
          color: #d4af37;
        }

        .nk-verified-badge {
          background: #3897f0;
          color: #fff;
          font-size: 0.65rem;
          width: 15px;
          height: 15px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          margin-left: 3px;
        }

        .nk-handle-sub {
          font-size: 0.72rem;
          color: #cbb394;
          letter-spacing: 0.02em;
        }

        .nk-social-actions {
          display: grid;
          gap: 9px;
          margin-top: 13px;
        }

        .nk-follow,
        .nk-followers {
          min-height: 42px;
          display: inline-flex;
          gap: 8px;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          font-size: 0.84rem;
          font-weight: 800;
          text-decoration: none;
        }

        .nk-follow {
          padding: 0 15px;
          color: #fff;
          background: linear-gradient(45deg, #f9ce34, #ee2a7b 52%, #6228d7);
          box-shadow: 0 10px 26px rgba(238, 42, 123, 0.22);
          transition: transform 180ms ease, box-shadow 180ms ease, filter 180ms ease;
        }

        .nk-follow:hover {
          transform: translateY(-2px);
          filter: saturate(1.1) brightness(1.05);
          box-shadow: 0 14px 32px rgba(238, 42, 123, 0.32);
        }

        .nk-followers {
          padding: 0 12px;
          color: #d8c2a0;
          border: 1px solid rgba(212, 175, 55, 0.2);
          background: rgba(8, 4, 5, 0.28);
        }

        .nk-followers strong {
          color: #f0d37c;
        }

        .nk-section-head {
          display: flex;
          gap: 20px;
          align-items: end;
          justify-content: space-between;
          margin-top: clamp(42px, 6vw, 72px);
        }

        .nk-section-copy {
          max-width: 650px;
        }

        .nk-section-title {
          margin: 0;
          color: #fff4dc;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(1.8rem, 3.5vw, 3.25rem);
          font-weight: 500;
          letter-spacing: -0.035em;
          line-height: 1.05;
          text-wrap: balance;
        }

        .nk-section-text {
          margin: 10px 0 0;
          color: #bfa88d;
          font-size: 0.94rem;
          line-height: 1.65;
        }

        .nk-carousel-controls {
          display: none;
          flex: 0 0 auto;
          gap: 8px;
        }

        .nk-arrow-button {
          width: 44px;
          height: 44px;
          display: grid;
          place-items: center;
          padding: 0;
          color: #f1d78d;
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 50%;
          background: rgba(24, 9, 11, 0.72);
          box-shadow: 0 10px 28px rgba(0, 0, 0, 0.2);
          cursor: pointer;
          transition: color 180ms ease, border-color 180ms ease, background 180ms ease, transform 180ms ease;
        }

        .nk-arrow-button:hover:not(:disabled) {
          color: #18090b;
          border-color: #d4af37;
          background: #d4af37;
          transform: translateY(-2px);
        }

        .nk-arrow-button:disabled {
          opacity: 0.34;
          cursor: not-allowed;
        }

        .nk-track {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
          margin-top: 28px;
        }

        .nk-card {
          position: relative;
          min-width: 0;
          display: block;
          width: 100%;
          margin: 0;
          padding: 0;
          overflow: hidden;
          color: inherit;
          text-align: left;
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 23px;
          background: linear-gradient(155deg, #241013, #120708 66%);
          box-shadow: 0 22px 55px rgba(0, 0, 0, 0.28);
          cursor: pointer;
          appearance: none;
          font: inherit;
          transition: transform 220ms ease, border-color 220ms ease, box-shadow 220ms ease;
        }

        .nk-card::before {
          content: "";
          position: absolute;
          z-index: 4;
          top: 0;
          left: 18%;
          right: 18%;
          height: 2px;
          background: linear-gradient(90deg, transparent, #d4af37, transparent);
        }

        .nk-card:hover {
          z-index: 2;
          border-color: rgba(212, 175, 55, 0.58);
          box-shadow: 0 28px 70px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(212, 175, 55, 0.08);
          transform: translateY(-6px);
        }

        .nk-card:focus-visible {
          position: relative;
          z-index: 5;
          outline: 3px solid #f0cd65;
          outline-offset: 4px;
        }

        .nk-thumb {
          position: relative;
          display: block;
          width: 100%;
          aspect-ratio: 4 / 5;
          overflow: hidden;
          isolation: isolate;
          background: #18090b;
        }

        .nk-thumb::after {
          content: "";
          position: absolute;
          z-index: 2;
          inset: 38% 0 0;
          background: linear-gradient(180deg, transparent, rgba(10, 4, 5, 0.16) 38%, rgba(10, 4, 5, 0.96));
          pointer-events: none;
        }

        .nk-thumb-video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 420ms ease, filter 420ms ease;
        }

        .nk-card:hover .nk-thumb-video,
        .nk-card:focus-visible .nk-thumb-video {
          filter: saturate(1.1) brightness(1.05);
          transform: scale(1.05);
        }

        .nk-video-media {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          background: #000;
        }

        .nk-reel-art {
          width: 100%;
          height: 100%;
          display: block;
          transition: transform 420ms ease, filter 420ms ease;
        }

        .nk-card:hover .nk-reel-art,
        .nk-card:focus-visible .nk-reel-art {
          filter: saturate(1.08) brightness(1.04);
          transform: scale(1.045);
        }

        .nk-card-badge {
          position: absolute;
          z-index: 4;
          top: 14px;
          left: 14px;
          max-width: calc(100% - 92px);
          padding: 7px 10px;
          overflow: hidden;
          color: #1a0d08;
          border-radius: 999px;
          background: linear-gradient(135deg, #f5dc83, #d4af37);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.24);
          font-size: 0.66rem;
          font-weight: 900;
          letter-spacing: 0.045em;
          line-height: 1.1;
          text-overflow: ellipsis;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .nk-card-views {
          position: absolute;
          z-index: 4;
          top: 14px;
          right: 14px;
          display: inline-flex;
          gap: 5px;
          align-items: center;
          padding: 7px 9px;
          color: #fff2d4;
          border: 1px solid rgba(255, 242, 216, 0.22);
          border-radius: 999px;
          background: rgba(12, 5, 6, 0.66);
          box-shadow: 0 7px 22px rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(10px);
          font-size: 0.7rem;
          font-weight: 800;
          line-height: 1;
        }

        .nk-card-play {
          position: absolute;
          z-index: 5;
          top: 50%;
          left: 50%;
          width: 64px;
          height: 64px;
          display: grid;
          place-items: center;
          color: #18090b;
          border: 1px solid rgba(255, 245, 220, 0.72);
          border-radius: 50%;
          background: rgba(212, 175, 55, 0.96);
          box-shadow: 0 14px 38px rgba(0, 0, 0, 0.34), 0 0 0 10px rgba(212, 175, 55, 0.12);
          transform: translate(-50%, -50%) scale(0.92);
          opacity: 0.9;
          transition: transform 220ms ease, opacity 220ms ease, box-shadow 220ms ease;
        }

        .nk-card:hover .nk-card-play,
        .nk-card:focus-visible .nk-card-play {
          opacity: 1;
          box-shadow: 0 18px 44px rgba(0, 0, 0, 0.4), 0 0 0 14px rgba(212, 175, 55, 0.14);
          transform: translate(-50%, -50%) scale(1);
        }

        .nk-card-copy {
          position: relative;
          z-index: 3;
          display: block;
          padding: 17px 17px 18px;
        }

        .nk-card-kicker {
          display: block;
          margin-bottom: 7px;
          color: #c9a552;
          font-size: 0.62rem;
          font-weight: 900;
          letter-spacing: 0.18em;
          line-height: 1;
          text-transform: uppercase;
        }

        .nk-card-title {
          display: block;
          margin: 0;
          color: #fff2d8;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(1.02rem, 1.5vw, 1.28rem);
          font-weight: 500;
          letter-spacing: -0.025em;
          line-height: 1.18;
          overflow-wrap: anywhere;
        }

        .nk-card-meta {
          display: flex;
          gap: 8px;
          align-items: center;
          justify-content: space-between;
          margin-top: 13px;
          color: #ad9478;
          font-size: 0.72rem;
        }

        .nk-watch {
          display: inline-flex;
          gap: 5px;
          align-items: center;
          color: #e5c676;
          font-weight: 800;
        }

        .nk-scroll-note {
          display: block;
          margin: 15px 4px 0;
          color: #9e886f;
          font-size: 0.72rem;
          letter-spacing: 0.04em;
          text-align: center;
          text-transform: uppercase;
        }

        .nk-modal-backdrop {
          position: fixed;
          z-index: 10000;
          inset: 0;
          display: grid;
          place-items: center;
          padding: clamp(8px, 3vw, 32px);
          background: rgba(7, 2, 3, 0.88);
          animation: nk-fade-in 180ms ease both;
          backdrop-filter: blur(16px);
        }

        .nk-modal {
          position: relative;
          width: min(920px, 100%);
          max-height: calc(100vh - 24px);
          max-height: calc(100dvh - 24px);
          overflow: auto;
          color: #f8ead2;
          border: 1px solid rgba(212, 175, 55, 0.36);
          border-radius: 24px;
          background:
            radial-gradient(circle at 15% 0%, rgba(122, 12, 14, 0.34), transparent 34%),
            #18090b;
          box-shadow: 0 36px 110px rgba(0, 0, 0, 0.62), 0 0 0 1px rgba(212, 175, 55, 0.06);
          animation: nk-modal-in 220ms ease both;
          scrollbar-width: thin;
          scrollbar-color: #7a5b22 #211013;
        }

        .nk-modal-close {
          position: absolute;
          z-index: 20;
          top: 12px;
          right: 12px;
          width: 40px;
          height: 40px;
          display: grid;
          place-items: center;
          padding: 0;
          color: #fff0cd;
          border: 1px solid rgba(255, 240, 205, 0.2);
          border-radius: 50%;
          background: rgba(10, 4, 5, 0.72);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.28);
          cursor: pointer;
          backdrop-filter: blur(10px);
          transition: color 180ms ease, background 180ms ease, transform 180ms ease;
        }

        .nk-modal-close:hover,
        .nk-modal-close:focus-visible {
          color: #18090b;
          background: #d4af37;
          outline: none;
          transform: rotate(4deg);
        }

        .nk-modal-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          min-height: 0;
        }

        .nk-player {
          position: relative;
          width: 100%;
          height: min(72dvh, 720px);
          min-height: 480px;
          overflow: hidden;
          isolation: isolate;
          background: #0d0607;
        }

        .nk-modal-art {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          display: block;
        }

        .nk-stage-vignette {
          position: absolute;
          z-index: 2;
          inset: 0;
          background:
            linear-gradient(180deg, rgba(8, 3, 4, 0.12), transparent 34%, rgba(8, 3, 4, 0.78)),
            radial-gradient(circle at center, transparent 42%, rgba(5, 2, 3, 0.26));
          pointer-events: none;
        }

        .nk-center-play {
          position: absolute;
          z-index: 6;
          top: 50%;
          left: 50%;
          width: 78px;
          height: 78px;
          display: grid;
          place-items: center;
          padding: 0;
          color: #18090b;
          border: 1px solid rgba(255, 245, 220, 0.8);
          border-radius: 50%;
          background: rgba(212, 175, 55, 0.96);
          box-shadow: 0 18px 50px rgba(0, 0, 0, 0.42), 0 0 0 12px rgba(212, 175, 55, 0.12);
          cursor: pointer;
          transform: translate(-50%, -50%);
          transition: transform 180ms ease, box-shadow 180ms ease;
        }

        .nk-center-play:hover {
          box-shadow: 0 20px 55px rgba(0, 0, 0, 0.48), 0 0 0 18px rgba(212, 175, 55, 0.13);
          transform: translate(-50%, -50%) scale(1.05);
        }

        .nk-player-controls {
          position: absolute;
          z-index: 8;
          right: 0;
          bottom: 0;
          left: 0;
          padding: 34px 15px 14px;
          background: linear-gradient(180deg, transparent, rgba(7, 3, 4, 0.92));
        }

        .nk-progress-row {
          display: grid;
          grid-template-columns: 34px minmax(0, 1fr) 34px;
          gap: 9px;
          align-items: center;
          margin-bottom: 11px;
          color: #e8d1a2;
          font-size: 0.68rem;
          font-variant-numeric: tabular-nums;
          font-weight: 700;
        }

        .nk-progress-row time:last-child {
          text-align: right;
        }

        .nk-range {
          width: 100%;
          height: 4px;
          margin: 0;
          padding: 0;
          border-radius: 999px;
          outline: none;
          appearance: none;
          cursor: pointer;
        }

        .nk-range::-webkit-slider-runnable-track {
          height: 4px;
          border-radius: 999px;
          background: transparent;
        }

        .nk-range::-moz-range-track {
          height: 4px;
          border-radius: 999px;
          background: transparent;
        }

        .nk-range::-webkit-slider-thumb {
          width: 13px;
          height: 13px;
          margin-top: -4.5px;
          border: 2px solid #fff1cd;
          border-radius: 50%;
          background: #d4af37;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
          appearance: none;
        }

        .nk-range::-moz-range-thumb {
          width: 11px;
          height: 11px;
          border: 2px solid #fff1cd;
          border-radius: 50%;
          background: #d4af37;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
        }

        .nk-control-row {
          display: flex;
          gap: 9px;
          align-items: center;
          flex-wrap: wrap;
        }

        .nk-icon-button {
          width: 38px;
          height: 38px;
          display: grid;
          flex: 0 0 auto;
          place-items: center;
          padding: 0;
          color: #fff0cd;
          border: 1px solid rgba(255, 240, 205, 0.18);
          border-radius: 50%;
          background: rgba(15, 7, 8, 0.66);
          cursor: pointer;
          backdrop-filter: blur(10px);
          transition: color 180ms ease, background 180ms ease, transform 180ms ease;
        }

        .nk-icon-button:hover,
        .nk-icon-button:focus-visible {
          color: #18090b;
          background: #d4af37;
          outline: none;
          transform: translateY(-1px);
        }

        .nk-audio-control {
          min-height: 36px;
          display: inline-flex;
          gap: 7px;
          align-items: center;
          padding: 0 10px;
          color: #ead4a5;
          border: 1px solid rgba(255, 240, 205, 0.16);
          border-radius: 999px;
          background: rgba(15, 7, 8, 0.58);
          cursor: pointer;
          font-size: 0.68rem;
          font-weight: 800;
          backdrop-filter: blur(10px);
        }

        .nk-volume {
          width: 82px;
          accent-color: #d4af37;
        }

        .nk-preview-label {
          margin-left: auto;
          color: rgba(248, 234, 210, 0.58);
          font-size: 0.62rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .nk-modal-info {
          min-width: 0;
          padding: clamp(22px, 4vw, 34px);
          background: linear-gradient(145deg, rgba(255, 244, 218, 0.055), rgba(122, 12, 14, 0.08));
        }

        .nk-modal-badge {
          display: inline-flex;
          padding: 7px 10px;
          color: #211107;
          border-radius: 999px;
          background: linear-gradient(135deg, #f5dc83, #d4af37);
          font-size: 0.66rem;
          font-weight: 900;
          letter-spacing: 0.05em;
          line-height: 1;
          text-transform: uppercase;
        }

        .nk-modal-title {
          margin: 15px 0 0;
          color: #fff3d9;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(1.65rem, 4vw, 2.65rem);
          font-weight: 500;
          letter-spacing: -0.04em;
          line-height: 1.04;
          overflow-wrap: anywhere;
        }

        .nk-modal-description {
          margin: 14px 0 0;
          color: #c4ad90;
          font-size: 0.92rem;
          line-height: 1.7;
        }

        .nk-modal-stats {
          display: flex;
          gap: 9px;
          flex-wrap: wrap;
          margin-top: 20px;
        }

        .nk-stat {
          display: inline-flex;
          gap: 6px;
          align-items: center;
          padding: 8px 10px;
          color: #e2c88f;
          border: 1px solid rgba(212, 175, 55, 0.18);
          border-radius: 999px;
          background: rgba(8, 4, 5, 0.3);
          font-size: 0.72rem;
          font-weight: 800;
        }

        .nk-modal-follow {
          display: grid;
          gap: 10px;
          margin-top: 26px;
          padding-top: 22px;
          border-top: 1px solid rgba(212, 175, 55, 0.16);
        }

        .nk-instagram-link {
          min-height: 46px;
          display: inline-flex;
          gap: 9px;
          align-items: center;
          justify-content: center;
          padding: 0 16px;
          color: #fff;
          border-radius: 13px;
          background: linear-gradient(45deg, #f9ce34, #ee2a7b 52%, #6228d7);
          box-shadow: 0 12px 30px rgba(238, 42, 123, 0.22);
          font-size: 0.84rem;
          font-weight: 900;
          text-decoration: none;
          transition: transform 180ms ease, filter 180ms ease;
        }

        .nk-instagram-link:hover {
          filter: brightness(1.08) saturate(1.1);
          transform: translateY(-2px);
        }

        .nk-modal-account {
          display: flex;
          gap: 7px;
          align-items: center;
          justify-content: center;
          color: #bfa88d;
          font-size: 0.72rem;
          font-weight: 800;
        }

        @media (min-width: 761px) and (max-width: 1080px) {
          .nk-track {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .nk-carousel-controls {
            display: flex;
          }
        }

        @media (min-width: 1081px) {
          .nk-track {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }

          .nk-carousel-controls {
            display: flex;
          }
        }

        @media (max-width: 900px) {
          .nk-header {
            grid-template-columns: 1fr;
            align-items: start;
          }

          .nk-social-panel {
            width: min(100%, 420px);
          }

          .nk-modal-grid {
            grid-template-columns: minmax(0, 1fr) minmax(250px, 0.72fr);
          }

          .nk-player {
            height: min(82dvh, 780px);
            min-height: 560px;
          }
        }

        @media (max-width: 760px) {
          .nk-shell {
            padding-top: 42px;
          }

          .nk-brand-lockup {
            gap: 14px;
          }

          .nk-crest-wrap {
            width: 60px;
            height: 60px;
          }

          .nk-crest {
            width: 58px;
            height: 72px;
          }

          .nk-display-title {
            font-size: clamp(2rem, 11vw, 3.4rem);
          }

          .nk-brand-intro {
            font-size: 0.88rem;
          }

          .nk-social-panel {
            min-width: 0;
          }

          .nk-social-actions {
            grid-template-columns: 1fr auto;
            align-items: stretch;
          }

          .nk-follow {
            min-width: 0;
          }

          .nk-section-head {
            align-items: start;
          }

          .nk-section-title {
            font-size: clamp(1.75rem, 8vw, 2.6rem);
          }

          .nk-track {
            display: flex;
            gap: 14px;
            margin-right: -16px;
            margin-left: -16px;
            padding: 4px 16px 18px;
            overflow-x: auto;
            overscroll-behavior-x: contain;
            scroll-padding-inline: 16px;
            scroll-snap-type: x mandatory;
            scrollbar-width: none;
            -webkit-overflow-scrolling: touch;
          }

          .nk-track::-webkit-scrollbar {
            display: none;
          }

          .nk-card {
            flex: 0 0 min(82vw, 330px);
            scroll-snap-align: start;
          }

          .nk-carousel-controls {
            display: none;
          }

          .nk-scroll-note {
            display: block;
          }
        }

        @media (max-width: 520px) {
          .nk-shell {
            padding-right: 16px;
            padding-left: 16px;
          }

          .nk-brand-lockup {
            align-items: flex-start;
          }

          .nk-eyebrow {
            font-size: 0.62rem;
          }

          .nk-display-title {
            font-size: clamp(1.9rem, 10.5vw, 2.8rem);
          }

          .nk-social-panel {
            padding: 13px;
            border-radius: 17px;
          }

          .nk-social-actions {
            display: grid;
            grid-template-columns: 1fr;
          }

          .nk-follow,
          .nk-followers {
            width: 100%;
          }

          .nk-section-head {
            display: block;
          }

          .nk-section-text {
            margin-top: 8px;
          }

          .nk-card {
            flex-basis: calc(100vw - 48px);
            border-radius: 20px;
          }

          .nk-card-copy {
            padding: 15px;
          }

          .nk-card-badge {
            top: 12px;
            left: 12px;
            font-size: 0.6rem;
          }

          .nk-card-views {
            top: 12px;
            right: 12px;
          }

          .nk-modal-backdrop {
            padding: 7px;
          }

          .nk-modal {
            max-height: calc(100vh - 14px);
            max-height: calc(100dvh - 14px);
            border-radius: 18px;
          }

          .nk-modal-grid {
            display: block;
          }

          .nk-player {
            height: min(68dvh, 680px);
            min-height: 410px;
          }

          .nk-modal-info {
            padding: 20px 18px 22px;
          }

          .nk-modal-title {
            font-size: 1.65rem;
          }

          .nk-modal-follow {
            margin-top: 21px;
            padding-top: 18px;
          }
        }

        @media (max-width: 360px) {
          .nk-shell {
            padding-top: 34px;
          }

          .nk-brand-lockup {
            gap: 11px;
          }

          .nk-crest-wrap {
            width: 62px;
            height: 76px;
          }

          .nk-crest {
            width: 52px;
            height: 65px;
          }

          .nk-display-title {
            font-size: 1.86rem;
          }

          .nk-brand-intro {
            margin-top: 11px;
            font-size: 0.8rem;
            line-height: 1.55;
          }

          .nk-handle {
            font-size: 0.74rem;
          }

          .nk-card {
            flex-basis: calc(100vw - 44px);
          }

          .nk-card-title {
            font-size: 0.96rem;
          }

          .nk-card-meta {
            font-size: 0.66rem;
          }

          .nk-player {
            height: 63dvh;
            min-height: 385px;
          }

          .nk-player-controls {
            padding-right: 10px;
            padding-left: 10px;
          }

          .nk-progress-row {
            grid-template-columns: 29px minmax(0, 1fr) 29px;
            gap: 5px;
            font-size: 0.6rem;
          }

          .nk-control-label,
          .nk-preview-label {
            display: none;
          }

          .nk-volume {
            width: 58px;
          }

          .nk-modal-close {
            top: 8px;
            right: 8px;
            width: 34px;
            height: 34px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .nk-reels *,
          .nk-reels *::before,
          .nk-reels *::after {
            scroll-behavior: auto !important;
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        @keyframes nk-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes nk-modal-in {
          from {
            opacity: 0;
            transform: translateY(14px) scale(0.985);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>

      <div className="nk-shell">
        <header className="nk-header">
          <div className="nk-brand-lockup">
            <div>
              <p className="nk-eyebrow">The royal feed · Indore</p>
              <h2 className="nk-display-title" id="nk-reels-title">
                Viral bites from <em>Nahari King</em>
              </h2>
              <p className="nk-brand-intro">
                Slow-cooked drama, royal portions, and the finishes people replay before booking a table.
              </p>
            </div>
          </div>

          <div className="nk-social-panel" aria-label="Nahari King Instagram account">
            <div className="nk-profile-header">
              <div className="nk-profile-avatar-wrap">
                <img
                  src="/nahari-king-crest.png"
                  alt="Nahari King Official Profile"
                  className="nk-profile-avatar"
                  width={48}
                  height={48}
                />
              </div>
              <div className="nk-profile-meta">
                <a
                  className="nk-handle"
                  href={instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Open @thenahariking on Instagram"
                >
                  <IconInstagram size={18} />
                  <span>@thenahariking</span>
                  <span className="nk-verified-badge" title="Verified">✓</span>
                </a>
                <span className="nk-handle-sub">Official Restaurant Page</span>
              </div>
            </div>

            <div className="nk-social-actions">
              <a
                className="nk-follow"
                href={instagramUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Follow Nahari King on Instagram"
              >
                <IconInstagram size={17} />
                <span>Follow on Instagram</span>
              </a>
              <span className="nk-followers" aria-label="125K plus followers">
                <IconUsers size={15} />
                <strong>125K+</strong>
                <span>followers</span>
              </span>
            </div>
          </div>
        </header>

        <div className="nk-section-head">
          <div className="nk-section-copy">
            <p className="nk-kicker">Reels worth a craving</p>
            <h3 className="nk-section-title">Press play. Then bring an appetite.</h3>
            <p className="nk-section-text">
              Tap a reel for an interactive preview, or visit the official account for the full feast.
            </p>
          </div>

          <div className="nk-carousel-controls" aria-label="Reel carousel controls">
            <button
              className="nk-arrow-button"
              type="button"
              onClick={() => scrollCarousel(-1)}
              disabled={!canScrollBack}
              aria-label="Scroll reels backward"
            >
              <IconArrow size={18} />
            </button>
            <button
              className="nk-arrow-button"
              type="button"
              onClick={() => scrollCarousel(1)}
              disabled={!canScrollForward}
              aria-label="Scroll reels forward"
            >
              <span style={{ display: "inline-block", transform: "rotate(180deg)" }}>
                <IconArrow size={18} />
              </span>
            </button>
          </div>
        </div>

        <div
          className="nk-track"
          ref={trackRef}
          onScroll={updateScrollState}
          aria-label="Viral Nahari King food reels"
        >
          {reels.map((reel) => (
            <button
              className="nk-card"
              type="button"
              key={reel.id}
              onClick={() => openReel(reel)}
              aria-label={`Play reel preview: ${reel.title}`}
            >
              <span className="nk-thumb">
                <video
                  src={reel.videoSrc}
                  className="nk-thumb-video"
                  muted
                  playsInline
                  loop
                  preload="metadata"
                  onMouseEnter={(e) => {
                    const promise = e.currentTarget.play();
                    if (promise !== undefined) promise.catch(() => {});
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.pause();
                    e.currentTarget.currentTime = 0;
                  }}
                />
                <span className="nk-card-badge">{reel.badge}</span>
                <span className="nk-card-views">
                  <IconEye size={14} />
                  {reel.views} views
                </span>
                <span className="nk-card-play" aria-hidden="true">
                  <IconPlay size={26} />
                </span>
              </span>
              <span className="nk-card-copy">
                <span className="nk-card-kicker">Instagram reel</span>
                <span className="nk-card-title">{reel.title}</span>
                <span className="nk-card-meta">
                  <span className="nk-watch">
                    <IconPlay size={12} />
                    Watch preview
                  </span>
                  <span>{reel.duration}s</span>
                </span>
              </span>
            </button>
          ))}
        </div>

        <span className="nk-scroll-note">Swipe to explore more royal reels</span>
      </div>

      {selectedReel && (
        <div
          className="nk-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeReel();
          }}
        >
          <div
            className="nk-modal"
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="nk-modal-title"
            aria-describedby="nk-modal-description"
          >
            <button
              className="nk-modal-close"
              type="button"
              ref={closeButtonRef}
              onClick={closeReel}
              aria-label="Close reel preview"
            >
              <IconClose size={22} />
            </button>

            <div className="nk-modal-grid">
              <div className="nk-player">
                <video
                  ref={modalVideoRef}
                  src={selectedReel.videoSrc}
                  className="nk-video-media"
                  playsInline
                  onTimeUpdate={(e) => {
                    setProgress(e.currentTarget.currentTime);
                  }}
                  onLoadedMetadata={(e) => {
                    if (e.currentTarget.duration) {
                      // Keep reel duration accurate
                      selectedReel.duration = Math.round(e.currentTarget.duration);
                    }
                  }}
                  onEnded={() => {
                    setIsPlaying(false);
                    setProgress(0);
                  }}
                  onClick={() => setIsPlaying((current) => !current)}
                />
                <div className="nk-stage-vignette" aria-hidden="true" />

                {!isPlaying && (
                  <button
                    className="nk-center-play"
                    type="button"
                    onClick={() => setIsPlaying(true)}
                    aria-label="Play reel preview"
                  >
                    <IconPlay size={32} />
                  </button>
                )}

                <div className="nk-player-controls">
                  <div className="nk-progress-row">
                    <time dateTime={`PT${Math.floor(progress)}S`}>{formatTime(progress)}</time>
                    <input
                      className="nk-range"
                      type="range"
                      min="0"
                      max={selectedReel.duration}
                      step="0.1"
                      value={Math.min(progress, selectedReel.duration)}
                      onChange={(event) => {
                        const nextTime = Number(event.currentTarget.value);
                        setProgress(nextTime);
                        if (modalVideoRef.current) {
                          modalVideoRef.current.currentTime = nextTime;
                        }
                      }}
                      style={{
                        background: `linear-gradient(90deg, #d4af37 ${progressPercent}%, rgba(255, 240, 205, 0.2) ${progressPercent}%)`,
                      }}
                      aria-label={`${selectedReel.title} playback position`}
                    />
                    <time dateTime={`PT${selectedReel.duration}S`}>{formatTime(selectedReel.duration)}</time>
                  </div>

                  <div className="nk-control-row">
                    <button
                      className="nk-icon-button"
                      type="button"
                      onClick={() => setIsPlaying((current) => !current)}
                      aria-label={isPlaying ? "Pause reel preview" : "Play reel preview"}
                      aria-pressed={isPlaying}
                    >
                      {isPlaying ? <IconPause size={19} /> : <IconPlay size={19} />}
                    </button>

                    <button
                      className="nk-audio-control"
                      type="button"
                      onClick={toggleMuted}
                      aria-label={isMuted ? "Turn reel audio on" : "Mute reel audio"}
                      aria-pressed={isMuted}
                    >
                      <IconVolume size={17} muted={isMuted} />
                      <span className="nk-control-label">{isMuted ? "Audio off" : "Audio on"}</span>
                    </button>

                    <input
                      className="nk-range nk-volume"
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={isMuted ? 0 : volume}
                      onChange={(event) => {
                        const nextVolume = Number(event.currentTarget.value);
                        setVolume(nextVolume);
                        if (nextVolume > 0 && isMuted) setIsMuted(false);
                      }}
                      aria-label="Reel preview volume"
                    />

                    <span className="nk-preview-label">Interactive reel preview</span>
                  </div>
                </div>
              </div>

              <aside className="nk-modal-info">
                <span className="nk-modal-badge">{selectedReel.badge}</span>
                <h3 className="nk-modal-title" id="nk-modal-title">
                  {selectedReel.title}
                </h3>
                <p className="nk-modal-description" id="nk-modal-description">
                  {selectedReel.description}
                </p>

                <div className="nk-modal-stats" aria-label="Reel details">
                  <span className="nk-stat">
                    <IconEye size={14} />
                    {selectedReel.views} views
                  </span>
                  <span className="nk-stat">@thenahariking</span>
                  <span className="nk-stat">{selectedReel.duration}s</span>
                </div>

                <div className="nk-modal-follow">
                  <a
                    className="nk-instagram-link"
                    href={selectedReel.instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Open ${selectedReel.title} reel on Instagram`}
                  >
                    <IconInstagram size={18} />
                    <span>Watch the full reel on Instagram</span>
                  </a>
                  <span className="nk-modal-account">
                    Official account · @thenahariking
                  </span>
                </div>
              </aside>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}