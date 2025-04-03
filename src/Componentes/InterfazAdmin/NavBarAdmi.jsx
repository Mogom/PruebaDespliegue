"use client"

import { useState, useEffect } from "react"
import {
  Settings,
  Users,
  User,
  Stethoscope,
  ChevronDown,
  Syringe,
  Bath,
  Scissors,
  Calendar,
  LogOut,
  Menu,
  X,
} from "lucide-react"
import "./Navbar.css"

const Navbar = () => {
  const [serviciosAbierto, setServiciosAbierto] = useState(false)
  const [agendaAbierta, setAgendaAbierta] = useState(false)
  const [menuUsuarioAbierto, setMenuUsuarioAbierto] = useState(false)
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false)
  const [esMovil, setEsMovil] = useState(false)

  // Detectar si es dispositivo móvil
  useEffect(() => {
    const comprobarTamaño = () => {
      setEsMovil(window.innerWidth <= 768)
    }

    comprobarTamaño()
    window.addEventListener("resize", comprobarTamaño)

    return () => {
      window.removeEventListener("resize", comprobarTamaño)
    }
  }, [])

  const toggleServicios = () => {
    setServiciosAbierto(!serviciosAbierto)
  }

  const toggleAgenda = () => {
    setAgendaAbierta(!agendaAbierta)
  }

  const toggleMenuMovil = () => {
    setMenuMovilAbierto(!menuMovilAbierto)
  }

  return (
    <>
      {/* Botón de menú móvil */}
      <button
        className={`boton-movil-admi ${menuMovilAbierto ? "activo-admi" : ""}`}
        onClick={toggleMenuMovil}
        aria-label="Menú"
      >
        {menuMovilAbierto ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay para cerrar el menú al hacer clic fuera */}
      {menuMovilAbierto && esMovil && <div className="overlay-admi" onClick={toggleMenuMovil}></div>}

      {/* Barra lateral */}
      <aside className={`barra-admi ${menuMovilAbierto ? "visible-admi" : ""}`}>
        <header className="cabecera-admi">
          <img src="/logo.png" alt="Logo" className="logo-admi" />
        </header>

        <nav className="menu-admi">
          <ul className="lista-admi">
            <li className="item-admi">
              <a href="/administracion" className="enlace-admi">
                <Settings className="icono-admi" size={20} />
                <span>Administración</span>
              </a>
            </li>

            <li className="item-admi">
              <a href="/usuarios" className="enlace-admi">
                <Users className="icono-admi" size={20} />
                <span>Usuarios</span>
              </a>
            </li>

            <li className="item-admi">
              <a href="/propietarios" className="enlace-admi">
                <User className="icono-admi" size={20} />
                <span>Propietarios</span>
              </a>
            </li>

            <li className="item-admi submenu-cont-admi">
              <button className="enlace-admi submenu-btn-admi" onClick={toggleServicios}>
                <Stethoscope className="icono-admi" size={20} />
                <span>Servicios</span>
                <ChevronDown className={`flecha-admi ${serviciosAbierto ? "girar-admi" : ""}`} size={16} />
              </button>

              <ul className={`submenu-admi ${serviciosAbierto ? "abierto-admi" : ""}`}>
                <li>
                  <a href="/servicios/vacunas" className="subenlace-admi">
                    <Syringe className="icono-admi" size={16} />
                    <span>Vacunas</span>
                  </a>
                </li>
                <li>
                  <a href="/servicios/bano" className="subenlace-admi">
                    <Bath className="icono-admi" size={16} />
                    <span>Baño</span>
                  </a>
                </li>
                <li>
                  <a href="/servicios/cirugia" className="subenlace-admi">
                    <Scissors className="icono-admi" size={16} />
                    <span>Cirugía</span>
                  </a>
                </li>
              </ul>
            </li>

            <li className="item-admi submenu-cont-admi">
              <button className="enlace-admi submenu-btn-admi" onClick={toggleAgenda}>
                <Calendar className="icono-admi" size={20} />
                <span>Agenda</span>
                <ChevronDown className={`flecha-admi ${agendaAbierta ? "girar-admi" : ""}`} size={16} />
              </button>

              <ul className={`submenu-admi ${agendaAbierta ? "abierto-admi" : ""}`}>
                <li>
                  <a href="/agenda/general" className="subenlace-admi">
                    <span className="subtexto-admi">Agenda General</span>
                  </a>
                </li>
                <li>
                  <a href="/agenda/personal" className="subenlace-admi">
                    <span className="subtexto-admi">Agenda Personal</span>
                  </a>
                </li>
              </ul>
            </li>

            <li className="item-admi">
              <a href="/consultorio" className="enlace-admi">
                <Stethoscope className="icono-admi" size={20} />
                <span>Consultorio</span>
              </a>
            </li>
          </ul>
        </nav>

        <footer
          className="usuario-admi"
          onMouseEnter={() => setMenuUsuarioAbierto(true)}
          onMouseLeave={() => setMenuUsuarioAbierto(false)}
        >
          <img src="/user-avatar.png" alt="Foto de usuario" className="foto-admi" />
          <span className="nombre-admi">Nombre de Usuario</span>

          {menuUsuarioAbierto && (
            <div className="menu-usuario-admi">
              <ul>
                <li>
                  <a href="/perfil" className="opcion-admi">
                    <User className="icono-admi" size={16} />
                    <span>Mi Perfil</span>
                  </a>
                </li>
                <li>
                  <a href="/configuracion" className="opcion-admi">
                    <Settings className="icono-admi" size={16} />
                    <span>Configuración</span>
                  </a>
                </li>
                <li className="divisor-admi"></li>
                <li>
                  <a href="/logout" className="opcion-admi salir-admi">
                    <LogOut className="icono-admi" size={16} />
                    <span>Cerrar Sesión</span>
                  </a>
                </li>
              </ul>
            </div>
          )}
        </footer>
      </aside>

      {/* Contenedor principal para el contenido de la página */}
      <main className="contenido-admi">{/* Aquí iría el contenido de la página */}</main>
    </>
  )
}

export default Navbar

