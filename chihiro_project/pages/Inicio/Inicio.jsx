/* Primera parte de la página web que contiene:

- Barra superior con Logo en la izquierda 
-En el centro, las distintas partes de la página
- Dos botones que redirigen al login.

En el espacio restante tenemos el H1 junto a su breve descripción.
*/

// Importamos todos los elementos necesarios

import './Inicio.css'
import logo from '../../assets/chihiro_sinlogo.png'
import { Origen } from '../El_origen/El_origen'
import { Tragedia } from '../La_tragedia/Tragedia'
import { Personajes } from '../Personajes/Personajes'
import { useNavigate } from 'react-router-dom'

// Con esto podemos acceder de nuevo a la zona del login, mediante los botones registrarse e iniciar sesión

export const Inicio = () => {


  const navigate = useNavigate()

  const LoginClick = () => {
    navigate('/')
  }



    return (
        <>  
   <div className='Wrapper' id='inicio'>
        <nav className='Nav-wrapper'>
          <div className="Nav-logo">
            <img src={logo} alt="Chihiro Logo" />
          </div>
          <div className="Nav-links">
            <ul className='Nav-ul'>
              <li><a href="#origen">El origen</a></li>
              <li><a href="#tragedia">La tragedia</a></li>
              <li><a href="#protagonistas">Los protagonistas</a></li>
            </ul>
          </div>
          <div className="Nav-buttons">
            <button className="Nav-login--button" onClick={LoginClick}>Iniciar sesión</button>
            <button className="Nav-register--button" onClick={LoginClick}>Registrarse</button>
          </div>
        </nav>
      <div className="Wrapper-bottom">
        <h1 className='Wrapper-title'>El reino de Chihiro</h1>
        <h2 className='Wrapper-h2'>ちひろの王国</h2>
        <h3 className='Wrapper-h3'>Descubre la historia de una partida de Dragones y Mazmorras a través de un mundo fantástico e imaginario ambientado en la antigua Japón</h3>
      </div>
      </div>
      <Origen/>
      <Tragedia/>
      <Personajes/>

    </>
    )
}