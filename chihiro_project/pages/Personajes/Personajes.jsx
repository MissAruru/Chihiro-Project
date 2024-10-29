/* Última parte de la web. Dentro de este JSX tenemos:

- Creador de personajes
- Footer

El creador de personajes contiene un sistema de CRUD, mediante un formulario que podemos rellenar para "crear" nuestros personajes en la historia de Chihiro.
El creador está pensado para contener hasta 6 personajes, de forma ideal. 

*/

// Comenzamos importando los Hooks e imagenes necesarias para el creador y footer

import './Personajes.css';
import flowerName from '../../assets/flower_name.png';
import { useState, useEffect, useRef } from 'react';

export const Personajes = () => {
    
    const { VITE_API, VITE_CHARACTERS, VITE_CHARACTERS_ID, VITE_IMAGE_BASE } = import.meta.env;
    // Estados para almacenar los personajes, el personaje seleccionado, y el nombre del archivo subido (por defecto: "No se ha cargado imagen")
    const [personajes, setPersonajes] = useState([])
    const [selectedPersonaje, setSelectedPersonaje] = useState(null)
    const [nombreArchivo, setNombreArchivo] = useState("No se ha cargado imagen")
    const [imagen, setImagen] = useState(null);
    // Usamos una referencia al formulario para usarlo directamente

    const formularioRef = useRef(null)

    console.log(VITE_API, VITE_CHARACTERS);

// Con pedirPersonajes hacemos una función asíncrona para obtener la lista de los personajes desde la API:

const pedirPersonajes = async () => {
    try {
        const response = await fetch(`${VITE_CHARACTERS}`);
        if (!response.ok) throw new Error('Error fetching personajes');
        const data = await response.json();
        console.log('Datos de la API:', data);

        if (Array.isArray(data)) {
            // Aquí puedes mapear los datos para agregar la URL de la imagen
            const personajesConImagen = data.map(personaje => ({
                ...personaje,
                imagenUrl: personaje.imagen ? `${VITE_IMAGE_BASE}/${personaje.imagen.url}` : null
            }));
            setPersonajes(personajesConImagen);
        } else {
            console.error('La respuesta de la API después de eliminar no es un array:', data);
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
        // Aquí puedes crear la URL del objeto para la vista previa
        const imageUrl = URL.createObjectURL(file);
        setSelectedPersonaje(prev => ({
            ...prev,
            imagenUrl: imageUrl // Agregamos la URL de la imagen seleccionada
        }));
    } else {
        setNombreArchivo("No se ha seleccionado archivo");
    }
}

    
// Función que maneja el envío del formulario, ya sea para crear o actualizar un personaje
const manejarFormulario = async (e) => {
    e.preventDefault()
    const { current: formulario } = formularioRef // Referencia al formulario

    // Creamos un FormData para enviar los datos del formulario junto con la imagen
    const formData = new FormData()
    formData.append('nombre', formulario.nombre.value)
    formData.append('raza', formulario.raza.value)
    formData.append('clase', formulario.clase.value)
    formData.append('nivel', formulario.nivel.value)
    formData.append('descripcion', formulario.descripcion.value)

    // Si hay imagen, la añadimos a los datos
    if (imagen) {
        formData.append('imagen', imagen)
    }
 // Si hay un personaje seleccionado, hacemos una petición PUT para actualizar; si no, hacemos una petición POST para crear un personaje nuevo
 const url = selectedPersonaje 
  ? `${VITE_CHARACTERS}/${selectedPersonaje._id}` 
  : `${VITE_CHARACTERS}`;
    const method = selectedPersonaje ? 'PUT' : 'POST'

    try {
        const response = await fetch(url, {
            method,
            body: formData 
        })

        if (!response.ok) throw new Error(`Error ${method === 'PUT' ? 'updating' : 'adding'} personaje: ${response.statusText}`)
        // Volvemos a pedir la lista de personajes actualizada
        await response.json()
        
        
        
        await pedirPersonajes()
        setSelectedPersonaje(null) //  Limpiamos la selección del personaje
        formulario.reset() // Reseteamos el formulario
        setImagen(null) // Despejamos la imagen
    } catch (error) {
        console.error(`Error ${method === 'PUT' ? 'updating' : 'adding'} personaje: ${error.message}`)
    }
}


    
    // Función para eliminar un personaje
    const deletePersonaje = async (_id) => {
        if (!_id) return // Sin un id no se haría nada
        
        try {
            const response = await fetch(`${VITE_CHARACTERS}/${selectedPersonaje._id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error(`Error eliminando personaje: ${response.statusText}`)
            
            console.log('Personaje eliminado correctamente')
            
             // Volvemos a pedir la lista de personajes actualizada
            await pedirPersonajes()
            setSelectedPersonaje(null) // Limpiamos la selección del personaje
        } catch (error) {
            console.error('Error eliminando el personaje:', error)
        }
    }
    
    
    

// Función para seleccionar un personaje al hacer clic en su nombre
    const handleLetterClick = (personaje) => {
        setSelectedPersonaje(personaje) // Establecemos el personaje seleccionado
        const { nombre, raza, clase, nivel, descripcion } = personaje
        const { current: formulario } = formularioRef
 // Si el formulario existe, llenamos los campos con los datos del personaje seleccionado
        if (formulario) {
            formulario[0].value = nombre
            formulario[1].value = raza
            formulario[2].value = clase
            formulario[3].value = nivel
            formulario[4].value = descripcion
        } else {
            console.error("Formulario no encontrado en la referencia.")
        }
    }
// Hook useEffect para cargar los personajes al montar el componente
    useEffect(() => {
        pedirPersonajes() // Cargamos los personajes al cargar el componente
    }, [])

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
                    onClick={() => handleLetterClick(personaje)}
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
        {selectedPersonaje && selectedPersonaje.imagen ? (
             <>
             {console.log(selectedPersonaje)}
             <img
                src={selectedPersonaje.imagenUrl ? `${VITE_IMAGE_BASE}${selectedPersonaje.imagenUrl}` : 'ruta/de/imagen/por/defecto.jpg'}
                alt={selectedPersonaje.nombre}
                className="personaje-imagen"
             />
         </>
        ) : (
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
            <p className='Wrapper-personaje--noseleccionado'>Sugerimos un máximo de 285 carácteres.</p>
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
                        <li className='Footer-li'><a href="#origen">El origen</a></li>
                        <li className='Footer-li'><a href="#tragedia">La tragedia</a></li>
                        <li className='Footer-li'><a href="#protagonistas">Los protagonistas</a></li>
                    </ul>
                    <div className='Div-ul'>
                        <p className='Div-p'>El reino de Chihiro © 2024</p>
                    </div>
                </div>
            </footer>
</>
    )
}
