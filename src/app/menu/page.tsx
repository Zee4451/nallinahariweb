'use client';

import React, { useState } from 'react';
import { MENU_ITEMS } from '@/data/restaurantData';
import { useCart } from '@/components/CartContext';
import type { Category, SpiceLevel, PortionOption, MenuItem } from '@/types/restaurant';

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | Category>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPortions, setSelectedPortions] = useState<{ [dishId: string]: PortionOption }>({});
  const [selectedSpices, setSelectedSpices] = useState<{ [dishId: string]: SpiceLevel }>({});
  const [addedToast, setAddedToast] = useState<string | null>(null);

  const { addToCart, totalCount, setIsCartOpen } = useCart();

  const categories: { id: 'all' | Category; label: string; icon: string }[] = [
    { id: 'all', label: 'All Fare', icon: '⚜️' },
    { id: 'nihari', label: 'Signature Niharis', icon: '🍲' },
    { id: 'biryani', label: 'Dum Biryanis', icon: '🍚' },
    { id: 'kebabs', label: 'Charcoal Kebabs', icon: '🍢' },
    { id: 'breads', label: 'Artisan Breads', icon: '🫓' },
    { id: 'desserts', label: 'Shahi Desserts', icon: '🍮' },
    { id: 'beverages', label: 'Royal Brews', icon: '☕' }
  ];

  const spiceOptions: { level: SpiceLevel; label: string; color: string }[] = [
    { level: 'mild', label: 'Mild Aromatics', color: '#10B981' },
    { level: 'classic', label: 'Classic Awadhi', color: '#F59E0B' },
    { level: 'zesty', label: 'Old Delhi Zesty', color: '#EF4444' },
    { level: 'royal-fiery', label: 'Royal Fiery', color: '#991B1B' }
  ];

  const filteredDishes = MENU_ITEMS.filter((item) => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q) || item.urduName.includes(q);
    return matchesCat && matchesSearch;
  });

  const handlePortionSelect = (dishId: string, portion: PortionOption) => {
    setSelectedPortions((prev) => ({ ...prev, [dishId]: portion }));
  };

  const handleSpiceSelect = (dishId: string, spice: SpiceLevel) => {
    setSelectedSpices((prev) => ({ ...prev, [dishId]: spice }));
  };

  const handleAdd = (dish: MenuItem) => {
    const chosenPortion = selectedPortions[dish.id] || (dish.portionSizes ? dish.portionSizes[0] : undefined);
    const chosenSpice = selectedSpices[dish.id] || dish.spiceLevel || 'classic';
    addToCart(dish, chosenPortion, chosenSpice);

    setAddedToast(`Added ${dish.name} to Dastarkhwan!`);
    setTimeout(() => setAddedToast(null), 2500);
  };

  return (
    <div className="menu-page-root">
      <style jsx>{`
        .menu-page-root {
          background: var(--bg-dark, #090404);
          color: var(--text-main, #FFFDF9);
          min-height: 100vh;
          padding-bottom: 120px;
          overflow-x: hidden;
          width: 100%;
        }

        .menu-hero {
          text-align: center;
          padding: clamp(36px, 6vw, 60px) clamp(16px, 4vw, 24px) clamp(28px, 4vw, 40px);
          background:
            radial-gradient(ellipse at 50% 20%, rgba(122, 12, 14, 0.28) 0%, transparent 68%),
            radial-gradient(ellipse at center, rgba(38, 20, 16, 0.6) 0%, #090404 75%);
          border-bottom: 1px solid rgba(212, 175, 55, 0.25);
        }

        .menu-eyebrow {
          font-size: 0.78rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #D4AF37;
          display: block;
          margin-bottom: 6px;
        }

        .menu-heading {
          font-family: var(--font-serif);
          font-size: clamp(1.8rem, 5vw, 3.2rem);
          font-weight: 800;
          color: #FAF7F2;
          margin-top: 4px;
          margin-bottom: 12px;
          line-height: 1.2;
        }

        .menu-subtitle {
          color: #B8B0A5;
          font-size: clamp(0.88rem, 2vw, 1rem);
          max-width: 580px;
          margin: 0 auto 24px;
          line-height: 1.55;
          padding: 0 8px;
        }

        .menu-search-wrap {
          max-width: 520px;
          margin: 0 auto;
          width: 100%;
          padding: 0 4px;
        }

        .menu-search-bar {
          display: flex;
          align-items: center;
          background: #18090B;
          border: 1px solid rgba(212, 175, 55, 0.35);
          border-radius: 999px;
          padding: 6px 12px 6px 18px;
          box-shadow: 0 6px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05);
          width: 100%;
        }

        .menu-search-input {
          flex: 1;
          background: transparent;
          border: none;
          color: #FAF7F2;
          font-size: 0.9rem;
          outline: none;
          padding: 8px 0;
          min-width: 0;
        }

        .category-tabs-container {
          max-width: 1280px;
          margin: clamp(20px, 4vw, 32px) auto 0;
          padding: 0 clamp(16px, 3vw, 24px);
          display: flex;
          gap: 10px;
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
          padding-bottom: 10px;
          -webkit-overflow-scrolling: touch;
        }

        .category-tabs-container::-webkit-scrollbar {
          display: none;
        }

        .category-btn {
          padding: 9px 18px;
          border-radius: 999px;
          font-size: 0.82rem;
          font-weight: 600;
          letter-spacing: 0.03em;
          white-space: nowrap;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          transition: all 0.22s ease;
          flex-shrink: 0;
        }

        .category-btn--active {
          background: linear-gradient(135deg, #FCE8A6 0%, #D4AF37 50%, #9E7D23 100%);
          color: #160608;
          border: 1px solid #D4AF37;
          box-shadow: 0 4px 14px rgba(212, 175, 55, 0.35);
        }

        .category-btn--inactive {
          background: rgba(255, 255, 255, 0.04);
          color: #C4BBB0;
          border: 1px solid rgba(212, 175, 55, 0.18);
        }

        .category-btn--inactive:hover {
          color: #FAF7F2;
          border-color: rgba(212, 175, 55, 0.4);
          background: rgba(212, 175, 55, 0.08);
        }

        .dishes-catalog-wrap {
          max-width: 1280px;
          margin: clamp(24px, 4vw, 40px) auto 0;
          padding: 0 clamp(16px, 3vw, 24px);
          width: 100%;
        }

        .dishes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
          gap: clamp(20px, 3vw, 32px);
          width: 100%;
        }

        .dish-card {
          background: linear-gradient(160deg, #1C0C0E 0%, #120607 100%);
          border: 1px solid rgba(212, 175, 55, 0.28);
          border-radius: 18px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 10px 30px rgba(0,0,0,0.6), 0 0 20px rgba(122, 12, 14, 0.15);
          transition: transform 0.24s ease, box-shadow 0.24s ease;
          width: 100%;
        }

        .dish-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 16px 36px rgba(0,0,0,0.7), 0 0 24px rgba(212, 175, 55, 0.22);
          border-color: rgba(212, 175, 55, 0.5);
        }

        .dish-media {
          height: clamp(190px, 24vw, 230px);
          position: relative;
          background-size: cover;
          background-position: center;
          width: 100%;
        }

        .dish-body {
          padding: clamp(16px, 3vw, 24px);
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .dish-pricing-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding-top: 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          margin-top: auto;
          flex-wrap: wrap;
        }

        .dish-add-btn {
          padding: 11px 20px;
          background: linear-gradient(135deg, #FCE8A6 0%, #D4AF37 50%, #9E7D23 100%);
          color: #160608;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.85rem;
          letter-spacing: 0.03em;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(212, 175, 55, 0.28);
          border: none;
          transition: transform 0.18s ease, filter 0.18s ease;
          white-space: nowrap;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .dish-add-btn:active {
          transform: scale(0.97);
        }

        .floating-cart-indicator {
          position: fixed;
          bottom: 24px;
          right: 20px;
          z-index: 900;
        }

        .floating-cart-btn {
          padding: 13px 22px;
          background: linear-gradient(135deg, #FCE8A6 0%, #D4AF37 50%, #9E7D23 100%);
          color: #120608;
          border-radius: 999px;
          font-weight: 800;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.85), 0 0 25px rgba(212,175,55,0.5);
          cursor: pointer;
          border: 2px solid rgba(255, 255, 255, 0.85);
          transition: transform 0.2s ease;
        }

        .floating-cart-btn:active {
          transform: scale(0.96);
        }

        @media (max-width: 640px) {
          .dishes-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .dish-pricing-row {
            gap: 10px;
          }

          .dish-add-btn {
            flex: 1;
            min-width: 140px;
            padding: 12px 14px;
            font-size: 0.82rem;
          }

          .floating-cart-indicator {
            left: 14px;
            right: 14px;
            bottom: 18px;
          }

          .floating-cart-btn {
            width: 100%;
            justify-content: center;
            padding: 14px 20px;
            font-size: 0.88rem;
          }
        }
      `}</style>

      {/* Toast Notification */}
      {addedToast && (
        <div style={{
          position: 'fixed',
          bottom: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
          background: '#1F0B0E',
          border: '1px solid #D4AF37',
          color: '#FAF7F2',
          padding: '11px 20px',
          borderRadius: '999px',
          fontSize: '0.84rem',
          fontWeight: 600,
          boxShadow: '0 8px 30px rgba(0,0,0,0.85), 0 0 18px rgba(212,175,55,0.35)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          maxWidth: '90vw',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          <span>✨</span>
          <span>{addedToast}</span>
        </div>
      )}

      {/* Hero Header */}
      <section className="menu-hero">
        <span className="menu-eyebrow">
          Dastarkhwan Selections
        </span>
        <h1 className="menu-heading">
          The Royal Culinary Catalog
        </h1>
        <p className="menu-subtitle">
          Slow-simmered over fragrant acacia charcoal. Select your preferred cut, portion size, and spice intensity.
        </p>

        {/* Search Bar */}
        <div className="menu-search-wrap">
          <div className="menu-search-bar">
            <span style={{ color: '#D4AF37', marginRight: '8px' }}>🔍</span>
            <input
              type="text"
              placeholder="Search dishes, spices (e.g. Nalli, Maghaz, Biryani)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="menu-search-input"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ background: 'none', border: 'none', color: '#B8B0A5', cursor: 'pointer', padding: '0 6px' }}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <div className="category-tabs-container">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`category-btn ${isSelected ? 'category-btn--active' : 'category-btn--inactive'}`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Dishes Catalog Grid */}
      <div className="dishes-catalog-wrap">
        {filteredDishes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#8E857B' }}>
            <div style={{ fontSize: '48px', marginBottom: '14px' }}>🍲</div>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: '#E5D6C5', marginBottom: '8px' }}>
              No Royal Delicacies Found
            </p>
            <p style={{ fontSize: '0.9rem' }}>Try refining your search keyword or clearing the filter.</p>
          </div>
        ) : (
          <div className="dishes-grid">
            {filteredDishes.map((dish) => {
              const activePortion = selectedPortions[dish.id] || (dish.portionSizes ? dish.portionSizes[0] : undefined);
              const currentPrice = activePortion ? activePortion.price : dish.price;
              const activeSpice = selectedSpices[dish.id] || dish.spiceLevel || 'classic';

              return (
                <div key={dish.id} className="dish-card">
                  {/* Dish Image */}
                  <div
                    className="dish-media"
                    style={{ backgroundImage: `url(${dish.image})` }}
                  >
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, #1C0C0E 0%, transparent 60%)'
                    }} />

                    {dish.tag && (
                      <span style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        padding: '4px 9px',
                        background: 'rgba(142, 32, 32, 0.95)',
                        color: '#FAF7F2',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        letterSpacing: '0.05em',
                        borderRadius: '4px',
                        border: '1px solid rgba(212, 175, 55, 0.35)'
                      }}>
                        {dish.tag}
                      </span>
                    )}

                    {dish.cookTimeHours && (
                      <span style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        padding: '4px 9px',
                        background: 'rgba(12, 5, 6, 0.88)',
                        color: '#D4AF37',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        borderRadius: '4px',
                        border: '1px solid rgba(212, 175, 55, 0.3)'
                      }}>
                        ⏳ {dish.cookTimeHours}h Simmer
                      </span>
                    )}
                  </div>

                  {/* Body Details */}
                  <div className="dish-body">
                    <div style={{ fontSize: '0.85rem', color: '#D4AF37', marginBottom: '4px', fontFamily: 'serif' }}>
                      {dish.urduName}
                    </div>
                    <h3 style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.2rem',
                      color: '#FAF7F2',
                      marginBottom: '8px',
                      lineHeight: 1.3
                    }}>
                      {dish.name}
                    </h3>
                    <p style={{
                      fontSize: '0.86rem',
                      lineHeight: 1.6,
                      color: '#9E9489',
                      marginBottom: '18px',
                      flex: 1
                    }}>
                      {dish.description}
                    </p>

                    {/* Portion Options */}
                    {dish.portionSizes && dish.portionSizes.length > 0 && (
                      <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '0.72rem', color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                          Select Cut / Portion:
                        </label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {dish.portionSizes.map((p) => {
                            const isPSelected = activePortion?.name === p.name;
                            return (
                              <button
                                key={p.name}
                                onClick={() => handlePortionSelect(dish.id, p)}
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  padding: '8px 11px',
                                  borderRadius: '6px',
                                  fontSize: '0.78rem',
                                  background: isPSelected ? 'rgba(212, 175, 55, 0.16)' : '#190B0D',
                                  border: isPSelected ? '1px solid #D4AF37' : '1px solid rgba(255, 255, 255, 0.08)',
                                  color: isPSelected ? '#FAF7F2' : '#A89F93',
                                  cursor: 'pointer',
                                  textAlign: 'left'
                                }}
                              >
                                <span>{p.name} <small style={{ color: '#7E766D' }}>({p.serves})</small></span>
                                <span style={{ fontWeight: 700, color: isPSelected ? '#D4AF37' : '#FAF7F2' }}>₹{p.price}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Spice Level Selector */}
                    {dish.category === 'nihari' && (
                      <div style={{ marginBottom: '18px' }}>
                        <label style={{ display: 'block', fontSize: '0.72rem', color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                          Spice Profile:
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
                          {spiceOptions.map((sp) => {
                            const isSpSelected = activeSpice === sp.level;
                            return (
                              <button
                                key={sp.level}
                                onClick={() => handleSpiceSelect(dish.id, sp.level)}
                                style={{
                                  padding: '6px 7px',
                                  borderRadius: '6px',
                                  fontSize: '0.7rem',
                                  background: isSpSelected ? 'rgba(212, 175, 55, 0.16)' : '#180A0C',
                                  border: isSpSelected ? '1px solid #D4AF37' : '1px solid rgba(255, 255, 255, 0.06)',
                                  color: isSpSelected ? '#D4AF37' : '#888075',
                                  cursor: 'pointer',
                                  fontWeight: isSpSelected ? 700 : 400
                                }}
                              >
                                {sp.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Price & Add to Cart Button */}
                    <div className="dish-pricing-row">
                      <div>
                        <span style={{ fontSize: '0.7rem', color: '#7E766D', display: 'block' }}>Portion Price</span>
                        <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FAF7F2' }}>₹{currentPrice}</span>
                      </div>

                      <button
                        onClick={() => handleAdd(dish)}
                        className="dish-add-btn"
                      >
                        + Add to Dastarkhwan
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Bottom Quick Cart Indicator */}
      {totalCount > 0 && (
        <div className="floating-cart-indicator">
          <button
            onClick={() => setIsCartOpen(true)}
            className="floating-cart-btn"
          >
            <span>🍲 View Dastarkhwan ({totalCount})</span>
            <span>→</span>
          </button>
        </div>
      )}
    </div>
  );
}
