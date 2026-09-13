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
    <div style={{ background: '#0A0807', color: '#FDFBF7', minHeight: '100vh', paddingBottom: '90px' }}>
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '80px 24px 60px',
        background: 'radial-gradient(ellipse at center, rgba(42, 28, 18, 0.7) 0%, #0A0807 80%)',
        borderBottom: '1px solid rgba(212, 175, 55, 0.2)'
      }}>
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
          <span style={{ fontSize: '0.8rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#D4AF37' }}>
            Awadhi & Mughal Culinary Dynasty
          </span>
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2.4rem, 5vw, 4rem)',
            color: '#FAF7F2',
            marginTop: '12px',
            marginBottom: '20px',
            lineHeight: 1.2
          }}>
            The Birth of Nihari & The Sacred 12-Hour Simmer
          </h1>
          <p style={{ color: '#C4BBB0', fontSize: '1.1rem', lineHeight: 1.8, maxWidth: '700px', margin: '0 auto' }}>
            Derived from the Arabic root <em>&apos;Nahar&apos;</em> (meaning daybreak), Nihari was born in the 18th-century royal courts of the Nawabs of Awadh and Old Delhi.
          </p>
        </div>
      </section>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 24px 0' }}>
        {/* Origin Story Section */}
        <section style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '48px',
          alignItems: 'center',
          marginBottom: '80px'
        }}>
          <div>
            <span style={{ fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#D4AF37' }}>
              The Dawn Tradition
            </span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', color: '#FAF7F2', marginTop: '8px', marginBottom: '16px' }}>
              Why It Was Cooked Through The Night
            </h2>
            <p style={{ color: '#A89F93', fontSize: '0.96rem', lineHeight: 1.8, marginBottom: '16px' }}>
              Royal Hakims (court physicians) crafted the original Nihari recipe to nourish laborers constructing grand royal monuments and the Nawabs themselves against the freezing winter mists of the northern plains.
            </p>
            <p style={{ color: '#A89F93', fontSize: '0.96rem', lineHeight: 1.8 }}>
              After morning Fajr prayers, nobles and commoners alike gathered around the steaming copper deghs. By simmering shank bones overnight for 12 straight hours over dying coals, the bone marrow melted completely, creating an elixir that imparted instant vitality and warmth.
            </p>
          </div>

          <div style={{
            background: '#14110F',
            border: '1px solid rgba(212, 175, 55, 0.25)',
            borderRadius: '16px',
            padding: '36px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.6)'
          }}>
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
        <section style={{ marginBottom: '90px' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span style={{ fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#D4AF37' }}>
              Culinary Foundation
            </span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.4rem', color: '#FAF7F2', marginTop: '8px' }}>
              The 4 Pillars of Authentic Nihari
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px'
          }}>
            {pillars.map((p) => (
              <div
                key={p.num}
                style={{
                  background: '#14110F',
                  border: '1px solid rgba(212, 175, 55, 0.2)',
                  borderRadius: '16px',
                  padding: '32px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  transition: 'transform 0.2s ease'
                }}
              >
                <div style={{
                  fontSize: '1.8rem',
                  fontFamily: 'var(--font-serif)',
                  fontWeight: 800,
                  color: '#D4AF37',
                  opacity: 0.8
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
        <section style={{
          background: '#14110F',
          border: '1px solid rgba(212, 175, 55, 0.25)',
          borderRadius: '20px',
          padding: '48px 36px',
          marginBottom: '70px'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span style={{ fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#D4AF37' }}>
              Table Manners of the Nawabs
            </span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', color: '#FAF7F2', marginTop: '8px' }}>
              The Royal Etiquette of Relishing Nalli Nahari
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {etiquetteSteps.map((s, idx) => (
              <div
                key={s.step}
                style={{
                  display: 'flex',
                  gap: '20px',
                  alignItems: 'flex-start',
                  padding: '20px',
                  background: '#1A1613',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}
              >
                <div style={{
                  background: 'rgba(212, 175, 55, 0.15)',
                  color: '#D4AF37',
                  border: '1px solid #D4AF37',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  flexShrink: 0
                }}>
                  {idx + 1}
                </div>
                <div>
                  <h4 style={{ color: '#FAF7F2', fontSize: '1.05rem', fontWeight: 600, marginBottom: '4px' }}>
                    {s.action}
                  </h4>
                  <p style={{ color: '#9E9489', fontSize: '0.9rem', lineHeight: 1.6 }}>
                    {s.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link
              href="/menu"
              style={{
                padding: '14px 32px',
                background: 'linear-gradient(135deg, #F3E5AB 0%, #D4AF37 100%)',
                color: '#120F0D',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.92rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                display: 'inline-block'
              }}
            >
              Taste The Heritage Menu 🍲
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
