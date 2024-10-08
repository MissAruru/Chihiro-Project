import './Personajes.css';
import flowerName from '../../assets/flower_name.png';
import { useState, useEffect, useRef } from 'react';

export const Personajes = () => {
    const [personajes, setPersonajes] = useState([]);
    const [selectedPersonaje, setSelectedPersonaje] = useState(null);


    const formularioRef = useRef(null);

    const pedirPersonajes = async () => {
        try {
            const response = await fetch('http://localhost:3000/personajes');
            if (!response.ok) throw new Error('Error fetching personajes');
            const data = await response.json();
            console.log('Datos de la API:', data); // Verifica si la imagen está incluida aquí
    
            if (Array.isArray(data)) {
                setPersonajes(data); // Actualiza el estado con el array
            } else {
                console.error('La respuesta de la API después de eliminar no es un array:', data);
            }
        } catch (error) {
            console.error('Error fetching personajes:', error);
        }
    };
    

    const [imagen, setImagen] = useState(null);

const manejarArchivoImagen = (e) => {
    setImagen(e.target.files[0]); // Guarda el archivo seleccionado en el estado
};

const manejarFormulario = async (e) => {
    e.preventDefault();
    const { current: formulario } = formularioRef;

    // Crear un objeto FormData para enviar los datos del formulario y la imagen
    const formData = new FormData();
    formData.append('nombre', formulario.nombre.value);
    formData.append('raza', formulario.raza.value);
    formData.append('clase', formulario.clase.value);
    formData.append('nivel', formulario.nivel.value);
    formData.append('descripcion', formulario.descripcion.value);

    // Agregar la imagen solo si existe
    if (imagen) {
        formData.append('imagen', imagen);
    }

    const url = selectedPersonaje ? `http://localhost:3000/personajes/${selectedPersonaje._id}` : "http://localhost:3000/personajes";
    const method = selectedPersonaje ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method,
            body: formData // Enviar el objeto FormData
        });

        if (!response.ok) throw new Error(`Error ${method === 'PUT' ? 'updating' : 'adding'} personaje: ${response.statusText}`);
        
        await response.json();
        console.log('Formulario enviado correctamente');
        
        // Refresca la lista de personajes llamando a pedirPersonajes
        await pedirPersonajes();  // Refresca la lista completa de personajes
        setSelectedPersonaje(null); // Restablece la selección después de agregar o actualizar
        formulario.reset();
        setImagen(null); // Restablece el estado de la imagen
    } catch (error) {
        console.error(`Error ${method === 'PUT' ? 'updating' : 'adding'} personaje: ${error.message}`);
    }
};


    
    
    const deletePersonaje = async (_id) => {
        if (!_id) return;
        
        try {
            const response = await fetch(`http://localhost:3000/personajes/${_id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error(`Error eliminando personaje: ${response.statusText}`);
            
            console.log('Personaje eliminado correctamente');
            
            // Refresca la lista de personajes
            await pedirPersonajes();  // Refresca la lista completa de personajes
            setSelectedPersonaje(null);
        } catch (error) {
            console.error('Error eliminando el personaje:', error);
        }
    };
    
    
    


    const handleLetterClick = (personaje) => {
        setSelectedPersonaje(personaje);
        const { nombre, raza, clase, nivel, descripcion } = personaje;
        const { current: formulario } = formularioRef;

        if (formulario) {
            formulario[0].value = nombre;
            formulario[1].value = raza;
            formulario[2].value = clase;
            formulario[3].value = nivel;
            formulario[4].value = descripcion;
        } else {
            console.error("Formulario no encontrado en la referencia.");
        }
    };

    useEffect(() => {
        pedirPersonajes();
    }, []);

    return (
        <>
            <div className="Wrapper-personajes" id="protagonistas">
    <div className="Wrapper-personajes--top top">
        <h2 className='Wrapper-personajes--h2'>Los protagonistas</h2>
        <p className='Wrapper-personajes--p'>¡Crea tu personaje e inclúyelo en la historia de Chihiro! Rellena con tus datos tu nombre, raza, clase nivel e historia.</p>
    </div>

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

    <div className="character">
        {selectedPersonaje && selectedPersonaje.imagen ? (
            <img
                src={`http://localhost:3000/uploads/${selectedPersonaje.imagen}`}
                alt={selectedPersonaje.nombre}
                className="personaje-imagen"
            />
        ) : (
            <p>Haz click en los nombres de la izquierda para ver los personajes</p>
        )}
    </div>

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



            <div className="Creator">
    <form ref={formularioRef} onSubmit={manejarFormulario} className='Wrapper-creator' encType="multipart/form-data">
        <input type="text" name="nombre" placeholder='Nombre' className='nombre' />
        <input type="text" name="raza" placeholder='Raza' className='raza' />
        <input type="text" name="clase" placeholder='Clase' className='clase' />
        <input type="text" name="nivel" placeholder='Nivel' className='nivel' />
        <textarea maxLength={285} name="descripcion" placeholder='Escribe la historia de tu personaje aquí' className='descripcion'></textarea>
        
        <input type="file" name="imagen" className='Wrapper-img--personaje' onChange={manejarArchivoImagen} />


        <input type="submit" value="Enviar" className='enviar' />
        {selectedPersonaje && (
            <button type="button" className='eliminar' onClick={() => deletePersonaje(selectedPersonaje._id)}>Eliminar</button>
        )}
    </form>
</div>


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
    );
};
