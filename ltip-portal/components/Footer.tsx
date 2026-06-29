// components/Footer.tsx
import Link from 'next/link';

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          {/* Coluna 1 — Identidade */}
          <div className="footer-col">
            <h4>LTIP</h4>
            <p>Laboratório de Tecnologia da Informação do PROFÁGUA</p>
            <br />
            <p>
              📍 Bloco C, Sala 205<br />
              Campus Universitário<br />
              CEP 69000-000<br />
              Manaus – AM
            </p>
            <br />
            <p>
              📞 (92) 3000-0000<br />
              ✉️ ltip@universidade.edu.br
            </p>
          </div>

          {/* Coluna 2 — Links rápidos */}
          <div className="footer-col">
            <h4>Links Rápidos</h4>
            <ul>
              <li><Link href="/#inventario">→ Inventário de Equipamentos</Link></li>
              <li><Link href="/#agendamento">→ Solicitar Agendamento</Link></li>
              <li><Link href="/documentos">→ Documentos e Relatórios</Link></li>
              <li><Link href="/equipe">→ Equipe do Laboratório</Link></li>
              <li><Link href="/#sobre">→ Missão e Visão</Link></li>
              <li><Link href="/admin">→ Área Restrita</Link></li>
            </ul>
          </div>

          {/* Coluna 3 — Parcerias */}
          <div className="footer-col">
            <h4>Parcerias</h4>
            <p style={{ marginBottom: 14, fontSize: 13 }}>
              Desenvolvido em parceria com instituições de excelência:
            </p>
            <div className="partner-logos">
              {['CNPq', 'FAPEAM', 'CAPES', 'FINEP', 'MCTI'].map((p) => (
                <div key={p} className="partner-logo">{p}</div>
              ))}
            </div>
          </div>

          {/* Coluna 4 — Horário */}
          <div className="footer-col">
            <h4>Horário de Funcionamento</h4>
            <ul>
              <li><a href="#">📅 Segunda a Sexta</a></li>
              <li><a href="#">⏰ 08h00 – 18h00</a></li>
              <li><a href="#">📅 Sábado</a></li>
              <li><a href="#">⏰ 08h00 – 12h00</a></li>
            </ul>
            <br />
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
              *Atendimento fora do horário mediante agendamento prévio
            </p>
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
