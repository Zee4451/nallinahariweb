-- ================================================================
-- Supabase Schema for The Nahari King Web App
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard
-- ================================================================

-- 1. Web Orders Table (Website Cart Checkouts)
CREATE TABLE IF NOT EXISTS public.web_orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT DEFAULT 'Online Web Guest',
  phone TEXT DEFAULT '+91 WhatsApp Order',
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_amount NUMERIC NOT NULL DEFAULT 0,
  payment_method TEXT DEFAULT 'UPI',
  status TEXT DEFAULT 'Pending',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Web Reservations Table (Table & VIP Majlis Bookings)
CREATE TABLE IF NOT EXISTS public.web_reservations (
  id TEXT PRIMARY KEY,
  guest_name TEXT NOT NULL,
  contact TEXT NOT NULL,
  date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  guests INTEGER NOT NULL DEFAULT 2,
  seating_type TEXT DEFAULT 'Traditional Diwan',
  status TEXT DEFAULT 'Confirmed',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Live CMS Table (Dishes, Viral Offers, Restaurant Info)
CREATE TABLE IF NOT EXISTS public.site_cms (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) & Allow Read/Insert Policies for public web usage
ALTER TABLE public.web_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.web_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_cms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read and insert web_orders" ON public.web_orders
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read and insert web_reservations" ON public.web_reservations
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read and update site_cms" ON public.site_cms
  FOR ALL USING (true) WITH CHECK (true);
