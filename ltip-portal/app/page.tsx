// app/page.tsx  (Server Component)
import { supabase } from '../lib/supabase';
import HeroSlider, { Slide } from '../components/HeroSlider';
import InventoryTable from '../components/InventoryTable';
import SchedulingForm from '../components/SchedulingForm';
import Link from 'next/link';

export const revalidate = 60;

async function getData() {
  const [
    { data: inventario },
    { data: documentos },
    { data: equipe },
    { data: configRows },
  ] = await Promise.all([
    supabase.from('inventario').select('*').order('nome_equipamento'),
    supabase.from('documentos').select('*').order('data_upload', { ascending: false }).limit(6),
    supabase.from('equipe').select('*').order('ordem'),
    supabase.from('configuracoes_site').select('*').in('chave', ['slides', 'sobre']),
  ]);

  const config: Record<string, any> = {};
  configRows?.forEach((row) => { config[row.chave] = row.valor; });

  return {
    inventario: inventario ?? [],
    documentos: documentos ?? [],
    equipe: equipe ?? [],
    slides: (config.slides ?? []) as Slide[],
    sobre: config.sobre ?? {
      titulo: 'Sobre o LTIP',
      descricao: 'Laboratório de referência em pesquisa tecnológica e inovação.',
      missao: '',
      visao: '',
      regras: '',
    },
  };
}

export default async function HomePage() {
  const { inventario, documentos, equipe, slides, sobre } = await getData();

  return (
    <>
      {/* ── HERO ── */}
      <HeroSlider slides={slides} />

      {/* ── ACESSO RÁPIDO ── */}
      <section className="quick-access" id="acesso">
        <div className="container">
          <div className="section-label">Acesso Rápido</div>
          <h2 className="section-title">O que você precisa hoje?</h2>
          <div className="divider" />
          <div className="cards-grid">
            {[
              { href: '#agendamento', icon: '📅', color: 'blue',   title: 'Agendamento',  desc: 'Reserve equipamentos e espaços do laboratório de forma rápida e prática.',             cta: 'Agendar →'       },
              { href: '#inventario',  icon: '🖥️',  color: 'green',  title: 'Equipamentos', desc: 'Consulte o inventário completo e verifique a disponibilidade dos recursos.',           cta: 'Ver inventário →' },
              { href: '/documentos', icon: '📄', color: 'amber',  title: 'Documentos',   desc: 'Acesse o repositório de relatórios, regimentos e documentos institucionais.',           cta: 'Acessar →'        },
              { href: '/equipe',     icon: '👥', color: 'purple', title: 'Equipe',        desc: 'Conheça os pesquisadores, técnicos e coordenadores do laboratório.',                   cta: 'Conhecer →'       },
            ].map((card) => (
              <Link key={card.href} href={card.href} className="qcard">
                <div className={`qcard-icon ${card.color}`}>{card.icon}</div>
                <h3>{card.title}</h3>
                <p>{card.desc}</p>
                <span className="qcard-arrow">{card.cta}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── INVENTÁRIO ── */}
      <section className="inventory" id="inventario" style={{ background: 'white' }}>
        <div className="container">
          <InventoryTable items={inventario} />
        </div>
      </section>

      {/* ── AGENDAMENTO ── */}
      <section className="scheduling" id="agendamento">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start', flexWrap: 'wrap' }}>
            <div>
              <div className="section-label">Reservas</div>
              <h2 className="section-title">Agendamento de Equipamentos</h2>
              <div className="divider" />
              <p className="section-desc">
                Preencha o formulário para solicitar a reserva de um equipamento.
                Nossa equipe confirmará a disponibilidade em até 24 horas.
              </p>
              <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { n: '1', title: 'Selecione o equipamento',    sub: 'Escolha o recurso desejado no formulário', color: 'var(--navy)'  },
                  { n: '2', title: 'Informe período e finalidade', sub: 'Descreva brevemente o objetivo de uso',   color: 'var(--navy)'  },
                  { n: '✓', title: 'Aguarde a confirmação',       sub: 'Você receberá confirmação por e-mail',    color: 'var(--green)' },
                ].map((step) => (
                  <div key={step.n} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ width: 40, height: 40, background: step.color, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, flexShrink: 0 }}>
                      {step.n}
                    </div>
                    <div>
                      <strong style={{ color: 'var(--navy)' }}>{step.title}</strong>
                      <br />
                      <span style={{ fontSize: 14, color: 'var(--gray-600)' }}>{step.sub}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <SchedulingForm equipamentos={inventario} />
          </div>
        </div>
      </section>

      {/* ── DOCUMENTOS (preview) ── */}
      <section className="documents" id="documentos" style={{ background: 'var(--gray-50)' }}>
        <div className="container">
          <div className="section-label">Repositório Institucional</div>
          <h2 className="section-title">Documentos e Relatórios</h2>
          <div className="divider" />
          <div className="docs-grid">
            {documentos.map((doc: any) => (
              <div key={doc.id} className="doc-card">
                <div className="doc-icon">📄</div>
                <div>
                  <div className="doc-name">{doc.titulo}</div>
                  <div className="doc-meta">
                    📁 {doc.categoria ?? 'Documento'} &nbsp;•&nbsp;
                    🗓️ {new Date(doc.data_upload).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}
                  </div>
                </div>
                <div className="doc-actions">
                  <a href={doc.arquivo_url} className="btn-doc primary" target="_blank" rel="noopener noreferrer">👁️ Visualizar</a>
                  <a href={doc.arquivo_url} className="btn-doc" download>⬇️ Baixar</a>
                </div>
              </div>
            ))}
          </div>
          {documentos.length === 0 && (
            <p style={{ color: 'var(--gray-600)', textAlign: 'center', padding: 32 }}>
              Nenhum documento publicado ainda.
            </p>
          )}
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Link href="/documentos" className="btn-action">Ver todos os documentos →</Link>
          </div>
        </div>
      </section>

      {/* ── EQUIPE (preview) ── */}
      <section className="team" id="equipe" style={{ background: 'white' }}>
        <div className="container">
          <div className="section-label">Nossos Profissionais</div>
          <h2 className="section-title">Equipe do Laboratório</h2>
          <div className="divider" />
          <div className="team-grid">
            {equipe.slice(0, 8).map((m: any) => {
              const initials = m.nome?.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() ?? '??';
              return (
                <div key={m.id} className="team-card">
                  <div className="team-avatar">
                    {m.imagem_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={m.imagem_url} alt={m.nome} />
                    ) : (
                      initials
                    )}
                  </div>
                  <div className="team-name">{m.nome}</div>
                  <div className="team-role">{m.cargo}</div>
                  {m.lattes_url && (
                    <a href={m.lattes_url} className="btn-lattes" target="_blank" rel="noopener noreferrer">
                      🎓 Currículo Lattes
                    </a>
                  )}
                </div>
              );
            })}
          </div>
          {equipe.length > 8 && (
            <div style={{ textAlign: 'center', marginTop: 32 }}>
              <Link href="/equipe" className="btn-action">Ver toda a equipe →</Link>
            </div>
          )}
        </div>
      </section>

      {/* ── SOBRE (dinâmico) ── */}
      <section className="about" id="sobre">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="section-label" style={{ color: 'var(--green-accent)' }}>Quem Somos</div>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: 'white', marginBottom: 12 }}>
              {sobre.titulo}
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.75)', maxWidth: 600, margin: '0 auto', fontSize: 17 }}>
              {sobre.descricao}
            </p>
          </div>
          <div className="about-grid">
            <div className="about-card">
              <div className="about-card-icon">🎯</div>
              <h3>Missão</h3>
              <p>{sobre.missao}</p>
            </div>
            <div className="about-card">
              <div className="about-card-icon">🔭</div>
              <h3>Visão</h3>
              <p>{sobre.visao}</p>
            </div>
            <div className="about-card">
              <div className="about-card-icon">📋</div>
              <h3>Regras de Uso</h3>
              <p>{sobre.regras}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
