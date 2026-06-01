import { Component, type ChangeEvent, type FormEvent } from 'react';
import { usuarios_dados } from '../Usuarios';

interface Plano {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  duracaoMeses: number;
}

interface Assinatura {
  id: number;
  idUsuario: number;
  idPlano: number;
  dataInicio: string;
  dataFim: string;
}

interface Pagamento {
  id: number;
  idAssinatura: number;
  valorPago: number;
  dataPagamento: string;
  metodoPagamento: string;
  idTransacaoGateway: string;
}

const planos_dados: Plano[] = [
  { id: 1, nome: 'Básico', descricao: 'Acesso a cursos gratuitos', preco: 0, duracaoMeses: 1 },
  { id: 2, nome: 'Pro', descricao: 'Acesso ilimitado a todos os cursos', preco: 49.90, duracaoMeses: 1 },
  { id: 3, nome: 'Anual', descricao: 'Pro com desconto anual', preco: 399.90, duracaoMeses: 12 },
];

const assinaturas_dados: Assinatura[] = [];
let proximoIdAssinatura = 1;

const pagamentos_dados: Pagamento[] = [];
let proximoIdPagamento = 1;

const metodos = ['Cartão de Crédito', 'PIX', 'Boleto'];

function gerarTransacao() {
  return 'TXN-' + Math.random().toString(36).substring(2, 10).toUpperCase();
}

const metodoBadge = (m: string) => {
  const map: Record<string, { bg: string; color: string }> = {
    'Cartão de Crédito': { bg: '#e8f0fe', color: '#1a56db' },
    'PIX': { bg: '#e6f9f0', color: '#1a7f4b' },
    'Boleto': { bg: '#fff8e6', color: '#b07c00' },
  };
  return map[m] ?? { bg: '#f0f0f0', color: '#555' };
};

interface State {
  assinaturas: Assinatura[];
  pagamentos: Pagamento[];
  formAssinatura: { idUsuario: number; idPlano: number; dataInicio: string };
  formPagamento: { idAssinatura: number; metodoPagamento: string };
  erroA: string;
  erroP: string;
  aba: 'assinaturas' | 'pagamentos';
}

export class Assinaturas extends Component<object, State> {
  state: State = {
    assinaturas: [...assinaturas_dados],
    pagamentos: [...pagamentos_dados],
    formAssinatura: { idUsuario: 0, idPlano: 0, dataInicio: '' },
    formPagamento: { idAssinatura: 0, metodoPagamento: 'Cartão de Crédito' },
    erroA: '',
    erroP: '',
    aba: 'assinaturas',
  };

  handleChangeA = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const val = e.target.name === 'dataInicio' ? e.target.value : Number(e.target.value);
    this.setState({ formAssinatura: { ...this.state.formAssinatura, [e.target.name]: val } });
  };

  handleChangeP = (e: ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.name === 'idAssinatura' ? Number(e.target.value) : e.target.value;
    this.setState({ formPagamento: { ...this.state.formPagamento, [e.target.name]: val } });
  };

  handleSubmitAssinatura = (e: FormEvent) => {
    e.preventDefault();
    const { idUsuario, idPlano, dataInicio } = this.state.formAssinatura;
    if (!idUsuario) return this.setState({ erroA: 'Selecione um usuário.' });
    if (!idPlano) return this.setState({ erroA: 'Selecione um plano.' });
    if (!dataInicio) return this.setState({ erroA: 'Data de início é obrigatória.' });

    const plano = planos_dados.find((p) => p.id === idPlano)!;
    const inicio = new Date(dataInicio);
    const fim = new Date(inicio);
    fim.setMonth(fim.getMonth() + plano.duracaoMeses);

    assinaturas_dados.push({
      id: proximoIdAssinatura++,
      idUsuario,
      idPlano,
      dataInicio,
      dataFim: fim.toISOString().split('T')[0],
    });

    this.setState({ assinaturas: [...assinaturas_dados], formAssinatura: { idUsuario: 0, idPlano: 0, dataInicio: '' }, erroA: '' });
  };

  handleSubmitPagamento = (e: FormEvent) => {
    e.preventDefault();
    const { idAssinatura, metodoPagamento } = this.state.formPagamento;
    if (!idAssinatura) return this.setState({ erroP: 'Selecione uma assinatura.' });

    const assinatura = assinaturas_dados.find((a) => a.id === idAssinatura)!;
    const plano = planos_dados.find((p) => p.id === assinatura.idPlano)!;

    pagamentos_dados.push({
      id: proximoIdPagamento++,
      idAssinatura,
      valorPago: plano.preco,
      dataPagamento: new Date().toISOString().split('T')[0],
      metodoPagamento,
      idTransacaoGateway: gerarTransacao(),
    });

    this.setState({ pagamentos: [...pagamentos_dados], formPagamento: { idAssinatura: 0, metodoPagamento: 'Cartão de Crédito' }, erroP: '' });
  };

  render() {
    const { assinaturas, pagamentos, formAssinatura, formPagamento, erroA, erroP, aba } = this.state;

    return (
      <div>
        <div className="mb-4 d-flex align-items-center gap-2">
          <div className="rounded-3 p-2 d-flex align-items-center justify-content-center" style={{ background: "#fef0e6", width: 42, height: 42 }}>
            <i className="bi bi-credit-card-fill" style={{ fontSize: 20, color: "#f97316" }}></i>
          </div>
          <div>
            <h4 className="mb-0 fw-bold" style={{ fontSize: 20 }}>Assinaturas e Pagamentos</h4>
            <div className="text-muted" style={{ fontSize: 13 }}>Gerencie planos, assinaturas e transações</div>
          </div>
        </div>

        <ul className="nav nav-tabs mb-4" style={{ borderBottom: "2px solid #e8edf5" }}>
          {(['assinaturas', 'pagamentos'] as const).map((tab) => (
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
                {tab === 'assinaturas' ? '📋 Assinaturas' : '💳 Pagamentos'}
              </button>
            </li>
          ))}
        </ul>

        {aba === 'assinaturas' && (
          <>
            <div className="card mb-4" style={{ border: "1px solid #e8edf5", borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <div className="card-header py-3 px-4" style={{ background: "#f8faff", borderBottom: "1px solid #e8edf5", borderRadius: "12px 12px 0 0" }}>
                <span className="fw-semibold" style={{ fontSize: 14 }}>➕ Nova Assinatura</span>
              </div>
              <div className="card-body px-4 py-3">
                {erroA && <div className="alert alert-danger py-2 mb-3" style={{ fontSize: 13, borderRadius: 8 }}><i className="bi bi-exclamation-circle me-1"></i>{erroA}</div>}
                <form onSubmit={this.handleSubmitAssinatura}>
                  <div className="row g-3">
                    <div className="col-md-3">
                      <label className="form-label fw-semibold" style={{ fontSize: 12, color: "#666", textTransform: "uppercase", letterSpacing: 0.5 }}>Usuário</label>
                      <select className="form-select" name="idUsuario" value={formAssinatura.idUsuario} onChange={this.handleChangeA} style={{ borderRadius: 8, fontSize: 14 }}>
                        <option value={0}>Selecione um usuário...</option>
                        {usuarios_dados.map((u) => <option key={u.id} value={u.id}>{u.nomeCompleto}</option>)}
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold" style={{ fontSize: 12, color: "#666", textTransform: "uppercase", letterSpacing: 0.5 }}>Plano</label>
                      <select className="form-select" name="idPlano" value={formAssinatura.idPlano} onChange={this.handleChangeA} style={{ borderRadius: 8, fontSize: 14 }}>
                        <option value={0}>Selecione um plano...</option>
                        {planos_dados.map((p) => <option key={p.id} value={p.id}>{p.nome} — R$ {p.preco.toFixed(2)} / {p.duracaoMeses} mês(es)</option>)}
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label fw-semibold" style={{ fontSize: 12, color: "#666", textTransform: "uppercase", letterSpacing: 0.5 }}>Data de início</label>
                      <input className="form-control" name="dataInicio" type="date" value={formAssinatura.dataInicio} onChange={this.handleChangeA} style={{ borderRadius: 8, fontSize: 14 }} />
                    </div>
                    <div className="col-md-2 d-flex align-items-end">
                      <button className="btn btn-sm w-100" type="submit" style={{ background: "#4f9cf9", color: "#fff", borderRadius: 8, fontWeight: 600, border: "none", padding: "8px 0" }}>Assinar</button>
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
                    <th style={{ color: "#aab4c8", fontWeight: 500, fontSize: 12, padding: "11px 14px" }}>Usuário</th>
                    <th style={{ color: "#aab4c8", fontWeight: 500, fontSize: 12, padding: "11px 14px" }}>Plano</th>
                    <th style={{ color: "#aab4c8", fontWeight: 500, fontSize: 12, padding: "11px 14px" }}>Data de início</th>
                    <th style={{ color: "#aab4c8", fontWeight: 500, fontSize: 12, padding: "11px 14px" }}>Data de término</th>
                  </tr>
                </thead>
                <tbody>
                  {assinaturas.length === 0 && <tr><td colSpan={5} className="text-center py-4" style={{ color: "#aaa", fontSize: 14 }}><i className="bi bi-inbox me-2"></i>Nenhuma assinatura cadastrada.</td></tr>}
                  {assinaturas.map((a) => (
                    <tr key={a.id} style={{ borderBottom: "1px solid #f0f4ff" }}>
                      <td style={{ padding: "11px 14px", color: "#999" }}>{a.id}</td>
                      <td style={{ padding: "11px 14px", fontWeight: 500 }}>{usuarios_dados.find((u) => u.id === a.idUsuario)?.nomeCompleto ?? '-'}</td>
                      <td style={{ padding: "11px 14px" }}><span style={{ background: "#fef0e6", color: "#f97316", fontSize: 12, borderRadius: 6, padding: "2px 8px", fontWeight: 600 }}>{planos_dados.find((p) => p.id === a.idPlano)?.nome ?? '-'}</span></td>
                      <td style={{ padding: "11px 14px", color: "#555" }}>{a.dataInicio}</td>
                      <td style={{ padding: "11px 14px", color: "#555" }}>{a.dataFim}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {aba === 'pagamentos' && (
          <>
            <div className="card mb-4" style={{ border: "1px solid #e8edf5", borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <div className="card-header py-3 px-4" style={{ background: "#f8faff", borderBottom: "1px solid #e8edf5", borderRadius: "12px 12px 0 0" }}>
                <span className="fw-semibold" style={{ fontSize: 14 }}>✅ Registrar Pagamento</span>
              </div>
              <div className="card-body px-4 py-3">
                {erroP && <div className="alert alert-danger py-2 mb-3" style={{ fontSize: 13, borderRadius: 8 }}><i className="bi bi-exclamation-circle me-1"></i>{erroP}</div>}
                <form onSubmit={this.handleSubmitPagamento}>
                  <div className="row g-3">
                    <div className="col-md-5">
                      <label className="form-label fw-semibold" style={{ fontSize: 12, color: "#666", textTransform: "uppercase", letterSpacing: 0.5 }}>Assinatura</label>
                      <select className="form-select" name="idAssinatura" value={formPagamento.idAssinatura} onChange={this.handleChangeP} style={{ borderRadius: 8, fontSize: 14 }}>
                        <option value={0}>Selecione uma assinatura...</option>
                        {assinaturas.map((a) => {
                          const usuario = usuarios_dados.find((u) => u.id === a.idUsuario)?.nomeCompleto ?? '?';
                          const plano = planos_dados.find((p) => p.id === a.idPlano)?.nome ?? '?';
                          return <option key={a.id} value={a.id}>#{a.id} — {usuario} / {plano}</option>;
                        })}
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold" style={{ fontSize: 12, color: "#666", textTransform: "uppercase", letterSpacing: 0.5 }}>Método de pagamento</label>
                      <select className="form-select" name="metodoPagamento" value={formPagamento.metodoPagamento} onChange={this.handleChangeP} style={{ borderRadius: 8, fontSize: 14 }}>
                        {metodos.map((m) => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                    <div className="col-md-3 d-flex align-items-end">
                      <button className="btn btn-sm w-100" type="submit" style={{ background: "#10b981", color: "#fff", borderRadius: 8, fontWeight: 600, border: "none", padding: "8px 0" }}>
                        <i className="bi bi-check-circle me-1"></i>Confirmar pagamento
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
                    <th style={{ color: "#aab4c8", fontWeight: 500, fontSize: 12, padding: "11px 14px" }}>Assinatura</th>
                    <th style={{ color: "#aab4c8", fontWeight: 500, fontSize: 12, padding: "11px 14px" }}>Valor pago</th>
                    <th style={{ color: "#aab4c8", fontWeight: 500, fontSize: 12, padding: "11px 14px" }}>Método</th>
                    <th style={{ color: "#aab4c8", fontWeight: 500, fontSize: 12, padding: "11px 14px" }}>Data do pagamento</th>
                    <th style={{ color: "#aab4c8", fontWeight: 500, fontSize: 12, padding: "11px 14px" }}>Código da transação</th>
                  </tr>
                </thead>
                <tbody>
                  {pagamentos.length === 0 && <tr><td colSpan={6} className="text-center py-4" style={{ color: "#aaa", fontSize: 14 }}><i className="bi bi-inbox me-2"></i>Nenhum pagamento registrado.</td></tr>}
                  {pagamentos.map((pg) => {
                    const badge = metodoBadge(pg.metodoPagamento);
                    return (
                      <tr key={pg.id} style={{ borderBottom: "1px solid #f0f4ff" }}>
                        <td style={{ padding: "11px 14px", color: "#999" }}>{pg.id}</td>
                        <td style={{ padding: "11px 14px", color: "#555" }}>Assinatura #{pg.idAssinatura}</td>
                        <td style={{ padding: "11px 14px", fontWeight: 600, color: "#10b981" }}>R$ {pg.valorPago.toFixed(2)}</td>
                        <td style={{ padding: "11px 14px" }}><span style={{ background: badge.bg, color: badge.color, fontSize: 11, borderRadius: 6, padding: "2px 8px", fontWeight: 600 }}>{pg.metodoPagamento}</span></td>
                        <td style={{ padding: "11px 14px", color: "#555" }}>{pg.dataPagamento}</td>
                        <td style={{ padding: "11px 14px" }}><code style={{ background: "#f5f5f5", padding: "2px 6px", borderRadius: 4, fontSize: 12 }}>{pg.idTransacaoGateway}</code></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    );
  }
}
