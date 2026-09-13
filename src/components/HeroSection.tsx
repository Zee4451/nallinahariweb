'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/components/CartContext';
import { MENU_ITEMS, RESTAURANT_INFO } from '@/data/restaurantData';
import VolumetricFire from '@/components/VolumetricFire';

type UnknownRecord = Record<string, unknown>;

type RestaurantInfoShape = {
  name?: unknown;
  tagline?: unknown;
  city?: unknown;
  area?: unknown;
  location?: unknown;
  address?: unknown;
  phone?: unknown;
};

type DishDefinition = {
  slug: string;
  label: string;
  price: number;
  eyebrow: string;
  keywords: string[];
  fallbackDescription: string;
  fallbackImage: string;
};

type SignatureDish = {
  slug: string;
  name: string;
  label: string;
  price: number;
  description: string;
  image: string;
  eyebrow: string;
  source?: UnknownRecord;
};

const readText = (value: unknown): string => {
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number') return String(value);

  if (value && typeof value === 'object') {
    const record = value as UnknownRecord;
    return readText(record.url ?? record.src ?? record.label ?? record.text);
  }

  return '';
};

const readImage = (value: unknown): string => {
  if (typeof value === 'string') return value.trim();
  if (Array.isArray(value)) return readImage(value[0]);

  if (value && typeof value === 'object') {
    const record = value as UnknownRecord;
    return readImage(record.url ?? record.src ?? record.publicUrl ?? record.image);
  }

  return '';
};

const readPrice = (value: unknown): number => {
  if (value && typeof value === 'object') {
    const record = value as UnknownRecord;
    return readPrice(record.amount ?? record.value ?? record.price);
  }

  const numericValue =
    typeof value === 'string'
      ? Number(value.replace(/[^\d.]/g, ''))
      : Number(value ?? 0);

  return Number.isFinite(numericValue) && numericValue > 0 ? numericValue : 0;
};

const recordsFrom = (value: unknown): UnknownRecord[] => {
  if (Array.isArray(value)) return value.flatMap(recordsFrom);
  if (value && typeof value === 'object') return [value as UnknownRecord];
  return [];
};

const getMenuCatalog = (items: unknown): UnknownRecord[] => {
  if (Array.isArray(items)) return recordsFrom(items);
  if (items && typeof items === 'object') {
    return Object.values(items as UnknownRecord).flatMap(recordsFrom);
  }
  return [];
};

const DISH_DEFINITIONS: readonly DishDefinition[] = [
  {
    slug: 'special-nalli-nihari',
    label: 'Special Nalli Nihari',
    price: 340,
    eyebrow: 'Slow-cooked favourite',
    keywords: ['special nalli nihari', 'nalli nihari', 'nalli-nihari', 'nihari'],
    fallbackDescription:
      'Tender shank and velvety overnight-spiced gravy, finished for a slow, satisfying bite.',
    fallbackImage:
      'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=1000&q=88',
  },
  {
    slug: 'mutton-paye',
    label: 'Mutton Paye',
    price: 300,
    eyebrow: 'Counter classic',
    keywords: ['mutton paye', 'mutton paya', 'paye', 'paya'],
    fallbackDescription:
      'Melt-away mutton simmered in a silky spice broth, made for slow mornings and big appetites.',
    fallbackImage:
      'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=88',
  },
  {
    slug: 'viral-thaal',
    label: 'Viral Thaal',
    price: 799,
    eyebrow: 'The full experience',
    keywords: ['viral thaal', 'viral thal', 'thaal', 'thal', 'dum thaal'],
    fallbackDescription:
      'The complete Nahari King spread: nihari, paye, naan and all the sides worth fighting over.',
    fallbackImage:
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=88',
  },
];

const menuCatalog = getMenuCatalog(MENU_ITEMS);

const findMenuDish = (definition: DishDefinition): UnknownRecord => {
  return (
    menuCatalog.find((item) => {
      const searchable = [item.id, item.slug, item.name, item.title]
        .map(readText)
        .join(' ')
        .toLowerCase();

      return definition.keywords.some((keyword) => searchable.includes(keyword));
    }) ?? {}
  );
};

const dishes: SignatureDish[] = DISH_DEFINITIONS.map((definition) => {
  const source = findMenuDish(definition);
  const sourceDescription = readText(
    source.description ?? source.shortDescription ?? source.summary
  );
  const sourceImage = readImage(
    source.image ?? source.photo ?? source.imageUrl ?? source.images
  );

  return {
    slug: definition.slug,
    name: readText(source.name) || definition.label,
    label: definition.label,
    price: readPrice(source.price) || definition.price,
    description: sourceDescription || definition.fallbackDescription,
    image: sourceImage || definition.fallbackImage,
    eyebrow: definition.eyebrow,
    source,
  };
});

const restaurantInfo = RESTAURANT_INFO as unknown as RestaurantInfoShape;
const rawRestaurantName = readText(restaurantInfo.name);
const restaurantName =
  rawRestaurantName.replace(/(\s*[-|·]\s*Indore|\s+Indore)$/i, '').trim() ||
  'Nahari King';

const locationSource = restaurantInfo.location ?? restaurantInfo.address;
const locationObject =
  locationSource && typeof locationSource === 'object'
    ? (locationSource as UnknownRecord)
    : {};
const locationParts = [
  readText(
    locationObject.area ??
      locationObject.locality ??
      locationObject.line1 ??
      restaurantInfo.area
  ),
  readText(locationObject.city ?? restaurantInfo.city),
].filter(Boolean);
const locationLabel =
  readText(locationSource) || locationParts.join(', ') || 'Khajrana, Indore';
const brandLocation = /khajrana/i.test(locationLabel)
  ? 'Khajrana, Indore'
  : locationLabel;
const phone = readText(restaurantInfo.phone).replace(/[^\d+]/g, '');
const contactHref = phone ? `tel:${phone}` : '#location';
const contactLabel = phone ? 'Call to Order' : 'Find Us';

export default function HeroSection() {
  const { addToCart } = useCart();
  const showcaseRef = useRef<HTMLDivElement>(null);
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [activeDishIndex, setActiveDishIndex] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const [hasImageError, setHasImageError] = useState(false);

  const selectedDish = dishes[activeDishIndex] ?? dishes[0];

  useEffect(() => {
    return () => {
      if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    };
  }, []);

  useEffect(() => {
    setHasImageError(false);
  }, [selectedDish.image]);

  useEffect(() => {
    const card = showcaseRef.current;
    if (!card || typeof window === 'undefined') return;

    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      card.style.transform = 'none';
      return;
    }

    let frameId = 0;

    const clampValue = (value: number, minimum: number, maximum: number) =>
      Math.min(maximum, Math.max(minimum, value));

    const updateTilt = () => {
      frameId = 0;
      const rect = card.getBoundingClientRect();
      const viewportHeight = Math.max(1, window.innerHeight);

      if (rect.bottom < 0 || rect.top > viewportHeight) return;

      const progress = clampValue(
        (window.scrollY + viewportHeight * 0.28 - rect.top) /
          (viewportHeight * 0.72),
        0,
        1
      );
      const rotateX = progress * 6;
      const rotateY = progress * -5;
      const scale = 1 + progress * 0.04;

      card.style.transform = `perspective(1150px) rotateX(${rotateX.toFixed(
        2
      )}deg) rotateY(${rotateY.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
    };

    const scheduleTilt = () => {
      if (!frameId) frameId = window.requestAnimationFrame(updateTilt);
    };

    updateTilt();
    window.addEventListener('scroll', scheduleTilt, { passive: true });
    window.addEventListener('resize', scheduleTilt);

    return () => {
      window.removeEventListener('scroll', scheduleTilt);
      window.removeEventListener('resize', scheduleTilt);
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, []);

  const selectDish = (index: number) => {
    setActiveDishIndex(index);
    setIsAdded(false);
    setHasImageError(false);
  };

  const handleAddToOrder = () => {
    const sourceItem = selectedDish.source ?? {};
    const cartPayload = {
      ...sourceItem,
      id: readText(sourceItem.id) || selectedDish.slug,
      name: selectedDish.name,
      price: selectedDish.price,
      quantity: 1,
      image: selectedDish.image,
      description: selectedDish.description,
    };

    addToCart(cartPayload as unknown as Parameters<typeof addToCart>[0]);

    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    setIsAdded(true);
    feedbackTimer.current = setTimeout(() => setIsAdded(false), 1800);
  };

  return (
    <section className="hero-section" id="home" aria-labelledby="hero-title">
      <style jsx>{`
        .hero-section {
          position: relative;
          min-height: 88vh;
          overflow: hidden;
          isolation: isolate;
          color: #f5eee2;
          background:
            radial-gradient(circle at 78% 12%, rgba(137, 67, 20, 0.2), transparent 28%),
            radial-gradient(circle at 8% 92%, rgba(126, 62, 23, 0.12), transparent 26%),
            #080706;
        }

        .hero-section,
        .hero-section * {
          box-sizing: border-box;
        }

        .hero-section::before {
          content: '';
          position: absolute;
          inset: 0;
          z-index: 0;
          opacity: 0.08;
          pointer-events: none;
          background-image: radial-gradient(
            circle at 1px 1px,
            rgba(232, 184, 91, 0.32) 0.6px,
            transparent 0.8px
          );
          background-size: 28px 28px;
          mask-image: linear-gradient(to bottom, #000, transparent 82%);
        }

        .hero-section::after {
          content: '';
          position: absolute;
          inset: 0;
          z-index: 1;
          opacity: 0.72;
          pointer-events: none;
          background: linear-gradient(
            to bottom,
            rgba(8, 7, 6, 0.18),
            transparent 26%,
            transparent 70%,
            #080706
          );
        }

        .hero-ambient {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background:
            radial-gradient(circle at 74% 34%, rgba(177, 92, 29, 0.13), transparent 22%),
            radial-gradient(circle at 20% 68%, rgba(111, 53, 20, 0.1), transparent 24%);
        }

        .grid-overlay {
          position: absolute;
          inset: 0;
          z-index: 0;
          opacity: 0.16;
          pointer-events: none;
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.018) 1px, transparent 1px);
          background-size: 72px 72px;
          mask-image: linear-gradient(to bottom, #000, transparent 76%);
        }

        .hero-background-fire {
          position: absolute;
          inset: 0;
          z-index: 1;
          width: 100%;
          height: 100%;
          pointer-events: none;
          mix-blend-mode: screen;
          opacity: 0.85;
          transform: translateZ(0);
          will-change: transform;
        }

        .embers {
          position: absolute;
          inset: 0;
          z-index: 1;
          opacity: 0.25;
          pointer-events: none;
        }

        .embers i {
          position: absolute;
          width: 2px;
          height: 2px;
          border-radius: 999px;
          background: #f2bd62;
          box-shadow: 0 0 12px 2px rgba(226, 143, 48, 0.7);
          animation: ember-float 9s ease-in-out infinite;
        }

        .embers i:nth-child(1) {
          left: 13%;
          bottom: 18%;
          animation-delay: -1s;
        }

        .embers i:nth-child(2) {
          left: 24%;
          bottom: 10%;
          animation-delay: -4.2s;
        }

        .embers i:nth-child(3) {
          left: 52%;
          bottom: 14%;
          animation-delay: -2.4s;
        }

        .embers i:nth-child(4) {
          left: 71%;
          bottom: 9%;
          animation-delay: -6.1s;
        }

        .embers i:nth-child(5) {
          left: 84%;
          bottom: 21%;
          animation-delay: -3.4s;
        }

        .embers i:nth-child(6) {
          left: 91%;
          bottom: 13%;
          animation-delay: -7.2s;
        }

        .hero-container {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 1240px;
          min-height: 88vh;
          margin: 0 auto;
          padding: 110px 24px 64px;
          display: flex;
          align-items: center;
        }

        .hero-grid {
          width: 100%;
          display: grid;
          grid-template-columns: minmax(0, 1.08fr) minmax(420px, 480px);
          align-items: center;
          gap: 56px;
        }

        .hero-copy {
          max-width: 650px;
        }

        .brand-tag {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          min-height: 29px;
          padding: 7px 12px;
          border: 1px solid rgba(219, 178, 94, 0.2);
          border-radius: 999px;
          background: rgba(224, 181, 91, 0.06);
          color: #d8b76f;
          font-size: 11px;
          line-height: 1;
          font-weight: 600;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .brand-dot {
          width: 5px;
          height: 5px;
          flex: 0 0 auto;
          border-radius: 50%;
          background: #d8ae5c;
          box-shadow: 0 0 12px rgba(216, 174, 92, 0.8);
        }

        .tag-text {
          background: linear-gradient(100deg, #f4ead5 5%, #cfa85e 58%, #ead19a);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .hero-title {
          max-width: 650px;
          margin: 24px 0 0;
          color: #f7f0e3;
          font-family: 'Playfair Display', 'Cinzel', Georgia, serif;
          font-size: clamp(2.4rem, 4.2vw, 4rem);
          font-weight: 600;
          line-height: 1.15;
          letter-spacing: -0.035em;
          text-wrap: balance;
        }

        .title-line {
          display: block;
        }

        .hero-title em {
          font-style: normal;
          background: linear-gradient(
            100deg,
            #f8efdf 8%,
            #d8b877 52%,
            #f0d9a5 92%
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .hero-description {
          max-width: 520px;
          margin: 22px 0 0;
          color: rgba(245, 238, 226, 0.75);
          font-size: 15px;
          line-height: 1.65;
          letter-spacing: 0.005em;
        }

        .hero-actions {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-top: 32px;
          flex-wrap: wrap;
        }

        .primary-cta {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          min-height: 52px;
          padding: 6px 8px 6px 20px;
          border-radius: 999px;
          color: #1a1106;
          font-family: inherit;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.01em;
          text-decoration: none;
          background: linear-gradient(135deg, #fae2a6 0%, #e5b34a 52%, #c98b28 100%);
          box-shadow:
            0 0 0 1px rgba(255, 230, 160, 0.4) inset,
            0 8px 24px -4px rgba(229, 179, 74, 0.4),
            0 16px 36px -8px rgba(0, 0, 0, 0.5);
          overflow: hidden;
          transition:
            transform 220ms cubic-bezier(0.16, 1, 0.3, 1),
            box-shadow 220ms cubic-bezier(0.16, 1, 0.3, 1),
            filter 220ms ease;
          cursor: pointer;
        }

        .cta-shimmer {
          position: absolute;
          top: -50%;
          left: -100%;
          width: 60%;
          height: 200%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.45) 50%,
            transparent
          );
          transform: rotate(25deg);
          animation: cta-shimmer-pass 3.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          pointer-events: none;
        }

        @keyframes cta-shimmer-pass {
          0%, 65% {
            left: -100%;
          }
          100% {
            left: 200%;
          }
        }

        .cta-content {
          position: relative;
          z-index: 2;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .cta-crown {
          font-size: 15px;
          filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
        }

        .cta-text {
          color: #170f05;
          font-weight: 700;
          letter-spacing: 0.015em;
        }

        .cta-badge {
          display: inline-flex;
          align-items: center;
          padding: 2px 7px;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 750;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: #fff9e6;
          background: rgba(26, 17, 6, 0.88);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
        }

        .cta-arrow-wrap {
          position: relative;
          z-index: 2;
          display: grid;
          place-items: center;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(26, 17, 6, 0.92);
          color: #f7d277;
          transition: transform 220ms cubic-bezier(0.16, 1, 0.3, 1), background 220ms ease;
        }

        .cta-arrow {
          width: 16px;
          height: 16px;
          transition: transform 220ms ease;
        }

        .primary-cta:hover {
          transform: translateY(-2px) scale(1.015);
          filter: brightness(1.05);
          box-shadow:
            0 0 0 1px rgba(255, 240, 180, 0.6) inset,
            0 12px 32px -4px rgba(229, 179, 74, 0.55),
            0 20px 42px -6px rgba(0, 0, 0, 0.55);
        }

        .primary-cta:hover .cta-arrow-wrap {
          transform: translateX(2px);
          background: #000;
        }

        .primary-cta:hover .cta-arrow {
          transform: translateX(1px);
        }

        .primary-cta:active {
          transform: translateY(0) scale(0.99);
        }

        .secondary-cta {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 14px;
          min-height: 52px;
          padding: 6px 20px 6px 8px;
          border-radius: 999px;
          text-decoration: none;
          background: rgba(24, 18, 14, 0.72);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(229, 179, 74, 0.32);
          box-shadow:
            0 8px 24px -4px rgba(0, 0, 0, 0.45),
            0 0 0 1px rgba(255, 255, 255, 0.05) inset;
          overflow: hidden;
          transition:
            transform 220ms cubic-bezier(0.16, 1, 0.3, 1),
            border-color 220ms ease,
            background 220ms ease,
            box-shadow 220ms ease;
        }

        .cta-glass-sheen {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.07) 0%,
            transparent 60%
          );
          pointer-events: none;
        }

        .cta-phone-indicator {
          position: relative;
          display: grid;
          place-items: center;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(229, 179, 74, 0.22), rgba(229, 179, 74, 0.08));
          border: 1px solid rgba(229, 179, 74, 0.4);
          color: #fce39f;
          flex-shrink: 0;
        }

        .pulse-ping {
          position: absolute;
          inset: -3px;
          border-radius: 50%;
          border: 1px solid rgba(74, 222, 128, 0.6);
          animation: phone-ping 2.2s cubic-bezier(0, 0, 0.2, 1) infinite;
          pointer-events: none;
        }

        .pulse-core {
          position: absolute;
          top: 3px;
          right: 3px;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #4ade80;
          box-shadow: 0 0 6px #4ade80;
        }

        @keyframes phone-ping {
          0% {
            transform: scale(0.9);
            opacity: 0.8;
          }
          70%, 100% {
            transform: scale(1.4);
            opacity: 0;
          }
        }

        .cta-phone-icon {
          width: 16px;
          height: 16px;
        }

        .secondary-cta-copy {
          display: flex;
          flex-direction: column;
          gap: 1px;
          text-align: left;
        }

        .secondary-cta-label {
          color: #fbf5eb;
          font-size: 13.5px;
          font-weight: 650;
          letter-spacing: 0.01em;
          line-height: 1.2;
        }

        .secondary-cta-sub {
          color: #cca457;
          font-size: 10.5px;
          font-weight: 500;
          letter-spacing: 0.03em;
          line-height: 1.2;
        }

        .secondary-cta:hover {
          transform: translateY(-2px) scale(1.015);
          background: rgba(36, 26, 18, 0.88);
          border-color: rgba(229, 179, 74, 0.65);
          box-shadow:
            0 12px 30px -4px rgba(0, 0, 0, 0.55),
            0 0 16px rgba(229, 179, 74, 0.2);
        }

        .secondary-cta:active {
          transform: translateY(0) scale(0.99);
        }

        .primary-cta:focus-visible,
        .secondary-cta:focus-visible,
        .dish-tab:focus-visible,
        .order-button:focus-visible {
          outline: 2px solid rgba(235, 198, 119, 0.9);
          outline-offset: 3px;
        }

        .bento-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
          max-width: 560px;
          margin-top: 28px;
        }

        .bento-card {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
          height: auto;
          padding: 12px 14px;
          border: 1px solid rgba(245, 238, 226, 0.09);
          border-radius: 15px;
          background: rgba(255, 244, 222, 0.045);
          backdrop-filter: blur(12px);
        }

        .bento-icon {
          display: grid;
          width: 29px;
          height: 29px;
          flex: 0 0 auto;
          place-items: center;
          border-radius: 9px;
          color: #e4bd72;
          background: rgba(219, 178, 94, 0.1);
        }

        .bento-icon svg {
          width: 15px;
          height: 15px;
        }

        .bento-icon--green {
          color: #c9d7a7;
          background: rgba(174, 196, 128, 0.09);
        }

        .bento-icon--rose {
          color: #e2ad8d;
          background: rgba(202, 119, 70, 0.1);
        }

        .bento-copy {
          min-width: 0;
        }

        .bento-copy strong {
          display: block;
          overflow: hidden;
          color: #f5eddd;
          font-size: 13px;
          font-weight: 650;
          line-height: 1.15;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .bento-copy span {
          display: block;
          margin-top: 3px;
          color: rgba(245, 238, 226, 0.52);
          font-size: 10.5px;
          line-height: 1.2;
          letter-spacing: 0.02em;
          text-transform: uppercase;
        }

        .showcase-wrap {
          width: min(100%, 480px);
          justify-self: end;
          perspective: 1200px;
        }

        .showcase-card {
          position: relative;
          width: 100%;
          max-width: 480px;
          padding: 18px;
          overflow: hidden;
          border: 1px solid rgba(224, 184, 105, 0.18);
          border-radius: 24px;
          background: linear-gradient(
            145deg,
            rgba(43, 30, 19, 0.96),
            rgba(17, 13, 10, 0.94)
          );
          box-shadow:
            0 28px 70px rgba(0, 0, 0, 0.34),
            inset 0 1px 0 rgba(255, 255, 255, 0.045);
          transform-style: preserve-3d;
          transition:
            transform 220ms ease-out,
            border-color 220ms ease-out;
        }

        .showcase-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 10%;
          right: 10%;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(230, 194, 123, 0.6),
            transparent
          );
          pointer-events: none;
        }

        .showcase-top {
          position: relative;
          z-index: 4;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          transform: translateZ(14px);
        }

        .showcase-heading span,
        .dish-kicker {
          display: block;
          color: rgba(228, 190, 116, 0.76);
          font-size: 10px;
          font-weight: 650;
          line-height: 1.2;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .showcase-heading strong {
          display: block;
          margin-top: 4px;
          color: rgba(245, 238, 226, 0.86);
          font-size: 13px;
          font-weight: 600;
          line-height: 1.25;
        }

        .degh-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          min-height: 27px;
          padding: 6px 9px;
          border: 1px solid rgba(224, 184, 105, 0.14);
          border-radius: 999px;
          color: rgba(239, 211, 157, 0.82);
          background: rgba(17, 12, 8, 0.42);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .degh-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #d99a4e;
          box-shadow: 0 0 9px rgba(217, 154, 78, 0.8);
        }

        .degh-meter {
          position: relative;
          width: 34px;
          height: 2px;
          overflow: hidden;
          border-radius: 999px;
          background: rgba(245, 238, 226, 0.12);
        }

        .degh-meter i {
          display: block;
          width: 78%;
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, #b96d2d, #e8c87e);
        }

        .dish-stage {
          position: relative;
          height: 260px;
          margin-top: 13px;
          overflow: hidden;
          border-radius: 18px;
          background: #1b130e;
          transform: translateZ(10px);
        }

        .dish-stage img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: saturate(0.92) contrast(1.04);
          transition: transform 420ms ease;
        }

        .dish-stage.image-missing img {
          opacity: 0;
        }

        .showcase-card:hover .dish-stage img {
          transform: scale(1.055);
        }

        .dish-fallback {
          position: absolute;
          inset: 0;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          color: rgba(245, 238, 226, 0.68);
          background:
            radial-gradient(circle at 50% 45%, rgba(153, 79, 28, 0.2), transparent 42%),
            #211710;
        }

        .dish-fallback svg {
          width: 72px;
          height: 54px;
          opacity: 0.76;
        }

        .dish-flame-effect {
          position: absolute;
          inset: 0;
          z-index: 5;
          pointer-events: none;
          mix-blend-mode: screen;
          opacity: 0.85;
          filter: drop-shadow(0 0 20px rgba(255, 90, 20, 0.4));
        }

        .steam-canopy {
          position: absolute;
          inset: 0;
          z-index: 10;
          overflow: visible;
          pointer-events: none;
        }

        .steam-cloud {
          position: absolute;
          bottom: 22%;
          border-radius: 50%;
          background: radial-gradient(
            circle at 50% 50%,
            rgba(255, 255, 255, 0.92) 0%,
            rgba(255, 248, 230, 0.75) 35%,
            rgba(245, 220, 165, 0.35) 60%,
            transparent 75%
          );
          filter: blur(14px);
          opacity: 0;
          mix-blend-mode: screen;
          will-change: transform, opacity;
          animation: steam-pop-rise infinite cubic-bezier(0.2, 0.8, 0.25, 1);
        }

        .steam-cloud-1 {
          left: 20%;
          width: 85px;
          height: 120px;
          animation-duration: 3.2s;
          animation-delay: 0s;
        }

        .steam-cloud-2 {
          left: 38%;
          width: 110px;
          height: 150px;
          animation-duration: 3.8s;
          animation-delay: 0.7s;
        }

        .steam-cloud-3 {
          left: 56%;
          width: 95px;
          height: 135px;
          animation-duration: 3.4s;
          animation-delay: 1.5s;
        }

        .steam-cloud-4 {
          left: 28%;
          width: 100px;
          height: 140px;
          animation-duration: 3.6s;
          animation-delay: 2.2s;
        }

        .steam-cloud-5 {
          left: 48%;
          width: 125px;
          height: 165px;
          animation-duration: 4.1s;
          animation-delay: 2.8s;
        }

        .steam-cloud-6 {
          left: 64%;
          width: 80px;
          height: 115px;
          animation-duration: 3.1s;
          animation-delay: 1.0s;
        }

        .dum-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          z-index: 3;
          padding: 7px 9px;
          border: 1px solid rgba(255, 244, 222, 0.16);
          border-radius: 999px;
          color: #f4e7cd;
          background: rgba(12, 9, 7, 0.48);
          backdrop-filter: blur(10px);
          font-size: 10px;
          font-weight: 650;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .dish-summary {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 14px;
          margin: 15px 3px 0;
          transform: translateZ(8px);
        }

        .dish-title-wrap {
          min-width: 0;
        }

        .dish-name {
          margin: 5px 0 0;
          overflow: hidden;
          color: #f7efdf;
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 21px;
          font-weight: 600;
          line-height: 1.16;
          letter-spacing: -0.018em;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .dish-price {
          flex: 0 0 auto;
          color: #e5c47d;
          font-size: 15px;
          font-weight: 650;
          line-height: 1.2;
        }

        .dish-description {
          margin: 8px 3px 0;
          color: rgba(245, 238, 226, 0.58);
          font-size: 12.5px;
          line-height: 1.55;
        }

        .dish-selector {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 6px;
          margin: 14px 0;
        }

        .dish-tab {
          min-width: 0;
          min-height: 49px;
          padding: 7px 5px;
          border: 1px solid rgba(245, 238, 226, 0.09);
          border-radius: 999px;
          color: rgba(245, 238, 226, 0.66);
          background: rgba(255, 255, 255, 0.025);
          cursor: pointer;
          transition:
            color 180ms ease,
            border-color 180ms ease,
            background 180ms ease,
            transform 180ms ease;
        }

        .dish-tab:hover {
          color: #f5eddd;
          border-color: rgba(224, 184, 105, 0.24);
          transform: translateY(-1px);
        }

        .dish-tab[aria-selected='true'] {
          color: #1c130b;
          border-color: transparent;
          background: linear-gradient(135deg, #eed092, #bd7c2e);
          box-shadow: 0 7px 18px rgba(153, 91, 25, 0.18);
        }

        .tab-label,
        .tab-price {
          display: block;
          min-width: 0;
          line-height: 1.2;
        }

        .tab-label {
          overflow: hidden;
          font-size: 11px;
          font-weight: 650;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .tab-price {
          margin-top: 3px;
          font-size: 11px;
          font-weight: 700;
        }

        .order-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          width: 100%;
          min-height: 46px;
          padding: 0 18px;
          border: 1px solid rgba(242, 207, 143, 0.28);
          border-radius: 999px;
          color: #1b1209;
          background: linear-gradient(135deg, #f0d393, #bd7c2e);
          box-shadow: 0 10px 24px rgba(153, 91, 25, 0.18);
          cursor: pointer;
          font-size: 13px;
          font-weight: 700;
          transition:
            transform 180ms ease,
            box-shadow 180ms ease,
            background 180ms ease;
        }

        .order-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 28px rgba(153, 91, 25, 0.26);
        }

        .order-button.is-added {
          color: #172213;
          background: linear-gradient(135deg, #e7dca5, #b9c48b);
        }

        .order-button svg {
          width: 16px;
          height: 16px;
          flex: 0 0 auto;
        }

        @keyframes steam-pop-rise {
          0% {
            opacity: 0;
            transform: translate3d(0, 25px, 0) scale(0.35) rotate(0deg);
          }
          18% {
            opacity: 0.95;
            transform: translate3d(-8px, -20px, 0) scale(0.85) rotate(-5deg);
          }
          48% {
            opacity: 0.8;
            transform: translate3d(10px, -80px, 0) scale(1.35) rotate(7deg);
          }
          75% {
            opacity: 0.45;
            transform: translate3d(-14px, -145px, 0) scale(1.85) rotate(-9deg);
          }
          100% {
            opacity: 0;
            transform: translate3d(18px, -210px, 0) scale(2.4) rotate(12deg);
          }
        }

        @keyframes ember-float {
          0% {
            opacity: 0;
            transform: translate3d(0, 0, 0);
          }
          18% {
            opacity: 0.72;
          }
          100% {
            opacity: 0;
            transform: translate3d(13px, -125px, 0);
          }
        }

        @media (max-width: 1080px) {
          .hero-container {
            min-height: auto;
            padding-bottom: 80px;
          }

          .hero-grid {
            grid-template-columns: 1fr;
            gap: 54px;
          }

          .hero-copy {
            max-width: 720px;
          }

          .showcase-wrap {
            width: min(100%, 520px);
            justify-self: center;
          }

          .bento-grid {
            max-width: 620px;
          }
        }

        @media (max-width: 640px) {
          .hero-container {
            padding: 110px 18px 44px;
          }

          .hero-grid {
            gap: 42px;
          }

          .brand-tag {
            max-width: 100%;
            letter-spacing: 0.2em;
          }

          .hero-description {
            margin-top: 19px;
          }

          .hero-actions {
            align-items: stretch;
            flex-direction: column;
          }

          .primary-cta,
          .secondary-cta {
            width: 100%;
          }

          .bento-grid {
            grid-template-columns: 1fr;
            max-width: none;
          }

          .bento-card {
            min-height: 54px;
          }

          .showcase-card {
            padding: 15px;
            border-radius: 22px;
          }

          .showcase-top {
            gap: 8px;
          }

          .showcase-heading strong {
            font-size: 12px;
          }

          .degh-badge {
            padding: 6px 7px;
          }

          .degh-badge > span:nth-child(2) {
            display: none;
          }

          .dish-stage {
            height: 260px;
          }

          .dish-name {
            font-size: 19px;
          }

          .dish-description {
            font-size: 12.5px;
          }

          .dish-selector {
            gap: 5px;
          }

          .dish-tab {
            min-height: 50px;
            padding: 7px 4px;
          }

          .tab-label {
            font-size: 10.5px;
          }

          .tab-price {
            font-size: 11px;
          }

          .order-button {
            min-height: 46px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-section *,
          .hero-section *::before,
          .hero-section *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
          }

          .showcase-card {
            transform: none !important;
            transition: none !important;
          }
        }
      `}</style>

      <div className="hero-ambient" aria-hidden="true" />
      <VolumetricFire
        className="hero-background-fire"
        color={0xff5511}
        magnitude={1.5}
        lacunarity={2.0}
        gain={0.6}
        scale={[3.8, 4.8, 3.2]}
        opacity={0.78}
      />
      <div className="grid-overlay" aria-hidden="true" />
      <div className="embers" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
        <i />
        <i />
      </div>

      <div className="hero-container">
        <div className="hero-grid">
          <div className="hero-copy">
            <div className="brand-tag">
              <span className="brand-dot" aria-hidden="true" />
              <span className="tag-text">
                {restaurantName} · {brandLocation}
              </span>
            </div>

            <h1 className="hero-title" id="hero-title">
              <span className="title-line">
                Slow-simmered <em>royalty,</em>
              </span>
              <span className="title-line">served with pride.</span>
            </h1>

            <p className="hero-description">
              Twelve hours of dum, hand-pounded spices, and a degh that turned
              Khajrana&apos;s favourite nihari into an Indore ritual.
            </p>

            <div className="hero-actions">
              <Link className="primary-cta" href="/#menu">
                <span className="cta-shimmer" aria-hidden="true" />
                <span className="cta-content">
                  <span className="cta-crown" aria-hidden="true">👑</span>
                  <span className="cta-text">Explore the Menu</span>
                  <span className="cta-badge">Fresh Dum</span>
                </span>
                <span className="cta-arrow-wrap" aria-hidden="true">
                  <svg
                    className="cta-arrow"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M5 12h14M13 6l6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </Link>

              <Link className="secondary-cta" href={contactHref}>
                <span className="cta-glass-sheen" aria-hidden="true" />
                <span className="cta-phone-indicator" aria-hidden="true">
                  <span className="pulse-ping" />
                  <span className="pulse-core" />
                  <svg
                    className="cta-phone-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M20 16.9v2.6a1.8 1.8 0 0 1-2 1.8 19.8 19.8 0 0 1-8.6-3.1 19.3 19.3 0 0 1-5.9-5.9A19.8 19.8 0 0 1 1.7 4.2 1.8 1.8 0 0 1 3.5 2.2h2.6a1.8 1.8 0 0 1 1.8 1.5c.1.9.4 1.8.7 2.6a1.8 1.8 0 0 1-.4 1.9L7 9.4a16.2 16.2 0 0 0 5.9 5.9l1.2-1.2a1.8 1.8 0 0 1 1.9-.4c.8.3 1.7.6 2.6.7a1.8 1.8 0 0 1 1.4 1.5Z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="secondary-cta-copy">
                  <span className="secondary-cta-label">{contactLabel}</span>
                  <span className="secondary-cta-sub">099775 71717 · Live</span>
                </span>
              </Link>
            </div>

            <div className="bento-grid" aria-label="Restaurant highlights">
              <div className="bento-card">
                <span className="bento-icon">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="m12 3 2.68 5.43 6 .87-4.34 4.23 1.02 5.97L12 16.9l-5.36 2.8 1.02-5.97L3.32 9.3l6-.87L12 3Z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
                <div className="bento-copy">
                  <strong>4.5</strong>
                  <span>Google rating</span>
                </div>
              </div>

              <div className="bento-card">
                <span className="bento-icon bento-icon--green">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle
                      cx="12"
                      cy="12"
                      r="8.5"
                      stroke="currentColor"
                      strokeWidth="1.7"
                    />
                    <path
                      d="M12 7.5V12l3 2"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <div className="bento-copy">
                  <strong>12h</strong>
                  <span>Dum craft</span>
                </div>
              </div>

              <div className="bento-card">
                <span className="bento-icon bento-icon--rose">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="12"
                      cy="10"
                      r="2.3"
                      stroke="currentColor"
                      strokeWidth="1.7"
                    />
                  </svg>
                </span>
                <div className="bento-copy">
                  <strong>Opp. Gate 2</strong>
                  <span>Khajrana, Indore</span>
                </div>
              </div>
            </div>
          </div>

          <div className="showcase-wrap">
            <article
              ref={showcaseRef}
              className="showcase-card"
              id="dish-panel"
              aria-label="Signature dish showcase"
            >
              <div className="showcase-top">
                <div className="showcase-heading">
                  <span>Signature counter</span>
                  <strong>Fresh from the degh</strong>
                </div>

                <div className="degh-badge" title="Traditional degh slow-cooking">
                  <span className="degh-dot" aria-hidden="true" />
                  <span>Degh 82°</span>
                  <span className="degh-meter" aria-hidden="true">
                    <i />
                  </span>
                </div>
              </div>

              <div className="dish-stage">
                {hasImageError ? (
                  <div className="dish-fallback" role="img" aria-label={`${selectedDish.name} illustration`}>
                    <svg viewBox="0 0 120 86" fill="none" aria-hidden="true">
                      <path
                        d="M18 35h84c0 23-15 39-42 39S18 58 18 35Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M12 35h96M35 24c3-8 11-12 25-12s22 4 25 12"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M42 52c8 7 28 7 36 0"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        opacity="0.65"
                      />
                    </svg>
                    <span>Slow-cooked signature</span>
                  </div>
                ) : (
                  <img
                    key={`${selectedDish.slug}-${selectedDish.image}`}
                    src={selectedDish.image}
                    alt={`${selectedDish.name} at ${restaurantName}`}
                    loading="eager"
                    decoding="async"
                    onError={() => setHasImageError(true)}
                  />
                )}

                <div className="steam-canopy" aria-hidden="true">
                  <div className="steam-cloud steam-cloud-1" />
                  <div className="steam-cloud steam-cloud-2" />
                  <div className="steam-cloud steam-cloud-3" />
                  <div className="steam-cloud steam-cloud-4" />
                  <div className="steam-cloud steam-cloud-5" />
                  <div className="steam-cloud steam-cloud-6" />
                </div>
                <span className="dum-badge">12h dum</span>
              </div>

              <div className="dish-summary">
                <div className="dish-title-wrap">
                  <span className="dish-kicker">{selectedDish.eyebrow}</span>
                  <h2 className="dish-name">{selectedDish.name}</h2>
                </div>
                <strong className="dish-price">{selectedDish.price.toLocaleString('en-IN')}</strong>
              </div>

              <p className="dish-description">{selectedDish.description}</p>

              <div className="dish-selector" role="tablist" aria-label="Choose a signature dish">
                {dishes.map((dish, index) => (
                  <button
                    key={dish.slug}
                    type="button"
                    role="tab"
                    aria-selected={activeDishIndex === index}
                    aria-controls="dish-panel"
                    className="dish-tab"
                    onClick={() => selectDish(index)}
                  >
                    <span className="tab-label">{dish.label}</span>
                    <span className="tab-price">{dish.price.toLocaleString('en-IN')}</span>
                  </button>
                ))}
              </div>

              <button
                type="button"
                className={`order-button${isAdded ? ' is-added' : ''}`}
                onClick={handleAddToOrder}
                aria-live="polite"
              >
                {isAdded ? (
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="m5 12 4.2 4.2L19 6.8"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M3 4h2.2l2 10.1a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 2-1.6L20.5 8H6"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="9.5" cy="20" r="1.3" fill="currentColor" />
                    <circle cx="17.5" cy="20" r="1.3" fill="currentColor" />
                  </svg>
                )}
                <span>{isAdded ? ' Added to Order' : 'Add to Order'}</span>
              </button>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}