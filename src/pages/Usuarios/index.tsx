import { Component, type ChangeEvent, type FormEvent } from 'react';

interface Usuario {
  id: number;
  nomeCompleto: string;
  email: string;
  senhaHash: string;
  dataCadastro: string;
}

const usuarios: Usuario[] = [
  { id: 1, nomeCompleto: 'Ana Souza', email: 'ana@email.com', senhaHash: '1234', dataCadastro: '2025-01-10' },
  { id: 2, nomeCompleto: 'Carlos Lima', email: 'carlos@email.com', senhaHash: '1234', dataCadastro: '2025-02-05' },
];
let proximoId = 3;

interface State {
  lista: Usuario[];
  form: Omit<Usuario, 'id'>;
  erro: string;
  editId: number | null;
}

export class Usuarios extends Component<object, State> {
  state: State = {
    lista: [...usuarios],
    form: { nomeCompleto: '', email: '', senhaHash: '', dataCadastro: '' },
    erro: '',
    editId: null,
  };

  handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ form: { ...this.state.form, [e.target.name]: e.target.value } });
  };

  validar = () => {
    const { nomeCompleto, email, senhaHash, dataCadastro } = this.state.form;
    if (!nomeCompleto.trim()) return 'Nome completo é obrigatório.';
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'E-mail inválido.';
    if (!senhaHash.trim() || senhaHash.length < 4) return 'Senha deve ter ao menos 4 caracteres.';
    if (!dataCadastro) return 'Data de cadastro é obrigatória.';
    const duplicado = usuarios.some((u) => u.email === email && u.id !== this.state.editId);
    if (duplicado) return 'Já existe um usuário com este e-mail.';
    return '';
  };

  handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const erro = this.validar();
    if (erro) return this.setState({ erro });

    if (this.state.editId !== null) {
      const idx = usuarios.findIndex((u) => u.id === this.state.editId);
      usuarios[idx] = { id: this.state.editId, ...this.state.form };
    } else {
      usuarios.push({ id: proximoId++, ...this.state.form });
    }

    this.setState({
      lista: [...usuarios],
      form: { nomeCompleto: '', email: '', senhaHash: '', dataCadastro: '' },
      erro: '',
      editId: null,
    });
  };

  editar = (u: Usuario) => {
    this.setState({ form: { nomeCompleto: u.nomeCompleto, email: u.email, senhaHash: u.senhaHash, dataCadastro: u.dataCadastro }, editId: u.id, erro: '' });
  };

  excluir = (id: number) => {
    const idx = usuarios.findIndex((u) => u.id === id);
    usuarios.splice(idx, 1);
    this.setState({ lista: [...usuarios] });
  };

  cancelar = () => {
    this.setState({ form: { nomeCompleto: '', email: '', senhaHash: '', dataCadastro: '' }, editId: null, erro: '' });
  };

  render() {
    const { form, lista, erro, editId } = this.state;
    return (
      <div>
        <div className="mb-4 d-flex align-items-center gap-2">
          <div className="rounded-3 p-2 d-flex align-items-center justify-content-center" style={{ background: "#e8f0fe", width: 42, height: 42 }}>
            <i className="bi bi-people-fill" style={{ fontSize: 20, color: "#4f9cf9" }}></i>
          </div>
          <div>
            <h4 className="mb-0 fw-bold" style={{ fontSize: 20 }}>Usuários</h4>
            <div className="text-muted" style={{ fontSize: 13 }}>Cadastro e gerenciamento de contas</div>
          </div>
        </div>

        <div className="card mb-4" style={{ border: "1px solid #e8edf5", borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <div className="card-header py-3 px-4" style={{ background: "#f8faff", borderBottom: "1px solid #e8edf5", borderRadius: "12px 12px 0 0" }}>
            <span className="fw-semibold" style={{ fontSize: 14 }}>{editId ? '✏️ Editar Usuário' : '➕ Novo Usuário'}</span>
          </div>
          <div className="card-body px-4 py-3">
            {erro && <div className="alert alert-danger py-2 mb-3" style={{ fontSize: 13, borderRadius: 8 }}><i className="bi bi-exclamation-circle me-1"></i>{erro}</div>}
            <form onSubmit={this.handleSubmit}>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label fw-semibold" style={{ fontSize: 12, color: "#666", textTransform: "uppercase", letterSpacing: 0.5 }}>Nome completo</label>
                  <input className="form-control" name="nomeCompleto" placeholder="Ex: João da Silva" value={form.nomeCompleto} onChange={this.handleChange} style={{ borderRadius: 8, fontSize: 14 }} />
                </div>
                <div className="col-md-3">
                  <label className="form-label fw-semibold" style={{ fontSize: 12, color: "#666", textTransform: "uppercase", letterSpacing: 0.5 }}>E-mail</label>
                  <input className="form-control" name="email" placeholder="usuario@email.com" value={form.email} onChange={this.handleChange} style={{ borderRadius: 8, fontSize: 14 }} />
                </div>
                <div className="col-md-2">
                  <label className="form-label fw-semibold" style={{ fontSize: 12, color: "#666", textTransform: "uppercase", letterSpacing: 0.5 }}>Senha</label>
                  <input className="form-control" name="senhaHash" type="password" placeholder="Mínimo 4 caracteres" value={form.senhaHash} onChange={this.handleChange} style={{ borderRadius: 8, fontSize: 14 }} />
                </div>
                <div className="col-md-2">
                  <label className="form-label fw-semibold" style={{ fontSize: 12, color: "#666", textTransform: "uppercase", letterSpacing: 0.5 }}>Data de cadastro</label>
                  <input className="form-control" name="dataCadastro" type="date" value={form.dataCadastro} onChange={this.handleChange} style={{ borderRadius: 8, fontSize: 14 }} />
                </div>
                <div className="col-md-1 d-flex align-items-end gap-1">
                  <button className="btn btn-sm w-100" type="submit" style={{ background: "#4f9cf9", color: "#fff", borderRadius: 8, fontWeight: 600, border: "none", padding: "8px 0" }}>{editId ? 'Salvar' : 'Add'}</button>
                  {editId && <button className="btn btn-sm btn-outline-secondary" type="button" onClick={this.cancelar} style={{ borderRadius: 8 }}>✕</button>}
                </div>
              </div>
            </form>
          </div>
        </div>

        <div style={{ borderRadius: 12, border: "1px solid #e8edf5", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <table className="table table-hover mb-0" style={{ fontSize: 14 }}>
            <thead>
              <tr style={{ background: "#1a1a2e" }}>
                <th style={{ color: "#aab4c8", fontWeight: 500, fontSize: 12, padding: "12px 16px", width: 60 }}>#</th>
                <th style={{ color: "#aab4c8", fontWeight: 500, fontSize: 12, padding: "12px 16px" }}>Nome</th>
                <th style={{ color: "#aab4c8", fontWeight: 500, fontSize: 12, padding: "12px 16px" }}>E-mail</th>
                <th style={{ color: "#aab4c8", fontWeight: 500, fontSize: 12, padding: "12px 16px" }}>Data de cadastro</th>
                <th style={{ color: "#aab4c8", fontWeight: 500, fontSize: 12, padding: "12px 16px", width: 160 }}></th>
              </tr>
            </thead>
            <tbody>
              {lista.length === 0 && (
                <tr><td colSpan={5} className="text-center py-4" style={{ color: "#aaa", fontSize: 14 }}>
                  <i className="bi bi-inbox me-2"></i>Nenhum usuário cadastrado.
                </td></tr>
              )}
              {lista.map((u) => (
                <tr key={u.id} style={{ borderBottom: "1px solid #f0f4ff" }}>
                  <td style={{ padding: "12px 16px", color: "#999" }}>{u.id}</td>
                  <td style={{ padding: "12px 16px", fontWeight: 500 }}>
                    <div className="d-flex align-items-center gap-2">
                      <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#e8f0fe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#4f9cf9" }}>
                        {u.nomeCompleto.charAt(0)}
                      </div>
                      {u.nomeCompleto}
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", color: "#555" }}>{u.email}</td>
                  <td style={{ padding: "12px 16px", color: "#555" }}>{u.dataCadastro}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <button className="btn btn-sm me-1" onClick={() => this.editar(u)} style={{ fontSize: 12, borderRadius: 6, border: "1px solid #ddd", background: "#fff", padding: "4px 10px" }}>
                      <i className="bi bi-pencil me-1"></i>Editar
                    </button>
                    <button className="btn btn-sm" onClick={() => this.excluir(u.id)} style={{ fontSize: 12, borderRadius: 6, border: "1px solid #ffd0d0", background: "#fff5f5", color: "#e03c3c", padding: "4px 10px" }}>
                      <i className="bi bi-trash me-1"></i>Excluir
                    </button>
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

export const usuarios_dados = usuarios;
