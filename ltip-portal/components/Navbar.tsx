'use client';
// components/Navbar.tsx
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar" role="navigation" aria-label="Navegação principal">
      <div className="navbar-inner">
        <Link href="/" className="navbar-brand">
          <div className="navbar-logo">
            <Image
              src="/images/logo-ltip.png"
              alt="LTIP"
              width={60}
              height={34}
              style={{ height: 34, width: 'auto', display: 'block' }}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent) parent.textContent = 'LTIP';
              }}
            />
          </div>
          <div className="navbar-title">
            <strong>LTIP</strong>
            Laboratório de Tecnologia da Informação do PROFÁGUA
          </div>
        </Link>

        <div className="navbar-nav" style={menuOpen ? { display: 'flex' } : {}}>
          <Link href="/#inventario">Inventário</Link>
          <Link href="/#agendamento">Agendamento</Link>
          <Link href="/documentos">Documentos</Link>
          <Link href="/equipe">Equipe</Link>
          <Link href="/#sobre">Sobre</Link>
          <Link href="/admin" className="btn-login">🔒 Área Restrita</Link>
        </div>

        <button
          className="hamburger"
          aria-label="Menu"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ display: 'none' }}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </nav>
  );
}
