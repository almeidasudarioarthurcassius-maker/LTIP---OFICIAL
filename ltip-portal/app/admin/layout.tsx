// app/admin/layout.tsx
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Painel Gestor — LTIP' };

const NAV = [
  { href: '/admin',            icon: '📊', label: 'Dashboard'    },
  { href: '/admin/equipe',     icon: '👥', label: 'Equipe'       },
  { href: '/admin/inventario', icon: '🖥️',  label: 'Inventário'  },
  { href: '/admin/documentos', icon: '📄', label: 'Documentos'   },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-layout" style={{ paddingTop: 0 }}>
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>⚙️ Painel Gestor</h2>
          <p>LTIP Administração</p>
        </div>
        <nav className="admin-nav">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="admin-nav-item">
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: 'auto' }}>
          <Link
            href="/"
            style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}
          >
            ← Voltar ao site
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="admin-main">
        {children}
      </div>
    </div>
  );
}
