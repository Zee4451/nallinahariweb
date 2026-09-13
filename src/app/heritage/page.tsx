'use client';

import React from 'react';
import Link from 'next/link';

export default function HeritagePage() {
  const pillars = [
    {
      num: '01',
      title: 'Baby Shank Selection',
      urdu: 'مخصوص نلی گوشت',
      desc: 'Only the tenderest baby marrow shanks are hand-selected at dawn. The natural bone marrow forms the buttery soul and collagen base of the entire brew.'
    },
    {
      num: '02',
      title: '32-Spice Hand-Pounded Potli',
      urdu: '۳۲ مصالحہ جات کی پوٹلی',
      desc: 'A secret ancestral sachet of pipli (long pepper), stone flower (pathar phool), star anise, dried ginger, green cardamom, and royal saffron roasted over clay pans.'
    },
    {
      num: '03',
      title: '12-Hour Charcoal Degh Dum',
      urdu: '۱۲ گھنٹے کوئلے کا دم',
      desc: 'The heavy tin-lined copper degh is hermetically sealed with whole-wheat dough ribbon, gently braising over acacia charcoal embers throughout the night.'
    },
    {
      num: '04',
      title: 'The Floating Roghan Elixir',
      urdu: 'زعفرانی روغن کی جھلک',
      desc: 'A shimmering emulsion of spiced cultured ghee skimmed before serving. It delivers an unforgettable aroma and velvety warmth with the first mouthful.'
    }
  ];

  const etiquetteSteps = [
    {
      step: 'Step 1',
      action: 'Inhale the Aromatic Vapors',
      detail: 'Before dipping, take in the perfume of 32 roasted potli spices and fresh ginger matchsticks rising with the steam.'
    },
    {
      step: 'Step 2',
      action: 'Tear a Morsel of Warm Bread',
      detail: 'Break a piece of golden Zafrani Roghani Naan or crisp Khamiri Roti, dipping deep into the velvety roghan emulsion.'
    },
    {
      step: 'Step 3',
      action: 'The Sacred Bone Marrow Tap',
      detail: 'Lift the roasted shank and tap it lightly against the rim of your bowl or plate to release the molten bone marrow (Nalli) directly into the broth.'
    },
    {
      step: 'Step 4',
      action: 'Garnish with Royal Precision',
      detail: 'Scatter fresh julienned ginger, chopped coriander, slivered green chilies, and a squeeze of fresh lime to cut through the richness.'
    },
    {
      step: 'Step 5',
      action: 'Palate Cleanser with Saffron Kahwa',
      detail: 'Complete the feast with a hot cup of crushed-almond Kashmiri Kahwa to soothe digestion and leave a lingering sweet cardamom finish.'
    }
  ];

  return (
    <div className="heritage-root">
      <style jsx>{`
        .heritage-root {
          background: #0A0807;
          color: #FDFBF7;
          min-height: 100vh;
          padding-bottom: 90px;
          overflow-x: hidden;
          width: 100%;
        }

        .heritage-hero {
          position: relative;
          min-height: 50vh;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: clamp(60px, 8vw, 100px) clamp(16px, 4vw, 32px) clamp(40px, 6vw, 60px);
          background: radial-gradient(ellipse at center, rgba(122, 12, 14, 0.35) 0%, #0A0807 80%);
          border-bottom: 1px solid rgba(212, 175, 55, 0.2);
          width: 100%;
        }

        .heritage-hero-inner {
          max-width: 850px;
          margin: 0 auto;
          width: 100%;
        }

        .heritage-eyebrow {
          font-size: clamp(0.72rem, 1.8vw, 0.8rem);
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #D4AF37;
          display: block;
        }

        .heritage-title {
          font-family: var(--font-serif);
          font-size: clamp(2rem, 5.5vw, 3.8rem);
          color: #FAF7F2;
          margin-top: 12px;
          margin-bottom: 20px;
          line-height: 1.2;
        }

        .heritage-lead {
          color: #C4BBB0;
          font-size: clamp(0.95rem, 2.2vw, 1.12rem);
          line-height: 1.8;
          max-width: 700px;
          margin: 0 auto;
        }

        .heritage-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: clamp(36px, 5vw, 60px) clamp(16px, 4vw, 24px) 0;
          width: 100%;
        }

        .story-section {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: clamp(28px, 4vw, 48px);
          align-items: center;
          margin-bottom: clamp(48px, 6vw, 80px);
          width: 100%;
        }

        .story-card {
          background: #14110F;
          border: 1px solid rgba(212, 175, 55, 0.25);
          border-radius: 16px;
          padding: clamp(24px, 4vw, 36px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.6);
          width: 100%;
        }

        .pillars-section {
          margin-bottom: clamp(54px, 7vw, 90px);
          width: 100%;
        }

        .pillars-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: clamp(16px, 2.5vw, 24px);
          width: 100%;
        }

        .pillar-card {
          background: #14110F;
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 16px;
          padding: clamp(24px, 3.5vw, 32px) clamp(18px, 3vw, 24px);
          display: flex;
          flex-direction: column;
          gap: 12px;
          transition: transform 0.2s ease, border-color 0.2s ease;
          width: 100%;
        }

        .pillar-card:hover {
          border-color: rgba(212, 175, 55, 0.5);
          transform: translateY(-2px);
        }

        .etiquette-card {
          background: #14110F;
          border: 1px solid rgba(212, 175, 55, 0.25);
          border-radius: 20px;
          padding: clamp(24px, 4vw, 48px) clamp(16px, 4vw, 36px);
          margin-bottom: 70px;
          width: 100%;
        }

        .etiquette-step-item {
          display: flex;
          gap: clamp(12px, 3vw, 20px);
          align-items: flex-start;
          padding: clamp(14px, 3vw, 20px);
          background: #1A1613;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          width: 100%;
        }

        .etiquette-step-badge {
          background: rgba(212, 175, 55, 0.15);
          color: #D4AF37;
          border: 1px solid #D4AF37;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.9rem;
          flex-shrink: 0;
        }

        .cta-btn-link {
          padding: 14px clamp(24px, 4vw, 36px);
          background: linear-gradient(135deg, #FCE8A6 0%, #D4AF37 50%, #9E7D23 100%);
          color: #160608;
          border-radius: 8px;
          font-weight: 800;
          font-size: clamp(0.85rem, 2vw, 0.95rem);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: inline-block;
          text-align: center;
          box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
          transition: transform 0.2s ease;
        }

        .cta-btn-link:active {
          transform: scale(0.98);
        }

        @media (max-width: 640px) {
          .story-section {
            grid-template-columns: 1fr;
            gap: 28px;
          }

          .pillars-grid {
            grid-template-columns: 1fr;
          }

          .etiquette-step-item {
            padding: 14px 12px;
          }

          .cta-btn-link {
            width: 100%;
          }
        }
      `}</style>

      {/* Hero Section */}
      <section className="heritage-hero">
        <div className="heritage-hero-inner">
          <span className="heritage-eyebrow">
            Awadhi & Mughal Culinary Dynasty
          </span>
          <h1 className="heritage-title">
            The Birth of Nihari & The Sacred 12-Hour Simmer
          </h1>
          <p className="heritage-lead">
            Derived from the Arabic root <em>&apos;Nahar&apos;</em> (meaning daybreak), Nihari was born in the 18th-century royal courts of the Nawabs of Awadh and Old Delhi.
          </p>
        </div>
      </section>

      <div className="heritage-container">
        {/* Origin Story Section */}
        <section className="story-section">
          <div>
            <span style={{ fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#D4AF37', display: 'block' }}>
              The Dawn Tradition
            </span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.7rem, 4vw, 2.2rem)', color: '#FAF7F2', marginTop: '8px', marginBottom: '16px', lineHeight: 1.25 }}>
              Why It Was Cooked Through The Night
            </h2>
            <p style={{ color: '#A89F93', fontSize: '0.96rem', lineHeight: 1.8, marginBottom: '16px' }}>
              Royal Hakims (court physicians) crafted the original Nihari recipe to nourish laborers constructing grand royal monuments and the Nawabs themselves against the freezing winter mists of the northern plains.
            </p>
            <p style={{ color: '#A89F93', fontSize: '0.96rem', lineHeight: 1.8 }}>
              After morning Fajr prayers, nobles and commoners alike gathered around the steaming copper deghs. By simmering shank bones overnight for 12 straight hours over dying coals, the bone marrow melted completely, creating an elixir that imparted instant vitality and warmth.
            </p>
          </div>

          <div className="story-card">
            <h3 style={{ fontFamily: 'var(--font-serif)', color: '#D4AF37', fontSize: '1.3rem', marginBottom: '12px' }}>
              The Sacred Degh Seal
            </h3>
            <p style={{ color: '#C4BBB0', fontSize: '0.92rem', lineHeight: 1.7, fontStyle: 'italic', marginBottom: '20px' }}>
              &quot;The degh is never opened in haste. When the dough ribbon cracks at dawn, the steam that escapes carries centuries of Awadhi heritage.&quot;
            </p>
            <div style={{ fontSize: '0.82rem', color: '#8E857B' }}>
              — Ustad Mian Bashir, Master Bawarchi (3rd Generation)
            </div>
          </div>
        </section>

        {/* 4 Pillars Grid */}
        <section className="pillars-section">
          <div style={{ textAlign: 'center', marginBottom: 'clamp(32px, 5vw, 48px)' }}>
            <span style={{ fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#D4AF37', display: 'block' }}>
              Culinary Foundation
            </span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem, 4.5vw, 2.4rem)', color: '#FAF7F2', marginTop: '8px', lineHeight: 1.25 }}>
              The 4 Pillars of Authentic Nihari
            </h2>
          </div>

          <div className="pillars-grid">
            {pillars.map((p) => (
              <div
                key={p.num}
                className="pillar-card"
              >
                <div style={{
                  fontSize: '1.8rem',
                  fontFamily: 'var(--font-serif)',
                  fontWeight: 800,
                  color: '#D4AF37',
                  opacity: 0.85
                }}>
                  {p.num}
                </div>
                <div style={{ fontSize: '0.82rem', color: '#D4AF37', fontFamily: 'serif' }}>{p.urdu}</div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: '#FAF7F2' }}>
                  {p.title}
                </h3>
                <p style={{ color: '#9E9489', fontSize: '0.88rem', lineHeight: 1.7 }}>
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Etiquette Guide */}
        <section className="etiquette-card">
          <div style={{ textAlign: 'center', marginBottom: 'clamp(28px, 4vw, 40px)' }}>
            <span style={{ fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#D4AF37', display: 'block' }}>
              Table Manners of the Nawabs
            </span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.7rem, 4vw, 2.2rem)', color: '#FAF7F2', marginTop: '8px', lineHeight: 1.25 }}>
              The Royal Etiquette of Relishing Nalli Nahari
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {etiquetteSteps.map((s, idx) => (
              <div
                key={s.step}
                className="etiquette-step-item"
              >
                <div className="etiquette-step-badge">
                  {idx + 1}
                </div>
                <div>
                  <h4 style={{ color: '#FAF7F2', fontSize: 'clamp(0.95rem, 2vw, 1.05rem)', fontWeight: 600, marginBottom: '4px' }}>
                    {s.action}
                  </h4>
                  <p style={{ color: '#9E9489', fontSize: '0.88rem', lineHeight: 1.6 }}>
                    {s.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 'clamp(28px, 4vw, 40px)' }}>
            <Link
              href="/menu"
              className="cta-btn-link"
            >
              Taste The Heritage Menu 🍲
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
