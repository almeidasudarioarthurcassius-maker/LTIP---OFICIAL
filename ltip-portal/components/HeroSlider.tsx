'use client';
// components/HeroSlider.tsx
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

const SLIDES = [
  {
    tag: 'Inovação & Pesquisa',
    title: 'Tecnologia a Serviço da Ciência',
    desc: 'O LTIP oferece infraestrutura de ponta para pesquisadores e estudantes desenvolverem projetos de alto impacto.',
    cta: { label: 'Agendar Equipamento →', href: '/#agendamento' },
    bg: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1400&q=80',
  },
  {
    tag: 'Equipamentos',
    title: 'Infraestrutura Completa e Atualizada',
    desc: 'Acesse nosso inventário de equipamentos disponíveis e verifique a disponibilidade em tempo real.',
    cta: { label: 'Ver Inventário →', href: '/#inventario' },
    bg: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1400&q=80',
  },
  {
    tag: 'Documentação',
    title: 'Repositório de Relatórios e Regimentos',
    desc: 'Acesse todos os documentos institucionais, regimentos e relatórios mensais do laboratório.',
    cta: { label: 'Acessar Documentos →', href: '/documentos' },
    bg: 'https://images.unsplash.com/photo-1562408590-e32931084e23?w=1400&q=80',
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent((c) => (c + 1) % SLIDES.length), []);
  const prev = () => setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length);

  useEffect(() => {
    const t = setInterval(next, 5500);
    return () => clearInterval(t);
  }, [next]);

  return (
    <section className="hero" aria-label="Banner principal">
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        {SLIDES.map((slide, i) => (
          <div
            key={i}
            className={`slide${i === current ? ' active' : ''}`}
            style={{
              backgroundColor: '#001833',
              backgroundImage: `url('${slide.bg}')`,
            }}
          >
            <div className="slide-overlay" />
            <div className="slide-content">
              <span className="slide-tag">{slide.tag}</span>
              <h1 className="slide-title">{slide.title}</h1>
              <p className="slide-desc">{slide.desc}</p>
              <Link href={slide.cta.href} className="slide-cta">
                {slide.cta.label}
              </Link>
            </div>
          </div>
        ))}

        <button className="slider-arrow prev" onClick={prev} aria-label="Slide anterior">‹</button>
        <button className="slider-arrow next" onClick={next} aria-label="Próximo slide">›</button>

        <div className="slider-dots">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              className={`dot${i === current ? ' active' : ''}`}
              onClick={() => setCurrent(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
