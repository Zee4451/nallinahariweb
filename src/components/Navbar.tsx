'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/components/CartContext';
import { RESTAURANT_INFO } from '@/data/restaurantData';

type NavbarProps = {
  setIsCartOpen?: (open: boolean) => void;
};

const navigationItems = [
  { label: 'Home', href: '/' },
  { label: 'Menu & Offers', href: '/menu' },
  { label: '12-Hour Craft', href: '/heritage' },
  { label: 'Reserve Table', href: '/reservations' },
  { label: 'Location', href: '/contact' },
];

export default function Navbar({ setIsCartOpen: propSetIsCartOpen }: NavbarProps = {}) {
  const pathname = usePathname();
  const { totalCount = 0, setIsCartOpen: contextSetIsCartOpen } = useCart();
  const setIsCartOpen = propSetIsCartOpen || contextSetIsCartOpen;
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

  return (
    <header className={`nk-navbar${isScrolled ? ' nk-navbar-scrolled' : ''}`}>
      <div className="nk-navbar-inner">
        <Link href="/" className="nk-brand" aria-label="Nahari King home" onClick={() => setMenuOpen(false)}>
          <span className="nk-brand-mark" aria-hidden="true">
            <img
              src="/nahari-king-crest.png"
              alt="Nahari King Royal Crest"
              className="nk-brand-logo-img"
              width={48}
              height={48}
            />
            <span className="nk-seal-glint" />
          </span>

          <span className="nk-brand-copy">
            <strong>NAHARI KING</strong>
            <span className="nk-brand-meta">
              <span className="nk-location">KHAJRANA <b>•</b> INDORE</span>
              <span className="nk-status">
                <i /> SIMMERING NOW <em>· OPEN TILL 11 PM</em>
              </span>
            </span>
          </span>
        </Link>

        <nav className="nk-desktop-nav" aria-label="Primary navigation">
          <ul className="nk-nav-list">
            {navigationItems.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`nk-nav-link${active ? ' nk-nav-link-active' : ''}`}
                    aria-current={active ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="nk-actions">
          <a className="nk-call-button" href={`tel:${RESTAURANT_INFO.phone}`}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8.1 3.2 10 7.1 8.2 8.9a15.8 15.8 0 0 0 6.9 6.9l1.8-1.8 3.9 1.9v2.7a2 2 0 0 1-2.1 2A17.4 17.4 0 0 1 6.1 8 17.4 17.4 0 0 1 6 5.3a2 2 0 0 1 2.1-2.1Z" />
            </svg>
            <span>
              <small>CONCIERGE</small>
              <strong>{RESTAURANT_INFO.phone}</strong>
            </span>
          </a>

          <Link className="nk-book-button" href="/reservations">
            <span className="nk-book-shimmer" aria-hidden="true" />
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 2.8v2.2M17 2.8V5M4.8 8.5h14.4M6.2 5h11.6A2.2 2.2 0 0 1 20 7.2v11.6a2.2 2.2 0 0 1-2.2 2.2H6.2A2.2 2.2 0 0 1 4 18.8V7.2A2.2 2.2 0 0 1 6.2 5Z" />
              <path d="m9.7 14.4 1.8 1.8 3.5-3.8" />
            </svg>
            <span>BOOK TABLE</span>
            <svg className="nk-button-arrow" viewBox="0 0 24 24" aria-hidden="true">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </Link>

          <button
            type="button"
            className={`nk-cart-button${totalCount > 0 ? ' nk-cart-button-active' : ''}`}
            aria-label={`Open cart, ${totalCount} ${totalCount === 1 ? 'item' : 'items'}`}
            onClick={() => setIsCartOpen(true)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4.8 8.2h14.1l-1.2 10.1a2 2 0 0 1-2 1.7H8.3a2 2 0 0 1-2-1.7L5.1 8.2H3" />
              <path d="M8.2 8.2 10 4.5h4l1.8 3.7M8.7 13.2h6.6" />
            </svg>
            <span className={`nk-cart-badge${totalCount > 0 ? ' nk-cart-badge-pulse' : ''}`}>
              {totalCount > 99 ? '99+' : totalCount}
            </span>
          </button>

          <button
            type="button"
            className={`nk-menu-toggle${menuOpen ? ' nk-menu-toggle-open' : ''}`}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="nk-mobile-drawer"
            onClick={() => setMenuOpen((current) => !current)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <div className={`nk-mobile-layer${menuOpen ? ' nk-mobile-layer-open' : ''}`}>
        <button
          type="button"
          className="nk-mobile-scrim"
          aria-label="Close menu"
          tabIndex={menuOpen ? 0 : -1}
          onClick={() => setMenuOpen(false)}
        />

        <aside
          id="nk-mobile-drawer"
          className="nk-mobile-drawer"
          aria-label="Mobile navigation"
          aria-hidden={!menuOpen}
        >
          <div className="nk-mobile-drawer-head">
            <span className="nk-mobile-seal" aria-hidden="true">
              <img
                src="/nahari-king-crest.png"
                alt="Nahari King Royal Crest"
                width={40}
                height={40}
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
              />
            </span>
            <div>
              <strong>NAHARI KING</strong>
              <span>KHAJRANA • INDORE</span>
            </div>
            <button
              type="button"
              className="nk-drawer-close"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
            </button>
          </div>

          <nav className="nk-mobile-nav" aria-label="Mobile primary navigation">
            {navigationItems.map((item, index) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nk-mobile-item nk-mobile-nav-link${active ? ' nk-mobile-nav-active' : ''}`}
                  style={{ '--item-delay': `${90 + index * 45}ms` } as React.CSSProperties}
                  aria-current={active ? 'page' : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  {item.label}
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </Link>
              );
            })}
          </nav>

          <div className="nk-mobile-divider" />

          <div className="nk-mobile-quick-actions">
            <a
              className="nk-mobile-item nk-mobile-call"
              href={`tel:${RESTAURANT_INFO.phone}`}
              style={{ '--item-delay': '330ms' } as React.CSSProperties}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.1 3.2 10 7.1 8.2 8.9a15.8 15.8 0 0 0 6.9 6.9l1.8-1.8 3.9 1.9v2.7a2 2 0 0 1-2.1 2A17.4 17.4 0 0 1 6.1 8 17.4 17.4 0 0 1 6 5.3a2 2 0 0 1 2.1-2.1Z" />
              </svg>
              <span><small>CONCIERGE QUICK CALL</small><strong>{RESTAURANT_INFO.phone}</strong></span>
            </a>

            <Link
              className="nk-mobile-item nk-mobile-booking"
              href="/reservations"
              style={{ '--item-delay': '375ms' } as React.CSSProperties}
              onClick={() => setMenuOpen(false)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7 2.8v2.2M17 2.8V5M4.8 8.5h14.4M6.2 5h11.6A2.2 2.2 0 0 1 20 7.2v11.6a2.2 2.2 0 0 1-2.2 2.2H6.2A2.2 2.2 0 0 1 4 18.8V7.2A2.2 2.2 0 0 1 6.2 5Z" />
                <path d="m9.7 14.4 1.8 1.8 3.5-3.8" />
              </svg>
              <span><small>ROYAL EXPERIENCE</small><strong>BOOK A TABLE</strong></span>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
            </Link>

            <Link
              className="nk-mobile-item nk-mobile-address"
              href="/contact"
              style={{ '--item-delay': '420ms' } as React.CSSProperties}
              onClick={() => setMenuOpen(false)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              <span><small>VISIT THE KING'S TABLE</small><strong>Khajrana Main Road, Indore</strong></span>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
            </Link>
          </div>

          <div className="nk-mobile-footer nk-mobile-item" style={{ '--item-delay': '465ms' } as React.CSSProperties}>
            <span className="nk-rating-dot"></span>
            <span><strong>4.5 Royal Rating</strong><small>Loved by Indore</small></span>
            <span className="nk-open-dot"><i /> OPEN TILL 11 PM</span>
          </div>
        </aside>
      </div>

      <style jsx global>{`
        .nk-navbar,
        .nk-navbar *,
        .nk-navbar *::before,
        .nk-navbar *::after {
          box-sizing: border-box;
        }

        .nk-navbar {
          position: fixed;
          top: clamp(12px, 1.8vw, 22px);
          left: 50%;
          z-index: 1000;
          width: min(calc(100% - 24px), 1480px);
          transform: translateX(-50%);
          border-radius: 999px;
          isolation: isolate;
        }

        .nk-navbar::before {
          content: '';
          position: absolute;
          top: 1px;
          left: 8%;
          right: 8%;
          z-index: 4;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(212, 175, 55, 0.18),
            rgba(255, 229, 138, 0.82),
            rgba(212, 175, 55, 0.18),
            transparent
          );
          opacity: 0.62;
          pointer-events: none;
        }

        .nk-navbar::after {
          content: '';
          position: absolute;
          inset: -1px;
          z-index: -1;
          border-radius: inherit;
          background: radial-gradient(
            ellipse at center,
            rgba(212, 175, 55, 0.18),
            rgba(212, 175, 55, 0.035) 48%,
            transparent 72%
          );
          filter: blur(18px);
          opacity: 0.2;
          transition: opacity 350ms ease;
          pointer-events: none;
        }

        .nk-navbar-scrolled::after {
          opacity: 0.38;
        }

        .nk-navbar-inner {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: clamp(14px, 2vw, 30px);
          min-height: 74px;
          padding: 8px 10px 8px clamp(12px, 1.2vw, 18px);
          overflow: visible;
          border: 1px solid rgba(212, 175, 55, 0.25);
          border-radius: 999px;
          background:
            linear-gradient(135deg, rgba(29, 21, 13, 0.94), rgba(14, 11, 9, 0.84) 42%, rgba(24, 17, 10, 0.92)),
            rgba(14, 11, 9, 0.82);
          box-shadow:
            0 14px 36px rgba(0, 0, 0, 0.46),
            inset 0 1px 0 rgba(255, 255, 255, 0.045),
            0 0 0 1px rgba(0, 0, 0, 0.12);
          -webkit-backdrop-filter: blur(24px) saturate(145%);
          backdrop-filter: blur(24px) saturate(145%);
          transition:
            min-height 360ms cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 360ms cubic-bezier(0.22, 1, 0.36, 1),
            background 360ms ease;
        }

        .nk-navbar-scrolled .nk-navbar-inner {
          min-height: 64px;
          box-shadow:
            0 20px 40px rgba(0, 0, 0, 0.7),
            0 0 25px rgba(212, 175, 55, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.055);
        }

        .nk-brand {
          display: inline-flex;
          align-items: center;
          min-width: 0;
          color: inherit;
          text-decoration: none;
        }

        .nk-brand-mark {
          position: relative;
          display: grid;
          flex: 0 0 auto;
          width: 52px;
          height: 52px;
          place-items: center;
          overflow: hidden;
          border: 1px solid rgba(226, 184, 79, 0.28);
          border-radius: 50%;
          background: radial-gradient(circle at 32% 25%, rgba(255, 220, 120, 0.16), rgba(18, 12, 7, 0.9) 62%);
          box-shadow:
            0 0 22px rgba(212, 175, 55, 0.16),
            inset 0 0 14px rgba(212, 175, 55, 0.08);
        }

        .nk-brand-mark::after {
          content: '';
          position: absolute;
          inset: 1px;
          border-radius: inherit;
          background: conic-gradient(
            from 0deg,
            transparent 0 68%,
            rgba(255, 232, 154, 0.72) 80%,
            transparent 92% 100%
          );
          animation: nk-seal-spin 7s linear infinite;
          opacity: 0.34;
        }

        .nk-brand-mark svg,
        .nk-brand-mark img,
        .nk-brand-logo-img {
          position: relative;
          z-index: 1;
          display: block;
          width: 46px;
          height: 46px;
          border-radius: 50%;
          object-fit: cover;
          filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.45));
        }

        .nk-seal-glint {
          position: absolute;
          top: 7px;
          left: 9px;
          z-index: 2;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #fff4c2;
          box-shadow: 0 0 9px 3px rgba(255, 230, 150, 0.68);
        }

        .nk-brand-copy {
          display: flex;
          min-width: 0;
          margin-left: 11px;
          flex-direction: column;
          gap: 3px;
        }

        .nk-brand-copy strong {
          display: block;
          color: transparent;
          font-family: Cinzel, 'Times New Roman', serif;
          font-size: 16px;
          font-weight: 700;
          line-height: 1;
          letter-spacing: 0.19em;
          white-space: nowrap;
          background: linear-gradient(100deg, #fff0aa 5%, #dcb853 42%, #9b6b20 64%, #ffe394 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: nk-gold-flow 7s ease-in-out infinite;
        }

        .nk-brand-meta {
          display: flex;
          align-items: center;
          min-width: 0;
          gap: 8px;
          color: rgba(235, 226, 205, 0.62);
          font-family: Inter, ui-sans-serif, system-ui, sans-serif;
          font-size: 8.5px;
          font-weight: 700;
          letter-spacing: 0.13em;
          line-height: 1;
          white-space: nowrap;
        }

        .nk-location b {
          margin: 0 3px;
          color: rgba(212, 175, 55, 0.68);
          font-weight: 400;
        }

        .nk-status {
          display: inline-flex;
          align-items: center;
          color: rgba(90, 220, 151, 0.82);
          letter-spacing: 0.08em;
        }

        .nk-status i,
        .nk-open-dot i {
          display: block;
          width: 6px;
          height: 6px;
          margin-right: 5px;
          flex: 0 0 auto;
          border: 1px solid rgba(105, 235, 164, 0.5);
          border-radius: 50%;
          background: #38d987;
          box-shadow: 0 0 0 0 rgba(56, 217, 135, 0.48), 0 0 10px rgba(56, 217, 135, 0.65);
          animation: nk-status-pulse 1.8s ease-out infinite;
        }

        .nk-status em {
          margin-left: 3px;
          color: rgba(231, 224, 206, 0.48);
          font-size: 8px;
          font-style: normal;
          font-weight: 600;
          letter-spacing: 0.06em;
        }

        .nk-desktop-nav {
          justify-self: center;
          min-width: 0;
        }

        .nk-nav-list {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0;
          padding: 0;
          gap: 3px;
          list-style: none;
        }

        .nk-nav-link {
          position: relative;
          display: flex;
          height: 38px;
          align-items: center;
          padding: 0 13px;
          border: 1px solid transparent;
          border-radius: 999px;
          color: rgba(238, 231, 214, 0.67);
          font-family: Inter, ui-sans-serif, system-ui, sans-serif;
          font-size: 11.5px;
          font-weight: 600;
          letter-spacing: 0.025em;
          line-height: 1;
          text-decoration: none;
          white-space: nowrap;
          transition:
            color 220ms ease,
            background-color 220ms ease,
            border-color 220ms ease,
            box-shadow 220ms ease,
            transform 220ms ease;
        }

        .nk-nav-link:hover {
          color: #f4d98b;
          border-color: rgba(212, 175, 55, 0.1);
          background: rgba(212, 175, 55, 0.1);
          box-shadow: 0 0 18px rgba(212, 175, 55, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.025);
          transform: translateY(-1px);
        }

        .nk-nav-link-active {
          color: #f6dc8e;
          border-color: rgba(212, 175, 55, 0.18);
          background: rgba(212, 175, 55, 0.12);
          box-shadow:
            0 0 20px rgba(212, 175, 55, 0.13),
            inset 0 1px 0 rgba(255, 255, 255, 0.035);
        }

        .nk-nav-link-active::after {
          content: '';
          position: absolute;
          bottom: 7px;
          left: 50%;
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: #e7bd55;
          box-shadow: 0 0 8px rgba(231, 189, 85, 0.9);
          transform: translateX(-50%);
        }

        .nk-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 8px;
        }

        .nk-call-button {
          display: inline-flex;
          height: 44px;
          align-items: center;
          gap: 9px;
          padding: 0 13px;
          border: 1px solid rgba(212, 175, 55, 0.18);
          border-radius: 999px;
          color: rgba(239, 230, 210, 0.76);
          background: rgba(255, 255, 255, 0.025);
          text-decoration: none;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.025);
          transition:
            border-color 220ms ease,
            background-color 220ms ease,
            box-shadow 220ms ease,
            transform 220ms ease;
        }

        .nk-call-button:hover {
          border-color: rgba(212, 175, 55, 0.34);
          background: rgba(212, 175, 55, 0.08);
          box-shadow: 0 0 18px rgba(212, 175, 55, 0.09);
          transform: translateY(-1px);
        }

        .nk-call-button > svg {
          width: 16px;
          height: 16px;
          flex: 0 0 auto;
          fill: none;
          stroke: #dcb853;
          stroke-width: 1.7;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .nk-call-button span {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .nk-call-button small {
          color: rgba(212, 175, 55, 0.72);
          font-family: Inter, ui-sans-serif, system-ui, sans-serif;
          font-size: 7.5px;
          font-weight: 800;
          letter-spacing: 0.16em;
          line-height: 1;
        }

        .nk-call-button strong {
          color: rgba(246, 239, 222, 0.88);
          font-family: Inter, ui-sans-serif, system-ui, sans-serif;
          font-size: 11px;
          font-weight: 650;
          letter-spacing: 0.035em;
          line-height: 1;
        }

        .nk-book-button {
          position: relative;
          display: inline-flex;
          height: 44px;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          gap: 8px;
          padding: 0 16px;
          border: 1px solid rgba(255, 232, 161, 0.48);
          border-radius: 999px;
          color: #211405;
          font-family: Inter, ui-sans-serif, system-ui, sans-serif;
          font-size: 10.5px;
          font-weight: 850;
          letter-spacing: 0.1em;
          line-height: 1;
          text-decoration: none;
          background: linear-gradient(115deg, #9b681c, #f0c865 28%, #fff0aa 50%, #d6a43d 72%, #9c6b1d);
          background-size: 180% 100%;
          box-shadow:
            0 7px 20px rgba(124, 82, 18, 0.28),
            inset 0 1px 0 rgba(255, 255, 255, 0.48);
          transition:
            transform 240ms ease,
            box-shadow 240ms ease,
            background-position 500ms ease;
        }

        .nk-book-button:hover {
          transform: translateY(-1px);
          background-position: 100% 0;
          box-shadow:
            0 10px 28px rgba(151, 100, 20, 0.38),
            0 0 22px rgba(226, 184, 79, 0.22),
            inset 0 1px 0 rgba(255, 255, 255, 0.6);
        }

        .nk-book-button > svg:first-of-type {
          width: 15px;
          height: 15px;
          fill: none;
          stroke: currentColor;
          stroke-width: 1.8;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .nk-book-shimmer {
          position: absolute;
          top: -60%;
          left: -42%;
          z-index: 0;
          width: 28%;
          height: 220%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.78), transparent);
          transform: rotate(18deg);
          opacity: 0;
          pointer-events: none;
        }

        .nk-book-button:hover .nk-book-shimmer {
          animation: nk-shimmer 1.15s ease-in-out infinite;
        }

        .nk-book-button > span:not(.nk-book-shimmer),
        .nk-book-button > svg:last-of-type {
          position: relative;
          z-index: 1;
        }

        .nk-button-arrow {
          width: 13px !important;
          height: 13px !important;
          fill: none;
          stroke: currentColor;
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .nk-cart-button {
          position: relative;
          display: grid;
          width: 44px;
          height: 44px;
          flex: 0 0 auto;
          place-items: center;
          padding: 0;
          cursor: pointer;
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 50%;
          color: rgba(241, 229, 201, 0.82);
          background: rgba(255, 255, 255, 0.035);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.035);
          transition:
            border-color 220ms ease,
            background-color 220ms ease,
            box-shadow 220ms ease,
            transform 220ms ease;
        }

        .nk-cart-button:hover,
        .nk-cart-button-active {
          border-color: rgba(226, 184, 79, 0.42);
          background: rgba(212, 175, 55, 0.13);
          box-shadow: 0 0 20px rgba(212, 175, 55, 0.15);
          transform: translateY(-1px);
        }

        .nk-cart-button > svg {
          width: 19px;
          height: 19px;
          fill: none;
          stroke: currentColor;
          stroke-width: 1.65;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .nk-cart-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          display: grid;
          min-width: 18px;
          height: 18px;
          place-items: center;
          padding: 0 4px;
          border: 2px solid rgba(19, 14, 9, 0.92);
          border-radius: 999px;
          color: #251504;
          font-family: Inter, ui-sans-serif, system-ui, sans-serif;
          font-size: 8.5px;
          font-weight: 900;
          line-height: 1;
          background: linear-gradient(135deg, #ffec9c, #e6b43c 55%, #ffcf55);
          box-shadow: 0 0 10px rgba(230, 180, 60, 0.55);
        }

        .nk-cart-badge-pulse {
          animation: nk-badge-pulse 1.5s ease-in-out infinite;
        }

        .nk-menu-toggle {
          display: none;
          width: 42px;
          height: 42px;
          flex: 0 0 auto;
          align-items: center;
          justify-content: center;
          padding: 0;
          cursor: pointer;
          border: 1px solid rgba(212, 175, 55, 0.22);
          border-radius: 50%;
          background: rgba(212, 175, 55, 0.08);
          transition:
            border-color 220ms ease,
            background-color 220ms ease;
        }

        .nk-menu-toggle:hover {
          border-color: rgba(226, 184, 79, 0.42);
          background: rgba(212, 175, 55, 0.13);
        }

        .nk-menu-toggle > span {
          position: absolute;
          width: 18px;
          height: 1.6px;
          border-radius: 999px;
          background: #ead28a;
          box-shadow: 0 0 8px rgba(212, 175, 55, 0.28);
          transition:
            transform 280ms cubic-bezier(0.22, 1, 0.36, 1),
            opacity 180ms ease;
        }

        .nk-menu-toggle > span:nth-child(1) { transform: translateY(-5px); }
        .nk-menu-toggle > span:nth-child(2) { opacity: 1; }
        .nk-menu-toggle > span:nth-child(3) { transform: translateY(5px); }

        .nk-menu-toggle-open > span:nth-child(1) { transform: translateY(5px) rotate(45deg); }
        .nk-menu-toggle-open > span:nth-child(2) { opacity: 0; transform: scaleX(0.4); }
        .nk-menu-toggle-open > span:nth-child(3) { transform: translateY(-5px) rotate(-45deg); }

        .nk-mobile-layer {
          position: fixed;
          inset: 0;
          z-index: 999;
          pointer-events: none;
        }

        .nk-mobile-scrim {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          padding: 0;
          cursor: pointer;
          border: 0;
          background: rgba(4, 3, 2, 0.62);
          opacity: 0;
          -webkit-backdrop-filter: blur(5px);
          backdrop-filter: blur(5px);
          transition: opacity 300ms ease;
        }

        .nk-mobile-drawer {
          position: absolute;
          top: clamp(82px, 11vw, 102px);
          left: 12px;
          right: 12px;
          max-height: calc(100dvh - clamp(96px, 12vw, 118px));
          overflow-y: auto;
          overscroll-behavior: contain;
          padding: 14px;
          border: 1px solid rgba(212, 175, 55, 0.26);
          border-radius: 27px;
          background:
            linear-gradient(145deg, rgba(31, 22, 13, 0.96), rgba(13, 10, 8, 0.94) 55%, rgba(25, 17, 10, 0.96)),
            rgba(14, 11, 9, 0.9);
          box-shadow:
            0 28px 70px rgba(0, 0, 0, 0.72),
            0 0 35px rgba(212, 175, 55, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
          -webkit-backdrop-filter: blur(28px) saturate(145%);
          backdrop-filter: blur(28px) saturate(145%);
          opacity: 0;
          visibility: hidden;
          transform: translateY(-18px) scale(0.98);
          transform-origin: top center;
          pointer-events: none;
          transition:
            opacity 300ms ease,
            transform 340ms cubic-bezier(0.22, 1, 0.36, 1),
            visibility 0s linear 340ms;
        }

        .nk-mobile-layer-open .nk-mobile-scrim {
          opacity: 1;
          pointer-events: auto;
        }

        .nk-mobile-layer-open .nk-mobile-drawer {
          opacity: 1;
          visibility: visible;
          transform: translateY(0) scale(1);
          pointer-events: auto;
          transition:
            opacity 300ms ease 50ms,
            transform 380ms cubic-bezier(0.22, 1, 0.36, 1) 50ms,
            visibility 0s;
        }

        .nk-mobile-drawer-head {
          display: grid;
          grid-template-columns: 44px 1fr auto;
          align-items: center;
          gap: 11px;
          padding: 2px 2px 13px;
        }

        .nk-mobile-seal {
          display: grid;
          width: 44px;
          height: 44px;
          place-items: center;
          border: 1px solid rgba(226, 184, 79, 0.25);
          border-radius: 50%;
          background: radial-gradient(circle at 30% 25%, rgba(255, 220, 120, 0.14), rgba(18, 12, 7, 0.85));
          box-shadow: 0 0 18px rgba(212, 175, 55, 0.12);
        }

        .nk-mobile-seal svg {
          width: 40px;
          height: 40px;
        }

        .nk-mobile-drawer-head > div {
          display: flex;
          min-width: 0;
          flex-direction: column;
          gap: 4px;
        }

        .nk-mobile-drawer-head strong {
          color: transparent;
          font-family: Cinzel, 'Times New Roman', serif;
          font-size: 14px;
          letter-spacing: 0.14em;
          background: linear-gradient(100deg, #fff0aa, #d5ac49 58%, #ffe291);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .nk-mobile-drawer-head span {
          color: rgba(226, 216, 196, 0.54);
          font-family: Inter, ui-sans-serif, system-ui, sans-serif;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 0.13em;
        }

        .nk-drawer-close {
          display: grid;
          width: 38px;
          height: 38px;
          place-items: center;
          padding: 0;
          cursor: pointer;
          border: 1px solid rgba(212, 175, 55, 0.18);
          border-radius: 50%;
          color: rgba(240, 229, 205, 0.72);
          background: rgba(255, 255, 255, 0.035);
          transition: background-color 200ms ease, color 200ms ease;
        }

        .nk-drawer-close:hover {
          color: #f3d98e;
          background: rgba(212, 175, 55, 0.1);
        }

        .nk-drawer-close svg {
          width: 17px;
          height: 17px;
          fill: none;
          stroke: currentColor;
          stroke-width: 1.8;
          stroke-linecap: round;
        }

        .nk-mobile-nav {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .nk-mobile-item {
          opacity: 0;
          transform: translateY(-8px);
          transition:
            opacity 260ms ease,
            transform 280ms cubic-bezier(0.22, 1, 0.36, 1),
            background-color 200ms ease,
            border-color 200ms ease;
          transition-delay: 0ms, 0ms, 0ms, 0ms;
        }

        .nk-mobile-layer-open .nk-mobile-item {
          opacity: 1;
          transform: translateY(0);
          transition-delay: var(--item-delay, 100ms), var(--item-delay, 100ms), 0ms, 0ms;
        }

        .nk-mobile-nav-link {
          display: grid;
          grid-template-columns: 28px 1fr auto;
          align-items: center;
          min-height: 47px;
          padding: 0 12px;
          border: 1px solid transparent;
          border-radius: 15px;
          color: rgba(239, 230, 211, 0.76);
          font-family: Inter, ui-sans-serif, system-ui, sans-serif;
          font-size: 12.5px;
          font-weight: 650;
          letter-spacing: 0.035em;
          text-decoration: none;
        }

        .nk-mobile-nav-link > span:first-child {
          color: rgba(212, 175, 55, 0.52);
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 0.1em;
        }

        .nk-mobile-nav-link > svg {
          width: 15px;
          height: 15px;
          fill: none;
          stroke: currentColor;
          stroke-width: 1.7;
          stroke-linecap: round;
          stroke-linejoin: round;
          opacity: 0.42;
          transform: translateX(-4px);
          transition: opacity 200ms ease, transform 200ms ease;
        }

        .nk-mobile-nav-link:hover,
        .nk-mobile-nav-active {
          border-color: rgba(212, 175, 55, 0.14);
          color: #f5dc94;
          background: rgba(212, 175, 55, 0.09);
        }

        .nk-mobile-nav-link:hover > svg,
        .nk-mobile-nav-active > svg {
          opacity: 1;
          transform: translateX(0);
        }

        .nk-mobile-nav-active > span:first-child {
          color: #e7bd55;
        }

        .nk-mobile-divider {
          height: 1px;
          margin: 13px 3px;
          background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.28), transparent);
        }

        .nk-mobile-quick-actions {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .nk-mobile-call,
        .nk-mobile-booking,
        .nk-mobile-address {
          display: grid;
          grid-template-columns: 38px 1fr auto;
          align-items: center;
          min-height: 58px;
          padding: 8px 12px;
          border: 1px solid rgba(212, 175, 55, 0.16);
          border-radius: 16px;
          color: rgba(240, 231, 211, 0.8);
          text-decoration: none;
          background: rgba(255, 255, 255, 0.028);
        }

        .nk-mobile-call:hover,
        .nk-mobile-booking:hover,
        .nk-mobile-address:hover {
          border-color: rgba(212, 175, 55, 0.3);
          background: rgba(212, 175, 55, 0.08);
        }

        .nk-mobile-call > svg,
        .nk-mobile-booking > svg:first-child,
        .nk-mobile-address > svg:first-child {
          width: 18px;
          height: 18px;
          fill: none;
          stroke: #dfba58;
          stroke-width: 1.7;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .nk-mobile-call span,
        .nk-mobile-booking span,
        .nk-mobile-address span {
          display: flex;
          min-width: 0;
          flex-direction: column;
          gap: 4px;
        }

        .nk-mobile-call small,
        .nk-mobile-booking small,
        .nk-mobile-address small {
          color: rgba(212, 175, 55, 0.62);
          font-size: 7.5px;
          font-weight: 800;
          letter-spacing: 0.12em;
        }

        .nk-mobile-call strong,
        .nk-mobile-booking strong,
        .nk-mobile-address strong {
          overflow: hidden;
          color: rgba(244, 236, 218, 0.86);
          font-size: 11px;
          font-weight: 650;
          letter-spacing: 0.035em;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .nk-mobile-booking {
          color: #211405;
          border-color: rgba(255, 232, 161, 0.3);
          background: linear-gradient(115deg, #ad7925, #f0ca69 48%, #d4a53e);
        }

        .nk-mobile-booking small {
          color: rgba(64, 39, 7, 0.64);
        }

        .nk-mobile-booking strong {
          color: #251606;
        }

        .nk-mobile-booking > svg:last-child {
          width: 15px;
          height: 15px;
          fill: none;
          stroke: currentColor;
          stroke-width: 1.8;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .nk-mobile-address strong {
          font-size: 10px;
        }

        .nk-mobile-footer {
          display: grid;
          grid-template-columns: 30px 1fr auto;
          align-items: center;
          min-height: 52px;
          margin-top: 8px;
          padding: 8px 12px;
          border: 1px solid rgba(91, 211, 145, 0.13);
          border-radius: 16px;
          background: rgba(39, 139, 84, 0.055);
        }

        .nk-rating-dot {
          display: grid;
          width: 28px;
          height: 28px;
          place-items: center;
          border-radius: 50%;
          color: #2b1a07;
          background: linear-gradient(135deg, #ffe99e, #d7aa3d);
          box-shadow: 0 0 14px rgba(226, 184, 79, 0.18);
        }

        .nk-mobile-footer > span:nth-child(2) {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .nk-mobile-footer strong {
          color: rgba(242, 234, 216, 0.84);
          font-size: 10px;
        }

        .nk-mobile-footer small {
          color: rgba(226, 216, 196, 0.44);
          font-size: 8px;
        }

        .nk-open-dot {
          display: inline-flex;
          align-items: center;
          color: rgba(87, 218, 149, 0.76);
          font-size: 7px;
          font-weight: 800;
          letter-spacing: 0.08em;
        }

        .nk-open-dot i {
          width: 5px;
          height: 5px;
          margin-right: 4px;
        }

        @keyframes nk-seal-spin {
          to { transform: rotate(360deg); }
        }

        @keyframes nk-gold-flow {
          0%, 100% { background-position: 0% center; }
          50% { background-position: 100% center; }
        }

        @keyframes nk-status-pulse {
          0% { box-shadow: 0 0 0 0 rgba(56, 217, 135, 0.48), 0 0 10px rgba(56, 217, 135, 0.65); }
          70% { box-shadow: 0 0 0 6px rgba(56, 217, 135, 0), 0 0 12px rgba(56, 217, 135, 0.35); }
          100% { box-shadow: 0 0 0 0 rgba(56, 217, 135, 0), 0 0 10px rgba(56, 217, 135, 0.65); }
        }

        @keyframes nk-shimmer {
          0% { left: -42%; opacity: 0; }
          18% { opacity: 0.85; }
          72% { opacity: 0.85; }
          100% { left: 125%; opacity: 0; }
        }

        @keyframes nk-badge-pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 9px rgba(230, 180, 60, 0.45); }
          50% { transform: scale(1.12); box-shadow: 0 0 16px rgba(230, 180, 60, 0.8); }
        }

        @media (max-width: 1360px) {
          .nk-call-button {
            display: none;
          }
        }

        @media (max-width: 1180px) {
          .nk-navbar-inner {
            grid-template-columns: auto 1fr auto;
            min-height: 64px;
            padding: 7px 8px 7px 10px;
          }

          .nk-desktop-nav,
          .nk-actions > .nk-call-button,
          .nk-actions > .nk-book-button,
          .nk-actions > .nk-cart-button {
            display: none;
          }

          .nk-actions {
            grid-column: 3;
          }

          .nk-menu-toggle {
            display: flex;
          }

          .nk-mobile-drawer {
            top: 78px;
          }
        }

        @media (max-width: 700px) {
          .nk-navbar {
            top: 8px;
            width: calc(100% - 16px);
          }

          .nk-navbar-inner {
            min-height: 60px;
            gap: 8px;
            padding: 6px 7px 6px 9px;
          }

          .nk-navbar-scrolled .nk-navbar-inner {
            min-height: 58px;
          }

          .nk-brand-mark {
            width: 42px;
            height: 42px;
          }

          .nk-brand-mark svg,
          .nk-brand-mark img,
          .nk-brand-logo-img {
            width: 38px;
            height: 38px;
          }

          .nk-brand-copy {
            margin-left: 8px;
          }

          .nk-brand-copy strong {
            font-size: 13px;
            letter-spacing: 0.15em;
          }

          .nk-status em {
            display: none;
          }

          .nk-mobile-drawer {
            top: 70px;
            left: 8px;
            right: 8px;
            max-height: calc(100dvh - 82px);
            padding: 12px;
            border-radius: 23px;
          }
        }

        @media (max-width: 390px) {
          .nk-brand-meta {
            display: none;
          }

          .nk-brand-copy strong {
            font-size: 12px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .nk-navbar-inner,
          .nk-nav-link,
          .nk-book-button,
          .nk-cart-button,
          .nk-mobile-drawer,
          .nk-mobile-item {
            transition-duration: 0.01ms !important;
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
          }

          .nk-brand-mark::after,
          .nk-brand-copy strong,
          .nk-status i,
          .nk-open-dot i,
          .nk-cart-badge-pulse {
            animation: none !important;
          }
        }
      `}</style>
    </header>
  );
}