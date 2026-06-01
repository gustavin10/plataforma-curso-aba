import { Component, type ChangeEvent, type FormEvent } from 'react';
import { cursos_dados } from '../Cursos';
import { modulos_dados } from '../Modulos';

interface Aula {
  id: number;
  idModulo: number;
  titulo: string;
  tipoConteudo: string;
  urlConteudo: string;
  duracaoMinutos: number;
  ordem: number;
}

interface ModuloSimples {
  id: number;
  idCurso: number;
  titulo: string;
}

interface CursoSimples {
  id: number;
  titulo: string;
}

export const aulas_dados: Aula[] = [
  { id: 1, idModulo: 1, titulo: 'Variáveis e Tipos', tipoConteudo: 'Vídeo', urlConteudo: 'https://exemplo.com/aula1', duracaoMinutos: 15, ordem: 1 },
  { id: 2, idModulo: 1, titulo: 'Operadores', tipoConteudo: 'Vídeo', urlConteudo: 'https://exemplo.com/aula2', duracaoMinutos: 12, ordem: 2 },
];
let proximoId = 3;

const tipos = ['Vídeo', 'Texto', 'Quiz'];

const tipoBadge = (tipo: string) => {
  const map: Record<string, { bg: string; color: string }> = {
    'Vídeo': { bg: '#e8f0fe', color: '#1a56db' },
    'Texto': { bg: '#e6f9f0', color: '#1a7f4b' },
    'Quiz': { bg: '#fff8e6', color: '#b07c00' },
  };
  return map[tipo] ?? { bg: '#f0f0f0', color: '#555' };
};

interface State {
  lista: Aula[];
  modulos: ModuloSimples[];
  cursos: CursoSimples[];
  form: Omit<Aula, 'id'>;
  erro: string;
  editId: number | null;
  filtroModulo: number | '';
}

export class Aulas extends Component<object, State> {
  state: State = {
    lista: [...aulas_dados],
    modulos: [...modulos_dados],
    cursos: [...cursos_dados],
    form: { idModulo: 0, titulo: '', tipoConteudo: 'Vídeo', urlConteudo: '', duracaoMinutos: 0, ordem: 1 },
    erro: '',
    editId: null,
    filtroModulo: '',
  };

  handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const val = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    this.setState({ form: { ...this.state.form, [e.target.name]: val } });
  };

  validar = () => {
    const { idModulo, titulo, urlConteudo } = this.state.form;
    if (!idModulo) return 'Selecione um módulo.';
    if (!titulo.trim()) return 'Título é obrigatório.';
    if (!urlConteudo.trim()) return 'URL do conteúdo é obrigatória.';
    return '';
  };

  handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const erro = this.validar();
    if (erro) return this.setState({ erro });

    if (this.state.editId !== null) {
      const idx = aulas_dados.findIndex((a) => a.id === this.state.editId);
      aulas_dados[idx] = { id: this.state.editId, ...this.state.form };
    } else {
      aulas_dados.push({ id: proximoId++, ...this.state.form });
    }

    this.setState({ lista: [...aulas_dados], form: { idModulo: 0, titulo: '', tipoConteudo: 'Vídeo', urlConteudo: '', duracaoMinutos: 0, ordem: 1 }, erro: '', editId: null });
  };

  editar = (a: Aula) => {
    this.setState({ form: { idModulo: a.idModulo, titulo: a.titulo, tipoConteudo: a.tipoConteudo, urlConteudo: a.urlConteudo, duracaoMinutos: a.duracaoMinutos, ordem: a.ordem }, editId: a.id, erro: '' });
  };

  excluir = (id: number) => {
    const idx = aulas_dados.findIndex((a) => a.id === id);
    aulas_dados.splice(idx, 1);
    this.setState({ lista: [...aulas_dados] });
  };

  cancelar = () => {
    this.setState({ form: { idModulo: 0, titulo: '', tipoConteudo: 'Vídeo', urlConteudo: '', duracaoMinutos: 0, ordem: 1 }, editId: null, erro: '' });
  };

  nomeModulo = (id: number) => {
    const { modulos } = this.state;
    const mod = modulos.find((m) => m.id === id);
    if (!mod) return '-';
    const curso = cursos_dados.find((c) => c.id === mod.idCurso);
    return `${curso?.titulo ?? '?'} › ${mod.titulo}`;
  };

  render() {
    const { form, lista, erro, editId, filtroModulo, modulos } = this.state;
    const listagem = filtroModulo !== '' ? lista.filter((a) => a.idModulo === filtroModulo) : lista;

    return (
      <div>
        <div className="mb-4 d-flex align-items-center gap-2">
          <div className="rounded-3 p-2 d-flex align-items-center justify-content-center" style={{ background: "#fce8ff", width: 42, height: 42 }}>
            <i className="bi bi-play-circle-fill" style={{ fontSize: 20, color: "#c026d3" }}></i>
          </div>
          <div>
            <h4 className="mb-0 fw-bold" style={{ fontSize: 20 }}>Aulas</h4>
            <div className="text-muted" style={{ fontSize: 13 }}>Cadastre aulas vinculadas aos módulos</div>
          </div>
        </div>

        <div className="card mb-4" style={{ border: "1px solid #e8edf5", borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <div className="card-header py-3 px-4" style={{ background: "#f8faff", borderBottom: "1px solid #e8edf5", borderRadius: "12px 12px 0 0" }}>
            <span className="fw-semibold" style={{ fontSize: 14 }}>{editId ? '✏️ Editar Aula' : '➕ Nova Aula'}</span>
          </div>
          <div className="card-body px-4 py-3">
            {erro && <div className="alert alert-danger py-2 mb-3" style={{ fontSize: 13, borderRadius: 8 }}><i className="bi bi-exclamation-circle me-1"></i>{erro}</div>}
            <form onSubmit={this.handleSubmit}>
              <div className="row g-3">
                <div className="col-md-3">
                  <label className="form-label fw-semibold" style={{ fontSize: 12, color: "#666", textTransform: "uppercase", letterSpacing: 0.5 }}>Módulo vinculado</label>
                  <select className="form-select" name="idModulo" value={form.idModulo} onChange={this.handleChange} style={{ borderRadius: 8, fontSize: 13 }}>
                    <option value={0}>Selecione o módulo...</option>
                    {modulos.map((m) => <option key={m.id} value={m.id}>{this.nomeModulo(m.id)}</option>)}
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label fw-semibold" style={{ fontSize: 12, color: "#666", textTransform: "uppercase", letterSpacing: 0.5 }}>Título da aula</label>
                  <input className="form-control" name="titulo" placeholder="Ex: Introdução às variáveis" value={form.titulo} onChange={this.handleChange} style={{ borderRadius: 8, fontSize: 14 }} />
                </div>
                <div className="col-md-2">
                  <label className="form-label fw-semibold" style={{ fontSize: 12, color: "#666", textTransform: "uppercase", letterSpacing: 0.5 }}>Tipo de conteúdo</label>
                  <select className="form-select" name="tipoConteudo" value={form.tipoConteudo} onChange={this.handleChange} style={{ borderRadius: 8, fontSize: 14 }}>
                    {tipos.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="col-md-2">
                  <label className="form-label fw-semibold" style={{ fontSize: 12, color: "#666", textTransform: "uppercase", letterSpacing: 0.5 }}>URL do conteúdo</label>
                  <input className="form-control" name="urlConteudo" placeholder="https://..." value={form.urlConteudo} onChange={this.handleChange} style={{ borderRadius: 8, fontSize: 14 }} />
                </div>
                <div className="col-md-1">
                  <label className="form-label fw-semibold" style={{ fontSize: 12, color: "#666", textTransform: "uppercase", letterSpacing: 0.5 }}>Duração (min)</label>
                  <input className="form-control" name="duracaoMinutos" type="number" placeholder="Ex: 15" min={0} value={form.duracaoMinutos} onChange={this.handleChange} style={{ borderRadius: 8, fontSize: 14 }} />
                </div>
                <div className="col-md-1">
                  <label className="form-label fw-semibold" style={{ fontSize: 12, color: "#666", textTransform: "uppercase", letterSpacing: 0.5 }}>Posição</label>
                  <input className="form-control" name="ordem" type="number" placeholder="Ex: 1" min={1} value={form.ordem} onChange={this.handleChange} style={{ borderRadius: 8, fontSize: 14 }} />
                </div>
                <div className="col-md-12 d-flex gap-2 justify-content-end">
                  <button className="btn btn-sm" type="submit" style={{ background: "#4f9cf9", color: "#fff", borderRadius: 8, fontWeight: 600, border: "none", padding: "8px 20px" }}>{editId ? 'Salvar alterações' : 'Adicionar aula'}</button>
                  {editId && <button className="btn btn-sm btn-outline-secondary" type="button" onClick={this.cancelar} style={{ borderRadius: 8 }}>Cancelar</button>}
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="d-flex align-items-center gap-2 mb-3">
          <label className="mb-0 fw-semibold" style={{ fontSize: 13 }}>Filtrar por módulo:</label>
          <select className="form-select form-select-sm w-auto" value={filtroModulo} onChange={(e) => this.setState({ filtroModulo: e.target.value === '' ? '' : Number(e.target.value) })} style={{ borderRadius: 8, fontSize: 13 }}>
            <option value="">Todos os módulos</option>
            {modulos.map((m) => <option key={m.id} value={m.id}>{this.nomeModulo(m.id)}</option>)}
          </select>
        </div>

        <div style={{ borderRadius: 12, border: "1px solid #e8edf5", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <table className="table table-hover mb-0" style={{ fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#1a1a2e" }}>
                <th style={{ color: "#aab4c8", fontWeight: 500, fontSize: 11, padding: "11px 14px", width: 50 }}>#</th>
                <th style={{ color: "#aab4c8", fontWeight: 500, fontSize: 11, padding: "11px 14px" }}>Módulo</th>
                <th style={{ color: "#aab4c8", fontWeight: 500, fontSize: 11, padding: "11px 14px" }}>Título da aula</th>
                <th style={{ color: "#aab4c8", fontWeight: 500, fontSize: 11, padding: "11px 14px" }}>Tipo</th>
                <th style={{ color: "#aab4c8", fontWeight: 500, fontSize: 11, padding: "11px 14px" }}>Link</th>
                <th style={{ color: "#aab4c8", fontWeight: 500, fontSize: 11, padding: "11px 14px" }}>Duração (min)</th>
                <th style={{ color: "#aab4c8", fontWeight: 500, fontSize: 11, padding: "11px 14px" }}>Posição</th>
                <th style={{ color: "#aab4c8", fontWeight: 500, fontSize: 11, padding: "11px 14px", width: 160 }}></th>
              </tr>
            </thead>
            <tbody>
              {listagem.length === 0 && <tr><td colSpan={8} className="text-center py-4" style={{ color: "#aaa", fontSize: 14 }}><i className="bi bi-inbox me-2"></i>Nenhuma aula cadastrada.</td></tr>}
              {listagem.map((a) => {
                const badge = tipoBadge(a.tipoConteudo);
                return (
                  <tr key={a.id} style={{ borderBottom: "1px solid #f0f4ff" }}>
                    <td style={{ padding: "11px 14px", color: "#999" }}>{a.id}</td>
                    <td style={{ padding: "11px 14px", fontSize: 12, color: "#555" }}>{this.nomeModulo(a.idModulo)}</td>
                    <td style={{ padding: "11px 14px", fontWeight: 500 }}>{a.titulo}</td>
                    <td style={{ padding: "11px 14px" }}><span style={{ background: badge.bg, color: badge.color, fontSize: 11, borderRadius: 6, padding: "2px 8px", fontWeight: 600 }}>{a.tipoConteudo}</span></td>
                    <td style={{ padding: "11px 14px" }}><a href={a.urlConteudo} target="_blank" rel="noreferrer" style={{ color: "#4f9cf9", fontSize: 12 }}><i className="bi bi-box-arrow-up-right me-1"></i>Abrir</a></td>
                    <td style={{ padding: "11px 14px", color: "#555" }}>{a.duracaoMinutos} min</td>
                    <td style={{ padding: "11px 14px" }}><span style={{ background: "#f5f5f5", borderRadius: 6, padding: "2px 10px", fontWeight: 600, fontSize: 13 }}>#{a.ordem}</span></td>
                    <td style={{ padding: "11px 14px" }}>
                      <button className="btn btn-sm me-1" onClick={() => this.editar(a)} style={{ fontSize: 12, borderRadius: 6, border: "1px solid #ddd", background: "#fff", padding: "3px 8px" }}><i className="bi bi-pencil me-1"></i>Editar</button>
                      <button className="btn btn-sm" onClick={() => this.excluir(a.id)} style={{ fontSize: 12, borderRadius: 6, border: "1px solid #ffd0d0", background: "#fff5f5", color: "#e03c3c", padding: "3px 8px" }}><i className="bi bi-trash me-1"></i>Excluir</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}               