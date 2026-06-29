'use client';
// components/InventoryTable.tsx
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Equipamento } from '../lib/supabase';

type Props = { items: Equipamento[] };

const STATUS_LABEL: Record<string, string> = {
  disponivel: 'Disponível',
  reservado: 'Reservado',
  manutencao: 'Manutenção',
};

export default function InventoryTable({ items }: Props) {
  const [filter, setFilter] = useState<string>('all');

  const visible = filter === 'all' ? items : items.filter((i) => i.status === filter);

  return (
    <>
      <div className="inv-header">
        <div>
          <div className="section-label">Recursos do Laboratório</div>
          <h2 className="section-title">Inventário de Equipamentos</h2>
          <div className="divider" style={{ marginBottom: 0 }} />
        </div>
        <div className="inv-filters">
          {[
            { key: 'all', label: 'Todos' },
            { key: 'disponivel', label: 'Disponível' },
            { key: 'reservado', label: 'Reservado' },
            { key: 'manutencao', label: 'Manutenção' },
          ].map((f) => (
            <button
              key={f.key}
              className={`filter-btn${filter === f.key ? ' active' : ''}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Status</th>
              <th>Equipamento</th>
              <th>Qtd.</th>
              <th>Funcionalidade</th>
              <th>Patrimônio / Tombo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: 32, color: 'var(--gray-600)' }}>
                  Nenhum equipamento encontrado.
                </td>
              </tr>
            )}
            {visible.map((item) => (
              <tr key={item.id} data-status={item.status}>
                <td>
                  <div className={`status-cell status-${item.status}`}>
                    <span className="status-dot" />
                    {STATUS_LABEL[item.status] ?? item.status}
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {item.imagem_url && (
                      <Image
                        src={item.imagem_url}
                        alt={item.nome_equipamento}
                        width={56}
                        height={44}
                        className="equip-img"
                      />
                    )}
                    <div>
                      <div className="equip-name">{item.nome_equipamento}</div>
                      {item.especificacoes && (
                        <div style={{ marginTop: 4 }}>
                          {item.especificacoes.split(',').map((s, i) => (
                            <span key={i} className="spec-tag">{s.trim()}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td style={{ textAlign: 'center', fontWeight: 700 }}>{item.quantidade}</td>
                <td style={{ maxWidth: 260, fontSize: 13, color: 'var(--gray-600)' }}>
                  {item.funcionalidade ?? '—'}
                </td>
                <td>
                  <span className="tombo">{item.tombo ?? '—'}</span>
                </td>
                <td>
                  {item.status === 'disponivel' ? (
                    <Link href={`/#agendamento`} className="btn-action">
                      📅 Reservar
                    </Link>
                  ) : (
                    <span className="btn-action" style={{ cursor: 'default', opacity: 0.6 }}>
                      🔍 Visualizar
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
