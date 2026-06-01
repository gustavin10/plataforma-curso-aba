import { NavLink } from "react-router-dom";

export const Header = () => {
    return (
        <>
            <div className="container-fluid py-2 px-3" style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)" }}>
                <div className="d-flex align-items-center gap-3">
                    <a
                        className="btn btn-sm d-flex align-items-center gap-1"
                        data-bs-toggle="offcanvas"
                        href="#offcanvasMenu"
                        role="button"
                        style={{ color: "#fff", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 8, padding: "6px 12px" }}
                    >
                        <i className="bi bi-list fs-5"></i>
                        <span className="d-none d-md-inline" style={{ fontSize: 13 }}>Menu</span>
                    </a>
                    <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 18 }}>|</span>
                    <span style={{ color: "#fff", fontWeight: 700, fontSize: 18, letterSpacing: 1 }}>GM<span style={{ color: "#4f9cf9" }}>.EDU</span></span>
                </div>

                <div className="offcanvas offcanvas-start" id="offcanvasMenu" style={{ maxWidth: 280 }}>
                    <div className="offcanvas-header" style={{ background: "#1a1a2e", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                        <h5 className="offcanvas-title" style={{ color: "#fff", fontWeight: 700 }}>
                            GM<span style={{ color: "#4f9cf9" }}>.EDU</span>
                        </h5>
                        <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas"></button>
                    </div>
                    <div className="offcanvas-body p-0">
                        <ul className="list-unstyled mb-0">
                            <li>
                                <NavLink className="d-flex align-items-center gap-2 px-4 py-3 text-decoration-none" to="/"
                                    style={({ isActive }) => ({ color: isActive ? "#4f9cf9" : "#444", fontWeight: 500, borderBottom: "1px solid #f0f0f0", fontSize: 15 })}>
                                    <i className="bi bi-house"></i> Home
                                </NavLink>
                            </li>
                            <li>
                                <NavLink className="d-flex align-items-center gap-2 px-4 py-3 text-decoration-none" to="/sgcursos"
                                    style={({ isActive }) => ({ color: isActive ? "#4f9cf9" : "#444", fontWeight: 500, fontSize: 15 })}>
                                    <i className="bi bi-mortarboard"></i> GM Cursos
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <nav className="navbar navbar-expand px-3 py-0" style={{ background: "#fff", borderBottom: "2px solid #f0f4ff", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
                <div className="navbar-nav gap-1 flex-wrap">
                    {[
                        { to: "/sgcursos/trilhas", icon: "bi-map", label: "Trilhas" },
                        { to: "/sgcursos/cursos", icon: "bi-book", label: "Cursos" },
                        { to: "/sgcursos/modulos", icon: "bi-puzzle", label: "Módulos" },
                        { to: "/sgcursos/aulas", icon: "bi-play-circle", label: "Aulas" },
                        { to: "/sgcursos/usuarios", icon: "bi-people", label: "Usuários" },
                        { to: "/sgcursos/assinaturas", icon: "bi-credit-card", label: "Assinaturas" },
                        { to: "/sgcursos/certificados", icon: "bi-award", label: "Certificados" },
                    ].map(({ to, icon, label }) => (
                        <NavLink key={to} to={to}
                            className="nav-link d-flex align-items-center gap-1 px-3 py-3"
                            style={({ isActive }) => ({
                                fontSize: 13.5,
                                fontWeight: isActive ? 600 : 400,
                                color: isActive ? "#4f9cf9" : "#555",
                                borderBottom: isActive ? "2.5px solid #4f9cf9" : "2.5px solid transparent",
                                borderRadius: 0,
                                transition: "all 0.15s",
                            })}
                        >
                            <i className={`bi ${icon}`} style={{ fontSize: 15 }}></i>
                            {label}
                        </NavLink>
                    ))}
                </div>
            </nav>
        </>
    );
};
