// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';

export const metadata: Metadata = {
  title: 'LTIP — Laboratório de Tecnologia da Informação do PROFÁGUA',
  description:
    'Portal do Laboratório de Tecnologia da Informação do PROFÁGUA — LTIP. Inventário de equipamentos, agendamentos, documentos e equipe.',
};

export const revalidate = 60;

async function getSiteConfig() {
  const { data } = await supabase
    .from('configuracoes_site')
    .select('*')
    .in('chave', ['logo', 'contato', 'parcerias']);

  const config: Record<string, any> = {};
  data?.forEach((row) => { config[row.chave] = row.valor; });

  return {
    logoUrl: config.logo?.url ?? null,
    contato: config.contato ?? undefined,
    parcerias: config.parcerias ?? undefined,
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { logoUrl, contato, parcerias } = await getSiteConfig();

  return (
    <html lang="pt-BR">
      <body>
        <Navbar logoUrl={logoUrl} />
        <main>{children}</main>
        <Footer contato={contato} parcerias={parcerias} />
      </body>
    </html>
  );
}
