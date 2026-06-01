import { Component, type ChangeEvent, type FormEvent } from 'react';
import { cursos_dados } from '../Cursos';

interface Modulo {
  id: number;
  idCurso: number;
  titulo: string;
  ordem: number;
}

interface CursoSimples {
  id: number;
  titulo: string;
}

export const modulos_dados: Modulo[] = [
  { id: 1, idCurso: 1, titulo: 'Fundamentos', ordem: 1 },
  { id: 2, idCurso: 1, titulo: 'Funções e Escopo', ordem: 2 },
];
let proximoId = 3;

interface State {
  lista: Modulo[];
  cursos: CursoSimples[];
  form: Omit<Modulo, 'id'>;
  erro: string;
  editId: number | null;
  filtroCurso: number | '';
}

export class Modulos extends Component<object, State> {
  state: State = {
    lista: [...modulos_dados],
    cursos: [...cursos_dados],
    form: { idCurso: 0, titulo: '', ordem: 1 },
    erro: '',
    editId: null,
    filtroCurso: '',
  };

  handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const val = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    this.setState({ form: { ...this.state.form, [e.target.name]: val } });
  };

  validar = () => {
    const { idCurso, titulo, ordem } = this.state.form;
    if (!idCurso) return 'Selecione um curso.';
    if (!titulo.trim()) return 'Título é obrigatório.';
    if (ordem < 1) return 'Ordem deve ser maior que zero.';
    return '';
  };

  handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const erro = this.validar();
    if (erro) return this.setState({ erro });

    if (this.state.editId !== null) {
      const idx = modulos_dados.findIndex((m) => m.id === this.state.editId);
      modulos_dados[idx] = { id: this.state.editId, ...this.state.form };
    } else {
      modulos_dados.push({ id: proximoId++, ...this.state.form });
    }

    this.setState({ lista: [...modulos_dados], form: { idCurso: 0, titulo: '', ordem: 1 }, erro: '', editId: null });
  };

  editar = (m: Modulo) => {
    this.setState({ form: { idCurso: m.idCurso, titulo: m.titulo, ordem: m.ordem }, editId: m.id, erro: '' });
  };

  excluir = (id: number) => {
    const idx = modulos_dados.findIndex((m) => m.id === id);
    modulos_dados.splice(idx, 1);
    this.setState({ lista: [...modulos_dados] });
  };

  cancelar = () => {
    this.setState({ form: { idCurso: 0, titulo: '', ordem: 1 }, editId: null, erro: '' });
  };

  render() {
    const { form, lista, erro, editId, filtroCurso, cursos } = this.state;
    const listagem = filtroCurso !== '' ? lista.filter((m) => m.idCurso === filtroCurso) : lista;

    return (
      <div>
        <div className="mb-4 d-flex align-items-center gap-2">
          <div className="rounded-3 p-2 d-flex align-items-center justify-content-center" style={{ background: "#f0e8ff", width: 42, height: 42 }}>
            <i className="bi bi-puzzle-fill" style={{ fontSize: 20, color: "#8b5cf6" }}></i>
          </div>
          <div>
            <h4 className="mb-0 fw-bold" style={{ fontSize: 20 }}>Módulos</h4>
            <div className="text-muted" style={{ fontSize: 13 }}>Organize os módulos por curso</div>
          </div>
        </div>

        <div className="card mb-4" style={{ border: "1px solid #e8edf5", borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <div className="card-header py-3 px-4" style={{ background: "#f8faff", borderBottom: "1px solid #e8edf5", borderRadius: "12px 12px 0 0" }}>
            <span className="fw-semibold" style={{ fontSize: 14 }}>{editId ? '✏️ Editar Módulo' : '➕ Novo Módulo'}</span>
          </div>
          <div className="card-body px-4 py-3">
            {erro && <div className="alert alert-danger py-2 mb-3" style={{ fontSize: 13, borderRadius: 8 }}><i className="bi bi-exclamation-circle me-1"></i>{erro}</div>}
            <form onSubmit={this.handleSubmit}>
              <div className="row g-3 align-items-end">
                <div className="col-md-4">
                  <label className="form-label fw-semibold" style={{ fontSize: 12, color: "#666", textTransform: "uppercase", letterSpacing: 0.5 }}>Curso vinculado</label>
                  <select className="form-select" name="idCurso" value={form.idCurso} onChange={this.handleChange} style={{ borderRadius: 8, fontSize: 14 }}>
                    <option value={0}>Selecione o curso...</option>
                    {cursos.map((c) => <option key={c.id} value={c.id}>{c.titulo}</option>)}
                  </select>
                </div>
                <div className="col-md-5">
                  <label className="form-label fw-semibold" style={{ fontSize: 12, color: "#666", textTransform: "uppercase", letterSpacing: 0.5 }}>Título do módulo</label>
                  <input className="form-control" name="titulo" placeholder="Ex: Introdução ao JavaScript" value={form.titulo} onChange={this.handleChange} style={{ borderRadius: 8, fontSize: 14 }} />
                </div>
                <div className="col-md-2">
                  <label className="form-label fw-semibold" style={{ fontSize: 12, color: "#666", textTransform: "uppercase", letterSpacing: 0.5 }}>Posição na sequência</label>
                  <input className="form-control" name="ordem" type="number" placeholder="Ex: 1" min={1} value={form.ordem} onChange={this.handleChange} style={{ borderRadius: 8, fontSize: 14 }} />
                </div>
                <div className="col-md-1 d-flex gap-1">
                  <button className="btn btn-sm w-100" type="submit" style={{ background: "#4f9cf9", color: "#fff", borderRadius: 8, fontWeight: 600, border: "none", padding: "8px 0" }}>{editId ? 'Salvar' : 'Add'}</button>
                  {editId && <button className="btn btn-sm btn-outline-secondary" type="button" onClick={this.cancelar} style={{ borderRadius: 8 }}>✕</button>}
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="d-flex align-items-center gap-2 mb-3">
          <label className="mb-0 fw-semibold" style={{ fontSize: 13 }}>Filtrar por curso:</label>
          <select className="form-select form-select-sm w-auto" value={filtroCurso} onChange={(e) => this.setState({ filtroCurso: e.target.value === '' ? '' : Number(e.target.value) })} style={{ borderRadius: 8, fontSize: 13 }}>
            <option value="">Todos os cursos</option>
            {cursos.map((c) => <option key={c.id} value={c.id}>{c.titulo}</option>)}
          </select>
        </div>

        <div style={{ borderRadius: 12, border: "1px solid #e8edf5", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <table className="table table-hover mb-0" style={{ fontSize: 14 }}>
            <thead>
              <tr style={{ background: "#1a1a2e" }}>
                <th style={{ color: "#aab4c8", fontWeight: 500, fontSize: 12, padding: "11px 14px", width: 60 }}>#</th>
                <th style={{ color: "#aab4c8", fontWeight: 500, fontSize: 12, padding: "11px 14px" }}>Curso</th>
                <th style={{ color: "#aab4c8", fontWeight: 500, fontSize: 12, padding: "11px 14px" }}>Título do módulo</th>
                <th style={{ color: "#aab4c8", fontWeight: 500, fontSize: 12, padding: "11px 14px" }}>Posição na sequência</th>
                <th style={{ color: "#aab4c8", fontWeight: 500, fontSize: 12, padding: "11px 14px", width: 160 }}></th>
              </tr>
            </thead>
            <tbody>
              {listagem.length === 0 && <tr><td colSpan={5} className="text-center py-4" style={{ color: "#aaa", fontSize: 14 }}><i className="bi bi-inbox me-2"></i>Nenhum módulo cadastrado.</td></tr>}
              {listagem.map((m) => (
                <tr key={m.id} style={{ borderBottom: "1px solid #f0f4ff" }}>
                  <td style={{ padding: "11px 14px", color: "#999" }}>{m.id}</td>
                  <td style={{ padding: "11px 14px" }}><span style={{ background: "#f0e8ff", color: "#8b5cf6", fontSize: 12, borderRadius: 6, padding: "2px 8px", fontWeight: 600 }}>{cursos_dados.find((c) => c.id === m.idCurso)?.titulo ?? '-'}</span></td>
                  <td style={{ padding: "11px 14px", fontWeight: 500 }}>{m.titulo}</td>
                  <td style={{ padding: "11px 14px", color: "#555" }}>
                    <span style={{ background: "#f5f5f5", borderRadius: 6, padding: "2px 10px", fontWeight: 600, fontSize: 13 }}>#{m.ordem}</span>
                  </td>
                  <td style={{ padding: "11px 14px" }}>
                    <button className="btn btn-sm me-1" onClick={() => this.editar(m)} style={{ fontSize: 12, borderRadius: 6, border: "1px solid #ddd", background: "#fff", padding: "3px 8px" }}><i className="bi bi-pencil me-1"></i>Editar</button>
                    <button className="btn btn-sm" onClick={() => this.excluir(m.id)} style={{ fontSize: 12, borderRadius: 6, border: "1px solid #ffd0d0", background: "#fff5f5", color: "#e03c3c", padding: "3px 8px" }}><i className="bi bi-trash me-1"></i>Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}