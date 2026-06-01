import { Component, type FormEvent } from 'react';
import { usuarios_dados } from '../Usuarios';
import { cursos_dados } from '../Cursos';
import { trilhas_dados } from '../Trilhas';

interface Certificado {
  id: number;
  idUsuario: number;
  idCurso: number | null;
  idTrilha: number | null;
  codigoVerificacao: string;
  dataEmissao: string;
}

const certificados_dados: Certificado[] = [];
let proximoId = 1;

function gerarCodigo() {
  return 'CERT-' + Math.random().toString(36).substring(2, 10).toUpperCase();
}

interface State {
  lista: Certificado[];
  form: { idUsuario: number; idCurso: number | ''; idTrilha: number | '' };
  erro: string;
  visualizado: Certificado | null;
}

export class Certificados extends Component<object, State> {
  state: State = {
    lista: [...certificados_dados],
    form: { idUsuario: 0, idCurso: '', idTrilha: '' },
    erro: '',
    visualizado: null,
  };

  handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const { idUsuario, idCurso, idTrilha } = this.state.form;
    if (!idUsuario) return this.setState({ erro: 'Selecione um usuário.' });
    if (!idCurso && !idTrilha) return this.setState({ erro: 'Selecione um curso ou uma trilha.' });

    const jaExiste = certificados_dados.some(
      (c) => c.idUsuario === idUsuario &&
        (idCurso !== '' ? c.idCurso === Number(idCurso) : c.idTrilha === Number(idTrilha))
    );
    if (jaExiste) return this.setState({ erro: 'Certificado já emitido para este usuário.' });

    const novo: Certificado = {
      id: proximoId++,
      idUsuario,
      idCurso: idCurso !== '' ? Number(idCurso) : null,
      idTrilha: idTrilha !== '' ? Number(idTrilha) : null,
      codigoVerificacao: gerarCodigo(),
      dataEmissao: new Date().toISOString().split('T')[0],
    };
    certificados_dados.push(novo);
    this.setState({ lista: [...certificados_dados], form: { idUsuario: 0, idCurso: '', idTrilha: '' }, erro: '' });
  };

  render() {
    const { lista, form, erro, visualizado } = this.state;

    return (
      <div>
        <div className="mb-4 d-flex align-items-center gap-2">
          <div className="rounded-3 p-2 d-flex align-items-center justify-content-center" style={{ background: "#fefbe6", width: 42, height: 42 }}>
            <i className="bi bi-award-fill" style={{ fontSize: 20, color: "#eab308" }}></i>
          </div>
          <div>
            <h4 className="mb-0 fw-bold" style={{ fontSize: 20 }}>Certificados</h4>
            <div className="text-muted" style={{ fontSize: 13 }}>Emissão e visualização de conclusões</div>
          </div>
        </div>

        <div className="card mb-4" style={{ border: "1px solid #e8edf5", borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <div className="card-header py-3 px-4" style={{ background: "#f8faff", borderBottom: "1px solid #e8edf5", borderRadius: "12px 12px 0 0" }}>
            <span className="fw-semibold" style={{ fontSize: 14 }}>🏅 Emitir Certificado</span>
          </div>
          <div className="card-body px-4 py-3">
            {erro && <div className="alert alert-danger py-2 mb-3" style={{ fontSize: 13, borderRadius: 8 }}><i className="bi bi-exclamation-circle me-1"></i>{erro}</div>}
            <form onSubmit={this.handleSubmit}>
              <div className="row g-3">
                <div className="col-md-3">
                  <label className="form-label fw-semibold" style={{ fontSize: 12, color: "#666", textTransform: "uppercase", letterSpacing: 0.5 }}>Usuário</label>
                  <select className="form-select" value={form.idUsuario} onChange={(e) => this.setState({ form: { ...form, idUsuario: Number(e.target.value) } })} style={{ borderRadius: 8, fontSize: 14 }}>
                    <option value={0}>Selecione o usuário...</option>
                    {usuarios_dados.map((u) => <option key={u.id} value={u.id}>{u.nomeCompleto}</option>)}
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label fw-semibold" style={{ fontSize: 12, color: "#666", textTransform: "uppercase", letterSpacing: 0.5 }}>Curso concluído <span style={{ fontWeight: 400, color: "#aaa" }}>(opcional)</span></label>
                  <select className="form-select" value={form.idCurso} onChange={(e) => this.setState({ form: { ...form, idCurso: e.target.value === '' ? '' : Number(e.target.value), idTrilha: '' } })} style={{ borderRadius: 8, fontSize: 14 }}>
                    <option value="">Selecione um curso...</option>
                    {cursos_dados.map((c) => <option key={c.id} value={c.id}>{c.titulo}</option>)}
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label fw-semibold" style={{ fontSize: 12, color: "#666", textTransform: "uppercase", letterSpacing: 0.5 }}>Trilha concluída <span style={{ fontWeight: 400, color: "#aaa" }}>(opcional)</span></label>
                  <select className="form-select" value={form.idTrilha} onChange={(e) => this.setState({ form: { ...form, idTrilha: e.target.value === '' ? '' : Number(e.target.value), idCurso: '' } })} style={{ borderRadius: 8, fontSize: 14 }}>
                    <option value="">Selecione uma trilha...</option>
                    {trilhas_dados.map((t) => <option key={t.id} value={t.id}>{t.titulo}</option>)}
                  </select>
                </div>
                <div className="col-md-3 d-flex align-items-end">
                  <button className="btn btn-sm w-100" type="submit" style={{ background: "#eab308", color: "#fff", borderRadius: 8, fontWeight: 600, border: "none", padding: "8px 0" }}>
                    <i className="bi bi-award me-1"></i>Emitir certificado
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div style={{ borderRadius: 12, border: "1px solid #e8edf5", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <table className="table table-hover mb-0" style={{ fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#1a1a2e" }}>
                <th style={{ color: "#aab4c8", fontWeight: 500, fontSize: 12, padding: "11px 14px", width: 50 }}>#</th>
                <th style={{ color: "#aab4c8", fontWeight: 500, fontSize: 12, padding: "11px 14px" }}>Usuário</th>
                <th style={{ color: "#aab4c8", fontWeight: 500, fontSize: 12, padding: "11px 14px" }}>Curso / Trilha</th>
                <th style={{ color: "#aab4c8", fontWeight: 500, fontSize: 12, padding: "11px 14px" }}>Código de verificação</th>
                <th style={{ color: "#aab4c8", fontWeight: 500, fontSize: 12, padding: "11px 14px" }}>Data de emissão</th>
                <th style={{ color: "#aab4c8", fontWeight: 500, fontSize: 12, padding: "11px 14px", width: 140 }}></th>
              </tr>
            </thead>
            <tbody>
              {lista.length === 0 && <tr><td colSpan={6} className="text-center py-4" style={{ color: "#aaa", fontSize: 14 }}><i className="bi bi-inbox me-2"></i>Nenhum certificado emitido.</td></tr>}
              {lista.map((c) => {
                const usuario = usuarios_dados.find((u) => u.id === c.idUsuario)?.nomeCompleto ?? '-';
                const referencia = c.idCurso
                  ? `Curso: ${cursos_dados.find((cu) => cu.id === c.idCurso)?.titulo ?? '-'}`
                  : `Trilha: ${trilhas_dados.find((t) => t.id === c.idTrilha)?.titulo ?? '-'}`;
                return (
                  <tr key={c.id} style={{ borderBottom: "1px solid #f0f4ff" }}>
                    <td style={{ padding: "11px 14px", color: "#999" }}>{c.id}</td>
                    <td style={{ padding: "11px 14px", fontWeight: 500 }}>{usuario}</td>
                    <td style={{ padding: "11px 14px", color: "#555", fontSize: 12 }}>{referencia}</td>
                    <td style={{ padding: "11px 14px" }}><code style={{ background: "#f5f5f5", padding: "2px 6px", borderRadius: 4, fontSize: 12 }}>{c.codigoVerificacao}</code></td>
                    <td style={{ padding: "11px 14px", color: "#555" }}>{c.dataEmissao}</td>
                    <td style={{ padding: "11px 14px" }}>
                      <button className="btn btn-sm" onClick={() => this.setState({ visualizado: c })} style={{ fontSize: 12, borderRadius: 6, border: "1px solid #e8edf5", background: "#f8faff", color: "#4f9cf9", padding: "3px 10px", fontWeight: 600 }}>
                        <i className="bi bi-eye me-1"></i>Visualizar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {visualizado && (() => {
          const c = visualizado;
          const usuario = usuarios_dados.find((u) => u.id === c.idUsuario)?.nomeCompleto ?? '-';
          const referencia = c.idCurso
            ? cursos_dados.find((cu) => cu.id === c.idCurso)?.titulo ?? '-'
            : trilhas_dados.find((t) => t.id === c.idTrilha)?.titulo ?? '-';
          return (
            <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.55)' }}>
              <div className="modal-dialog modal-lg">
                <div className="modal-content" style={{ borderRadius: 16, overflow: "hidden", border: "none" }}>
                  <div className="modal-body p-0">
                    <div style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)", padding: "2rem", textAlign: "center" }}>
                      <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, letterSpacing: 4, textTransform: "uppercase", marginBottom: 8 }}>Certificado de Conclusão</div>
                      <div style={{ fontSize: 40 }}>🏅</div>
                    </div>
                    <div style={{ padding: "2.5rem 3rem", textAlign: "center", background: "#fff" }}>
                      <p style={{ color: "#888", fontSize: 14, marginBottom: 8 }}>Este certificado é conferido a</p>
                      <h2 style={{ fontWeight: 700, fontSize: 30, color: "#1a1a2e", marginBottom: 12 }}>{usuario}</h2>
                      <p style={{ color: "#666", fontSize: 15, marginBottom: 6 }}>por ter concluído com êxito</p>
                      <h4 style={{ fontWeight: 600, color: "#4f9cf9", marginBottom: 20 }}>{c.idCurso ? 'o curso' : 'a trilha'}: <em>{referencia}</em></h4>
                      <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ fontSize: 12, color: "#aaa" }}>Emitido em <strong>{c.dataEmissao}</strong></div>
                        <div style={{ fontSize: 12, color: "#aaa" }}>Código: <code style={{ background: "#f5f5f5", padding: "2px 6px", borderRadius: 4 }}>{c.codigoVerificacao}</code></div>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer" style={{ borderTop: "1px solid #f0f0f0" }}>
                    <button className="btn btn-sm" onClick={() => this.setState({ visualizado: null })} style={{ borderRadius: 8, border: "1px solid #ddd", background: "#fff", padding: "6px 20px" }}>Fechar</button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    );
  }
}
