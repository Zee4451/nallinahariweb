'use client';

import React, { useState } from 'react';
import { RESTAURANT_INFO } from '@/data/restaurantData';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    inquiryType: 'Party & Dastarkhwan Booking',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert('Please fill out your name and phone number.');
      return;
    }
    setSubmitted(true);
  };

  const handleWhatsAppDirect = () => {
    const text =
      `*Nahari King Indore Inquiry*\n\n` +
      `👤 *Name:* ${formData.name}\n` +
      `📞 *Phone:* ${formData.phone}\n` +
      `✉️ *Email:* ${formData.email || 'N/A'}\n` +
      `🏷️ *Topic:* ${formData.inquiryType}\n` +
      (formData.message ? `💬 *Message:* ${formData.message}` : '');

    window.open(`https://wa.me/${RESTAURANT_INFO.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div style={{ background: '#0A0807', color: '#FDFBF7', minHeight: '100vh', padding: '60px 24px 100px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <span style={{ fontSize: '0.8rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#D4AF37' }}>
            Khajrana, Indore
          </span>
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2.2rem, 4vw, 3.5rem)',
            color: '#FAF7F2',
            marginTop: '8px',
            marginBottom: '12px'
          }}>
            Visit {RESTAURANT_INFO.name} 👑
          </h1>
          <p style={{ color: '#B8B0A5', fontSize: '1.05rem', maxWidth: '640px', margin: '0 auto' }}>
            Chota Gate, Kadar Colony, Opp. Dargah Gate 2, Khajrana, Indore.
          </p>
        </div>

        {/* 2 Columns Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '36px',
          marginBottom: '50px'
        }}>
          {/* Left Column: Address & Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Address Card */}
            <div style={{
              background: '#14110F',
              border: '1px solid rgba(212, 175, 55, 0.25)',
              borderRadius: '16px',
              padding: '32px'
            }}>
              <span style={{ color: '#D4AF37', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Restaurant Details
              </span>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: '#FAF7F2', marginTop: '6px', marginBottom: '14px' }}>
                {RESTAURANT_INFO.brandTitle}
              </h3>
              <p style={{ color: '#C4BBB0', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '20px' }}>
                📍 <strong>Address:</strong> {RESTAURANT_INFO.address}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', color: '#9E9489', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px' }}>
                <div>📞 <strong>Phone:</strong> <a href={`tel:${RESTAURANT_INFO.phone}`} style={{ color: '#FAF7F2', textDecoration: 'underline' }}>{RESTAURANT_INFO.phone}</a></div>
                <div>💬 <strong>WhatsApp Ordering:</strong> <a href={`https://wa.me/${RESTAURANT_INFO.whatsapp}`} style={{ color: '#25D366' }}>Chat on WhatsApp</a></div>
                <div>📸 <strong>Instagram:</strong> <a href={RESTAURANT_INFO.instagram} target="_blank" rel="noreferrer" style={{ color: '#F472B6' }}>{RESTAURANT_INFO.instagramHandle}</a></div>
                <div>📍 <strong>Landmark:</strong> {RESTAURANT_INFO.landmark}</div>
              </div>
            </div>

            {/* Timings Card */}
            <div style={{
              background: '#14110F',
              border: '1px solid rgba(212, 175, 55, 0.25)',
              borderRadius: '16px',
              padding: '32px'
            }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: '#FAF7F2', marginBottom: '16px' }}>
                Operational Hours
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ padding: '12px 16px', background: 'rgba(212, 175, 55, 0.08)', borderRadius: '8px', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
                  <div style={{ color: '#D4AF37', fontWeight: 700, fontSize: '0.85rem' }}>
                    🌅 Morning Nihari & Khamiri
                  </div>
                  <div style={{ color: '#FAF7F2', fontSize: '0.95rem', marginTop: '2px', fontWeight: 600 }}>
                    {RESTAURANT_INFO.timings.fajrNihari}
                  </div>
                </div>

                <div style={{ padding: '12px 16px', background: 'rgba(34, 197, 94, 0.08)', borderRadius: '8px', border: '1px solid rgba(34, 197, 94, 0.25)' }}>
                  <div style={{ color: '#4ADE80', fontWeight: 700, fontSize: '0.85rem' }}>
                    🌙 Evening & Midnight Feast
                  </div>
                  <div style={{ color: '#FAF7F2', fontSize: '0.95rem', marginTop: '2px', fontWeight: 600 }}>
                    {RESTAURANT_INFO.timings.dinner}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#9E9489', marginTop: '4px' }}>
                    Peak rush at 11:00 PM • Closes 12:00 AM Midnight
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Inquiry & Bulk Order Form */}
          <div style={{
            background: '#14110F',
            border: '1px solid rgba(212, 175, 55, 0.25)',
            borderRadius: '16px',
            padding: '36px 32px'
          }}>
            <span style={{ color: '#D4AF37', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Orders & Enquiries
            </span>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: '#FAF7F2', marginTop: '6px', marginBottom: '8px' }}>
              Message Nahari King Team
            </h3>
            <p style={{ color: '#9E9489', fontSize: '0.9rem', marginBottom: '24px' }}>
              For bulk degh orders, party packs, or table booking in Khajrana.
            </p>

            {submitted ? (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                background: '#1A1613',
                borderRadius: '12px',
                border: '1px solid #D4AF37'
              }}>
                <div style={{ fontSize: '42px', marginBottom: '16px' }}>👑</div>
                <h4 style={{ fontFamily: 'var(--font-serif)', color: '#FAF7F2', fontSize: '1.3rem', marginBottom: '8px' }}>
                  Thank You!
                </h4>
                <p style={{ color: '#B8B0A5', fontSize: '0.9rem', marginBottom: '24px' }}>
                  Your message has been received. We will call you or connect on WhatsApp shortly.
                </p>
                <button
                  onClick={handleWhatsAppDirect}
                  style={{
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                    color: '#FFF',
                    borderRadius: '8px',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span>💬 Open in WhatsApp</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#A89F93', marginBottom: '6px' }}>
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Rizwan Bhai / Rahul"
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      background: '#1A1613',
                      border: '1px solid rgba(212, 175, 55, 0.25)',
                      borderRadius: '8px',
                      color: '#FAF7F2',
                      fontSize: '0.92rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#A89F93', marginBottom: '6px' }}>
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="099775 71717"
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      background: '#1A1613',
                      border: '1px solid rgba(212, 175, 55, 0.25)',
                      borderRadius: '8px',
                      color: '#FAF7F2',
                      fontSize: '0.92rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#A89F93', marginBottom: '6px' }}>
                    Inquiry Type
                  </label>
                  <select
                    value={formData.inquiryType}
                    onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      background: '#1A1613',
                      border: '1px solid rgba(212, 175, 55, 0.25)',
                      borderRadius: '8px',
                      color: '#FAF7F2',
                      fontSize: '0.92rem',
                      outline: 'none'
                    }}
                  >
                    <option value="Family Dastarkhwan Booking">Family Dastarkhwan Booking</option>
                    <option value="₹799 Non-Veg Thaal Pre-order">₹799 Non-Veg Thaal Pre-order</option>
                    <option value="Degh Catering / Bulk Nihari Pack">Degh Catering / Bulk Nihari Pack</option>
                    <option value="General Question / Directions">General Question / Directions</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#A89F93', marginBottom: '6px' }}>
                    Message
                  </label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="No. of guests, date, or specific Nihari cut preferences..."
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      background: '#1A1613',
                      border: '1px solid rgba(212, 175, 55, 0.25)',
                      borderRadius: '8px',
                      color: '#FAF7F2',
                      fontSize: '0.92rem',
                      outline: 'none',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    padding: '14px',
                    background: 'linear-gradient(135deg, #F3E5AB 0%, #D4AF37 50%, #B89025 100%)',
                    color: '#120F0D',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    textTransform: 'uppercase',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(212, 175, 55, 0.25)'
                  }}
                >
                  Send Message ✉️
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Google Maps Directions Card */}
        <div style={{
          background: '#14110F',
          border: '1px solid rgba(212, 175, 55, 0.25)',
          borderRadius: '16px',
          padding: '36px',
          textAlign: 'center'
        }}>
          <span style={{ fontSize: '0.78rem', color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
            Khajrana Navigation
          </span>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.7rem', color: '#FAF7F2', marginTop: '6px', marginBottom: '10px' }}>
            Reach Nahari King Khajrana
          </h3>
          <p style={{ color: '#A89F93', fontSize: '0.95rem', maxWidth: '650px', margin: '0 auto 20px' }}>
            Opposite Dargah Gate 2, Chota Gate, 56 Kadar Colony, Dargah Pakiza Road, Khajrana, Indore.
          </p>

          <a
            href="https://maps.google.com/?q=Nahari+King+Khajrana+Indore"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 28px',
              background: '#D4AF37',
              color: '#120F0D',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.92rem'
            }}
          >
            <span>🗺️ Open in Google Maps (Directions)</span>
          </a>
        </div>
      </div>
    </div>
  );
}
