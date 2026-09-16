'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  MENU_ITEMS as DEFAULT_MENU_ITEMS,
  RESTAURANT_INFO as DEFAULT_RESTAURANT_INFO,
  REVIEWS as DEFAULT_REVIEWS,
  TIME_SLOTS as DEFAULT_TIME_SLOTS
} from '@/data/restaurantData';
import type { MenuItem, Review } from '@/types/restaurant';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export interface ViralOfferData {
  tag: string;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  priceTag: string;
}

export interface CMSState {
  menuItems: MenuItem[];
  restaurantInfo: typeof DEFAULT_RESTAURANT_INFO;
  reviews: Review[];
  viralOffer: ViralOfferData;
  timeSlots: string[];
}

const STORAGE_KEY = 'nahari_king_live_cms_v1';
const CMS_SYNC_EVENT = 'nk-cms-sync';

const DEFAULT_VIRAL_OFFER: ViralOfferData = {
  tag: '★ Limited Khajrana Special Offer',
  title: 'Indore Ki Best Nihari & Paye Non-Veg Thaal — Sirf ₹799 Mein!',
  description: 'Nalli Nihari + Mutton Paye + Seekh Kebabs + Dum Biryani + 4 Tandoor Rotis + Raita.',
  ctaText: 'Order Thaal Now →',
  ctaLink: '/menu',
  priceTag: '₹799'
};

interface CMSContextType {
  state: CMSState;
  updateDish: (dish: MenuItem) => void;
  addDish: (dish: MenuItem) => void;
  deleteDish: (id: string) => void;
  updateRestaurantInfo: (info: Partial<typeof DEFAULT_RESTAURANT_INFO>) => void;
  updateViralOffer: (offer: Partial<ViralOfferData>) => void;
  addReview: (review: Review) => void;
  updateReview: (review: Review) => void;
  deleteReview: (id: string) => void;
  resetToDefaults: () => void;
  exportDataJson: () => string;
  importDataJson: (jsonString: string) => boolean;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export function CMSProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<CMSState>({
    menuItems: DEFAULT_MENU_ITEMS,
    restaurantInfo: DEFAULT_RESTAURANT_INFO,
    reviews: DEFAULT_REVIEWS,
    viralOffer: DEFAULT_VIRAL_OFFER,
    timeSlots: DEFAULT_TIME_SLOTS
  });

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setState((prev) => ({
          ...prev,
          menuItems: Array.isArray(parsed.menuItems) ? parsed.menuItems : prev.menuItems,
          restaurantInfo: parsed.restaurantInfo ? { ...prev.restaurantInfo, ...parsed.restaurantInfo } : prev.restaurantInfo,
          reviews: Array.isArray(parsed.reviews) ? parsed.reviews : prev.reviews,
          viralOffer: parsed.viralOffer ? { ...prev.viralOffer, ...parsed.viralOffer } : prev.viralOffer,
          timeSlots: Array.isArray(parsed.timeSlots) ? parsed.timeSlots : prev.timeSlots
        }));
      }
    } catch {
      // ignore
    }

    // Hydrate from Cloud Database (Supabase) if configured
    if (isSupabaseConfigured && supabase) {
      supabase
        .from('site_cms')
        .select('data')
        .eq('id', 'live_content')
        .single()
        .then(
          ({ data, error }) => {
            if (!error && data?.data) {
              const cloud = data.data as CMSState;
              setState((prev) => ({
                ...prev,
                menuItems: Array.isArray(cloud.menuItems) ? cloud.menuItems : prev.menuItems,
                restaurantInfo: cloud.restaurantInfo ? { ...prev.restaurantInfo, ...cloud.restaurantInfo } : prev.restaurantInfo,
                reviews: Array.isArray(cloud.reviews) ? cloud.reviews : prev.reviews,
                viralOffer: cloud.viralOffer ? { ...prev.viralOffer, ...cloud.viralOffer } : prev.viralOffer,
                timeSlots: Array.isArray(cloud.timeSlots) ? cloud.timeSlots : prev.timeSlots
              }));
              try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(cloud));
              } catch {}
            }
          },
          () => {}
        );
    }

    // Cross-tab sync listener
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const fresh = JSON.parse(e.newValue);
          setState(fresh);
        } catch {
          // ignore
        }
      }
    };

    const handleCustomSync = (e: Event) => {
      const customEvent = e as CustomEvent<CMSState>;
      if (customEvent.detail) {
        setState(customEvent.detail);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(CMS_SYNC_EVENT, handleCustomSync);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(CMS_SYNC_EVENT, handleCustomSync);
    };
  }, []);

  // Sync to localStorage & Cloud Database
  const saveState = useCallback((newState: CMSState) => {
    setState(newState);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      window.dispatchEvent(new CustomEvent(CMS_SYNC_EVENT, { detail: newState }));

      if (isSupabaseConfigured && supabase) {
        supabase
          .from('site_cms')
          .upsert([{ id: 'live_content', data: newState, updated_at: new Date().toISOString() }])
          .then(
            ({ error }) => {
              if (error) console.warn('Supabase CMS upsert error:', error.message);
            },
            () => {}
          );
      }
    } catch {
      // ignore
    }
  }, []);

  const updateDish = (dish: MenuItem) => {
    saveState({
      ...state,
      menuItems: state.menuItems.map((item) => (item.id === dish.id ? dish : item))
    });
  };

  const addDish = (dish: MenuItem) => {
    saveState({
      ...state,
      menuItems: [dish, ...state.menuItems]
    });
  };

  const deleteDish = (id: string) => {
    saveState({
      ...state,
      menuItems: state.menuItems.filter((item) => item.id !== id)
    });
  };

  const updateRestaurantInfo = (info: Partial<typeof DEFAULT_RESTAURANT_INFO>) => {
    saveState({
      ...state,
      restaurantInfo: { ...state.restaurantInfo, ...info }
    });
  };

  const updateViralOffer = (offer: Partial<ViralOfferData>) => {
    saveState({
      ...state,
      viralOffer: { ...state.viralOffer, ...offer }
    });
  };

  const addReview = (review: Review) => {
    saveState({
      ...state,
      reviews: [review, ...state.reviews]
    });
  };

  const updateReview = (review: Review) => {
    saveState({
      ...state,
      reviews: state.reviews.map((r) => (r.id === review.id ? review : r))
    });
  };

  const deleteReview = (id: string) => {
    saveState({
      ...state,
      reviews: state.reviews.filter((r) => r.id !== id)
    });
  };

  const resetToDefaults = () => {
    const defaultState: CMSState = {
      menuItems: DEFAULT_MENU_ITEMS,
      restaurantInfo: DEFAULT_RESTAURANT_INFO,
      reviews: DEFAULT_REVIEWS,
      viralOffer: DEFAULT_VIRAL_OFFER,
      timeSlots: DEFAULT_TIME_SLOTS
    };
    saveState(defaultState);
  };

  const exportDataJson = () => {
    return JSON.stringify(state, null, 2);
  };

  const importDataJson = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && Array.isArray(parsed.menuItems)) {
        saveState({
          menuItems: parsed.menuItems,
          restaurantInfo: parsed.restaurantInfo || DEFAULT_RESTAURANT_INFO,
          reviews: parsed.reviews || DEFAULT_REVIEWS,
          viralOffer: parsed.viralOffer || DEFAULT_VIRAL_OFFER,
          timeSlots: parsed.timeSlots || DEFAULT_TIME_SLOTS
        });
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  return (
    <CMSContext.Provider
      value={{
        state,
        updateDish,
        addDish,
        deleteDish,
        updateRestaurantInfo,
        updateViralOffer,
        addReview,
        updateReview,
        deleteReview,
        resetToDefaults,
        exportDataJson,
        importDataJson
      }}
    >
      {children}
    </CMSContext.Provider>
  );
}

export function useCMS() {
  const context = useContext(CMSContext);
  if (!context) {
    // Fallback if rendered outside provider
    return {
      state: {
        menuItems: DEFAULT_MENU_ITEMS,
        restaurantInfo: DEFAULT_RESTAURANT_INFO,
        reviews: DEFAULT_REVIEWS,
        viralOffer: DEFAULT_VIRAL_OFFER,
        timeSlots: DEFAULT_TIME_SLOTS
      },
      updateDish: () => {},
      addDish: () => {},
      deleteDish: () => {},
      updateRestaurantInfo: () => {},
      updateViralOffer: () => {},
      addReview: () => {},
      updateReview: () => {},
      deleteReview: () => {},
      resetToDefaults: () => {},
      exportDataJson: () => '',
      importDataJson: () => false
    };
  }
  return context;
}
