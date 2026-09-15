'use client';

import React, { useState } from 'react';
import { TIME_SLOTS as DEFAULT_TIME_SLOTS, RESTAURANT_INFO as DEFAULT_RESTAURANT_INFO } from '@/data/restaurantData';
import { useCMS } from '@/components/CMSContext';

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
  const { state: cmsState } = useCMS();
  const restaurantInfo = cmsState?.restaurantInfo || DEFAULT_RESTAURANT_INFO;
  const timeSlots = cmsState?.timeSlots || DEFAULT_TIME_SLOTS;

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState(timeSlots[4] || timeSlots[0] || '');
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

    // Save to admin dashboard reservations in localStorage
    try {
      const DATA_STORAGE_KEY = 'nahari-king-admin-data-v1';
      const existing = localStorage.getItem(DATA_STORAGE_KEY);
      if (existing) {
        const parsed = JSON.parse(existing);
        const newBooking = {
          id: pass.id,
          guestName: pass.fullName,
          contact: phone,
          date: pass.date,
          timeSlot: pass.timeSlot,
          guests: pass.guests,
          seatingType: pass.seatingType === 'Shahi Majlis (Private Chamber)' ? 'Shahi Majlis VIP' : pass.seatingType === 'Royal Dining Table' ? 'Royal Dining Table' : 'Traditional Diwan',
          status: 'Confirmed',
          notes: pass.specialRequests || 'Website online booking'
        };
        parsed.reservations = [newBooking, ...(parsed.reservations || [])];
        localStorage.setItem(DATA_STORAGE_KEY, JSON.stringify(parsed));
      }
    } catch {
      // ignore
    }
  };

  const handleShareWhatsApp = () => {
    if (!bookingPass) return;
    const msg =
      `*Dastarkhwan Reservation Pass — ${restaurantInfo.name}*\n\n` +
      `⚜️ *Pass ID:* ${bookingPass.id}\n` +
      `👤 *Guest Name:* ${bookingPass.fullName}\n` +
      `📅 *Date:* ${bookingPass.date}\n` +
      `⏰ *Time Slot:* ${bookingPass.timeSlot}\n` +
      `👥 *Guests:* ${bookingPass.guests} Persons\n` +
      `🛋️ *Seating:* ${bookingPass.seatingType}\n` +
      (bookingPass.specialRequests ? `📝 *Notes:* ${bookingPass.specialRequests}\n\n` : '\n') +
      `Please confirm my reservation. Looking forward to the feast!`;

    window.open(`https://wa.me/${restaurantInfo.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="reservations-root">
      <style jsx>{`
        .reservations-root {
          background: var(--bg-dark, #090404);
          color: var(--text-main, #FFFDF9);
          min-height: 100vh;
          padding: clamp(36px, 6vw, 60px) clamp(16px, 4vw, 24px) 100px;
          overflow-x: hidden;
          width: 100%;
        }

        .reservations-inner {
          max-width: 960px;
          margin: 0 auto;
          width: 100%;
        }

        .reservations-header {
          text-align: center;
          margin-bottom: clamp(28px, 5vw, 48px);
        }

        .reservations-eyebrow {
          font-size: 0.78rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #D4AF37;
          display: block;
        }

        .reservations-title {
          font-family: var(--font-serif);
          fontSize: clamp(1.8rem, 5vw, 3.2rem);
          color: #FAF7F2;
          margin-top: 8px;
          margin-bottom: 12px;
          line-height: 1.2;
        }

        .reservations-subtitle {
          color: #B8B0A5;
          font-size: clamp(0.9rem, 2vw, 1.05rem);
          max-width: 640px;
          margin: 0 auto;
          line-height: 1.6;
          padding: 0 6px;
        }

        .reservation-card-box {
          background: linear-gradient(160deg, #18090B 0%, #110507 100%);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 20px;
          padding: clamp(20px, 4vw, 40px) clamp(16px, 4vw, 32px);
          display: flex;
          flex-direction: column;
          gap: clamp(20px, 4vw, 32px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.7), 0 0 25px rgba(122, 12, 14, 0.2);
          width: 100%;
        }

        .seating-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 14px;
          width: 100%;
        }

        .schedule-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
          gap: 18px;
          width: 100%;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
          gap: 18px;
          width: 100%;
        }

        .submit-reserve-btn {
          padding: 15px 28px;
          background: linear-gradient(135deg, #FCE8A6 0%, #D4AF37 50%, #9E7D23 100%);
          color: #160608;
          border-radius: 8px;
          font-weight: 800;
          font-size: clamp(0.88rem, 2vw, 1rem);
          letter-spacing: 0.05em;
          text-transform: uppercase;
          border: none;
          cursor: pointer;
          box-shadow: 0 6px 20px rgba(212, 175, 55, 0.35);
          margin-top: 10px;
          width: 100%;
          transition: transform 0.2s ease, filter 0.2s ease;
        }

        .submit-reserve-btn:active {
          transform: scale(0.98);
        }

        .voucher-box {
          background: linear-gradient(160deg, #1C0C0E 0%, #100507 100%);
          border: 2px solid #D4AF37;
          border-radius: 20px;
          padding: clamp(24px, 4vw, 40px) clamp(16px, 4vw, 32px);
          box-shadow: 0 20px 50px rgba(0,0,0,0.85), 0 0 35px rgba(212,175,55,0.3);
          position: relative;
          overflow: hidden;
          width: 100%;
        }

        .voucher-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 18px;
          padding: clamp(16px, 3vw, 24px);
          background: #19090B;
          border-radius: 12px;
          border: 1px solid rgba(212, 175, 55, 0.2);
          margin-bottom: 28px;
          width: 100%;
        }

        .voucher-btn-row {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          justify-content: center;
          width: 100%;
        }

        .voucher-action-btn {
          flex: 1 1 auto;
          min-width: 200px;
          text-align: center;
          justify-content: center;
        }

        @media (max-width: 640px) {
          .seating-grid {
            grid-template-columns: 1fr;
          }

          .schedule-grid {
            grid-template-columns: 1fr;
          }

          .contact-grid {
            grid-template-columns: 1fr;
          }

          .voucher-grid {
            grid-template-columns: 1fr;
          }

          .voucher-btn-row {
            flex-direction: column;
          }

          .voucher-action-btn {
            width: 100%;
          }
        }
      `}</style>

      <div className="reservations-inner">
        {/* Header */}
        <div className="reservations-header">
          <span className="reservations-eyebrow">
            Imperial Hospitality
          </span>
          <h1 className="reservations-title">
            Reserve Your Dastarkhwan
          </h1>
          <p className="reservations-subtitle">
            Select your preferred dining tradition: from the sacred low floor diwan to private royal chambers.
          </p>
        </div>

        {/* If Voucher is Generated */}
        {bookingPass ? (
          <div className="voucher-box">
            {/* Top Badge */}
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <span style={{
                background: 'rgba(212, 175, 55, 0.18)',
                color: '#D4AF37',
                padding: '6px 16px',
                borderRadius: '999px',
                fontSize: '0.75rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                border: '1px solid rgba(212, 175, 55, 0.45)'
              }}>
                Reservation Confirmed
              </span>
              <h2 style={{
                fontFamily: 'var(--font-serif)',
                color: '#FAF7F2',
                fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
                marginTop: '12px',
                marginBottom: '4px'
              }}>
                Shahi Dastarkhwan Pass
              </h2>
              <div style={{ color: '#D4AF37', fontSize: '1rem', fontWeight: 700, letterSpacing: '0.08em' }}>
                Ref: {bookingPass.id}
              </div>
            </div>

            {/* Voucher Details Grid */}
            <div className="voucher-grid">
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
            <div className="voucher-btn-row">
              <button
                onClick={handleShareWhatsApp}
                className="voucher-action-btn"
                style={{
                  padding: '14px 24px',
                  background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                  color: '#FFFFFF',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '0.92rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(37, 211, 102, 0.3)'
                }}
              >
                <span>💬 Send to WhatsApp</span>
              </button>

              <button
                onClick={() => window.print()}
                className="voucher-action-btn"
                style={{
                  padding: '14px 24px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(212, 175, 55, 0.4)',
                  color: '#FAF7F2',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '0.92rem',
                  cursor: 'pointer'
                }}
              >
                🖨️ Print / Save Voucher
              </button>

              <button
                onClick={() => setBookingPass(null)}
                className="voucher-action-btn"
                style={{
                  padding: '14px 24px',
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#A89F93',
                  borderRadius: '8px',
                  fontSize: '0.92rem',
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
            className="reservation-card-box"
          >
            {/* 1. Step: Seating Choice */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.82rem',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: '#D4AF37',
                marginBottom: '14px',
                fontWeight: 700
              }}>
                1. Select Preferred Seating Style:
              </label>

              <div className="seating-grid">
                {seatingOptions.map((opt) => {
                  const isChosen = seatingType === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setSeatingType(opt.id)}
                      style={{
                        padding: '18px',
                        borderRadius: '12px',
                        background: isChosen ? 'rgba(212, 175, 55, 0.16)' : '#190A0C',
                        border: isChosen ? '2px solid #D4AF37' : '1px solid rgba(212, 175, 55, 0.18)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        boxShadow: isChosen ? '0 0 16px rgba(212, 175, 55, 0.25)' : 'none'
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

              <div className="schedule-grid">
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
                    {timeSlots.map((slot: string) => (
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

              <div className="contact-grid">
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
              className="submit-reserve-btn"
            >
              Generate Shahi Reservation Pass ⚜️
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
