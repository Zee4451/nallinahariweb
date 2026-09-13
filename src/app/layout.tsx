import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/components/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import SmoothScrollProvider from '@/components/SmoothScrollProvider';
import { RESTAURANT_INFO } from '@/data/restaurantData';

export const metadata: Metadata = {
  title: 'Nahari King Indore 👑 — Delhi Ka Asli Swad | Nalli Nihari, Paye & Non-Veg Thaal',
  description: 'Welcome to Nahari King (Khajrana, Indore). Authentic slow-cooked Nalli Nihari, Mutton Paye, viral ₹799 Non-Veg Thaal, and Khamiri Roti. Open till 12 AM midnight.',
  keywords: 'Nahari King, Nahari King Indore, Nalli Nihari Khajrana, Indore best nihari, Mutton Paye Indore, ₹799 non veg thaal, thenahariking, Khajrana food',
  openGraph: {
    title: 'Nahari King 👑 — Indore’s Most Famous Nalli Nihari & Paye',
    description: 'Delhi ka asli swaad, ab Indore ke Khajrana mein! Chota Gate, Opp. Dargah Gate 2, Kadar Colony.',
    type: 'website'
  }
};

import GradualBlur from '@/components/GradualBlur';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SmoothScrollProvider>
          <CartProvider>
            <Navbar />
            <main style={{ minHeight: '80vh', paddingTop: '76px' }}>
              {children}
            </main>
            <Footer />
            <GradualBlur
              target="page"
              position="bottom"
              height="4rem"
              strength={2}
              divCount={5}
              curve="bezier"
              exponential
              opacity={0.8}
              zIndex={950}
            />
            <CartDrawer />
          </CartProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
