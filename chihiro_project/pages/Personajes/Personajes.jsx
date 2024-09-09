import './Personajes.css'
import background from '../../assets/bg_personajes.jpg'
import kroggar from '../../assets/kroggar.png'
import flower_name from '../../assets/flower_name.png'
import { useState, useEffect, useContext, useRef } from 'react'


export const Personajes = () => {
    const [personajes, setPersonajes] = useState([]);
    const [selectedPersonaje, setSelectedPersonaje] = useState(null);
  
    const anadirPersonajeRef = useRef(null)
    const updateFormRef = useRef(null)
  
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
        setPersonajes(data);
      } catch (error) {
        console.error('Error fetching personajes:', error);
      }
    };
    
const anadirPersonajes = async (e) => {

    e.preventDefault()
  
    const { current : formulario } = anadirPersonajeRef

  const [ nombreInput, nivelInput, claseInput, razaInput ] = formulario

  const nueva = {
    id : uuidv4(),
    nombre : nombreInput.value,
    nivel : nivelInput.value,
    clase : claseInput.value,
    raza : razaInput.value
  }

  const controller = new AbortController()
  const options = {
    method : 'post',
    headers : {"Content-type" : "application/json"},
    body : JSON.stringify(nueva),
    signal : controller.signal
  }

  fetch('http://localhost:3000/personajes', options)
    .then(res => res.json())
    .then(data => {
      setPersonajes(data)
      formulario.reset()
    })
    
}

const deletePersonaje = async (id) => {

  const controller = new AbortController()
  const options = {
    method : 'delete',
    signal : controller.signal
  }

  fetch(`http://localhost:3000/${id}`, options)
  .then( res => res.json())
  .then( data => setPersonajes(data))
  .catch(error => console.error('Error deleting personaje:', error))

}
  
const handleUpdateClick = (personaje) => {
  setSelectedPersonaje(personaje)
  const { nombre, nivel, clase, raza } = personaje
  const { current: formulario } = updateFormRef
  formulario[0].value = nombre
  formulario[1].value = nivel
  formulario[2].value = clase
  formulario[3].value = raza
}

  const updatePersonaje = async (e) => {
    e.preventDefault()
  
    const { current: formulario } = updateFormRef
  
    const [nombreInput, nivelInput, claseInput, razaInput] = formulario
  
    if (!selectedPersonaje) {
      console.error('No se ha seleccionado ningún personaje para actualizar.')
      return
    }
  
    const actuPersonaje = {
      id: selectedPersonaje.id,
      nombre: nombreInput.value,
      nivel: nivelInput.value,
      clase: claseInput.value,
      raza: razaInput.value
    }
  
    const options = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(actuPersonaje),
    }
  
    try {
      const response = await fetch(`http://localhost:3000/personajes/${selectedPersonaje.id}`, options)
      if (!response.ok) {
        throw new Error('Error al actualizar el personaje')
      }
      const updatedPersonaje = await response.json()
      setPersonajes(personajes.map(personaje => (personaje.id === selectedPersonaje.id ? updatedPersonaje : personaje)))
      formulario.reset()
      setSelectedPersonaje(null)
    } catch (error) {
      console.error('Error al actualizar el personaje:', error)
    }
  }

    useEffect(() => {
        pedirPersonajes();
    }, [])


    return (
        <>

        <div className="Wrapper-personajes" id="protagonistas">
            <div className="Wrapper-personajes--top top">
                <h2 className='Wrapper-personajes--h2'>Los protagonistas</h2>
                <p className='Wrapper-personajes--p'>¡Crea tu personaje e incluyelo en la historia de Chihiro! Rellena con tus datos tu nombre, raza, clase nivel e historia.</p>
            </div>
            <div className="Wrapper-names names">
                <h3>Kroggar</h3>
                <img src={flower_name} alt="Flower_name" className='Flower_name' />
            </div>
            <div className="Wrapper-img images">
                <img src= {kroggar} alt="kroggar" />
            </div>
            <div className="Wrapper-story story">
            {personajes.length === 0 && <p>No hay personajes disponibles.</p>}
            {personajes.length > 0 && (
                <ul className='Wrapper-story--ul'>
                    {personajes.map((personaje) => (
                        <li key={personaje.id}>
                            <h2 className='Wrapper-story--h2'>{personaje.nombre}</h2>
                            <p>Raza: {personaje.raza}</p>
                            <p>Clase: {personaje.clase}</p>
                            <p>Nivel: {personaje.nivel}</p>
                            <p>Descripción: {personaje.descripcion}</p>
                            {personaje.img && <img src={`data:${personaje.img.contentType};base64,${btoa(String.fromCharCode(...new Uint8Array(personaje.img.data)))}`} alt={personaje.nombre} />
                        }
                        </li>
                    ))}
                </ul>
             
            )}
            </div>
            </div>
        <div className="Creator">
            <form ref={anadirPersonajeRef} onSubmit={anadirPersonajes} className='Wrapper-creator'>
                <input type="text" placeholder='Nombre' className='nombre'/>
                <input type="text" placeholder='Raza' className='raza'/>
                <input type="text" placeholder='Clase' className='clase'/>
                <input type="text" placeholder='Nivel' className='nivel'/>
                <textarea name="textarea" id="textarea" placeholder='Escribe la historia de tu personaje aquí' className='descripcion'></textarea>
                <input type="file" name="Subir imagen" id="Upload" className='img' />
                <input type="submit" value="Enviar" className='enviar' />
                <button type="button" className='actualizar' onClick={() => selectedPersonaje && handleUpdateClick(selectedPersonaje)}>Actualizar</button>
                <button type="button" className='eliminar' onClick={() => selectedPersonaje && deletePersonaje(selectedPersonaje.id)}>Eliminar</button>

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
    )
}

