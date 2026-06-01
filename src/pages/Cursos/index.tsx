import { Component, type ChangeEvent, type FormEvent } from 'react';
import { usuarios_dados } from '../Usuarios';

interface Curso {
  id: number;
  titulo: string;
  descricao: string;
  idInstrutor: number;
  idCategoria: number;
  nivel: string;
  dataPublicacao: string;
  totalAulas: number;
  totalHoras: number;
}

interface Categoria {
  id: number;
  nome: string;
  descricao: string;
}

export const categorias_dados: Categoria[] = [
  { id: 1, nome: 'Programação', descricao: 'Cursos de desenvolvimento de software' },
  { id: 2, nome: 'Design', descricao: 'UI/UX e ferramentas criativas' },
];
let proximoIdCategoria = 3;

export const cursos_dados: Curso[] = [
  { id: 1, titulo: 'JavaScript do Zero', descricao: 'Aprenda JS moderno', idInstrutor: 2, idCategoria: 1, nivel: 'Iniciante', dataPublicacao: '2025-03-01', totalAulas: 20, totalHoras: 10 },
  { id: 2, titulo: 'React Avançado', descricao: 'Hooks, Context e mais', idInstrutor: 2, idCategoria: 1, nivel: 'Avançado', dataPublicacao: '2025-04-01', totalAulas: 35, totalHoras: 18 },
];
let proximoIdCurso = 3;

const niveis = ['Iniciante', 'Intermediário', 'Avançado'];

const nivelBadge = (nivel: string) => {
  const map: Record<string, { bg: string; color: string }> = {
    'Iniciante': { bg: '#e6f9f0', color: '#1a7f4b' },
    'Intermediário': { bg: '#fff8e6', color: '#b07c00' },
    'Avançado': { bg: '#ffe8e8', color: '#c0392b' },
  };
  return map[nivel] ?? { bg: '#f0f0f0', color: '#555' };
};

interface State {
  cursos: Curso[];
  categorias: Categoria[];
  formCurso: Omit<Curso, 'id'>;
  formCategoria: Omit<Categoria, 'id'>;
  erroCurso: string;
  erroCategoria: string;
  editId: number | null;
  filtroCategoria: number | '';
  aba: 'cursos' | 'categorias';
}

export class Cursos extends Component<object, State> {
  state: State = {
    cursos: [...cursos_dados],
    categorias: [...categorias_dados],
    formCurso: { titulo: '', descricao: '', idInstrutor: 0, idCategoria: 0, nivel: 'Iniciante', dataPublicacao: '', totalAulas: 0, totalHoras: 0 },
    formCategoria: { nome: '', descricao: '' },
    erroCurso: '',
    erroCategoria: '',
    editId: null,
    filtroCategoria: '',
    aba: 'cursos',
  };

  handleChangeCurso = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const val = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    this.setState({ formCurso: { ...this.state.formCurso, [e.target.name]: val } });
  };

  handleChangeCategoria = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ formCategoria: { ...this.state.formCategoria, [e.target.name]: e.target.value } });
  };

  validarCurso = () => {
    const { titulo, idInstrutor, idCategoria, nivel, dataPublicacao } = this.state.formCurso;
    if (!titulo.trim()) return 'Título é obrigatório.';
    if (!idInstrutor) return 'Selecione um instrutor.';
    if (!idCategoria) return 'Selecione uma categoria.';
    if (!nivel) return 'Selecione o nível.';
    if (!dataPublicacao) return 'Data de publicação é obrigatória.';
    return '';
  };

  handleSubmitCurso = (e: FormEvent) => {
    e.preventDefault();
    const erro = this.validarCurso();
    if (erro) return this.setState({ erroCurso: erro });

    if (this.state.editId !== null) {
      const idx = cursos_dados.findIndex((c) => c.id === this.state.editId);
      cursos_dados[idx] = { id: this.state.editId, ...this.state.formCurso };
    } else {
      cursos_dados.push({ id: proximoIdCurso++, ...this.state.formCurso });
    }

    this.setState({
      cursos: [...cursos_dados],
      formCurso: { titulo: '', descricao: '', idInstrutor: 0, idCategoria: 0, nivel: 'Iniciante', dataPublicacao: '', totalAulas: 0, totalHoras: 0 },
      erroCurso: '',
      editId: null,
    });
  };

  handleSubmitCategoria = (e: FormEvent) => {
    e.preventDefault();
    const { nome, descricao } = this.state.formCategoria;
    if (!nome.trim()) return this.setState({ erroCategoria: 'Nome é obrigatório.' });
    const duplicado = categorias_dados.some((c) => c.nome.toLowerCase() === nome.toLowerCase());
    if (duplicado) return this.setState({ erroCategoria: 'Já existe uma categoria com este nome.' });

    categorias_dados.push({ id: proximoIdCategoria++, nome, descricao });
    this.setState({ categorias: [...categorias_dados], formCategoria: { nome: '', descricao: '' }, erroCategoria: '' });
  };

  excluirCategoria = (id: number) => {
    const idx = categorias_dados.findIndex((c) => c.id === id);
    categorias_dados.splice(idx, 1);
    this.setState({ categorias: [...categorias_dados] });
  };

  editar = (c: Curso) => {
    this.setState({ formCurso: { titulo: c.titulo, descricao: c.descricao, idInstrutor: c.idInstrutor, idCategoria: c.idCategoria, nivel: c.nivel, dataPublicacao: c.dataPublicacao, totalAulas: c.totalAulas, totalHoras: c.totalHoras }, editId: c.id, erroCurso: '' });
  };

  excluir = (id: number) => {
    const idx = cursos_dados.findIndex((c) => c.id === id);
    cursos_dados.splice(idx, 1);
    this.setState({ cursos: [...cursos_dados] });
  };

  cancelar = () => {
    this.setState({ formCurso: { titulo: '', descricao: '', idInstrutor: 0, idCategoria: 0, nivel: 'Iniciante', dataPublicacao: '', totalAulas: 0, totalHoras: 0 }, editId: null, erroCurso: '' });
  };

  render() {
    const { formCurso, formCategoria, cursos, categorias, erroCurso, erroCategoria, editId, filtroCategoria, aba } = this.state;
    const listagem = filtroCategoria !== '' ? cursos.filter((c) => c.idCategoria === filtroCategoria) : cursos;

    return (
      <div>
        <div className="mb-4 d-flex align-items-center gap-2">
          <div className="rounded-3 p-2 d-flex align-items-center justify-content-center" style={{ background: "#fef3e2", width: 42, height: 42 }}>
            <i className="bi bi-book-fill" style={{ fontSize: 20, color: "#f39c12" }}></i>
          </div>
          <div>
            <h4 className="mb-0 fw-bold" style={{ fontSize: 20 }}>Cursos</h4>
            <div className="text-muted" style={{ fontSize: 13 }}>Gerencie cursos e suas categorias</div>
          </div>
        </div>

        <ul className="nav nav-tabs mb-4" style={{ borderBottom: "2px solid #e8edf5" }}>
          {(['cursos', 'categorias'] as const).map((tab) => (
            <li className="nav-item" key={tab}>
              <button
                className="nav-link"
                onClick={() => this.setState({ aba: tab })}
                style={{
                  fontWeight: aba === tab ? 600 : 400,
                  color: aba === tab ? "#4f9cf9" : "#666",
                  borderBottom: aba === tab ? "2px solid #4f9cf9" : "2px solid transparent",
                  background: "none", border: "none", borderRadius: 0,
                  padding: "10px 18px", fontSize: 14,
                }}
              >
                {tab === 'cursos' ? '📚 Cursos' : '🏷️ Categorias'}
              </button>
            </li>
          ))}
        </ul>

        {aba === 'cursos' && (
          <>
            <div className="card mb-4" style={{ border: "1px solid #e8edf5", borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <div className="card-header py-3 px-4" style={{ background: "#f8faff", borderBottom: "1px solid #e8edf5", borderRadius: "12px 12px 0 0" }}>
                <span className="fw-semibold" style={{ fontSize: 14 }}>{editId ? '✏️ Editar Curso' : '➕ Novo Curso'}</span>
              </div>
              <div className="card-body px-4 py-3">
                {erroCurso && <div className="alert alert-danger py-2 mb-3" style={{ fontSize: 13, borderRadius: 8 }}><i className="bi bi-exclamation-circle me-1"></i>{erroCurso}</div>}
                <form onSubmit={this.handleSubmitCurso}>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="form-label fw-semibold" style={{ fontSize: 12, color: "#666", textTransform: "uppercase", letterSpacing: 0.5 }}>Título do curso</label>
                      <input className="form-control" name="titulo" placeholder="Ex: Python para Iniciantes" value={formCurso.titulo} onChange={this.handleChangeCurso} style={{ borderRadius: 8, fontSize: 14 }} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold" style={{ fontSize: 12, color: "#666", textTransform: "uppercase", letterSpacing: 0.5 }}>Descrição curta</label>
                      <input className="form-control" name="descricao" placeholder="Ex: Aprenda do zero ao avançado" value={formCurso.descricao} onChange={this.handleChangeCurso} style={{ borderRadius: 8, fontSize: 14 }} />
                    </div>
                    <div className="col-md-2">
                      <label className="form-label fw-semibold" style={{ fontSize: 12, color: "#666", textTransform: "uppercase", letterSpacing: 0.5 }}>Instrutor responsável</label>
                      <select className="form-select" name="idInstrutor" value={formCurso.idInstrutor} onChange={this.handleChangeCurso} style={{ borderRadius: 8, fontSize: 14 }}>
                        <option value={0}>Selecione...</option>
                        {usuarios_dados.map((u) => <option key={u.id} value={u.id}>{u.nomeCompleto}</option>)}
                      </select>
                    </div>
                    <div className="col-md-2">
                      <label className="form-label fw-semibold" style={{ fontSize: 12, color: "#666", textTransform: "uppercase", letterSpacing: 0.5 }}>Categoria</label>
                      <select className="form-select" name="idCategoria" value={formCurso.idCategoria} onChange={this.handleChangeCurso} style={{ borderRadius: 8, fontSize: 14 }}>
                        <option value={0}>Selecione...</option>
                        {categorias.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
                      </select>
                    </div>
                    <div className="col-md-2">
                      <label className="form-label fw-semibold" style={{ fontSize: 12, color: "#666", textTransform: "uppercase", letterSpacing: 0.5 }}>Nível de dificuldade</label>
                      <select className="form-select" name="nivel" value={formCurso.nivel} onChange={this.handleChangeCurso} style={{ borderRadius: 8, fontSize: 14 }}>
                        {niveis.map((n) => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                    <div className="col-md-2">
                      <label className="form-label fw-semibold" style={{ fontSize: 12, color: "#666", textTransform: "uppercase", letterSpacing: 0.5 }}>Data de publicação</label>
                      <input className="form-control" name="dataPublicacao" type="date" value={formCurso.dataPublicacao} onChange={this.handleChangeCurso} style={{ borderRadius: 8, fontSize: 14 }} />
                    </div>
                    <div className="col-md-2">
                      <label className="form-label fw-semibold" style={{ fontSize: 12, color: "#666", textTransform: "uppercase", letterSpacing: 0.5 }}>Qtd. de aulas</label>
                      <input className="form-control" name="totalAulas" type="number" placeholder="Ex: 20" min={0} value={formCurso.totalAulas} onChange={this.handleChangeCurso} style={{ borderRadius: 8, fontSize: 14 }} />
                    </div>
                    <div className="col-md-2">
                      <label className="form-label fw-semibold" style={{ fontSize: 12, color: "#666", textTransform: "uppercase", letterSpacing: 0.5 }}>Carga horária (horas)</label>
                      <input className="form-control" name="totalHoras" type="number" placeholder="Ex: 10" min={0} value={formCurso.totalHoras} onChange={this.handleChangeCurso} style={{ borderRadius: 8, fontSize: 14 }} />
                    </div>
                    <div className="col-md-2 d-flex align-items-end gap-2">
                      <button className="btn btn-sm w-100" type="submit" style={{ background: "#4f9cf9", color: "#fff", borderRadius: 8, fontWeight: 600, border: "none", padding: "8px 0" }}>{editId ? 'Salvar' : 'Adicionar'}</button>
                      {editId && <button className="btn btn-sm btn-outline-secondary" type="button" onClick={this.cancelar} style={{ borderRadius: 8 }}>✕</button>}
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <div className="d-flex align-items-center gap-2 mb-3">
              <label className="mb-0 fw-semibold" style={{ fontSize: 13 }}>Filtrar por categoria:</label>
              <select className="form-select form-select-sm w-auto" value={filtroCategoria} onChange={(e) => this.setState({ filtroCategoria: e.target.value === '' ? '' : Number(e.target.value) })} style={{ borderRadius: 8, fontSize: 13 }}>
                <option value="">Todas as categorias</option>
                {categorias.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
            </div>

            <div style={{ borderRadius: 12, border: "1px solid #e8edf5", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <table className="table table-hover mb-0" style={{ fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "#1a1a2e" }}>
                    <th style={{ color: "#aab4c8", fontWeight: 500, fontSize: 11, padding: "11px 14px", width: 50 }}>#</th>
                    <th style={{ color: "#aab4c8", fontWeight: 500, fontSize: 11, padding: "11px 14px" }}>Título</th>
                    <th style={{ color: "#aab4c8", fontWeight: 500, fontSize: 11, padding: "11px 14px" }}>Categoria</th>
                    <th style={{ color: "#aab4c8", fontWeight: 500, fontSize: 11, padding: "11px 14px" }}>Nível</th>
                    <th style={{ color: "#aab4c8", fontWeight: 500, fontSize: 11, padding: "11px 14px" }}>Instrutor</th>
                    <th style={{ color: "#aab4c8", fontWeight: 500, fontSize: 11, padding: "11px 14px" }}>Publicação</th>
                    <th style={{ color: "#aab4c8", fontWeight: 500, fontSize: 11, padding: "11px 14px" }}>Aulas</th>
                    <th style={{ color: "#aab4c8", fontWeight: 500, fontSize: 11, padding: "11px 14px" }}>Horas</th>
                    <th style={{ color: "#aab4c8", fontWeight: 500, fontSize: 11, padding: "11px 14px", width: 140 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {listagem.length === 0 && <tr><td colSpan={9} className="text-center py-4" style={{ color: "#aaa", fontSize: 14 }}><i className="bi bi-inbox me-2"></i>Nenhum curso encontrado.</td></tr>}
                  {listagem.map((c) => {
                    const badge = nivelBadge(c.nivel);
                    return (
                      <tr key={c.id} style={{ borderBottom: "1px solid #f0f4ff" }}>
                        <td style={{ padding: "11px 14px", color: "#999" }}>{c.id}</td>
                        <td style={{ padding: "11px 14px", fontWeight: 500 }}>{c.titulo}</td>
                        <td style={{ padding: "11px 14px" }}><span style={{ background: "#e8f0fe", color: "#4f9cf9", fontSize: 11, borderRadius: 6, padding: "2px 8px", fontWeight: 600 }}>{categorias_dados.find((cat) => cat.id === c.idCategoria)?.nome ?? '-'}</span></td>

                        <td style={{ padding: "11px 14px" }}><span style={{ background: badge.bg, color: badge.color, fontSize: 11, borderRadius: 6, padding: "2px 8px", fontWeight: 600 }}>{c.nivel}</span></td>
                        <td style={{ padding: "11px 14px", color: "#555" }}>{usuarios_dados.find((u) => u.id === c.idInstrutor)?.nomeCompleto ?? '-'}</td>
                        <td style={{ padding: "11px 14px", color: "#555" }}>{c.dataPublicacao}</td>
                        <td style={{ padding: "11px 14px", color: "#555" }}>{c.totalAulas}</td>
                        <td style={{ padding: "11px 14px", color: "#555" }}>{c.totalHoras}h</td>
                        <td style={{ padding: "11px 14px" }}>
                          <button className="btn btn-sm me-1" onClick={() => this.editar(c)} style={{ fontSize: 12, borderRadius: 6, border: "1px solid #ddd", background: "#fff", padding: "3px 8px" }}><i className="bi bi-pencil me-1"></i>Editar</button>
                          <button className="btn btn-sm" onClick={() => this.excluir(c.id)} style={{ fontSize: 12, borderRadius: 6, border: "1px solid #ffd0d0", background: "#fff5f5", color: "#e03c3c", padding: "3px 8px" }}><i className="bi bi-trash me-1"></i>Excluir</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {aba === 'categorias' && (
          <>
            <div className="card mb-4" style={{ border: "1px solid #e8edf5", borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <div className="card-header py-3 px-4" style={{ background: "#f8faff", borderBottom: "1px solid #e8edf5", borderRadius: "12px 12px 0 0" }}>
                <span className="fw-semibold" style={{ fontSize: 14 }}>➕ Nova Categoria</span>
              </div>
              <div className="card-body px-4 py-3">
                {erroCategoria && <div className="alert alert-danger py-2 mb-3" style={{ fontSize: 13, borderRadius: 8 }}><i className="bi bi-exclamation-circle me-1"></i>{erroCategoria}</div>}
                <form onSubmit={this.handleSubmitCategoria}>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="form-label fw-semibold" style={{ fontSize: 12, color: "#666", textTransform: "uppercase", letterSpacing: 0.5 }}>Nome da categoria</label>
                      <input className="form-control" name="nome" placeholder="Ex: Marketing Digital" value={formCategoria.nome} onChange={this.handleChangeCategoria} style={{ borderRadius: 8, fontSize: 14 }} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold" style={{ fontSize: 12, color: "#666", textTransform: "uppercase", letterSpacing: 0.5 }}>Descrição</label>
                      <input className="form-control" name="descricao" placeholder="Ex: Estratégias e ferramentas de marketing" value={formCategoria.descricao} onChange={this.handleChangeCategoria} style={{ borderRadius: 8, fontSize: 14 }} />
                    </div>
                    <div className="col-md-2 d-flex align-items-end">
                      <button className="btn btn-sm w-100" type="submit" style={{ background: "#4f9cf9", color: "#fff", borderRadius: 8, fontWeight: 600, border: "none", padding: "8px 0" }}>Adicionar</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <div style={{ borderRadius: 12, border: "1px solid #e8edf5", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <table className="table table-hover mb-0" style={{ fontSize: 14 }}>
                <thead>
                  <tr style={{ background: "#1a1a2e" }}>
                    <th style={{ color: "#aab4c8", fontWeight: 500, fontSize: 12, padding: "11px 14px", width: 60 }}>#</th>
                    <th style={{ color: "#aab4c8", fontWeight: 500, fontSize: 12, padding: "11px 14px" }}>Nome</th>
                    <th style={{ color: "#aab4c8", fontWeight: 500, fontSize: 12, padding: "11px 14px" }}>Descrição</th>
                    <th style={{ color: "#aab4c8", fontWeight: 500, fontSize: 12, padding: "11px 14px", width: 100 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {categorias.length === 0 && <tr><td colSpan={4} className="text-center py-4" style={{ color: "#aaa" }}><i className="bi bi-inbox me-2"></i>Nenhuma categoria cadastrada.</td></tr>}
                  {categorias.map((c) => (
                    <tr key={c.id} style={{ borderBottom: "1px solid #f0f4ff" }}>
                      <td style={{ padding: "11px 14px", color: "#999" }}>{c.id}</td>
                      <td style={{ padding: "11px 14px", fontWeight: 500 }}>{c.nome}</td>
                      <td style={{ padding: "11px 14px", color: "#555" }}>{c.descricao}</td>
                      <td style={{ padding: "11px 14px" }}>
                        <button className="btn btn-sm" onClick={() => this.excluirCategoria(c.id)} style={{ fontSize: 12, borderRadius: 6, border: "1px solid #ffd0d0", background: "#fff5f5", color: "#e03c3c", padding: "3px 8px" }}><i className="bi bi-trash me-1"></i>Excluir</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    );
  }
}