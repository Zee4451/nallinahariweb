import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { CartProvider } from '@/components/CartContext';
import { CMSProvider } from '@/components/CMSContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import SmoothScrollProvider from '@/components/SmoothScrollProvider';
import GradualBlur from '@/components/GradualBlur';
import VideoPreloader from '@/components/VideoPreloader';
import { RESTAURANT_INFO } from '@/data/restaurantData';

export const metadataBase = new URL(
  process.env.NEXT_PUBLIC_SITE_URL || 'https://thenahariking.com'
);

const siteUrl = metadataBase.href;
const logoUrl = new URL('/nahari-king-logo.png', metadataBase).href;
const siteDescription =
  'Slow-cooked Nalli Nihari, Mutton Paye and Khamiri Roti at Nahari King in Khajrana, Indore. Enjoy our viral ₹799 Non-Veg Thaal, open until midnight.';

export const metadata: Metadata = {
  metadataBase,
  title: {
    default: 'Nahari King Indore 👑 | Nalli Nihari, Paye & ₹799 Non-Veg Thaal',
    template: '%s | Nahari King Indore',
  },
  description: siteDescription,
  keywords: [
    'Nahari King',
    'Nahari King Indore',
    'Nahari King Khajrana',
    'The Nahari King',
    'Nalli Nihari Indore',
    'Mutton Nihari Khajrana',
    'Mutton Paye Indore',
    'Khamiri Roti Indore',
    'non-veg thaal Indore',
    '799 non-veg thaal',
    'best nihari in Indore',
    'late night non-veg Indore',
  ],
  authors: [{ name: 'Nahari King', url: siteUrl }],
  applicationName: 'Nahari King',
  other: {
    creator: 'Nahari King',
    publisher: 'Nahari King',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  alternates: {
    canonical: '/',
    languages: {
      'en-IN': '/',
    },
  },
  openGraph: {
    title: 'Nahari King Indore — Nalli Nihari, Mutton Paye & Non-Veg Thaal',
    description: siteDescription,
    url: '/',
    siteName: 'Nahari King',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/nahari-king-logo.png',
        width: 1024,
        height: 1024,
        alt: 'Nahari King Indore - Royal Nalli Nihari',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nahari King Indore — Nalli Nihari, Paye & Non-Veg Thaal',
    description: siteDescription,
    creator: '@thenahariking',
    site: '@thenahariking',
    images: ['/nahari-king-logo.png'],
  },
  icons: {
    icon: '/nahari-king-crest.png',
    apple: '/nahari-king-crest.png',
  },
};

const restaurantJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  '@id': `${siteUrl}#restaurant`,
  name: 'Nahari King',
  url: siteUrl,
  image: logoUrl,
  logo: logoUrl,
  description: siteDescription,
  telephone: RESTAURANT_INFO.phone,
  priceRange: '₹₹',
  servesCuisine: 'Mughlai / Nihari',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Chota Gate, Opp. Dargah Gate 2, Kadar Colony, Khajrana',
    addressLocality: 'Indore',
    addressRegion: 'Madhya Pradesh',
    addressCountry: 'IN',
  },
  openingHours: ['Mo-Su 12:00-24:00'],
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      opens: '12:00',
      closes: '24:00',
    },
  ],
  publisher: {
    '@type': 'Organization',
    name: 'Nahari King',
    url: siteUrl,
  },
};

const restaurantJsonLdString = JSON.stringify(restaurantJsonLd).replace(
  /</g,
  '\\u003c'
);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Script
          id="restaurant-json-ld"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: restaurantJsonLdString }}
        />
        <VideoPreloader />
        <SmoothScrollProvider>
          <CMSProvider>
            <CartProvider>
              <Navbar />
              <main style={{ minHeight: '80vh', paddingTop: '76px' }}>
                {children}
              </main>
              <Footer />
              <GradualBlur
                target="page"
                position="bottom"
                height="3.5rem"
                strength={1.5}
                divCount={3}
                curve="linear"
                opacity={0.75}
                zIndex={950}
              />
              <CartDrawer />
            </CartProvider>
          </CMSProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}