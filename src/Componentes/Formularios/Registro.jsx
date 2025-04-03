import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import emailjs from "emailjs-com";
import { Link } from "react-router"
import "../../../public/styles/Formularios/Registro.css";


const Registro = () => {
  const imagenFondo = "https://media.githubusercontent.com/media/Mogom/Imagenes_PetsHeaven/main/Fondos/fondo.png";
  const logoUrl = "https://media.githubusercontent.com/media/Mogom/Imagenes_PetsHeaven/main/Logos/1.png";

  // Datos que entran del formulario de registro
  const [formData, setFormData] = useState({
    // Paso 1
    tipoDocumento: "",
    numeroDocumento: "",
    nombres: "",
    apellidos: "",
    fechaNacimiento: "",
    genero: "",
    telefono: "",
    direccion: "",
    // Paso 2
    email: "",
    confirmEmail: "",
    password: "",
    confirmPassword: "",
    terminos: false,
    // Verificación
    codigoVerificacion: "",
    codigoIngresado: ["", "", "", "", "", ""]
  });
  
  // Estados de UI
  const [paso, setPaso] = useState(1);
  const [verPassword, setVerPassword] = useState(false);
  const [verConfirmarPassword, setVerConfirmarPassword] = useState(false);
  const [mostrarRequisitosPassword, setMostrarRequisitosPassword] = useState(false);
  const [mostrarRequisitosFecha, setMostrarRequisitosFecha] = useState(false);
  const [errorCodigo, setErrorCodigo] = useState(false);
  const [tiempoRestante, setTiempoRestante] = useState(300);
  const [timerActivo, setTimerActivo] = useState(false);
  const [status, setStatus] = useState("");

  
  // Configuración de react-hook-form
  const {
      register,
      handleSubmit,
      watch,
      formState: { errors },
      trigger,
      setValue,
      getValues
    } = useForm({ mode: "onChange",
        defaultValues: formData
     });
    const password = watch("password");

  // Efectos
  useEffect(() => {
    const subscription = watch((values) => {
      setFormData(prev => ({
        ...prev,
        ...values,
        codigoVerificacion: prev.codigoVerificacion,
        codigoIngresado: prev.codigoIngresado
      }));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    let intervalo = null;
    if (timerActivo && tiempoRestante > 0) {
      intervalo = setInterval(() => {
        setTiempoRestante((prev) => prev - 1);
      }, 1000);
    } else if (tiempoRestante === 0) {
      setTimerActivo(false);
      if (paso === 3) generarCodigoVerificacion();
    }
    return () => clearInterval(intervalo);
  }, [timerActivo, tiempoRestante, paso]);

  // Funciones principales
  const onSubmit = async (data) => {
    if (paso === 1) {
      const isValid = await trigger([
        "tipoDocumento", 
        "numeroDocumento",
        "nombres",
        "apellidos",
        "fechaNacimiento",
        "genero",
        "telefono",
        "direccion"
      ]);
      
      if (isValid) {
        setPaso(2);
      }
    } 
    else if (paso === 2) {
      const isValid = await trigger([
        "email",
        "confirmEmail",
        "password",
        "confirmPassword",
        "terminos"
      ]);
  
      if (isValid) {
        const codigo = generarCodigoVerificacion();
        enviarEmail(codigo);
        setPaso(3);
        setTiempoRestante(300);
        setTimerActivo(true);
      }
    }
  };

  const generarCodigoVerificacion = () => {
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    setFormData(prev => ({
      ...prev,
      codigoVerificacion: codigo,
      codigoIngresado: ["", "", "", "", "", ""]
    }));

    setValue("codigoVerificacion", codigo);
    setValue("codigoIngresado", ["", "", "", "", "", ""]);

    setErrorCodigo(false);
    return(codigo);
  };

  const enviarEmail = (codigo) => {
    console.log(formData)
    const Params = {
      name: formData.nombres,
      email: formData.confirmEmail,
      codigoVerificacion: codigo
    };
    console.log("Datos a enviar:", Params);

    // emailjs.send(
    //   "service_uxyihs4",
    //   "template_qro23i8",
    //   Params,
    //   "c_HuA2dqs1UP1L1J0"
    // ).then(
    //   (result) => {
    //     setStatus("Mensaje enviado con éxito!");
    //     console.log("Email enviado correctamente");
    //   },
    //   (error) => {
    //     setStatus("Hubo un error. Intenta de nuevo.");
    //     console.error("Error al enviar email:", error);
    //   }
    // );
  };

  // Funciones auxiliares
  const manejarCambioCodigo = (indice, valor) => {
    if (!/^\d*$/.test(valor)) return;
    
    const nuevoCodigo = [...formData.codigoIngresado];
    nuevoCodigo[indice] = valor;
    
    setFormData(prev => ({ ...prev, codigoIngresado: nuevoCodigo }));
    setValue("codigoIngresado", nuevoCodigo);
    
    if (valor !== "" && indice < 5) {
      const siguienteInput = document.getElementById(`codigo-input-${indice + 1}`);
      if (siguienteInput) siguienteInput.focus();
    }
  };

  const manejarPegadoCodigo = (e) => {
    e.preventDefault();
    const datoPegado = e.clipboardData.getData("text");
    if (/^\d{6}$/.test(datoPegado)) {
      setFormData(prev => ({ ...prev, codigoIngresado: datoPegado.split("") }));
      document.getElementById("codigo-input-5")?.focus();
    }
  };

  const verificarCodigo = () => {
    const codigoInput = formData.codigoIngresado.join("");
    if (codigoInput === formData.codigoVerificacion) {
      alert("¡Verificación exitosa!");
      console.log("Datos del usuario a guardar:", {
        ...formData,
        codigoVerificacion: undefined,
        codigoIngresado: undefined
      });
      // fetch para guardar los datos aqui proximamente solo en cines tambien en 3d
      setPaso(1);
    } else {
      setErrorCodigo(true);
    }
  };

  const reenviarCodigo = () => {
    generarCodigoVerificacion();
    setTiempoRestante(300);
    setTimerActivo(true);
    alert(`Nuevo código enviado a ${formData.email}`);
  };

  const retrocederPaso = () => setPaso(paso === 3 ? 2 : 1);

  // Funciones de UI
  const cambiarVisibilidadPassword = () => setVerPassword(!verPassword);
  const cambiarVisibilidadConfirmarPassword = () => setVerConfirmarPassword(!verConfirmarPassword);
  const mostrarRequisitosPasswordAlFocus = () => setMostrarRequisitosPassword(true);
  const ocultarRequisitosPasswordAlBlur = () => setMostrarRequisitosPassword(false);
  const mostrarRequisitosFechaAlFocus = () => setMostrarRequisitosFecha(true);
  const ocultarRequisitosFechaAlBlur = () => setMostrarRequisitosFecha(false);

  // Funciones de validación
  const permitirSoloNumeros = (e) => {
    const charCode = e.which || e.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) e.preventDefault();
  };

  const permitirSoloLetras = (e) => {
    const charCode = e.which || e.keyCode;
    if (!(charCode >= 65 && charCode <= 90) &&
        !(charCode >= 97 && charCode <= 122) &&
        !(charCode === 32) &&
        !(charCode >= 192 && charCode <= 255)) {
      e.preventDefault();
    }
  };

  const evitarPegado = (e) => e.preventDefault();

  // Formatear el tiempo restante
  const formatearTiempo = (segundos) => {
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${minutos}:${segs < 10 ? "0" : ""}${segs}`;
  };

  return (
    <div className="registro-container">
      {/* Sección izquierda - Imagen y cita */}
      <div className="registro-imagen-container">
        <div className="imagen-fondo-contenedor">
          <img src={imagenFondo || "/placeholder.svg"} alt="Imagen de fondo" className="imagen-fondo" />
        </div>
        <div className="overlay-imagen"></div>
        <div className="contenedor-cita">
          <h2 className="texto-cita">"El amor por los animales es el reflejo de nuestra humanidad"</h2>
          <p className="subtexto-cita">En PetsHeaven cuidamos de quienes más amas</p>
        </div>
      </div>

      {/* Sección derecha - Formulario de registro */}
      <div className="registro-formulario-container">
        <div className="contenedor-logo-externo">
          <a href="/" className="cursor-pointer">
            <img src={logoUrl || "/placeholder.svg"} alt="Logo PetsHeaven" className="logo-veterinaria" />
          </a>
        </div>

        <div className="formulario-card">
          <div className="contenido-formulario">
            <div className="encabezado-formulario">
              <h2 className="titulo-formulario">Registrarse</h2>

              <div className="indicadores-paso">
                <div className={`paso ${paso >= 1 ? "activo" : ""}`}>1</div>
                <div className="linea"></div>
                <div className={`paso ${paso >= 2 ? "activo" : ""}`}>2</div>
                <div className="linea"></div>
                <div className={`paso ${paso >= 3 ? "activo" : ""}`}>3</div>
              </div>

              <p className="subtitulo-formulario">
                {paso === 1 ? "Información Personal" : paso === 2 ? "Datos de Acceso" : "Verificación de Correo"}
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Paso 1: Información Personal */}
              <div className={`contenido-paso ${paso === 1 ? '' : 'paso-oculto'}`}>
                <div className="grid-campos">
                <div className="grupo-campo">
                      <label>
                        Tipo de documento <span className="obligatorio">*</span>
                      </label>
                      <select
                        name="tipoDocumento"
                        className={errors.tipoDocumento ? "campo-error" : ""}
                        {...register("tipoDocumento", {
                          required: true,
                        })}
                      >
                        <option value="" disabled selected>
                          Seleccione...
                        </option>
                        <option value="CC">Cédula de Ciudadanía (CC)</option>
                        <option value="CE">Cédula de Extranjería (CE)</option>
                        <option value="PAS">Pasaporte</option>
                      </select>
                      {errors.tipoDocumento && (
                        <p className="mensaje-error">Debes seleccionar un tipo de documento</p>
                      )}
                    </div>

                    <div className="grupo-campo">
                      <label>
                        Número de documento <span className="obligatorio">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: 65642312"
                        maxLength={15}
                        className={errors.numeroDocumento ? "campo-error" : ""}
                        onKeyPress={permitirSoloNumeros}
                        {...register("numeroDocumento", {
                          required: true,
                          minLength: 6,
                          pattern: {
                            value: /^[0-9]+$/,
                            message: "Solo se permiten números",
                          },
                        })}
                      />
                      {errors.numeroDocumento && (
                        <p className="mensaje-error">
                          {errors.numeroDocumento.type === "required"
                            ? "El número de documento es obligatorio"
                            : errors.numeroDocumento.type === "minLength"
                              ? "El número debe tener al menos 6 dígitos"
                              : "Solo se permiten números"}
                        </p>
                      )}
                    </div>

                    <div className="grupo-campo">
                      <label>
                        Nombres <span className="obligatorio">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: Pepito Juan"
                        maxLength={50}
                        className={errors.nombres ? "campo-error" : ""}
                        onKeyPress={permitirSoloLetras}
                        {...register("nombres", {
                          required: true,
                          minLength: {
                            value: 3,
                            message: "El nombre debe tener al menos 3 caracteres",
                          },
                          maxLength: 50,
                          pattern: {
                            value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                            message: "El nombre solo puede contener letras y espacios",
                          },
                        })}
                      />
                      {errors.nombres && (
                        <p className="mensaje-error">
                          {errors.nombres.type === "required"
                            ? "El nombre es obligatorio"
                            : errors.nombres.type === "minLength"
                              ? "El nombre debe tener al menos 3 caracteres"
                              : "El nombre solo puede contener letras y espacios"}
                        </p>
                      )}
                    </div>

                    <div className="grupo-campo">
                      <label>
                        Apellidos <span className="obligatorio">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: López Pérez"
                        maxLength={50}
                        className={errors.apellidos ? "campo-error" : ""}
                        onKeyPress={permitirSoloLetras}
                        {...register("apellidos", {
                          required: true,
                          minLength: {
                            value: 3,
                            message: "El apellido debe tener al menos 3 caracteres",
                          },
                          maxLength: 50,
                          pattern: {
                            value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                            message: "El apellido solo puede contener letras y espacios",
                          },
                        })}
                      />
                      {errors.apellidos && (
                        <p className="mensaje-error">
                          {errors.apellidos.type === "required"
                            ? "El apellido es obligatorio"
                            : errors.apellidos.type === "minLength"
                              ? "El apellido debe tener al menos 3 caracteres"
                              : "El apellido solo puede contener letras y espacios"}
                        </p>
                      )}
                    </div>

                    <div className="grupo-campo">
                    <label>
                        Fecha de nacimiento <span className="obligatorio">*</span>
                    </label>
                    <input
                        type="date"
                        className={errors.fechaNacimiento ? "campo-error" : watch("fechaNacimiento") ? "campo-valido" : ""}
                        {...register("fechaNacimiento", {
                        required: "La fecha de nacimiento es obligatoria",
                        validate: {
                            mayorDeEdad: (value) => {
                            if (!value) return true;
                            
                            const fechaNac = new Date(value);
                            const hoy = new Date();
                            let edad = hoy.getFullYear() - fechaNac.getFullYear();
                            const m = hoy.getMonth() - fechaNac.getMonth();
                            
                            if (m < 0 || (m === 0 && hoy.getDate() < fechaNac.getDate())) {
                                edad--;
                            }
                            
                            return edad >= 18 || "Debes ser mayor de 18 años";
                            }
                        }
                        })}
                        onFocus={() => setMostrarRequisitosFecha(true)}
                        onBlur={() => setMostrarRequisitosFecha(false)}
                    />
                    
                    {errors.fechaNacimiento && (
                        <p className="mensaje-error">{errors.fechaNacimiento.message}</p>
                    )}
                    
                    {mostrarRequisitosFecha && !errors.fechaNacimiento && (
                        <p className="mensaje-info">Debes ser mayor de 18 años para registrarte</p>
                    )}
                    </div>

                    <div className="grupo-campo">
                      <label>
                        Género <span className="obligatorio">*</span>
                      </label>
                      <select
                        className={errors.genero ? "campo-error" : ""}
                        {...register("genero", {
                          required: true,
                        })}
                      >
                        <option value="" disabled selected>
                          Seleccione...
                        </option>
                        <option value="F">Femenino</option>
                        <option value="M">Masculino</option>
                        <option value="O">Otro</option>
                      </select>
                      {errors.genero && <p className="mensaje-error">Debes seleccionar un género</p>}
                    </div>

                    <div className="grupo-campo">
                      <label>
                        Teléfono <span className="obligatorio">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: 65642312"
                        maxLength={10}
                        className={errors.telefono ? "campo-error" : ""}
                        onKeyPress={permitirSoloNumeros}
                        {...register("telefono", {
                          required: true,
                          pattern: {
                            value: /^[0-9]{10}$/,
                            message: "El celular debe tener 10 dígitos numéricos",
                          },
                        })}
                      />
                      {errors.telefono && (
                        <p className="mensaje-error">
                          {errors.telefono.type === "required"
                            ? "El teléfono es obligatorio"
                            : "El teléfono debe tener 10 dígitos numéricos"}
                        </p>
                      )}
                    </div>

                    <div className="grupo-campo">
                      <label>
                        Dirección <span className="obligatorio">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: Calle 123 Nro. 456"
                        maxLength={100}
                        className={errors.direccion ? "campo-error" : ""}
                        {...register("direccion", {
                          required: true,
                          minLength: {
                            value: 5,
                            message: "La dirección debe tener al menos 5 caracteres",
                          },
                          maxLength: 100,
                        })}
                      />
                      {errors.direccion && (
                        <p className="mensaje-error">
                          {errors.direccion.type === "required"
                            ? "La dirección es obligatoria"
                            : "La dirección debe tener al menos 5 caracteres"}
                        </p>
                      )}
                    </div>
                </div>

                <div className="navegacion-botones">
                <button 
                    type="button" 
                    className="boton-siguiente"
                    onClick={async () => {
                    const isValid = await trigger([
                        "tipoDocumento",
                        "numeroDocumento", 
                        "nombres",
                        "apellidos",
                        "fechaNacimiento",
                        "genero",
                        "telefono",
                        "direccion"
                    ]);
                    
                    if (isValid) {
                        setPaso(2);
                    }
                    }}
                >
                    Siguiente
                </button>
                </div>
              </div>

              {/* Paso 2: Datos de Acceso */}
              <div className={`contenido-paso ${paso === 2 ? '' : 'paso-oculto'}`}>
                <div className="grid-campos">
                <div className="grupo-campo">
                      <label>
                        Email <span className="obligatorio">*</span>
                      </label>
                      <input
                        type="email"
                        placeholder="Ej: juan.lopez@example.com"
                        maxLength={320}
                        className={errors.email ? "campo-error" : ""}
                        onPaste={evitarPegado}
                        {...register("email", {
                          required: true,
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "El correo electrónico es inválido",
                          },
                          maxLength: 320,
                        })}
                      />
                      {errors.email && (
                        <p className="mensaje-error">
                          {errors.email.type === "required"
                            ? "El email es obligatorio"
                            : "El formato del correo electrónico es inválido"}
                        </p>
                      )}
                    </div>

                    <div className="grupo-campo">
                      <label>
                        Confirmación Email <span className="obligatorio">*</span>
                      </label>
                      <input
                        type="email"
                        placeholder="Confirmar correo electrónico"
                        maxLength={320}
                        className={errors.confirmEmail ? "campo-error" : ""}
                        onPaste={evitarPegado}
                        {...register("confirmEmail", {
                          required: true,
                          validate: (value) => {
                            const emailValue = watch("email")
                            return value === emailValue || "Los correos electrónicos no coinciden"
                          },
                          maxLength: 320,
                        })}
                      />
                      {errors.confirmEmail && (
                        <p className="mensaje-error">
                          {errors.confirmEmail.type === "required"
                            ? "La confirmación de email es obligatoria"
                            : "Los correos electrónicos no coinciden"}
                        </p>
                      )}
                    </div>

                    <div className="grupo-campo">
                      <label>
                        Contraseña <span className="obligatorio">*</span>
                      </label>
                      <div className="contenedor-input-password">
                        <input
                          type={verPassword ? "text" : "password"}
                          placeholder="Contraseña"
                          maxLength={64}
                          className={errors.password ? "campo-error" : ""}
                          onPaste={evitarPegado}
                          onFocus={mostrarRequisitosPasswordAlFocus}
                          onBlur={ocultarRequisitosPasswordAlBlur}
                          {...register("password", {
                            required: true,
                            minLength: {
                              value: 8,
                              message: "La contraseña debe tener al menos 8 caracteres",
                            },
                            maxLength: 64,
                            pattern: {
                              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                              message:
                                "La contraseña debe tener al menos una letra mayúscula, una minúscula, un número y un carácter especial",
                            },
                          })}
                        />
                        <button type="button" className="boton-toggle-password" onClick={cambiarVisibilidadPassword}>
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
                              className="icono-ojo"
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
                              className="icono-ojo"
                            >
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                              <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                          )}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="mensaje-error">
                          {errors.password.type === "required"
                            ? "La contraseña es obligatoria"
                            : errors.password.type === "minLength"
                              ? "La contraseña debe tener al menos 8 caracteres"
                              : "La contraseña debe tener al menos una letra mayúscula, una minúscula, un número y un carácter especial"}
                        </p>
                      )}
                      {mostrarRequisitosPassword && (
                        <p className="mensaje-info">
                          La contraseña debe contener: al menos 8 caracteres, una mayúscula, una minúscula, un número y
                          un carácter especial (@$!%*?&)
                        </p>
                      )}
                    </div>

                    <div className="grupo-campo">
                    <label>
                        Confirmación Contraseña <span className="obligatorio">*</span>
                    </label>
                    <div className="contenedor-input-password">
                        <input
                        type={verConfirmarPassword ? "text" : "password"}
                        placeholder="Confirmar contraseña"
                        maxLength={64}
                        className={errors.confirmPassword ? "campo-error" : ""}
                        onPaste={evitarPegado}
                        {...register("confirmPassword", {
                            required: "La confirmación de contraseña es obligatoria",
                            validate: (value) => value === password || "Las contraseñas no coinciden"
                        })}
                        />
                        <button
                          type="button"
                          className="boton-toggle-password"
                          onClick={cambiarVisibilidadConfirmarPassword}
                        >
                          {verConfirmarPassword ? (
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
                              className="icono-ojo"
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
                              className="icono-ojo"
                            >
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                              <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                          )}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="mensaje-error">{errors.confirmPassword.message}</p>
                    )}
                    </div>
                  </div>

                  <div className="grupo-campo checkbox campo-ancho-completo">
                    <input
                      type="checkbox"
                      id="terminos"
                      className={errors.terminos ? "campo-error" : ""}
                      {...register("terminos", {
                        required: true,
                      })}
                    />
                    <label htmlFor="terminos">
                      Acepto los términos y condiciones <span className="obligatorio">*</span>
                    </label>
                    {errors.terminos && <p className="mensaje-error">Debes aceptar los términos y condiciones</p>}
                  </div>

                <div className="navegacion-botones">
                  <button type="button" className="boton-anterior" onClick={retrocederPaso}>
                    Anterior
                  </button>
                  <button type="submit" className="boton-enviar">
                    Registrarse
                  </button>
                </div>
              </div>
            </form>

            {/* Paso 3: Verificación de correo */}
            {paso === 3 && (
              <div className="contenido-paso">
<div className="verificacion-email">
                  <div className="icono-verificacion">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="64"
                      height="64"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#00bcd4"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 2L11 13"></path>
                      <path d="M22 2L15 22L11 13L2 9L22 2Z"></path>
                    </svg>
                  </div>

                  <h3 className="titulo-verificacion">Verifica tu correo electrónico</h3>

                  <p className="descripcion-verificacion">
                    Hemos enviado un código de verificación a <strong>{formData.email}</strong>. Por favor, introduce el
                    código de 6 dígitos para verificar tu cuenta.
                  </p>

                  <div className="contenedor-codigo">
                    {formData.codigoIngresado.map((digito, indice) => (
                      <input
                        key={indice}
                        id={`codigo-input-${indice}`}
                        type="text"
                        maxLength="1"
                        className={`input-codigo ${errorCodigo ? "codigo-error" : ""}`}
                        value={digito}
                        onChange={(e) => manejarCambioCodigo(indice, e.target.value)}
                        onPaste={indice === 0 ? manejarPegadoCodigo : null}
                        autoFocus={indice === 0}
                      />
                    ))}
                  </div>

                  {errorCodigo && (
                    <p className="mensaje-error mensaje-error-codigo">
                      El código ingresado no es válido. Por favor, intenta nuevamente.
                    </p>
                  )}

                  <div className="contenedor-timer">
                    <p className="texto-timer">
                      Tiempo restante: <span className="contador-timer">{formatearTiempo(tiempoRestante)}</span>
                    </p>
                  </div>

                  <div className="botones-verificacion">
                    <button type="button" className="boton-verificar" onClick={verificarCodigo}>
                      Verificar
                    </button>

                    <button
                      type="button"
                      className="boton-reenviar"
                      onClick={reenviarCodigo}
                      disabled={timerActivo && tiempoRestante > 240} // Deshabilitar por 1 minuto
                    >
                      Reenviar código
                    </button>
                  </div>

                  <p className="ayuda-verificacion">
                    ¿No recibiste el código? Revisa tu carpeta de spam o solicita un nuevo código.
                  </p>
                </div>
              </div>
            )}
          </div>

          {paso === 1 && (
            <div className="seccion-login">
              <p className="texto-login">¿Ya haces parte de PetsHeaven?</p>
              {/* <Link to="/login" className="enlace">
                Inicia sesión
              </Link> */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Registro;