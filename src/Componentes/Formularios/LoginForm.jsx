// Librarys 
import React from "react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Link } from 'react-router'

// Imports 
import "../../../public/styles/Formularios/login.css"

// Main component 
export const LoginForm = () => {
  // Vars 
  const [verPassword, setVerPassword] =  useState(false)
  const imagenFondo = "https://media.githubusercontent.com/media/Mogom/Imagenes_PetsHeaven/main/Fondos/fondo.png" 
  const logoUrl = "https://media.githubusercontent.com/media/Mogom/Imagenes_PetsHeaven/main/Logos/1.png"

  // Configuración del formulario
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  })

  // Manejador de envío del formulario
  const onSubmit = (datos) => {
    console.log("Datos de login:", datos)
    alert("Validando datos de inicio de sesión")
  }

  // Función para cambiar la visibilidad de la contraseña
  const cambiarVisibilidadPassword = () => {
    setVerPassword(!verPassword)
  }

  return (
    <div className="login-container">
      <div className="login-formulario-container">
        <div className="contenedor-logo-externo-login">
          <img src={logoUrl || "/placeholder.svg"} alt="Logo PetsHeaven" className="logo-veterinaria-login" />
        </div>

        {/* Contenedor del formulario */}
        <div className="formulario-card-login">
          <div className="contenido-formulario-login">
            <div className="encabezado-formulario-login">
              <h2 className="titulo-formulario-login">Iniciar Sesión</h2>
              <p className="subtitulo-formulario-login">Ingresa tus credenciales para acceder</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="contenido-paso-login">
                <div className="grupo-campo-login">
                  <label>
                    Documento o Email <span className="obligatorio-login">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Número de documento o email"
                    className={errors.docEmail ? "campo-error-login" : ""}
                    {...register("docEmail", {
                      required: "Este campo es obligatorio",
                      minLength: {
                        value: 6,
                        message: "Debe contener al menos 6 caracteres",
                      },
                      maxLength: {
                        value: 100,
                        message: "Debe contener menos de 100 caracteres",
                      },
                    })}
                  />
                  {errors.docEmail && <p className="mensaje-error-login">{errors.docEmail.message}</p>}
                </div>

                <div className="grupo-campo-login">
                  <label>
                    Contraseña <span className="obligatorio-login">*</span>
                  </label>
                  <div className="contenedor-input-password-login">
                    <input
                      type={verPassword ? "text" : "password"}
                      placeholder="Contraseña"
                      className={errors.password ? "campo-error-login" : ""}
                      {...register("password", {
                        required: "Este campo es obligatorio",
                        minLength: {
                          value: 8,
                          message: "La contraseña debe tener al menos 8 caracteres",
                        },
                        maxLength: {
                          value: 100,
                          message: "Debe contener menos de 100 caracteres",
                        },
                      })}
                    />
                    <button type="button" className="boton-toggle-password-login" onClick={cambiarVisibilidadPassword}>
                      {verPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="icono-ojo-login"
                        >
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                          <line x1="1" y1="1" x2="23" y2="23"></line>
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="icono-ojo-login"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.password && <p className="mensaje-error-login">{errors.password.message}</p>}
                </div>

                <button type="submit" className="boton-login">
                  Entrar
                </button>

                <div className="enlaces-container-login">
                  <Link to="/user/recuperar" className="enlace-login">
                    ¿Olvidaste tu contraseña?
                  </Link>
                  <Link to="/user/register" className="enlace-login">
                    ¿No tienes una cuenta?
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Sección derecha - Imagen y cita */}
      <div className="login-imagen-container">
        <div className="imagen-fondo-contenedor-login">
          <img src={imagenFondo || "/placeholder.svg"} alt="Imagen de fondo" className="imagen-fondo-login" />
        </div>
        <div className="overlay-imagen-login"></div>
        <div className="contenedor-cita-login">
          <h2 className="texto-cita-login">"El amor por los animales es el reflejo de nuestra humanidad"</h2>
          <p className="subtexto-cita-login">En PetsHeaven cuidamos de quienes más amas</p>
        </div>
      </div>
    </div>
  )
}


