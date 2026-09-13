'use client';

import React from 'react';
import { useCart } from '@/components/CartContext';
import { RESTAURANT_INFO } from '@/data/restaurantData';

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, clearCart, updateQuantity, cartTotal, totalCount } = useCart();

  if (!isCartOpen) return null;

  const handleWhatsAppOrder = () => {
    if (cart.length === 0) return;

    let text = `*New Royal Order from Nalli Nahari Web*\n\n`;
    cart.forEach((ci, idx) => {
      const p = ci.selectedPortion ? ci.selectedPortion.price : ci.item.price;
      const portionText = ci.selectedPortion ? ` [${ci.selectedPortion.name}]` : '';
      const spiceText = ci.selectedSpice ? ` (Spice: ${ci.selectedSpice.toUpperCase()})` : '';
      text += `${idx + 1}. *${ci.item.name}*${portionText}${spiceText}\n   Qty: ${ci.quantity} × ₹${p} = ₹${p * ci.quantity}\n\n`;
    });
    text += `*Grand Total: ₹${cartTotal}*\n`;
    text += `\nPlease confirm preparation and delivery/pickup availability.`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/${RESTAURANT_INFO.whatsapp}?text=${encoded}`, '_blank');
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      display: 'flex',
      justifyContent: 'flex-end',
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      transition: 'opacity 0.3s ease'
    }}>
      {/* Backdrop click to close */}
      <div style={{ flex: 1 }} onClick={() => setIsCartOpen(false)} />

      {/* Slide Drawer */}
      <div style={{
        width: '100%',
        maxWidth: '460px',
        height: '100%',
        background: '#120F0D',
        borderLeft: '1px solid rgba(212, 175, 55, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-10px 0 40px rgba(0,0,0,0.8)'
      }}>
        {/* Drawer Header */}
        <div style={{
          padding: '24px 28px',
          borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#161310'
        }}>
          <div>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#D4AF37' }}>
              Shahi Dastarkhwan Cart
            </span>
            <h3 style={{ fontFamily: 'var(--font-serif)', color: '#FAF7F2', fontSize: '1.25rem', marginTop: '4px' }}>
              Selected Royal Fare ({totalCount})
            </h3>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              color: '#D4AF37',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              fontSize: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            ✕
          </button>
        </div>

        {/* Items List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#8E857B' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🍲</div>
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: '#E5D6C5', marginBottom: '8px' }}>
                Your Dastarkhwan is Empty
              </p>
              <p style={{ fontSize: '0.85rem' }}>Select your favorite slow-cooked Nihari, Biryani or Kebabs from our menu.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {cart.map((ci, index) => {
                const itemPrice = ci.selectedPortion ? ci.selectedPortion.price : ci.item.price;
                return (
                  <div
                    key={`${ci.item.id}-${index}`}
                    style={{
                      background: '#1A1613',
                      border: '1px solid rgba(212, 175, 55, 0.15)',
                      borderRadius: '12px',
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h4 style={{ color: '#FAF7F2', fontSize: '0.95rem', fontWeight: 600 }}>{ci.item.name}</h4>
                        <div style={{ fontSize: '0.75rem', color: '#D4AF37', marginTop: '2px' }}>
                          {ci.selectedPortion ? ci.selectedPortion.name : 'Standard Portion'}
                          {ci.selectedSpice && ` • ${ci.selectedSpice.toUpperCase()}`}
                        </div>
                      </div>
                      <span style={{ color: '#FAF7F2', fontWeight: 700, fontSize: '1rem' }}>
                        ₹{itemPrice * ci.quantity}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      <span style={{ fontSize: '0.8rem', color: '#8E857B' }}>₹{itemPrice} each</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button
                          onClick={() => updateQuantity(index, ci.quantity - 1)}
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '6px',
                            background: '#241E19',
                            border: '1px solid rgba(212, 175, 55, 0.3)',
                            color: '#FAF7F2',
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                          }}
                        >
                          -
                        </button>
                        <span style={{ color: '#D4AF37', fontWeight: 600, fontSize: '0.9rem' }}>{ci.quantity}</span>
                        <button
                          onClick={() => updateQuantity(index, ci.quantity + 1)}
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '6px',
                            background: '#241E19',
                            border: '1px solid rgba(212, 175, 55, 0.3)',
                            color: '#FAF7F2',
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {cart.length > 0 && (
          <div style={{
            padding: '24px 28px',
            borderTop: '1px solid rgba(212, 175, 55, 0.2)',
            background: '#161310',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#B8B0A5', fontSize: '0.9rem' }}>Subtotal</span>
              <span style={{ color: '#FAF7F2', fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--font-serif)' }}>
                ₹{cartTotal}
              </span>
            </div>

            <button
              onClick={handleWhatsAppOrder}
              style={{
                width: '100%',
                padding: '14px',
                background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                color: '#FFFFFF',
                borderRadius: '10px',
                fontWeight: 600,
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 15px rgba(37, 211, 102, 0.25)',
                cursor: 'pointer'
              }}
            >
              <span>💬 Order via WhatsApp Concierge</span>
            </button>

            <button
              onClick={clearCart}
              style={{
                fontSize: '0.75rem',
                color: '#8E857B',
                textDecoration: 'underline',
                textAlign: 'center',
                cursor: 'pointer'
              }}
            >
              Clear Dastarkhwan Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
