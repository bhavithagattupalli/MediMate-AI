import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import { AuthProvider } from '@/context/AuthContext';
import { EmergencyBanner } from '@/components/EmergencyBanner';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AIChatModal } from '@/components/AIChatModal';

export const metadata: Metadata = {
  title: 'MediMate AI – Your Personal AI Health Copilot',
  description: 'Evidence-informed healthcare modules, clinical triage, doctor specialty matching, and AI health copilot.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased flex flex-col min-h-screen bg-slate-50 selection:bg-teal-500 selection:text-white">
        <LanguageProvider>
          <AuthProvider>
            <EmergencyBanner />
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
            <AIChatModal />
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
