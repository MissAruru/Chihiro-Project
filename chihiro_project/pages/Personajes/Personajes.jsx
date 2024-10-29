import './Personajes.css';
import flowerName from '../../assets/flower_name.png';
import { useState, useEffect, useRef } from 'react';

export const Personajes = () => {
    const { VITE_API, VITE_CHARACTERS, VITE_CHARACTERS_ID, VITE_IMAGE_BASE } = import.meta.env;
    const [personajes, setPersonajes] = useState([]);
    const [selectedPersonaje, setSelectedPersonaje] = useState(null);
    const [nombreArchivo, setNombreArchivo] = useState("No se ha cargado imagen");
    const [imagen, setImagen] = useState(null);
    const formularioRef = useRef(null);

    const pedirPersonajes = async () => {
        try {
            const response = await fetch(`${VITE_CHARACTERS}`);
            if (!response.ok) throw new Error('Error fetching personajes');
            const data = await response.json();
            if (Array.isArray(data)) {
                const personajesConImagen = data.map(personaje => ({
                    ...personaje,
                    imagenUrl: personaje.imagen ? `${VITE_IMAGE_BASE}/${personaje.imagen.url}` : null
                }));
                setPersonajes(personajesConImagen);
            }
        } catch (error) {
            console.error('Error fetching personajes:', error);
        }
    }

    const manejarArchivoImagen = (e) => {
        const file = e.target.files[0];
        setImagen(file);

        if (file) {
            setNombreArchivo(file.name);
            const imageUrl = URL.createObjectURL(file);
            if (selectedPersonaje) {
                setSelectedPersonaje(prev => ({
                    ...prev,
                    imagenUrl: imageUrl // Actualizar la URL de la imagen seleccionada
                }));
            }
        } else {
            setNombreArchivo("No se ha seleccionado archivo");
        }
    }

    const manejarFormulario = async (e) => {
        e.preventDefault();
        const { current: formulario } = formularioRef;

        const formData = new FormData();
        formData.append('nombre', formulario.nombre.value);
        formData.append('raza', formulario.raza.value);
        formData.append('clase', formulario.clase.value);
        formData.append('nivel', formulario.nivel.value);
        formData.append('descripcion', formulario.descripcion.value);

        if (imagen) {
            formData.append('imagen', imagen);
        } else {
            console.warn('No se ha seleccionado ninguna imagen.');
        }

        const url = selectedPersonaje 
            ? `${VITE_CHARACTERS}/${selectedPersonaje._id}` 
            : `${VITE_CHARACTERS}`;
        const method = selectedPersonaje ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                body: formData 
            });

            if (!response.ok) {
                const errorMessage = await response.text(); 
                throw new Error(`Error ${method === 'PUT' ? 'updating' : 'adding'} personaje: ${errorMessage}`);
            }

            const data = await response.json();
            await pedirPersonajes();
            setSelectedPersonaje(null);
            formulario.reset();
            setImagen(null); // Limpiar la imagen aquí
            setNombreArchivo("No se ha cargado imagen"); // Reiniciar el nombre del archivo
        } catch (error) {
            console.error(`Error ${method === 'PUT' ? 'updating' : 'adding'} personaje: ${error.message}`);
        }
    };

    const deletePersonaje = async (_id) => {
        if (!_id) return; 
        
        try {
            const response = await fetch(`${VITE_CHARACTERS}/${_id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error(`Error eliminando personaje: ${response.statusText}`);
            
            await pedirPersonajes();
            setSelectedPersonaje(null);
        } catch (error) {
            console.error('Error eliminando el personaje:', error);
        }
    }

    const seleccionarPersonaje = (personaje) => {
        if (personaje && personaje._id) {
            setSelectedPersonaje({
                ...personaje,
                imagenUrl: personaje.imagenUrl || null
            });
            // Actualizar el formulario con los datos del personaje seleccionado
            const { current: formulario } = formularioRef;
            if (formulario) {
                formulario.nombre.value = personaje.nombre;
                formulario.raza.value = personaje.raza;
                formulario.clase.value = personaje.clase;
                formulario.nivel.value = personaje.nivel;
                formulario.descripcion.value = personaje.descripcion;
                setNombreArchivo(personaje.imagen ? personaje.imagen.url : "No se ha cargado imagen");
            }
        } else {
            console.error('Personaje no válido o sin ID');
        }
    };

    useEffect(() => {
        pedirPersonajes();
    }, []);

    return (
        <>
            {/* Sección de personajes */}
            <div className="Wrapper-personajes" id="protagonistas">
                <div className="Wrapper-personajes--top top">
                    <h2 className='Wrapper-personajes--h2'>Los protagonistas</h2>
                    <p className='Wrapper-personajes--p'>¡Crea tu personaje e inclúyelo en la historia de Chihiro! Rellena con tus datos tu nombre, raza, clase nivel e historia.</p>
                </div>
                {/* Listado de personajes */}
                <div className="Wrapper-names">
                    <ul className="Wrapper-names">
                        {personajes.map((personaje) => (
                            <li
                                key={personaje._id}
                                onClick={() => seleccionarPersonaje(personaje)}
                                className="personaje-item"
                                style={{ backgroundImage: `url(${flowerName})` }}
                            >
                                {personaje.nombre}
                            </li>
                        ))}
                    </ul>
                </div>
                {/* Imagen del personaje seleccionado */}
                <div className="character">
                    {selectedPersonaje && (
                        <img
                            src={selectedPersonaje.imagenUrl}
                            alt={selectedPersonaje.nombre}
                            className="personaje-imagen"
                        />
                    )}
                    {!selectedPersonaje && (
                        <div className="Character-wrapper">
                            <p>Haz click en los nombres para ver los personajes</p>
                        </div>
                    )}
                </div>
                {/* Sección del creador para visualizar los personajes */}
                <div className="Wrapper-story">
                    {selectedPersonaje ? (
                        <div className='Wrapper-story-text'>
                            <h2 className='Wrapper-story--h2'>{selectedPersonaje.nombre}</h2>
                            <p>Raza: {selectedPersonaje.raza}</p>
                            <p>Clase: {selectedPersonaje.clase}</p>
                            <p>Nivel: {selectedPersonaje.nivel}</p>
                            <p>Descripción: {selectedPersonaje.descripcion}</p>
                        </div>
                    ) : (
                        <p className='Wrapper-personaje--noseleccionado'>Sugerimos un máximo de 285 caracteres.</p>
                    )}
                </div>
            </div>

            {/* Formulario para crear, editar o eliminar los personajes */}
            <div className="Creator">
                <form ref={formularioRef} onSubmit={manejarFormulario} className='Wrapper-creator' encType="multipart/form-data">
                    <input type="text" name="nombre" placeholder='Nombre' className='nombre' />
                    <input type="text" name="raza" placeholder='Raza' className='raza' />
                    <input type="text" name="clase" placeholder='Clase' className='clase' />
                    <input type="text" name="nivel" placeholder='Nivel' className='nivel' />
                    <textarea maxLength={285} name="descripcion" placeholder='Escribe la historia de tu personaje aquí' className='descripcion'></textarea>
                    
                    <div className="Wrapper-img--personaje">
                        <input type="text" value={nombreArchivo} readOnly className="input-fake" />
                        <input type="file" id="imagen" name="imagen" className="imagen" onChange={manejarArchivoImagen} />
                        <label htmlFor="imagen">Seleccionar archivo</label>
                    </div>

                    <input type="submit" value="Enviar" className='enviar' />
                    {selectedPersonaje && (
                        <button type="button" className='eliminar' onClick={() => deletePersonaje(selectedPersonaje._id)}>Eliminar</button>
                    )}
                </form>
            </div>

            {/* Footer de la página */}
            <footer>
                <div className='Div-links'>
                    <ul className='Footer-ul'>
                        <li className='Footer-li'><a href="#inicio">Inicio</a></li>
                        <li className='Footer-li'><a href="#protagonistas">Personajes</a></li>
                        <li className='Footer-li'><a href="#historias">Historias</a></li>
                        <li className='Footer-li'><a href="#contacto">Contacto</a></li>
                    </ul>
                </div>
            </footer>
        </>
    );
};
