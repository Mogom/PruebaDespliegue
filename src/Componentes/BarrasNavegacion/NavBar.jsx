import { useRef, useEffect, useState } from 'react'
import React from "react"
import { Menu, X } from "lucide-react"
import '../../../public/styles/BarrasNavegacion/NavBar.css'

export const NavBar = () => {

  const [menuAbierto, setMenuAbierto] = useState(false)
  const refNav = useRef(null)

  
   // Función para manejar el scroll a secciones
  const irASeccion = (e, id) => {
    e.preventDefault()
    setMenuAbierto(false)

    if (!id) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
      return
    }

    const elemento = document.getElementById(id)
    if (elemento) {
      const alturaNav = refNav.current?.offsetHeight || 0
      const posicion = elemento.getBoundingClientRect().top + window.scrollY
      window.scrollTo({
        top: posicion - alturaNav,
        behavior: "smooth",
      })
    }
  }

  return (
    // <nav className="nav-container">
    //   <NavLink className="link" to='register'>Registro</NavLink>
    //   <NavLink className="link" to='login'>Login</NavLink>
    //   <NavLink className="link" to='/'>Home</NavLink>
    //   <NavLink className="link" to='pets'>Pets</NavLink>
    //   <NavLink className="link" to='registerM'>Register pets</NavLink>
    // </nav>
    <header className="encabezado" ref={refNav}>
      <div className="contenedor-header">
        <div className="logo-container">
          <img src="https://media.githubusercontent.com/media/Mogom/Imagenes_PetsHeaven/main/Logos/3.png" alt="PetsHeaven Logo" width={50} height={50} className="logo-img" />
        </div>

        {/* Navegación Escritorio */}
        <nav className="nav-escritorio">
          <a href="main" className="enlace-nav" onClick={(e) => irASeccion(e, "")}>
            Inicio
          </a>
          <a href="#nosotros" className="enlace-nav" onClick={(e) => irASeccion(e, "nosotros")}>
            Nosotros
          </a>
          <a href="#servicios" className="enlace-nav" onClick={(e) => irASeccion(e, "servicios")}>
            Servicios
          </a>
          <a href="#promociones" className="enlace-nav" onClick={(e) => irASeccion(e, "promociones")}>
            Promociones
          </a>
          <a href="#testimonios" className="enlace-nav" onClick={(e) => irASeccion(e, "testimonios")}>
            Testimonios
          </a>
          <a href="#contacto" className="enlace-nav" onClick={(e) => irASeccion(e, "contacto")}>
            Contáctanos
          </a>
        </nav>

        {/* Botón Menú Móvil */}
        <div className="contenedor-boton-menu">
          <button
            className="boton-menu"
            onClick={() => setMenuAbierto(!menuAbierto)}
            aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}>
            {menuAbierto ? <X className="icono-menu" /> : <Menu className="icono-menu" />}
          </button>
        </div>

        {/* Botones para escritorio */}
        <div className="botones-escritorio">
          <a href="/user/register" className="boton-registro">
            Registrarse
          </a>
          <a href="/user/login" className="boton-login">Iniciar Sesión</a>
        </div>
      </div>

      {/* Navegación Móvil */}
      <div className={`menu-movil ${menuAbierto ? "activo" : ""}`}>
        <nav className="nav-movil">
          <a href="#" className="enlace-nav-movil" onClick={(e) => irASeccion(e, "")}>
            Inicio
          </a>
          <a href="#nosotros" className="enlace-nav-movil" onClick={(e) => irASeccion(e, "nosotros")}>
            Nosotros
          </a>
          <a href="#servicios" className="enlace-nav-movil" onClick={(e) => irASeccion(e, "servicios")}>
            Servicios
          </a>
          <a href="#promociones" className="enlace-nav-movil" onClick={(e) => irASeccion(e, "promociones")}>
            Promociones
          </a>
          <a href="#testimonios" className="enlace-nav-movil" onClick={(e) => irASeccion(e, "testimonios")}>
            Testimonios
          </a>
          <a href="#contacto" className="enlace-nav-movil" onClick={(e) => irASeccion(e, "contacto")}>
            Contáctanos
          </a>
          {/* Botones para móvil */}
          <div className="botones-movil">
            <a href="/user/register" className="boton-registro-movil">
              Registrarse
            </a>
            <a href='/user/login' className="boton-login-movil">Iniciar Sesión</a>
          </div>
        </nav>
      </div>
    </header>
  )
}