import React from 'react';
import Link from 'next/link';
import { RESTAURANT_INFO } from '@/data/restaurantData';

export default function Footer() {
  return (
    <footer style={{
      background: '#080605',
      borderTop: '1px solid rgba(212, 175, 55, 0.25)',
      padding: '60px 20px 48px',
      color: '#B8B0A5'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '40px'
      }}>
        {/* Brand Legacy */}
        <div>
          <div style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.6rem',
            fontWeight: 900,
            color: '#D4AF37',
            letterSpacing: '0.05em',
            marginBottom: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>👑</span>
            <span>{RESTAURANT_INFO.name}</span>
          </div>
          <p style={{ fontSize: '0.9rem', lineHeight: 1.7, color: '#9E9489', marginBottom: '16px' }}>
            {RESTAURANT_INFO.tagline}. Bringing authentic Old Delhi Jama Masjid style slow-charcoal simmered Nalli Nihari, tender mutton paye, and viral non-veg thaal combos to Indore.
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ padding: '4px 12px', background: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: '999px', fontSize: '0.75rem', color: '#D4AF37' }}>
              ⭐ 4.5 Google Rating
            </span>
            <a
              href={RESTAURANT_INFO.instagram}
              target="_blank"
              rel="noopener noreferrer"
              style={{ padding: '4px 12px', background: 'rgba(225, 48, 108, 0.15)', border: '1px solid rgba(225, 48, 108, 0.35)', borderRadius: '999px', fontSize: '0.75rem', color: '#F472B6' }}
            >
              📸 Instagram {RESTAURANT_INFO.instagramHandle}
            </a>
          </div>
        </div>

        {/* Timings */}
        <div>
          <h4 style={{ fontFamily: 'var(--font-serif)', color: '#FAF7F2', fontSize: '1.1rem', marginBottom: '16px' }}>
            Kitchen Hours
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.88rem' }}>
            <div>
              <span style={{ color: '#D4AF37', fontWeight: 700, display: 'block' }}>Morning Nihari & Khamiri</span>
              <span style={{ color: '#E5D8CA' }}>{RESTAURANT_INFO.timings.fajrNihari}</span>
            </div>
            <div>
              <span style={{ color: '#D4AF37', fontWeight: 700, display: 'block' }}>Afternoon Service</span>
              <span style={{ color: '#E5D8CA' }}>{RESTAURANT_INFO.timings.lunch}</span>
            </div>
            <div>
              <span style={{ color: '#D4AF37', fontWeight: 700, display: 'block' }}>Evening & Midnight Nihari</span>
              <span style={{ color: '#E5D8CA' }}>{RESTAURANT_INFO.timings.dinner}</span>
              <span style={{ display: 'block', fontSize: '0.75rem', color: '#888075', marginTop: '2px' }}>
                Peak rush at 11:00 PM • Open till 12 AM
              </span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ fontFamily: 'var(--font-serif)', color: '#FAF7F2', fontSize: '1.1rem', marginBottom: '16px' }}>
            Explore
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
            <li><Link href="/menu" style={{ color: '#B8B0A5' }}>Full Menu & ₹799 Thaal</Link></li>
            <li><Link href="/heritage" style={{ color: '#B8B0A5' }}>Delhi Simmer Secret</Link></li>
            <li><Link href="/reservations" style={{ color: '#B8B0A5' }}>Table Reservation</Link></li>
            <li><Link href="/contact" style={{ color: '#B8B0A5' }}>Khajrana Location & Map</Link></li>
          </ul>
        </div>

        {/* Contact info */}
        <div>
          <h4 style={{ fontFamily: 'var(--font-serif)', color: '#FAF7F2', fontSize: '1.1rem', marginBottom: '16px' }}>
            Contact & Location
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: '#9E9489' }}>
            <p>📍 {RESTAURANT_INFO.address}</p>
            <p>📞 Phone: <strong style={{ color: '#FAF7F2' }}>{RESTAURANT_INFO.phone}</strong></p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
              <a
                href={`tel:${RESTAURANT_INFO.phone}`}
                style={{
                  padding: '8px 16px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(212,175,55,0.3)',
                  color: '#FAF7F2',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '0.82rem'
                }}
              >
                Call Now
              </a>
              <a
                href={`https://wa.me/${RESTAURANT_INFO.whatsapp}?text=Hello%20Nahari%20King%20Indore`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '8px 16px',
                  background: 'rgba(37, 211, 102, 0.15)',
                  border: '1px solid rgba(37, 211, 102, 0.4)',
                  color: '#25D366',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '0.82rem'
                }}
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      <div style={{
        maxWidth: '1280px',
        margin: '40px auto 0',
        paddingTop: '20px',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.78rem',
        color: '#6E665C',
        gap: '12px'
      }}>
        <div>
          © {new Date().getFullYear()} {RESTAURANT_INFO.name} (Khajrana, Indore). All Rights Reserved.
        </div>
        <div>
          Opp. Dargah Gate 2, Kadar Colony • 100% Halal
        </div>
      </div>
    </footer>
  );
}
