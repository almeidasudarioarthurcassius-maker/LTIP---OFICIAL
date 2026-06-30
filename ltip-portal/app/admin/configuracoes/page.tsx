'use client';
// app/admin/configuracoes/page.tsx
import { useEffect, useRef, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import Toast from '../../../components/Toast';

type Sobre = { titulo: string; descricao: string; missao: string; visao: string; regras: string };
type Contato = {
  endereco_linha1: string; endereco_linha2: string; cep: string; cidade: string;
  telefone: string; email: string; horario_semana: string; horario_sabado: string; observacao: string;
};

const SOBRE_EMPTY: Sobre = { titulo: '', descricao: '', missao: '', visao: '', regras: '' };
const CONTATO_EMPTY: Contato = {
  endereco_linha1: '', endereco_linha2: '', cep: '', cidade: '',
  telefone: '', email: '', horario_semana: '', horario_sabado: '', observacao: '',
};

export default function AdminConfiguracoesPage() {
  const [sobre, setSobre] = useState<Sobre>(SOBRE_EMPTY);
  const [contato, setContato] = useState<Contato>(CONTATO_EMPTY);
  const [parcerias, setParcerias] = useState<string>('');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'error') => setToast({ msg, type });

  async function load() {
    const { data } = await supabase
      .from('configuracoes_site')
      .select('*')
      .in('chave', ['sobre', 'contato', 'logo', 'parcerias']);

    data?.forEach((row) => {
      if (row.chave === 'sobre') setSobre(row.valor);
      if (row.chave === 'contato') setContato(row.valor);
      if (row.chave === 'logo') setLogoUrl(row.valor?.url ?? null);
      if (row.chave === 'parcerias') setParcerias((row.valor ?? []).join(', '));
    });
  }

  useEffect(() => { load(); }, []);

  async function uploadLogo(): Promise<string | null> {
    if (!logoFile) return logoUrl;
    const ext = logoFile.name.split('.').pop();
    const path = `logo/logo-ltip-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('ltip-public').upload(path, logoFile, { upsert: true });
    if (error) { showToast('Erro no upload da logo: ' + error.message); return logoUrl; }
    const { data } = supabase.storage.from('ltip-public').getPublicUrl(path);
    return data.publicUrl;
  }

  function onLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  }

  async function saveAll() {
    setLoading(true);
    try {
      const novaLogoUrl = await uploadLogo();

      const parceriasArray = parcerias.split(',').map((p) => p.trim()).filter(Boolean);

      const upserts = [
        { chave: 'sobre', valor: sobre },
        { chave: 'contato', valor: contato },
        { chave: 'logo', valor: { url: novaLogoUrl } },
        { chave: 'parcerias', valor: parceriasArray },
      ];

      for (const item of upserts) {
        const { error } = await supabase.from('configuracoes_site').upsert(item, { onConflict: 'chave' });
        if (error) throw error;
      }

      setLogoUrl(novaLogoUrl);
      setLogoFile(null);
      showToast('Configurações salvas com sucesso!', 'success');
    } catch (err: any) {
      showToast('Erro ao salvar: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {toast && <Toast message={toast.msg} type={toast.type} onDone={() => setToast(null)} />}

      <div className="admin-topbar">
        <h1>⚙️ Sobre / Contato / Logo</h1>
      </div>

      <div className="admin-content">

        {/* ── LOGO ── */}
        <div className="admin-card">
          <h3>🖼️ Logo do Laboratório</h3>
          <p style={{ fontSize: 13, color: 'var(--gray-600)', marginBottom: 16 }}>
            Envie a logo oficial do LTIP. Ela aparecerá no cabeçalho do site, substituindo o texto "LTIP".
          </p>
          <div
            className="upload-zone"
            onClick={() => fileRef.current?.click()}
            style={{ maxWidth: 320 }}
          >
            {(logoPreview || logoUrl) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoPreview || logoUrl || ''}
                alt="Logo atual"
                style={{ height: 60, maxWidth: '100%', objectFit: 'contain', margin: '0 auto 12px' }}
              />
            ) : (
              <div className="upload-zone-icon">🖼️</div>
            )}
            <p><strong>Clique para selecionar</strong> a logo (PNG com fundo transparente)</p>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onLogoChange} />
          </div>
        </div>

        {/* ── SOBRE ── */}
        <div className="admin-card">
          <h3>✏️ Textos da Seção "Sobre"</h3>
          <div className="admin-input-group">
            <label>Título da Seção</label>
            <input value={sobre.titulo} onChange={(e) => setSobre({ ...sobre, titulo: e.target.value })} />
          </div>
          <div className="admin-input-group">
            <label>Descrição geral</label>
            <textarea rows={3} value={sobre.descricao} onChange={(e) => setSobre({ ...sobre, descricao: e.target.value })} />
          </div>
          <div className="admin-input-group">
            <label>Missão</label>
            <textarea rows={4} value={sobre.missao} onChange={(e) => setSobre({ ...sobre, missao: e.target.value })} />
          </div>
          <div className="admin-input-group">
            <label>Visão</label>
            <textarea rows={4} value={sobre.visao} onChange={(e) => setSobre({ ...sobre, visao: e.target.value })} />
          </div>
          <div className="admin-input-group">
            <label>Regras de Uso</label>
            <textarea rows={4} value={sobre.regras} onChange={(e) => setSobre({ ...sobre, regras: e.target.value })} />
          </div>
        </div>

        {/* ── CONTATO / ENDEREÇO ── */}
        <div className="admin-card">
          <h3>📍 Endereço, Contato e Horário</h3>
          <div className="admin-form-row">
            <div className="admin-input-group">
              <label>Endereço — linha 1</label>
              <input
                placeholder="Ex: Av. General Rodrigo Octávio, 6200"
                value={contato.endereco_linha1}
                onChange={(e) => setContato({ ...contato, endereco_linha1: e.target.value })}
              />
            </div>
            <div className="admin-input-group">
              <label>Endereço — linha 2</label>
              <input
                placeholder="Ex: Campus Universitário, Setor Sul"
                value={contato.endereco_linha2}
                onChange={(e) => setContato({ ...contato, endereco_linha2: e.target.value })}
              />
            </div>
          </div>
          <div className="admin-form-row">
            <div className="admin-input-group">
              <label>CEP</label>
              <input value={contato.cep} onChange={(e) => setContato({ ...contato, cep: e.target.value })} />
            </div>
            <div className="admin-input-group">
              <label>Cidade / UF</label>
              <input
                placeholder="Ex: Manaus – AM"
                value={contato.cidade}
                onChange={(e) => setContato({ ...contato, cidade: e.target.value })}
              />
            </div>
          </div>
          <div className="admin-form-row">
            <div className="admin-input-group">
              <label>Telefone</label>
              <input value={contato.telefone} onChange={(e) => setContato({ ...contato, telefone: e.target.value })} />
            </div>
            <div className="admin-input-group">
              <label>E-mail</label>
              <input value={contato.email} onChange={(e) => setContato({ ...contato, email: e.target.value })} />
            </div>
          </div>
          <div className="admin-form-row">
            <div className="admin-input-group">
              <label>Horário — Segunda a Sexta</label>
              <input
                placeholder="Ex: 08h00 – 18h00"
                value={contato.horario_semana}
                onChange={(e) => setContato({ ...contato, horario_semana: e.target.value })}
              />
            </div>
            <div className="admin-input-group">
              <label>Horário — Sábado</label>
              <input
                placeholder="Ex: 08h00 – 12h00"
                value={contato.horario_sabado}
                onChange={(e) => setContato({ ...contato, horario_sabado: e.target.value })}
              />
            </div>
          </div>
          <div className="admin-input-group">
            <label>Observação sobre horário</label>
            <input
              value={contato.observacao}
              onChange={(e) => setContato({ ...contato, observacao: e.target.value })}
            />
          </div>
        </div>

        {/* ── PARCERIAS ── */}
        <div className="admin-card">
          <h3>🤝 Parcerias</h3>
          <div className="admin-input-group">
            <label>Lista de parceiros (separados por vírgula)</label>
            <input
              placeholder="Ex: CNPq, FAPEAM, CAPES, FINEP, MCTI"
              value={parcerias}
              onChange={(e) => setParcerias(e.target.value)}
            />
          </div>
        </div>

        <button className="btn-primary-admin" onClick={saveAll} disabled={loading} style={{ padding: '12px 32px' }}>
          {loading ? 'Salvando...' : '💾 Salvar Todas as Configurações'}
        </button>
      </div>
    </>
  );
}
