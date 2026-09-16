import React from 'react';
import Link from 'next/link';
import { RESTAURANT_INFO } from '@/data/restaurantData';

export default function Footer() {
  return (
    <footer style={{
      background: 'linear-gradient(180deg, #110507 0%, #080304 100%)',
      borderTop: '1px solid rgba(212, 175, 55, 0.35)',
      boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.6), 0 0 30px rgba(122, 12, 14, 0.15)',
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
            gap: '12px'
          }}>
            <img
              src="/nahari-king-crest.png"
              alt="Nahari King Official Logo"
              width={42}
              height={42}
              style={{
                borderRadius: '50%',
                border: '1px solid rgba(212, 175, 55, 0.45)',
                boxShadow: '0 0 16px rgba(212, 175, 55, 0.25)',
                objectFit: 'cover'
              }}
            />
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
            <li><Link href="/admin" style={{ color: '#D4AF37', fontSize: '0.85rem', opacity: 0.85 }}>👑 Kitchen & Staff Portal</Link></li>
          </ul>
        </div>

        {/* Contact info & Map Preview */}
        <div>
          <h4 style={{ fontFamily: 'var(--font-serif)', color: '#FAF7F2', fontSize: '1.1rem', marginBottom: '16px' }}>
            Location & Map
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: '#9E9489' }}>
            <p style={{ lineHeight: 1.5 }}>📍 {RESTAURANT_INFO.address}</p>
            <p>📞 Concierge: <strong style={{ color: '#FAF7F2' }}>{RESTAURANT_INFO.phone}</strong></p>

            {/* Embedded Live Google Map */}
            <div style={{
              width: '100%',
              height: '140px',
              borderRadius: '10px',
              overflow: 'hidden',
              border: '1px solid rgba(212, 175, 55, 0.35)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
              marginTop: '4px',
              position: 'relative'
            }}>
              <iframe
                title="Nahari King Khajrana Indore Map"
                src="https://maps.google.com/maps?q=Nahari+King,+Chota+Gate,+56+Kadar+Colony,+Opp.+Dargah+Gate+2,+Khajrana,+Indore&t=&z=17&ie=UTF8&iwloc=B&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'contrast(1.05) saturate(1.1)' }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
              <a
                href="https://maps.google.com/?q=Nahari+King+Khajrana+Indore"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1,
                  textAlign: 'center',
                  padding: '8px 12px',
                  background: 'linear-gradient(135deg, rgba(212,175,55,0.2) 0%, rgba(212,175,55,0.05) 100%)',
                  border: '1px solid rgba(212,175,55,0.4)',
                  color: '#FCE8A6',
                  borderRadius: '6px',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                🗺️ Directions
              </a>
              <a
                href={`https://wa.me/${RESTAURANT_INFO.whatsapp}?text=Hello%20Nahari%20King%20Indore`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '8px 14px',
                  background: 'rgba(37, 211, 102, 0.15)',
                  border: '1px solid rgba(37, 211, 102, 0.4)',
                  color: '#25D366',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '0.8rem'
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
