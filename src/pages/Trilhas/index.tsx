import { Component, type ChangeEvent, type FormEvent } from 'react';
import { categorias_dados, cursos_dados } from '../Cursos';

interface Trilha {
  id: number;
  titulo: string;
  descricao: string;
  idCategoria: number;
}

interface TrilhaCurso {
  idTrilha: number;
  idCurso: number;
  ordem: number;
}

export const trilhas_dados: Trilha[] = [
  { id: 1, titulo: 'Dev Frontend', descricao: 'Do zero ao profissional em front-end', idCategoria: 1 },
];
let proximoId = 2;

const trilhasCursos_dados: TrilhaCurso[] = [];

interface State {
  lista: Trilha[];
  form: Omit<Trilha, 'id'>;
  erro: string;
  editId: number | null;
  trilhaSelecionada: number | '';
  cursoParaAdd: number;
  ordemCurso: number;
  vinculados: TrilhaCurso[];
}

export class Trilhas extends Component<object, State> {
  state: State = {
    lista: [...trilhas_dados],
    form: { titulo: '', descricao: '', idCategoria: 0 },
    erro: '',
    editId: null,
    trilhaSelecionada: '',
    cursoParaAdd: 0,
    ordemCurso: 1,
    vinculados: [...trilhasCursos_dados],
  };

  handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const val = e.target.name === 'idCategoria' ? Number(e.target.value) : e.target.value;
    this.setState({ form: { ...this.state.form, [e.target.name]: val } });
  };

  validar = () => {
    const { titulo, idCategoria } = this.state.form;
    if (!titulo.trim()) return 'Título é obrigatório.';
    if (!idCategoria) return 'Selecione uma categoria.';
    return '';
  };

  handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const erro = this.validar();
    if (erro) return this.setState({ erro });

    if (this.state.editId !== null) {
      const idx = trilhas_dados.findIndex((t) => t.id === this.state.editId);
      trilhas_dados[idx] = { id: this.state.editId, ...this.state.form };
    } else {
      trilhas_dados.push({ id: proximoId++, ...this.state.form });
    }

    this.setState({ lista: [...trilhas_dados], form: { titulo: '', descricao: '', idCategoria: 0 }, erro: '', editId: null });
  };

  editar = (t: Trilha) => {
    this.setState({ form: { titulo: t.titulo, descricao: t.descricao, idCategoria: t.idCategoria }, editId: t.id, erro: '' });
  };

  excluir = (id: number) => {
    const idx = trilhas_dados.findIndex((t) => t.id === id);
    trilhas_dados.splice(idx, 1);
    this.setState({ lista: [...trilhas_dados] });
  };

  cancelar = () => {
    this.setState({ form: { titulo: '', descricao: '', idCategoria: 0 }, editId: null, erro: '' });
  };

  adicionarCurso = () => {
    const { trilhaSelecionada, cursoParaAdd, ordemCurso } = this.state;
    if (!trilhaSelecionada || !cursoParaAdd) return;
    const jaExiste = trilhasCursos_dados.some((tc) => tc.idTrilha === trilhaSelecionada && tc.idCurso === cursoParaAdd);
    if (jaExiste) return;
    trilhasCursos_dados.push({ idTrilha: Number(trilhaSelecionada), idCurso: cursoParaAdd, ordem: ordemCurso });
    this.setState({ vinculados: [...trilhasCursos_dados], cursoParaAdd: 0 });
  };

  removerCurso = (idTrilha: number, idCurso: number) => {
    const idx = trilhasCursos_dados.findIndex((tc) => tc.idTrilha === idTrilha && tc.idCurso === idCurso);
    trilhasCursos_dados.splice(idx, 1);
    this.setState({ vinculados: [...trilhasCursos_dados] });
  };

  render() {
    const { form, lista, erro, editId, trilhaSelecionada, cursoParaAdd, ordemCurso, vinculados } = this.state;
    const cursosDaTrilha = trilhaSelecionada !== '' ? vinculados.filter((tc) => tc.idTrilha === trilhaSelecionada) : [];

    return (
      <div>
        <div className="mb-4 d-flex align-items-center gap-2">
          <div className="rounded-3 p-2 d-flex align-items-center justify-content-center" style={{ background: "#e6f9f0", width: 42, height: 42 }}>
            <i className="bi bi-map-fill" style={{ fontSize: 20, color: "#10b981" }}></i>
          </div>
          <div>
            <h4 className="mb-0 fw-bold" style={{ fontSize: 20 }}>Trilhas de Conhecimento</h4>
            <div className="text-muted" style={{ fontSize: 13 }}>Monte trilhas vinculando cursos em sequência</div>
          </div>
        </div>

        <div className="card mb-4" style={{ border: "1px solid #e8edf5", borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <div className="card-header py-3 px-4" style={{ background: "#f8faff", borderBottom: "1px solid #e8edf5", borderRadius: "12px 12px 0 0" }}>
            <span className="fw-semibold" style={{ fontSize: 14 }}>{editId ? '✏️ Editar Trilha' : '➕ Nova Trilha'}</span>
          </div>
          <div className="card-body px-4 py-3">
            {erro && <div className="alert alert-danger py-2 mb-3" style={{ fontSize: 13, borderRadius: 8 }}><i className="bi bi-exclamation-circle me-1"></i>{erro}</div>}
            <form onSubmit={this.handleSubmit}>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label fw-semibold" style={{ fontSize: 12, color: "#666", textTransform: "uppercase", letterSpacing: 0.5 }}>Título da trilha</label>
                  <input className="form-control" name="titulo" placeholder="Ex: Dev Full Stack" value={form.titulo} onChange={this.handleChange} style={{ borderRadius: 8, fontSize: 14 }} />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold" style={{ fontSize: 12, color: "#666", textTransform: "uppercase", letterSpacing: 0.5 }}>Descrição</label>
                  <input className="form-control" name="descricao" placeholder="Ex: Do zero ao emprego em tecnologia" value={form.descricao} onChange={this.handleChange} style={{ borderRadius: 8, fontSize: 14 }} />
                </div>
                <div className="col-md-2">
                  <label className="form-label fw-semibold" style={{ fontSize: 12, color: "#666", textTransform: "uppercase", letterSpacing: 0.5 }}>Categoria</label>
                  <select className="form-select" name="idCategoria" value={form.idCategoria} onChange={this.handleChange} style={{ borderRadius: 8, fontSize: 14 }}>
                    <option value={0}>Selecione...</option>
                    {categorias_dados.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
                  </select>
                </div>
                <div className="col-md-2 d-flex align-items-end gap-2">
                  <button className="btn btn-sm w-100" type="submit" style={{ background: "#4f9cf9", color: "#fff", borderRadius: 8, fontWeight: 600, border: "none", padding: "8px 0" }}>{editId ? 'Salvar' : 'Adicionar'}</button>
                  {editId && <button className="btn btn-sm btn-outline-secondary" type="button" onClick={this.cancelar} style={{ borderRadius: 8 }}>✕</button>}
                </div>
              </div>
            </form>
          </div>
        </div>

        <div style={{ borderRadius: 12, border: "1px solid #e8edf5", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", marginBottom: 24 }}>
          <table className="table table-hover mb-0" style={{ fontSize: 14 }}>
            <thead>
              <tr style={{ background: "#1a1a2e" }}>
                <th style={{ color: "#aab4c8", fontWeight: 500, fontSize: 12, padding: "11px 14px", width: 60 }}>#</th>
                <th style={{ color: "#aab4c8", fontWeight: 500, fontSize: 12, padding: "11px 14px" }}>Título</th>
                <th style={{ color: "#aab4c8", fontWeight: 500, fontSize: 12, padding: "11px 14px" }}>Categoria</th>
                <th style={{ color: "#aab4c8", fontWeight: 500, fontSize: 12, padding: "11px 14px" }}>Descrição</th>
                <th style={{ color: "#aab4c8", fontWeight: 500, fontSize: 12, padding: "11px 14px", width: 160 }}></th>
              </tr>
            </thead>
            <tbody>
              {lista.length === 0 && <tr><td colSpan={5} className="text-center py-4" style={{ color: "#aaa", fontSize: 14 }}><i className="bi bi-inbox me-2"></i>Nenhuma trilha cadastrada.</td></tr>}
              {lista.map((t) => (
                <tr key={t.id} style={{ borderBottom: "1px solid #f0f4ff" }}>
                  <td style={{ padding: "11px 14px", color: "#999" }}>{t.id}</td>
                  <td style={{ padding: "11px 14px", fontWeight: 500 }}>{t.titulo}</td>
                  <td style={{ padding: "11px 14px" }}><span style={{ background: "#e6f9f0", color: "#10b981", fontSize: 12, borderRadius: 6, padding: "2px 8px", fontWeight: 600 }}>{categorias_dados.find((c) => c.id === t.idCategoria)?.nome ?? '-'}</span></td>
                  <td style={{ padding: "11px 14px", color: "#555" }}>{t.descricao}</td>
                  <td style={{ padding: "11px 14px" }}>
                    <button className="btn btn-sm me-1" onClick={() => this.editar(t)} style={{ fontSize: 12, borderRadius: 6, border: "1px solid #ddd", background: "#fff", padding: "3px 8px" }}><i className="bi bi-pencil me-1"></i>Editar</button>
                    <button className="btn btn-sm" onClick={() => this.excluir(t.id)} style={{ fontSize: 12, borderRadius: 6, border: "1px solid #ffd0d0", background: "#fff5f5", color: "#e03c3c", padding: "3px 8px" }}><i className="bi bi-trash me-1"></i>Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card" style={{ border: "1px solid #e8edf5", borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <div className="card-header py-3 px-4" style={{ background: "#f8faff", borderBottom: "1px solid #e8edf5", borderRadius: "12px 12px 0 0" }}>
            <span className="fw-semibold" style={{ fontSize: 14 }}>🔗 Cursos da Trilha</span>
          </div>
          <div className="card-body px-4 py-3">
            <div className="row g-3 mb-3 align-items-end">
              <div className="col-md-3">
                <label className="form-label fw-semibold" style={{ fontSize: 12, color: "#666", textTransform: "uppercase", letterSpacing: 0.5 }}>Trilha</label>
                <select className="form-select" value={trilhaSelecionada} onChange={(e) => this.setState({ trilhaSelecionada: e.target.value === '' ? '' : Number(e.target.value) })} style={{ borderRadius: 8, fontSize: 14 }}>
                  <option value="">Selecione uma trilha...</option>
                  {lista.map((t) => <option key={t.id} value={t.id}>{t.titulo}</option>)}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label fw-semibold" style={{ fontSize: 12, color: "#666", textTransform: "uppercase", letterSpacing: 0.5 }}>Curso a adicionar</label>
                <select className="form-select" value={cursoParaAdd} onChange={(e) => this.setState({ cursoParaAdd: Number(e.target.value) })} style={{ borderRadius: 8, fontSize: 14 }}>
                  <option value={0}>Selecione um curso...</option>
                  {cursos_dados.map((c) => <option key={c.id} value={c.id}>{c.titulo}</option>)}
                </select>
              </div>
              <div className="col-md-2">
                <label className="form-label fw-semibold" style={{ fontSize: 12, color: "#666", textTransform: "uppercase", letterSpacing: 0.5 }}>Posição na trilha</label>
                <input className="form-control" type="number" min={1} placeholder="Ex: 1" value={ordemCurso} onChange={(e) => this.setState({ ordemCurso: Number(e.target.value) })} style={{ borderRadius: 8, fontSize: 14 }} />
              </div>
              <div className="col-md-3">
                <button className="btn btn-sm w-100" type="button" onClick={this.adicionarCurso} style={{ background: "#10b981", color: "#fff", borderRadius: 8, fontWeight: 600, border: "none", padding: "8px 0" }}>
                  <i className="bi bi-plus-lg me-1"></i>Adicionar curso
                </button>
              </div>
            </div>
            {trilhaSelecionada !== '' && (
              <div style={{ borderRadius: 10, border: "1px solid #e8edf5", overflow: "hidden" }}>
                <table className="table table-sm mb-0" style={{ fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: "#f8faff" }}>
                      <th style={{ padding: "9px 14px", color: "#666", fontSize: 12, fontWeight: 600 }}>Curso</th>
                      <th style={{ padding: "9px 14px", color: "#666", fontSize: 12, fontWeight: 600 }}>Posição na trilha</th>
                      <th style={{ padding: "9px 14px", width: 110 }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cursosDaTrilha.length === 0 && <tr><td colSpan={3} className="text-muted py-3 text-center" style={{ fontSize: 13 }}><i className="bi bi-info-circle me-1"></i>Nenhum curso nesta trilha ainda.</td></tr>}
                    {[...cursosDaTrilha].sort((a, b) => a.ordem - b.ordem).map((tc) => (
                      <tr key={tc.idCurso} style={{ borderBottom: "1px solid #f0f4ff" }}>
                        <td style={{ padding: "10px 14px", fontWeight: 500 }}>{cursos_dados.find((c) => c.id === tc.idCurso)?.titulo ?? '-'}</td>
                        <td style={{ padding: "10px 14px" }}><span style={{ background: "#f5f5f5", borderRadius: 6, padding: "2px 10px", fontWeight: 600 }}>#{tc.ordem}</span></td>
                        <td style={{ padding: "10px 14px" }}>
                          <button className="btn btn-sm" onClick={() => this.removerCurso(tc.idTrilha, tc.idCurso)} style={{ fontSize: 12, borderRadius: 6, border: "1px solid #ffd0d0", background: "#fff5f5", color: "#e03c3c", padding: "3px 8px" }}>Remover</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
