'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/components/CartContext';
import { useCMS } from '@/components/CMSContext';
import HeroSection from '@/components/HeroSection';
import InstagramReelsSection from '@/components/InstagramReelsSection';

export default function HomePage() {
  const { addToCart } = useCart();
  const { state: cmsState } = useCMS();

  const signatureDishes = (cmsState?.menuItems || []).filter((item) => item.isSignature);
  const offer = cmsState?.viralOffer || {
    tag: '★ Limited Khajrana Special Offer',
    title: 'Indore Ki Best Nihari & Paye Non-Veg Thaal — Sirf ₹799 Mein!',
    description: 'Nalli Nihari + Mutton Paye + Seekh Kebabs + Dum Biryani + 4 Tandoor Rotis + Raita.',
    ctaText: 'Order Thaal Now →',
    ctaLink: '/menu'
  };
  const reviews = cmsState?.reviews || [];

  return (
    <div style={{ background: 'var(--bg-dark)', color: 'var(--text-main)' }}>
      {/* 1. Cinematic Interactive Split-Screen Hero Section */}
      <HeroSection />

      {/* 2. Viral Offers Banner */}
      <section className="offers-banner-section">
        <style jsx>{`
          .offers-banner-section {
            background: linear-gradient(90deg, #1C0709 0%, #360A0E 50%, #1C0709 100%);
            border-bottom: 1px solid rgba(212, 175, 55, 0.35);
            box-shadow: inset 0 1px 0 rgba(212, 175, 55, 0.15), 0 10px 25px rgba(0,0,0,0.5);
            padding: clamp(18px, 4vw, 24px) clamp(16px, 4vw, 24px);
            text-align: center;
            width: 100%;
            overflow-x: hidden;
          }

          .offers-container {
            max-width: 1000px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            flex-wrap: wrap;
          }

          .offers-content {
            text-align: left;
            flex: 1 1 300px;
          }

          .offers-tag {
            color: #F87171;
            font-weight: 800;
            font-size: 0.78rem;
            text-transform: uppercase;
            letter-spacing: 0.12em;
            display: block;
          }

          .offers-title {
            font-family: var(--font-serif);
            color: #FAF7F2;
            font-size: clamp(1.15rem, 3vw, 1.35rem);
            margin-top: 4px;
            margin-bottom: 4px;
            line-height: 1.3;
          }

          .offers-desc {
            color: #D4C9BC;
            font-size: clamp(0.82rem, 2vw, 0.88rem);
            line-height: 1.5;
          }

          .offers-cta {
            padding: 12px 28px;
            background: linear-gradient(135deg, #FCE8A6 0%, #D4AF37 50%, #9E7D23 100%);
            color: #1A0709;
            border-radius: 8px;
            font-weight: 800;
            font-size: 0.9rem;
            white-space: nowrap;
            box-shadow: 0 4px 15px rgba(212, 175, 55, 0.35);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
            transition: transform 0.2s ease;
          }

          .offers-cta:active {
            transform: scale(0.97);
          }

          @media (max-width: 640px) {
            .offers-container {
              flex-direction: column;
              text-align: center;
              gap: 14px;
            }

            .offers-content {
              text-align: center;
              flex: 1 1 100%;
            }

            .offers-cta {
              width: 100%;
              padding: 13px 20px;
            }
          }
        `}</style>

        <div className="offers-container">
          <div className="offers-content">
            <span className="offers-tag">
              {offer.tag}
            </span>
            <h3 className="offers-title">
              {offer.title}
            </h3>
            <p className="offers-desc">
              {offer.description}
            </p>
          </div>

          <Link
            href={offer.ctaLink || '/menu'}
            className="offers-cta"
          >
            {offer.ctaText || 'Order Thaal Now →'}
          </Link>
        </div>
      </section>

      {/* 3. Signature Dishes Spotlight */}
      <section id="menu" style={{ padding: 'clamp(50px, 8vw, 80px) clamp(16px, 4vw, 24px)', maxWidth: '1280px', margin: '0 auto', scrollMarginTop: '80px', width: '100%', overflowX: 'hidden' }}>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(32px, 6vw, 50px)' }}>
          <span style={{ fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#D4AF37' }}>
            Khajrana&apos;s Crowning Flavors
          </span>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.8rem, 4.5vw, 2.8rem)',
            color: '#FAF7F2',
            marginTop: '8px',
            lineHeight: 1.2
          }}>
            Nahari King&apos;s Bestselling Delicacies
          </h2>
          <p style={{ color: '#9E9489', fontSize: '0.94rem', maxWidth: '600px', margin: '10px auto 0', padding: '0 8px' }}>
            Prepared in traditional deghs opposite Dargah Gate 2, Kadar Colony.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 'clamp(20px, 3vw, 30px)',
          width: '100%'
        }}>
          {signatureDishes.map((dish) => (
            <div
              key={dish.id}
              style={{
                background: 'linear-gradient(160deg, #1C0C0E 0%, #120607 100%)',
                border: '1px solid rgba(212, 175, 55, 0.28)',
                borderRadius: '18px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 12px 36px rgba(0,0,0,0.65), 0 0 20px rgba(122, 12, 14, 0.2)'
              }}
            >
              {/* Dish Visual */}
              <div style={{
                height: '230px',
                position: 'relative',
                backgroundImage: `url(${dish.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}>
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, #1C0C0E 0%, transparent 60%)'
                }} />

                {dish.tag && (
                  <span style={{
                    position: 'absolute',
                    top: '14px',
                    left: '14px',
                    padding: '6px 12px',
                    background: 'rgba(142, 32, 32, 0.95)',
                    color: '#FAF7F2',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    borderRadius: '4px',
                    border: '1px solid rgba(212, 175, 55, 0.3)'
                  }}>
                    {dish.tag}
                  </span>
                )}

                {dish.cookTimeHours && (
                  <span style={{
                    position: 'absolute',
                    top: '14px',
                    right: '14px',
                    padding: '6px 12px',
                    background: 'rgba(10, 8, 7, 0.88)',
                    color: '#D4AF37',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    borderRadius: '4px',
                    border: '1px solid rgba(212, 175, 55, 0.3)'
                  }}>
                    ⏳ {dish.cookTimeHours}h Simmer
                  </span>
                )}
              </div>

              {/* Card Body */}
              <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '0.85rem', color: '#D4AF37', marginBottom: '4px', fontFamily: 'serif' }}>
                  {dish.urduName}
                </div>
                <h3 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.25rem',
                  color: '#FAF7F2',
                  marginBottom: '10px'
                }}>
                  {dish.name}
                </h3>
                <p style={{
                  fontSize: '0.88rem',
                  lineHeight: 1.6,
                  color: '#9E9489',
                  marginBottom: '20px',
                  flex: 1
                }}>
                  {dish.description}
                </p>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '16px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)'
                }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#7E766D', display: 'block' }}>Starts at</span>
                    <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FAF7F2' }}>₹{dish.price}</span>
                  </div>

                  <button
                    onClick={() => addToCart(dish, dish.portionSizes ? dish.portionSizes[0] : undefined, dish.spiceLevel)}
                    style={{
                      padding: '10px 20px',
                      background: 'rgba(212, 175, 55, 0.15)',
                      border: '1px solid rgba(212, 175, 55, 0.45)',
                      color: '#D4AF37',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer'
                    }}
                  >
                    + Add to Order
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Viral Instagram Food Reels Showcase */}
      <InstagramReelsSection />

      {/* 5. Food Vlogger & Google Reviews Section */}
      <section style={{
        background: 'linear-gradient(180deg, #140809 0%, #1D090B 50%, #120607 100%)',
        borderTop: '1px solid rgba(212, 175, 55, 0.22)',
        borderBottom: '1px solid rgba(212, 175, 55, 0.22)',
        padding: 'clamp(50px, 8vw, 80px) clamp(16px, 4vw, 24px)',
        width: '100%',
        overflowX: 'hidden'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 'clamp(32px, 6vw, 48px)' }}>
            <span style={{ fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#D4AF37' }}>
              Customer Love & Vlogger Acclaim
            </span>
            <h2 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
              color: '#FAF7F2',
              marginTop: '8px',
              lineHeight: 1.25
            }}>
              Why Indore Raves About Nahari King
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
            gap: 'clamp(18px, 3vw, 28px)',
            width: '100%'
          }}>
            {reviews.map((rev) => (
              <div
                key={rev.id}
                style={{
                  background: 'linear-gradient(145deg, #1C0C0E 0%, #15080A 100%)',
                  border: '1px solid rgba(212, 175, 55, 0.24)',
                  borderRadius: '16px',
                  padding: 'clamp(20px, 3vw, 30px)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                  width: '100%'
                }}
              >
                <div>
                  <div style={{ color: '#D4AF37', fontSize: '1.1rem', marginBottom: '14px' }}>
                    {'★'.repeat(rev.rating)}
                  </div>
                  <p style={{
                    fontSize: '0.92rem',
                    lineHeight: 1.65,
                    color: '#D8CFBF',
                    fontStyle: 'italic',
                    marginBottom: '20px'
                  }}>
                    &quot;{rev.quote}&quot;
                  </p>
                </div>

                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '16px' }}>
                  <h4 style={{ color: '#FAF7F2', fontSize: '0.95rem', fontWeight: 700 }}>{rev.author}</h4>
                  <div style={{ fontSize: '0.78rem', color: '#8E857B' }}>{rev.city}</div>
                  <div style={{ fontSize: '0.78rem', color: '#D4AF37', marginTop: '4px' }}>
                    Must-Try: {rev.dishRecommended}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Khajrana Visit Banner */}
      <section style={{
        padding: 'clamp(48px, 8vw, 70px) clamp(16px, 4vw, 24px)',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #24080A 0%, #150607 60%, #0A0405 100%)',
        borderTop: '1px solid rgba(212, 175, 55, 0.25)',
        boxShadow: 'inset 0 1px 0 rgba(255, 235, 175, 0.1)',
        width: '100%',
        overflowX: 'hidden'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span style={{ color: '#D4AF37', fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            Visit Khajrana, Indore
          </span>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.8rem, 4.5vw, 2.4rem)',
            color: '#FAF7F2',
            marginTop: '8px',
            marginBottom: '16px',
            lineHeight: 1.25
          }}>
            Craving Delhi-Style Nalli Nihari Tonight?
          </h2>
          <p style={{ color: '#B8B0A5', fontSize: 'clamp(0.9rem, 2vw, 1rem)', lineHeight: 1.6, marginBottom: '28px', padding: '0 8px' }}>
            Opp. Dargah Gate 2, Corner of Kadar Colony, Khajrana. Dine in with family or order piping hot packed degh containers for home feast.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'center' }}>
            <Link
              href="/menu"
              style={{
                padding: '14px 32px',
                background: 'linear-gradient(135deg, #FCE8A6 0%, #D4AF37 50%, #9E7D23 100%)',
                color: '#1A0709',
                borderRadius: '8px',
                fontWeight: 800,
                fontSize: '0.92rem',
                textTransform: 'uppercase',
                boxShadow: '0 4px 20px rgba(212, 175, 55, 0.35)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '220px'
              }}
            >
              Order Online via WhatsApp
            </Link>
            <a
              href={`tel:${cmsState?.restaurantInfo?.phone || '+91 98765 43210'}`}
              style={{
                padding: '14px 28px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(212,175,55,0.4)',
                color: '#FAF7F2',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.92rem',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '180px'
              }}
            >
              Call {cmsState?.restaurantInfo?.phone || '+91 98765 43210'}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
