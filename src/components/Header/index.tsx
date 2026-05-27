import { NavLink } from "react-router-dom";

export const Header = () => {
    return (
        <>
            <div className="container-fluid bg-dark">
                <a className="btn btn-dark" data-bs-toggle="offcanvas" href="#offcanvasMenu" role="button">
                    <i className="bi bi-list text-white"></i>
                </a>

                <div className="offcanvas offcanvas-start" id="offcanvasMenu">
                    <div className="offcanvas-header">
                        <h5 className="offcanvas-title">DevTech.EDU</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="offcanvas"></button>
                    </div>
                    <div className="offcanvas-body">
                        <ul className="list-unstyled">
                            <li><NavLink className="nav-link" to="/">Home</NavLink></li>
                            <li><NavLink className="nav-link" to="/sgcursos">Milhomem Cursos</NavLink></li>
                        </ul>
                    </div>
                </div>
            </div>

            <nav className="navbar navbar-expand bg-white border-bottom px-3">
                <span className="navbar-brand fw-bold">SG Cursos</span>
                <div className="navbar-nav">
                    <NavLink className="nav-link" to="/sgcursos/trilhas">Trilhas</NavLink>
                    <NavLink className="nav-link" to="/sgcursos/cursos">Cursos</NavLink>
                    <NavLink className="nav-link" to="/sgcursos/modulos">Módulos</NavLink>
                    <NavLink className="nav-link" to="/sgcursos/aulas">Aulas</NavLink>
                    <NavLink className="nav-link" to="/sgcursos/usuarios">Usuários</NavLink>
                    <NavLink className="nav-link" to="/sgcursos/assinaturas">Assinaturas</NavLink>
                    <NavLink className="nav-link" to="/sgcursos/certificados">Certificados</NavLink>
                </div>
            </nav>
        </>
    );
};