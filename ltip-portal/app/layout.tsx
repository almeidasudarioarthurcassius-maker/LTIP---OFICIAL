// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata: Metadata = {
  title: 'LTIP — Laboratório de Tecnologia da Informação do PROFÁGUA',
  description:
    'Portal do Laboratório de Tecnologia da Informação do PROFÁGUA — LTIP. Inventário de equipamentos, agendamentos, documentos e equipe.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
