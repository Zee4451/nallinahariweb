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
    <div className="location-root">
      <style jsx>{`
        .location-root {
          background: #0A0807;
          color: #FDFBF7;
          min-height: 100vh;
          padding: clamp(36px, 6vw, 60px) clamp(16px, 4vw, 24px) 100px;
          overflow-x: hidden;
          width: 100%;
        }

        .location-container {
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }

        .location-header {
          text-align: center;
          margin-bottom: clamp(32px, 5vw, 50px);
        }

        .location-eyebrow {
          font-size: 0.78rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #D4AF37;
          display: block;
        }

        .location-title {
          font-family: var(--font-serif);
          font-size: clamp(2rem, 5vw, 3.5rem);
          color: #FAF7F2;
          margin-top: 8px;
          margin-bottom: 12px;
          line-height: 1.2;
        }

        .location-subtitle {
          color: #B8B0A5;
          font-size: clamp(0.92rem, 2vw, 1.05rem);
          max-width: 640px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .location-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: clamp(24px, 3.5vw, 36px);
          margin-bottom: clamp(36px, 5vw, 50px);
          width: 100%;
        }

        .details-col {
          display: flex;
          flex-direction: column;
          gap: 24px;
          width: 100%;
        }

        .info-card {
          background: #14110F;
          border: 1px solid rgba(212, 175, 55, 0.25);
          border-radius: 16px;
          padding: clamp(22px, 3.5vw, 32px);
          width: 100%;
          box-shadow: 0 8px 24px rgba(0,0,0,0.5);
        }

        .form-card {
          background: #14110F;
          border: 1px solid rgba(212, 175, 55, 0.25);
          border-radius: 16px;
          padding: clamp(24px, 4vw, 36px) clamp(18px, 3.5vw, 32px);
          width: 100%;
          box-shadow: 0 8px 24px rgba(0,0,0,0.5);
        }

        .form-input {
          width: 100%;
          padding: 12px 14px;
          background: #1A1613;
          border: 1px solid rgba(212, 175, 55, 0.25);
          border-radius: 8px;
          color: #FAF7F2;
          font-size: 0.95rem;
          outline: none;
          transition: border-color 0.2s ease;
        }

        .form-input:focus {
          border-color: #D4AF37;
        }

        .submit-btn {
          width: 100%;
          padding: 15px;
          background: linear-gradient(135deg, #FCE8A6 0%, #D4AF37 50%, #9E7D23 100%);
          color: #160608;
          border-radius: 8px;
          font-weight: 800;
          font-size: clamp(0.88rem, 2vw, 0.96rem);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
          transition: transform 0.2s ease;
        }

        .submit-btn:active {
          transform: scale(0.98);
        }

        .maps-card {
          background: #14110F;
          border: 1px solid rgba(212, 175, 55, 0.25);
          border-radius: 16px;
          padding: clamp(24px, 4vw, 36px);
          text-align: center;
          width: 100%;
          box-shadow: 0 8px 24px rgba(0,0,0,0.5);
        }

        .map-embed-wrapper {
          width: 100%;
          height: clamp(280px, 42vw, 420px);
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid rgba(212, 175, 55, 0.35);
          box-shadow: 0 8px 30px rgba(0,0,0,0.6);
          margin-bottom: 24px;
        }

        .maps-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px clamp(20px, 4vw, 32px);
          background: linear-gradient(135deg, #FCE8A6 0%, #D4AF37 100%);
          color: #120F0D;
          border-radius: 8px;
          font-weight: 800;
          font-size: clamp(0.88rem, 2vw, 0.95rem);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          transition: transform 0.2s ease;
        }

        .maps-btn:active {
          transform: scale(0.98);
        }

        @media (max-width: 640px) {
          .location-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }

          .maps-btn {
            width: 100%;
          }
        }
      `}</style>

      <div className="location-container">
        {/* Header */}
        <div className="location-header">
          <span className="location-eyebrow">
            Khajrana, Indore
          </span>
          <h1 className="location-title">
            Visit {RESTAURANT_INFO.name} 👑
          </h1>
          <p className="location-subtitle">
            Chota Gate, Kadar Colony, Opp. Dargah Gate 2, Khajrana, Indore.
          </p>
        </div>

        {/* 2 Columns Grid */}
        <div className="location-grid">
          {/* Left Column: Address & Details */}
          <div className="details-col">
            {/* Address Card */}
            <div className="info-card">
              <span style={{ color: '#D4AF37', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block' }}>
                Restaurant Details
              </span>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: '#FAF7F2', marginTop: '6px', marginBottom: '14px' }}>
                {RESTAURANT_INFO.brandTitle}
              </h3>
              <p style={{ color: '#C4BBB0', fontSize: '0.92rem', lineHeight: 1.7, marginBottom: '20px' }}>
                📍 <strong>Address:</strong> {RESTAURANT_INFO.address}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.88rem', color: '#9E9489', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px' }}>
                <div>📞 <strong>Phone:</strong> <a href={`tel:${RESTAURANT_INFO.phone}`} style={{ color: '#FAF7F2', textDecoration: 'underline' }}>{RESTAURANT_INFO.phone}</a></div>
                <div>💬 <strong>WhatsApp Ordering:</strong> <a href={`https://wa.me/${RESTAURANT_INFO.whatsapp}`} style={{ color: '#25D366' }}>Chat on WhatsApp</a></div>
                <div>📸 <strong>Instagram:</strong> <a href={RESTAURANT_INFO.instagram} target="_blank" rel="noreferrer" style={{ color: '#F472B6' }}>{RESTAURANT_INFO.instagramHandle}</a></div>
                <div>📍 <strong>Landmark:</strong> {RESTAURANT_INFO.landmark}</div>
              </div>
            </div>

            {/* Timings Card */}
            <div className="info-card">
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: '#FAF7F2', marginBottom: '16px' }}>
                Operational Hours
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ padding: '12px 16px', background: 'rgba(212, 175, 55, 0.08)', borderRadius: '8px', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
                  <div style={{ color: '#D4AF37', fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase' }}>
                    🌅 Morning Nihari & Khamiri
                  </div>
                  <div style={{ color: '#FAF7F2', fontSize: '0.95rem', marginTop: '2px', fontWeight: 600 }}>
                    {RESTAURANT_INFO.timings.fajrNihari}
                  </div>
                </div>

                <div style={{ padding: '12px 16px', background: 'rgba(34, 197, 94, 0.08)', borderRadius: '8px', border: '1px solid rgba(34, 197, 94, 0.25)' }}>
                  <div style={{ color: '#4ADE80', fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase' }}>
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
          <div className="form-card">
            <span style={{ color: '#D4AF37', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block' }}>
              Orders & Enquiries
            </span>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: '#FAF7F2', marginTop: '6px', marginBottom: '8px' }}>
              Message Nahari King Team
            </h3>
            <p style={{ color: '#9E9489', fontSize: '0.88rem', marginBottom: '24px' }}>
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
                    gap: '8px',
                    boxShadow: '0 4px 15px rgba(37, 211, 102, 0.3)'
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
                    className="form-input"
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
                    className="form-input"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#A89F93', marginBottom: '6px' }}>
                    Inquiry Type
                  </label>
                  <select
                    value={formData.inquiryType}
                    onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                    className="form-input"
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
                    className="form-input"
                    style={{ resize: 'vertical' }}
                  />
                </div>

                <button
                  type="submit"
                  className="submit-btn"
                >
                  Send Message ✉️
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Google Maps Interactive Embed & Directions Card */}
        <div className="maps-card">
          <span style={{ fontSize: '0.78rem', color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.15em', display: 'block' }}>
            Khajrana Live Location
          </span>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.4rem, 3.5vw, 1.7rem)', color: '#FAF7F2', marginTop: '6px', marginBottom: '10px' }}>
            Find {RESTAURANT_INFO.name} on Map
          </h3>
          <p style={{ color: '#A89F93', fontSize: '0.92rem', maxWidth: '650px', margin: '0 auto 20px', lineHeight: 1.6 }}>
            Opposite Dargah Gate 2, Chota Gate, 56 Kadar Colony, Dargah Pakiza Road, Khajrana, Indore.
          </p>

          {/* Interactive Google Map with Exact Nahari King Pin Marker */}
          <div className="map-embed-wrapper">
            <iframe
              title="Nahari King Khajrana Indore Interactive Map"
              src="https://maps.google.com/maps?q=Nahari+King,+Chota+Gate,+56+Kadar+Colony,+Opp.+Dargah+Gate+2,+Khajrana,+Indore&t=&z=17&ie=UTF8&iwloc=B&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, display: 'block' }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <a
            href="https://maps.google.com/?q=Nahari+King+Khajrana+Indore"
            target="_blank"
            rel="noopener noreferrer"
            className="maps-btn"
          >
            <span>🗺️ Open in Google Maps App (Directions)</span>
          </a>
        </div>
      </div>
    </div>
  );
}
