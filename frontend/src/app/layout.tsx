import type { Metadata } from 'next';
import { Inter, Manrope, JetBrains_Mono, Noto_Sans_Bengali } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import { AuthProvider } from '@/context/AuthContext';
import { PreloaderProvider } from '@/context/PreloaderContext';
import { GoogleMapsProvider } from '@/components/GoogleMapsProvider';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AiAssistantWidget } from '@/components/AiAssistantWidget';
import { AccessibilityWidget } from '@/components/AccessibilityWidget';
import { CivicPortalBackdrop, CivicSkylineBand } from '@/components/CivicPortalBackdrop';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-heading',
  display: 'swap',
});

const notoBengali = Noto_Sans_Bengali({
  subsets: ['bengali', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-bengali',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Dhaka Smart City Corporation — Digital Citizen Service Platform',
  description:
    'Modern bilingual civic-tech portal and paperless citizen e-service platform for Dhaka Smart City Corporation with QR verification, geo-tagged complaints, GIS city map, open budget tracker, and RBAC operations.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/images/Dhaka_City_logo.png',
  },
  openGraph: {
    title: 'Dhaka Smart City Corporation — Digital Citizen Service Platform',
    description:
      'Paperless trade licenses, holding tax calculator, QR verification, geo-tagged complaints, GIS city map, and open municipal budget tracking.',
    type: 'website',
  },
};

export const dynamic = 'force-dynamic';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const mapsApiKey =
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
    process.env.GOOGLE_MAPS_API_KEY ||
    process.env.VITE_GOOGLE_MAPS_API_KEY ||
    '';

  return (
    <html
      lang="bn"
      className={`${inter.variable} ${manrope.variable} ${notoBengali.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="relative min-h-screen flex flex-col antialiased bg-[#F8FAFC] text-[#111827] selection:bg-[#006A4E]/15 selection:text-[#006A4E]" suppressHydrationWarning>
        <CivicPortalBackdrop />
        <AppProvider>
          <PreloaderProvider>
            <AuthProvider>
              <GoogleMapsProvider initialApiKey={mapsApiKey}>
                <Navbar />
                <main className="relative z-10 flex-1">{children}</main>
                <CivicSkylineBand />
                <Footer />
                <AiAssistantWidget />
                <AccessibilityWidget />
              </GoogleMapsProvider>
            </AuthProvider>
          </PreloaderProvider>
        </AppProvider>
      </body>
    </html>
  );
}
