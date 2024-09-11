import './Personajes.css';
import background from '../../assets/bg_personajes.jpg';
import kroggar from '../../assets/kroggar.png';
import flower_name from '../../assets/flower_name.png';
import { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';


export const Personajes = () => {
    const [personajes, setPersonajes] = useState([]);
    const [selectedPersonaje, setSelectedPersonaje] = useState(null);

    const formularioRef = useRef(null);

    const pedirPersonajes = async () => {
        const controller = new AbortController();
        const options = {
            method: 'GET',
            signal: controller.signal
        };
    
        try {
            const response = await fetch('http://localhost:3000/personajes', options);
            if (!response.ok) throw new Error('Error fetching personajes');
            const data = await response.json();
            console.log('Datos obtenidos:', data); // Verifica los datos
            setPersonajes(data);
        } catch (error) {
            console.error('Error fetching personajes:', error);
        }
    };
    
    

    const manejarFormulario = async (e) => {
        e.preventDefault();
        const { current: formulario } = formularioRef;
        const [nombreInput, razaInput, claseInput, nivelInput, descripcionInput, imgInput] = formulario.elements;

        const personaje = {
            id: selectedPersonaje ? selectedPersonaje.id : uuidv4(),
            nombre: nombreInput.value,
            raza: razaInput.value,
            clase: claseInput.value,
            nivel: nivelInput.value,
            descripcion: descripcionInput.value,
            img: imgInput.files[0] // Si estás cargando una imagen
        };

        const url = selectedPersonaje ? `http://localhost:3000/personajes/${selectedPersonaje.id}` : "http://localhost:3000/personajes";
        const method = selectedPersonaje ? 'PUT' : 'POST';

        try {
            const formData = new FormData();
            for (const key in personaje) {
                formData.append(key, personaje[key]);
            }

            const options = {
                method,
                body: formData,
            };

            const response = await fetch(url, options);
            if (!response.ok) throw new Error(`Error ${method === 'PUT' ? 'updating' : 'adding'} personaje: Unknown error`);

            const data = await response.json();
            if (selectedPersonaje) {
                setPersonajes(personajes.map(p => (p.id === selectedPersonaje.id ? data : p)));
                setSelectedPersonaje(null);
            } else {
                setPersonajes((prevPersonajes) => [...prevPersonajes, data]);
            }
            formulario.reset();
        } catch (error) {
            console.error(`Error ${method === 'PUT' ? 'updating' : 'adding'} personaje: ${error.message}`);
        }
    };

    const deletePersonaje = async (id) => {
        if (!id) {
            console.error("ID del personaje no proporcionado");
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/personajes/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error(`Error deleting personaje: ${response.statusText}`);
            const data = await response.json();
            setPersonajes(data);
            setSelectedPersonaje(null); // Restablecer selección después de eliminar
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
        console.log(personajes); // Verificar qué datos contiene el array
    }, []);
    

    return (
        <>
            <div className="Wrapper-personajes" id="protagonistas">
                <div className="Wrapper-personajes--top top">
                    <h2 className='Wrapper-personajes--h2'>Los protagonistas</h2>
                    <p className='Wrapper-personajes--p'>¡Crea tu personaje e inclúyelo en la historia de Chihiro! Rellena con tus datos tu nombre, raza, clase nivel e historia.</p>
                </div>

                <div className="Wrapper-names names">
    {personajes.map((personaje) => (
        <h3 key={personaje.id} onClick={() => handleLetterClick(personaje)}>
            {personaje.nombre ? personaje.nombre[0] : 'N/A'} {/* Verifica si "nombre" existe */}
        </h3>
    ))}
    <img src={flower_name} alt="Flower_name" className='Flower_name' />
</div>



                {/* Muestra solo el personaje seleccionado */}
                <div className="Wrapper-story story">
                    {selectedPersonaje ? (
                        <div>
                            <h2>{selectedPersonaje.nombre}</h2>
                            <p>Raza: {selectedPersonaje.raza}</p>
                            <p>Clase: {selectedPersonaje.clase}</p>
                            <p>Nivel: {selectedPersonaje.nivel}</p>
                            <p>Descripción: {selectedPersonaje.descripcion}</p>
                            {selectedPersonaje.img && (
                                <img src={selectedPersonaje.imgUrl} alt={selectedPersonaje.nombre} />
                            )}
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
                    <input type="file" name="Subir imagen" id="Upload" className='img' />
                    <input type="submit" value="Enviar" className='enviar' />
                    {selectedPersonaje && (
    <>
        <button type="button" className='actualizar' onClick={manejarFormulario}>Actualizar</button>
        <button type="button" className='eliminar' onClick={() => deletePersonaje(selectedPersonaje.id)}>Eliminar</button>
    </>
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
