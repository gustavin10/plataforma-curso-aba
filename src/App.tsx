import { Component } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Trilhas } from "./pages/Trilhas";
import { Cursos } from "./pages/Cursos";
import { Modulos } from "./pages/Modulos";
import { Aulas } from "./pages/Aulas";
import { Usuarios } from "./pages/Usuarios";
import { Assinaturas } from "./pages/Assinaturas";
import { Certificados } from "./pages/Certificados";

export class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Header />
        <div className="container mt-4">
          <Routes>
            <Route path="/sgcursos/trilhas" element={<Trilhas />} />
            <Route path="/sgcursos/cursos" element={<Cursos />} />
            <Route path="/sgcursos/modulos" element={<Modulos />} />
            <Route path="/sgcursos/aulas" element={<Aulas />} />
            <Route path="/sgcursos/usuarios" element={<Usuarios />} />
            <Route path="/sgcursos/assinaturas" element={<Assinaturas />} />
            <Route path="/sgcursos/certificados" element={<Certificados />} />
          </Routes>
        </div>
      </BrowserRouter>
    );
  }
}