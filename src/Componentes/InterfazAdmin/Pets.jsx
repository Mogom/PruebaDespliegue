// Imports
import { GetData } from '../Varios/Util'
import { Loader } from '../Errores/Loader'
import "../../../public/styles/InterfazAdmin/pets.css"

// Librarys 
import React, { useState, useEffect } from "react"

// Main component
export const Pets = () => {
    // Declare Vars
    const URL = "http://localhost:3000/pet/all"
    const [petsData, setPetsData] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedPet, setSelectedPet] = useState(null)
    const [showModal, setShowModal] = useState(false)

    // Ejecutar el fetch para traer datos
    useEffect(() => {
        const fetchData = async () => {
            try {
                const pets = await GetData(URL)
                setPetsData(pets)
                setLoading(false)
            } catch (error) {
                window.location.href = "/internal"
                setPetsData([])
            }
        }
      
        fetchData()
    }, [])

    const namePro = gen => {
        return gen === "Hombre" ? "Propietario" : "Propietaria"
    }

    const openModal = (pet) => {
        setSelectedPet(pet)
        setShowModal(true)
        document.body.style.overflow = 'hidden' // Deshabilita el scroll del body
    }

    const closeModal = () => {
        setShowModal(false)
        document.body.style.overflow = 'auto' // Habilita el scroll del body
    }

    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <main className='main-pets-container'>
                    <NavBar />
                    <section className='pets-container'>
                        {petsData.map((i, index) => (
                            <aside key={index} className='pets-card'>
                                <img 
                                    className='pets-card-img' 
                                    src={i.fot_mas} 
                                    alt={`${i.esp_mas} de raza ${i.raz_mas} color ${i.col_mas} con nombre ${i.nom_mas}`} 
                                />
                                <span className='pets-card-info'>
                                    <p><strong>Nombre: </strong> {i.nom_mas}</p>
                                    <p><strong>Especie: </strong> {i.esp_mas}</p>
                                    <p><strong>Color: </strong> {i.col_mas}</p>
                                    <p><strong>Raza: </strong> {i.raz_mas}</p>
                                    <p><strong>{namePro(i.gen_usu)}: </strong>{i.nom_usu} {i.ape_usu}</p>
                                </span>
                                <button 
                                    type='button' 
                                    className='boton-enviar'
                                    onClick={() => openModal(i)}
                                >
                                    Descripción
                                </button>
                            </aside>
                        ))}
                    </section>

                    {/* Modal para mostrar detalles completos */}
                    {showModal && selectedPet && (
                        <section className="pet-modal-overlay" onClick={closeModal}>
                            <div className="pet-modal-content" onClick={e => e.stopPropagation()}>
                                <button className="pet-modal-close" onClick={closeModal}>×</button>
                                
                                <section className="pet-modal-grid">
                                    <picture className="pet-modal-image">
                                        <img 
                                            src={selectedPet.fot_mas} 
                                            alt={`${selectedPet.esp_mas} ${selectedPet.nom_mas}`} 
                                        />
                                    </picture>
                                    
                                    <section className="pet-modal-info">
                                        <h2>{selectedPet.nom_mas}</h2>
                                        <aside className="pet-details-grid">
                                            <article>
                                                <h3>Información Básica</h3>
                                                <p><strong>Especie: </strong> {selectedPet.esp_mas}</p>
                                                <p><strong>Raza: </strong> {selectedPet.raz_mas}</p>
                                                <p><strong>Color: </strong> {selectedPet.col_mas}</p>
                                                <p><strong>Género: </strong> {selectedPet.gen_mas === 'M' ? 'Macho' : 'Hembra'}</p>
                                                <p><strong>Fecha de Nacimiento: </strong> {new Date(selectedPet.fec_nac_mas).toLocaleDateString()}</p>
                                                <p><strong>Peso: </strong> {selectedPet.pes_mas} kg</p>
                                            </article>
                                            
                                            <article>
                                                <h3>Datos del Propietario</h3>
                                                <p><strong>{namePro(selectedPet.gen_usu)}: </strong> {selectedPet.nom_usu} {selectedPet.ape_usu}</p>
                                                <p><strong>Documento: </strong> {selectedPet.doc_usu}</p>
                                                <p><strong>Celular: </strong> {selectedPet.cel_usu}</p>
                                                <p><strong>Email: </strong> {selectedPet.email_usu}</p>
                                            </article>
                                            
                                            <article>
                                                <h3>Salud</h3>
                                                <p><strong>Estado reproductivo: </strong> {selectedPet.est_rep_mas}</p>
                                                <p><strong>Alimento: </strong> {selectedPet.ali_mas}</p>
                                            </article>
                                        </aside>
                                    </section>
                                </section>
                            </div>
                        </section>
                    )}
                </main>
            )}   
        </>
    )
}