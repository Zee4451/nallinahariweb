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
    <div style={{ background: '#0A0807', color: '#FDFBF7', minHeight: '100vh', paddingBottom: '100px' }}>
      {/* Toast Notification */}
      {addedToast && (
        <div style={{
          position: 'fixed',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
          background: '#1A1613',
          border: '1px solid #D4AF37',
          color: '#FAF7F2',
          padding: '12px 24px',
          borderRadius: '999px',
          fontSize: '0.88rem',
          fontWeight: 600,
          boxShadow: '0 8px 30px rgba(0,0,0,0.8), 0 0 15px rgba(212,175,55,0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>✨</span>
          <span>{addedToast}</span>
        </div>
      )}

      {/* Hero Header */}
      <section style={{
        textAlign: 'center',
        padding: '60px 24px 40px',
        background: 'radial-gradient(ellipse at center, rgba(38, 28, 20, 0.5) 0%, #0A0807 70%)',
        borderBottom: '1px solid rgba(212, 175, 55, 0.2)'
      }}>
        <span style={{ fontSize: '0.8rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#D4AF37' }}>
          Dastarkhwan Selections
        </span>
        <h1 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(2.2rem, 4vw, 3.5rem)',
          fontWeight: 800,
          color: '#FAF7F2',
          marginTop: '8px',
          marginBottom: '12px'
        }}>
          The Royal Culinary Catalog
        </h1>
        <p style={{ color: '#B8B0A5', fontSize: '1rem', maxWidth: '600px', margin: '0 auto 28px' }}>
          Slow-simmered over fragrant acacia charcoal. Select your preferred cut, portion size, and spice intensity.
        </p>

        {/* Search Bar */}
        <div style={{ maxWidth: '520px', margin: '0 auto' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: '#14110F',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            borderRadius: '999px',
            padding: '4px 8px 4px 20px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)'
          }}>
            <span style={{ color: '#D4AF37', marginRight: '10px' }}>🔍</span>
            <input
              type="text"
              placeholder="Search by dish name, spice, or ingredient (e.g. Nalli, Maghaz, Sheermal)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                color: '#FAF7F2',
                fontSize: '0.9rem',
                outline: 'none',
                padding: '8px 0'
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', padding: '0 8px' }}
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <div style={{
        maxWidth: '1280px',
        margin: '32px auto 0',
        padding: '0 24px',
        display: 'flex',
        gap: '12px',
        overflowX: 'auto',
        paddingBottom: '12px'
      }}>
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                padding: '10px 20px',
                borderRadius: '999px',
                fontSize: '0.85rem',
                fontWeight: 600,
                letterSpacing: '0.04em',
                whiteSpace: 'nowrap',
                background: isSelected ? 'linear-gradient(135deg, #F3E5AB 0%, #D4AF37 100%)' : 'rgba(255, 255, 255, 0.04)',
                color: isSelected ? '#120F0D' : '#C4BBB0',
                border: isSelected ? '1px solid #D4AF37' : '1px solid rgba(255, 255, 255, 0.1)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease'
              }}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Dishes Catalog Grid */}
      <div style={{ maxWidth: '1280px', margin: '40px auto 0', padding: '0 24px' }}>
        {filteredDishes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#8E857B' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🍲</div>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: '#E5D6C5', marginBottom: '8px' }}>
              No Royal Delicacies Found
            </p>
            <p style={{ fontSize: '0.9rem' }}>Try refining your search keyword or clearing the filter.</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '32px'
          }}>
            {filteredDishes.map((dish) => {
              const activePortion = selectedPortions[dish.id] || (dish.portionSizes ? dish.portionSizes[0] : undefined);
              const currentPrice = activePortion ? activePortion.price : dish.price;
              const activeSpice = selectedSpices[dish.id] || dish.spiceLevel || 'classic';

              return (
                <div
                  key={dish.id}
                  style={{
                    background: '#14110F',
                    border: '1px solid rgba(212, 175, 55, 0.18)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {/* Dish Image */}
                  <div style={{
                    height: '220px',
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
                        padding: '4px 10px',
                        background: 'rgba(142, 32, 32, 0.9)',
                        color: '#FAF7F2',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        letterSpacing: '0.05em',
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
                        padding: '4px 10px',
                        background: 'rgba(10, 8, 7, 0.85)',
                        color: '#D4AF37',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        borderRadius: '4px',
                        border: '1px solid rgba(212, 175, 55, 0.3)'
                      }}>
                        ⏳ {dish.cookTimeHours}h Simmer
                      </span>
                    )}
                  </div>

                  {/* Body Details */}
                  <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: '0.85rem', color: '#D4AF37', marginBottom: '4px', fontFamily: 'serif' }}>
                      {dish.urduName}
                    </div>
                    <h3 style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.25rem',
                      color: '#FAF7F2',
                      marginBottom: '8px'
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

                    {/* Portion Options (if applicable) */}
                    {dish.portionSizes && dish.portionSizes.length > 0 && (
                      <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '0.75rem', color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
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
                                  padding: '8px 12px',
                                  borderRadius: '6px',
                                  fontSize: '0.8rem',
                                  background: isPSelected ? 'rgba(212, 175, 55, 0.15)' : '#1A1613',
                                  border: isPSelected ? '1px solid #D4AF37' : '1px solid rgba(255, 255, 255, 0.08)',
                                  color: isPSelected ? '#FAF7F2' : '#A89F93',
                                  cursor: 'pointer',
                                  textAlign: 'left'
                                }}
                              >
                                <span>{p.name} <small style={{ color: '#7E766D' }}>({p.serves})</small></span>
                                <span style={{ fontWeight: 600, color: isPSelected ? '#D4AF37' : '#FAF7F2' }}>₹{p.price}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Spice Level Selector (if relevant) */}
                    {dish.category === 'nihari' && (
                      <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '0.75rem', color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
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
                                  padding: '6px 8px',
                                  borderRadius: '6px',
                                  fontSize: '0.72rem',
                                  background: isSpSelected ? 'rgba(212, 175, 55, 0.12)' : '#181412',
                                  border: isSpSelected ? '1px solid #D4AF37' : '1px solid rgba(255, 255, 255, 0.06)',
                                  color: isSpSelected ? '#D4AF37' : '#888075',
                                  cursor: 'pointer',
                                  fontWeight: isSpSelected ? 600 : 400
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
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '16px',
                      borderTop: '1px solid rgba(255, 255, 255, 0.08)'
                    }}>
                      <div>
                        <span style={{ fontSize: '0.72rem', color: '#7E766D', display: 'block' }}>Portion Price</span>
                        <span style={{ fontSize: '1.35rem', fontWeight: 700, color: '#FAF7F2' }}>₹{currentPrice}</span>
                      </div>

                      <button
                        onClick={() => handleAdd(dish)}
                        style={{
                          padding: '11px 22px',
                          background: 'linear-gradient(135deg, #F3E5AB 0%, #D4AF37 100%)',
                          color: '#120F0D',
                          borderRadius: '8px',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          letterSpacing: '0.04em',
                          cursor: 'pointer',
                          boxShadow: '0 4px 15px rgba(212, 175, 55, 0.2)',
                          border: 'none'
                        }}
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
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 40
        }}>
          <button
            onClick={() => setIsCartOpen(true)}
            style={{
              padding: '14px 24px',
              background: '#D4AF37',
              color: '#0A0807',
              borderRadius: '999px',
              fontWeight: 700,
              fontSize: '0.92rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.8), 0 0 20px rgba(212,175,55,0.4)',
              cursor: 'pointer',
              border: '2px solid #FFF'
            }}
          >
            <span>🍲 View Dastarkhwan ({totalCount})</span>
            <span>→</span>
          </button>
        </div>
      )}
    </div>
  );
}
