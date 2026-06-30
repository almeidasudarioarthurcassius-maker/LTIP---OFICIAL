// components/Footer.tsx
import Link from 'next/link';

type Contato = {
  endereco_linha1?: string; endereco_linha2?: string; cep?: string; cidade?: string;
  telefone?: string; email?: string; horario_semana?: string; horario_sabado?: string; observacao?: string;
};

type Props = {
  contato?: Contato;
  parcerias?: string[];
};

const CONTATO_PADRAO: Contato = {
  endereco_linha1: 'Bloco C, Sala 205',
  endereco_linha2: 'Campus Universitário',
  cep: '69000-000',
  cidade: 'Manaus – AM',
  telefone: '(92) 3000-0000',
  email: 'ltip@universidade.edu.br',
  horario_semana: '08h00 – 18h00',
  horario_sabado: '08h00 – 12h00',
  observacao: 'Atendimento fora do horário mediante agendamento prévio',
};

export default function Footer({ contato, parcerias }: Props) {
  const c = { ...CONTATO_PADRAO, ...(contato ?? {}) };
  const parceiros = parcerias && parcerias.length > 0 ? parcerias : ['CNPq', 'FAPEAM', 'CAPES', 'FINEP', 'MCTI'];

  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <h4>LTIP</h4>
            <p>Laboratório de Tecnologia da Informação do PROFÁGUA</p>
            <br />
            <p>
              📍 {c.endereco_linha1}<br />
              {c.endereco_linha2}<br />
              CEP {c.cep}<br />
              {c.cidade}
            </p>
            <br />
            <p>
              📞 {c.telefone}<br />
              ✉️ {c.email}
            </p>
          </div>

          <div className="footer-col">
            <h4>Links Rápidos</h4>
            <ul>
              <li><Link href="/#inventario">→ Inventário de Equipamentos</Link></li>
              <li><Link href="/#agendamento">→ Solicitar Agendamento</Link></li>
              <li><Link href="/documentos">→ Documentos e Relatórios</Link></li>
              <li><Link href="/equipe">→ Equipe do Laboratório</Link></li>
              <li><Link href="/#sobre">→ Missão e Visão</Link></li>
              <li><Link href="/admin/login">→ Área Restrita</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Parcerias</h4>
            <p style={{ marginBottom: 14, fontSize: 13 }}>
              Desenvolvido em parceria com instituições de excelência:
            </p>
            <div className="partner-logos">
              {parceiros.map((p) => (
                <div key={p} className="partner-logo">{p}</div>
              ))}
            </div>
          </div>

          <div className="footer-col">
            <h4>Horário de Funcionamento</h4>
            <ul>
              <li><a href="#">📅 Segunda a Sexta</a></li>
              <li><a href="#">⏰ {c.horario_semana}</a></li>
              <li><a href="#">📅 Sábado</a></li>
              <li><a href="#">⏰ {c.horario_sabado}</a></li>
            </ul>
            <br />
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>*{c.observacao}</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} LTIP — Laboratório de Tecnologia da Informação do PROFÁGUA. Todos os direitos reservados.</p>
          <p>Desenvolvido com Next.js + Supabase</p>
        </div>
      </div>
    </footer>
  );
}
