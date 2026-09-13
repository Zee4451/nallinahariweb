'use client';

import React, { useState } from 'react';
import { TIME_SLOTS, RESTAURANT_INFO } from '@/data/restaurantData';

type SeatingType = 'diwan' | 'table' | 'majlis';

interface SeatingOption {
  id: SeatingType;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  minGuests: number;
}

export default function ReservationsPage() {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[4] || '');
  const [guests, setGuests] = useState(2);
  const [seatingType, setSeatingType] = useState<SeatingType>('diwan');
  const [specialRequests, setSpecialRequests] = useState('');
  const [bookingPass, setBookingPass] = useState<{
    id: string;
    fullName: string;
    date: string;
    timeSlot: string;
    guests: number;
    seatingType: string;
    specialRequests: string;
  } | null>(null);

  const seatingOptions: SeatingOption[] = [
    {
      id: 'diwan',
      title: 'Traditional Floor Diwan',
      subtitle: 'Shahi Dastarkhwan',
      description: 'Plush Persian carpets, royal silk bolsters (gao-takiya), and low dining chauki. The authentic 18th-century way to feast.',
      badge: 'Heritage Experience',
      minGuests: 2
    },
    {
      id: 'table',
      title: 'Royal Dining Table',
      subtitle: 'Imperial Enclave',
      description: 'Handcrafted rosewood chairs, candlelight setting, bespoke bone china dinnerware with attentive personal table service.',
      badge: 'Fine Dining Comfort',
      minGuests: 1
    },
    {
      id: 'majlis',
      title: 'Shahi Majlis (Private Chamber)',
      subtitle: 'Nawabi Courtyard',
      description: 'Exclusive enclosed banquet chamber with dedicated Bawarchi and live instrumental sitar recital for family gatherings.',
      badge: 'Private & VIP (Min 6 Guests)',
      minGuests: 6
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !date || !timeSlot) {
      alert('Please fill out all required fields to reserve your Dastarkhwan.');
      return;
    }

    const selectedOption = seatingOptions.find((s) => s.id === seatingType);
    const pass = {
      id: `NN-${Math.floor(100000 + Math.random() * 900000)}`,
      fullName,
      date,
      timeSlot,
      guests,
      seatingType: selectedOption?.title || 'Dastarkhwan',
      specialRequests
    };

    setBookingPass(pass);
  };

  const handleShareWhatsApp = () => {
    if (!bookingPass) return;
    const msg =
      `*Dastarkhwan Reservation Pass — ${RESTAURANT_INFO.name}*\n\n` +
      `⚜️ *Pass ID:* ${bookingPass.id}\n` +
      `👤 *Guest Name:* ${bookingPass.fullName}\n` +
      `📅 *Date:* ${bookingPass.date}\n` +
      `⏰ *Time Slot:* ${bookingPass.timeSlot}\n` +
      `👥 *Guests:* ${bookingPass.guests} Persons\n` +
      `🛋️ *Seating:* ${bookingPass.seatingType}\n` +
      (bookingPass.specialRequests ? `📝 *Notes:* ${bookingPass.specialRequests}\n\n` : '\n') +
      `Please confirm my reservation. Looking forward to the feast!`;

    window.open(`https://wa.me/${RESTAURANT_INFO.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div style={{ background: '#0A0807', color: '#FDFBF7', minHeight: '100vh', padding: '60px 24px 100px' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{ fontSize: '0.8rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#D4AF37' }}>
            Imperial Hospitality
          </span>
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2.2rem, 4vw, 3.5rem)',
            color: '#FAF7F2',
            marginTop: '8px',
            marginBottom: '14px'
          }}>
            Reserve Your Dastarkhwan
          </h1>
          <p style={{ color: '#B8B0A5', fontSize: '1.05rem', maxWidth: '640px', margin: '0 auto' }}>
            Select your preferred dining tradition: from the sacred low floor diwan to private royal chambers.
          </p>
        </div>

        {/* If Voucher is Generated */}
        {bookingPass ? (
          <div style={{
            background: '#14110F',
            border: '2px solid #D4AF37',
            borderRadius: '20px',
            padding: '40px 32px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(212,175,55,0.2)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Top Badge */}
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <span style={{
                background: 'rgba(212, 175, 55, 0.15)',
                color: '#D4AF37',
                padding: '6px 18px',
                borderRadius: '999px',
                fontSize: '0.8rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                border: '1px solid rgba(212, 175, 55, 0.4)'
              }}>
                Reservation Confirmed
              </span>
              <h2 style={{
                fontFamily: 'var(--font-serif)',
                color: '#FAF7F2',
                fontSize: '2rem',
                marginTop: '12px',
                marginBottom: '4px'
              }}>
                Shahi Dastarkhwan Pass
              </h2>
              <div style={{ color: '#D4AF37', fontSize: '1.1rem', fontWeight: 700, letterSpacing: '0.08em' }}>
                Ref: {bookingPass.id}
              </div>
            </div>

            {/* Voucher Details Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '24px',
              padding: '24px',
              background: '#1A1613',
              borderRadius: '12px',
              border: '1px solid rgba(212, 175, 55, 0.15)',
              marginBottom: '32px'
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#888075', textTransform: 'uppercase' }}>Guest of Honour</span>
                <div style={{ color: '#FAF7F2', fontSize: '1.05rem', fontWeight: 600, marginTop: '2px' }}>
                  {bookingPass.fullName}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: '#888075', textTransform: 'uppercase' }}>Date & Schedule</span>
                <div style={{ color: '#FAF7F2', fontSize: '1.05rem', fontWeight: 600, marginTop: '2px' }}>
                  {bookingPass.date}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: '#888075', textTransform: 'uppercase' }}>Time Slot</span>
                <div style={{ color: '#D4AF37', fontSize: '1rem', fontWeight: 600, marginTop: '2px' }}>
                  {bookingPass.timeSlot}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: '#888075', textTransform: 'uppercase' }}>Guests Seated</span>
                <div style={{ color: '#FAF7F2', fontSize: '1.05rem', fontWeight: 600, marginTop: '2px' }}>
                  {bookingPass.guests} Persons
                </div>
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <span style={{ fontSize: '0.75rem', color: '#888075', textTransform: 'uppercase' }}>Seating Arrangement</span>
                <div style={{ color: '#FAF7F2', fontSize: '1.05rem', fontWeight: 600, marginTop: '2px' }}>
                  🛋️ {bookingPass.seatingType}
                </div>
              </div>

              {bookingPass.specialRequests && (
                <div style={{ gridColumn: '1 / -1' }}>
                  <span style={{ fontSize: '0.75rem', color: '#888075', textTransform: 'uppercase' }}>Special Preparation Notes</span>
                  <div style={{ color: '#D8CFBF', fontSize: '0.9rem', fontStyle: 'italic', marginTop: '2px' }}>
                    &quot;{bookingPass.specialRequests}&quot;
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
              <button
                onClick={handleShareWhatsApp}
                style={{
                  padding: '14px 28px',
                  background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                  color: '#FFFFFF',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(37, 211, 102, 0.3)'
                }}
              >
                <span>💬 Send Confirmation to WhatsApp</span>
              </button>

              <button
                onClick={() => window.print()}
                style={{
                  padding: '14px 28px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(212, 175, 55, 0.4)',
                  color: '#FAF7F2',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  cursor: 'pointer'
                }}
              >
                🖨️ Print / Save Voucher
              </button>

              <button
                onClick={() => setBookingPass(null)}
                style={{
                  padding: '14px 28px',
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#A89F93',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  cursor: 'pointer'
                }}
              >
                Book Another Table
              </button>
            </div>
          </div>
        ) : (
          /* Reservation Form */
          <form
            onSubmit={handleSubmit}
            style={{
              background: '#14110F',
              border: '1px solid rgba(212, 175, 55, 0.2)',
              borderRadius: '20px',
              padding: '40px 32px',
              display: 'flex',
              flexDirection: 'column',
              gap: '32px'
            }}
          >
            {/* 1. Step: Seating Choice */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.85rem',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: '#D4AF37',
                marginBottom: '16px'
              }}>
                1. Select Preferred Seating Style:
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                {seatingOptions.map((opt) => {
                  const isChosen = seatingType === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setSeatingType(opt.id)}
                      style={{
                        padding: '20px',
                        borderRadius: '12px',
                        background: isChosen ? 'rgba(212, 175, 55, 0.12)' : '#1A1613',
                        border: isChosen ? '2px solid #D4AF37' : '1px solid rgba(255, 255, 255, 0.08)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <span style={{
                          fontSize: '0.7rem',
                          color: isChosen ? '#D4AF37' : '#8E857B',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em'
                        }}>
                          {opt.badge}
                        </span>
                        <h3 style={{
                          fontFamily: 'var(--font-serif)',
                          fontSize: '1.15rem',
                          color: '#FAF7F2',
                          marginTop: '6px',
                          marginBottom: '8px'
                        }}>
                          {opt.title}
                        </h3>
                        <p style={{ fontSize: '0.85rem', lineHeight: 1.6, color: '#9E9489' }}>
                          {opt.description}
                        </p>
                      </div>

                      <div style={{ marginTop: '16px', fontSize: '0.78rem', color: isChosen ? '#D4AF37' : '#6E665C' }}>
                        {isChosen ? '✓ Selected' : 'Tap to select'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Step: Schedule & Guests */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.85rem',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: '#D4AF37',
                marginBottom: '16px'
              }}>
                2. Date, Time Slot & Party Size:
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#A89F93', marginBottom: '8px' }}>
                    Feast Date *
                  </label>
                  <input
                    type="date"
                    min={today}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: '#1A1613',
                      border: '1px solid rgba(212, 175, 55, 0.25)',
                      borderRadius: '8px',
                      color: '#FAF7F2',
                      fontSize: '0.95rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#A89F93', marginBottom: '8px' }}>
                    Time Slot *
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: '#1A1613',
                      border: '1px solid rgba(212, 175, 55, 0.25)',
                      borderRadius: '8px',
                      color: '#FAF7F2',
                      fontSize: '0.92rem',
                      outline: 'none'
                    }}
                  >
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot} style={{ background: '#1A1613', color: '#FAF7F2' }}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#A89F93', marginBottom: '8px' }}>
                    Number of Guests: {guests}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="14"
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value))}
                    style={{ width: '100%', accentColor: '#D4AF37', marginTop: '10px' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#7E766D', marginTop: '4px' }}>
                    <span>1 Person</span>
                    <span>6 (Majlis)</span>
                    <span>14+ Royal Party</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Step: Guest Details */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.85rem',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: '#D4AF37',
                marginBottom: '16px'
              }}>
                3. Guest Credentials:
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#A89F93', marginBottom: '8px' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Nawabzada Tariq Khan"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: '#1A1613',
                      border: '1px solid rgba(212, 175, 55, 0.25)',
                      borderRadius: '8px',
                      color: '#FAF7F2',
                      fontSize: '0.95rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#A89F93', marginBottom: '8px' }}>
                    Mobile Number (for SMS & WhatsApp Confirmation) *
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: '#1A1613',
                      border: '1px solid rgba(212, 175, 55, 0.25)',
                      borderRadius: '8px',
                      color: '#FAF7F2',
                      fontSize: '0.95rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#A89F93', marginBottom: '8px' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="tariq@awadh.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: '#1A1613',
                      border: '1px solid rgba(212, 175, 55, 0.25)',
                      borderRadius: '8px',
                      color: '#FAF7F2',
                      fontSize: '0.95rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Special Requests */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#A89F93', marginBottom: '8px' }}>
                Special Preparation or Seating Preferences (Optional)
              </label>
              <textarea
                placeholder="e.g. Extra hot marrow bones requested, mild spice for elderly family member, celebrating wedding anniversary..."
                rows={3}
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
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

            {/* Submit Button */}
            <button
              type="submit"
              style={{
                padding: '16px 36px',
                background: 'linear-gradient(135deg, #F3E5AB 0%, #D4AF37 50%, #B89025 100%)',
                color: '#120F0D',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '1rem',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 8px 25px rgba(212, 175, 55, 0.3)',
                marginTop: '10px'
              }}
            >
              Generate Shahi Reservation Pass ⚜️
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
