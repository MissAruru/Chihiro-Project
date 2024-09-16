import './Personajes.css';
import flower_name from '../../assets/flower_name.png';
import { useState, useEffect, useRef, useCallback } from 'react';

export const Personajes = () => {
    const [personajes, setPersonajes] = useState([]);
    const [selectedPersonaje, setSelectedPersonaje] = useState(null);

    const formularioRef = useRef(null);

    const pedirPersonajes = async () => {
        try {
            const response = await fetch('http://localhost:3000/personajes');
            if (!response.ok) throw new Error('Error fetching personajes');
            const data = await response.json();
            console.log('Datos de la API:', data);
            if (Array.isArray(data)) {
                setPersonajes(data); // Actualiza el estado con el array
                setSelectedPersonaje(null); // Restablecer selección después de eliminar
            } else {
                console.error('La respuesta de la API después de eliminar no es un array:', data);
            }
            
        } catch (error) {
            console.error('Error fetching personajes:', error);
        }
    };
    

    const manejarFormulario = async (e) => {
        e.preventDefault();
        const { current: formulario } = formularioRef;
        const [nombreInput, razaInput, claseInput, nivelInput, descripcionInput] = formulario.elements;
        
        const personaje = {
            nombre: nombreInput.value,
            raza: razaInput.value,
            clase: claseInput.value,
            nivel: nivelInput.value,
            descripcion: descripcionInput.value
        };
        
        const url = selectedPersonaje ? `http://localhost:3000/personajes/${selectedPersonaje._id}` : "http://localhost:3000/personajes";
        const method = selectedPersonaje ? 'PUT' : 'POST';
        
        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(personaje)
            });
            if (!response.ok) throw new Error(`Error ${method === 'PUT' ? 'updating' : 'adding'} personaje: ${response.statusText}`);
            
            const data = await response.json();
            console.log('Respuesta después de enviar el formulario:', data);
        
            if (method === 'PUT') {
                setPersonajes(prevPersonajes => prevPersonajes.map(p => (p._id === selectedPersonaje._id ? data : p)));
            } else {
                setPersonajes(prevPersonajes => [...prevPersonajes, data]);
            }
            setSelectedPersonaje(null); // Restablece la selección después de agregar o actualizar
            formulario.reset();
        } catch (error) {
            console.error(`Error ${method === 'PUT' ? 'updating' : 'adding'} personaje: ${error.message}`);
        }
    };
    
    
    
    

    const deletePersonaje = async (_id) => {
        if (!_id) return;
        
        try {
            const response = await fetch(`http://localhost:3000/personajes/${_id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error(`Error eliminando personaje: ${response.statusText}`);
            
            await response.json();
            console.log('Personaje eliminado correctamente');
            
            // Actualiza el estado eliminando el personaje localmente
            setPersonajes(prevPersonajes => prevPersonajes.filter(personaje => personaje._id !== _id));
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

                <div className="Wrapper-names names">
                {personajes.map((personaje) => {
    console.log(`Key for personaje: ${personaje._id}`); // Verifica las claves aquí
    return (
       <ul> 
        <li key={personaje._id} onClick={() => handleLetterClick(personaje)}>
            {personaje.nombre ? personaje.nombre : 'Sin nombre'}
        </li>
        </ul>
    );
})}
                    <img src={flower_name} alt="Flower_name" className='Flower_name' />
                </div>

                <div className="Wrapper-story story">
                    {selectedPersonaje ? (
                        <div>
                            <h2>{selectedPersonaje.nombre}</h2>
                            <p>Raza: {selectedPersonaje.raza}</p>
                            <p>Clase: {selectedPersonaje.clase}</p>
                            <p>Nivel: {selectedPersonaje.nivel}</p>
                            <p>Descripción: {selectedPersonaje.descripcion}</p>
                        </div>
                    ) : (
                        <p>No hay personaje seleccionado.</p>
                    )}
                </div>
            </div>

            <div className="Creator">
                <form ref={formularioRef} onSubmit={manejarFormulario} className='Wrapper-creator'>
                    <input type="text" placeholder='Nombre' className='nombre' />
                    <input type="text" placeholder='Raza' className='raza' />
                    <input type="text" placeholder='Clase' className='clase' />
                    <input type="text" placeholder='Nivel' className='nivel' />
                    <textarea name="textarea" id="textarea" placeholder='Escribe la historia de tu personaje aquí' className='descripcion'></textarea>
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
