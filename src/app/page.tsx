'use client';

import React from 'react';
import Link from 'next/link';
import { MENU_ITEMS, REVIEWS, RESTAURANT_INFO } from '@/data/restaurantData';
import { useCart } from '@/components/CartContext';
import HeroSection from '@/components/HeroSection';

export default function HomePage() {
  const { addToCart } = useCart();
  const signatureDishes = MENU_ITEMS.filter((item) => item.isSignature);

  return (
    <div style={{ background: '#0A0807', color: '#FDFBF7' }}>
      {/* 1. Cinematic Interactive Split-Screen Hero Section */}
      <HeroSection />

      {/* 2. Viral Offers Banner */}
      <section style={{
        background: 'linear-gradient(90deg, #1C1510 0%, #2A1A14 50%, #1C1510 100%)',
        borderBottom: '1px solid rgba(212, 175, 55, 0.25)',
        padding: '24px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div style={{ textAlign: 'left' }}>
            <span style={{ color: '#EF4444', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              ★ Limited Khajrana Special Offer
            </span>
            <h3 style={{ fontFamily: 'var(--font-serif)', color: '#FAF7F2', fontSize: '1.35rem', marginTop: '2px' }}>
              Indore Ki Best Nihari & Paye Non-Veg Thaal — Sirf ₹799 Mein!
            </h3>
            <p style={{ color: '#B8B0A5', fontSize: '0.88rem' }}>
              Nalli Nihari + Mutton Paye + Seekh Kebabs + Dum Biryani + 4 Tandoor Rotis + Raita.
            </p>
          </div>

          <Link
            href="/menu"
            style={{
              padding: '12px 28px',
              background: '#D4AF37',
              color: '#0A0807',
              borderRadius: '6px',
              fontWeight: 800,
              fontSize: '0.9rem',
              whiteSpace: 'nowrap'
            }}
          >
            Order Thaal Now →
          </Link>
        </div>
      </section>

      {/* 3. Signature Dishes Spotlight */}
      <section id="menu" style={{ padding: '80px 24px', maxWidth: '1280px', margin: '0 auto', scrollMarginTop: '80px' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <span style={{ fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#D4AF37' }}>
            Khajrana&apos;s Crowning Flavors
          </span>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
            color: '#FAF7F2',
            marginTop: '8px'
          }}>
            Nahari King&apos;s Bestselling Delicacies
          </h2>
          <p style={{ color: '#9E9489', fontSize: '0.98rem', maxWidth: '600px', margin: '10px auto 0' }}>
            Prepared in traditional deghs opposite Dargah Gate 2, Kadar Colony.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '30px'
        }}>
          {signatureDishes.map((dish) => (
            <div
              key={dish.id}
              style={{
                background: '#14110F',
                border: '1px solid rgba(212, 175, 55, 0.22)',
                borderRadius: '16px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
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
                  background: 'linear-gradient(to top, #14110F 0%, transparent 60%)'
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

      {/* 4. Food Vlogger & Google Reviews Section */}
      <section style={{
        background: '#120F0D',
        borderTop: '1px solid rgba(212, 175, 55, 0.18)',
        borderBottom: '1px solid rgba(212, 175, 55, 0.18)',
        padding: '80px 24px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span style={{ fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#D4AF37' }}>
              Customer Love & Vlogger Acclaim
            </span>
            <h2 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '2.5rem',
              color: '#FAF7F2',
              marginTop: '8px'
            }}>
              Why Indore Raves About Nahari King
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '28px'
          }}>
            {REVIEWS.map((rev) => (
              <div
                key={rev.id}
                style={{
                  background: '#161310',
                  border: '1px solid rgba(212, 175, 55, 0.2)',
                  borderRadius: '16px',
                  padding: '30px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ color: '#D4AF37', fontSize: '1.1rem', marginBottom: '14px' }}>
                    {'★'.repeat(rev.rating)}
                  </div>
                  <p style={{
                    fontSize: '0.95rem',
                    lineHeight: 1.7,
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
        padding: '70px 24px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #1C1510 0%, #0E0B0A 100%)'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span style={{ color: '#D4AF37', fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            Visit Khajrana, Indore
          </span>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '2.4rem',
            color: '#FAF7F2',
            marginTop: '8px',
            marginBottom: '16px'
          }}>
            Craving Delhi-Style Nalli Nihari Tonight?
          </h2>
          <p style={{ color: '#B8B0A5', fontSize: '1rem', lineHeight: 1.6, marginBottom: '32px' }}>
            Opp. Dargah Gate 2, Corner of Kadar Colony, Khajrana. Dine in with family or order piping hot packed degh containers for home feast.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
            <Link
              href="/menu"
              style={{
                padding: '15px 36px',
                background: 'linear-gradient(135deg, #F3E5AB 0%, #D4AF37 50%, #B89025 100%)',
                color: '#120F0D',
                borderRadius: '8px',
                fontWeight: 800,
                fontSize: '0.95rem',
                textTransform: 'uppercase'
              }}
            >
              Order Online via WhatsApp
            </Link>
            <a
              href={`tel:${RESTAURANT_INFO.phone}`}
              style={{
                padding: '15px 32px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(212,175,55,0.4)',
                color: '#FAF7F2',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.95rem'
              }}
            >
              Call {RESTAURANT_INFO.phone}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
