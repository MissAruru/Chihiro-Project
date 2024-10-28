/* Primera parte de la página web a la que accedemos, este login se presenta de forma muy sencilla:

- Usuario 
- Contraseña
En el caso de equivocarnos con las contraseñas el sitio está preparado para dar el error en el front.

*/



import './login.css'
import logo from '../../assets/chihiro.png'
import { useEffect, useState } from 'react'
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'


export const Login = () => {

    const [login, setLogin] = useState(false)
    const [error, setError] = useState('')

   
    console.log('Login state:', login);


    const navigate = useNavigate()

    useEffect(() => {
        console.log('Login state changed:', login)
        if (login) {
            console.log('Redirecting to: /')
            navigate('/')
        }
    }, [login, navigate])
    
    

    const formulario = useRef()

    const postLogin = async (e) => {
        e.preventDefault();
    
        const { current: form } = formulario;
    
        const nuevo = {
            usuario: form['usuario'].value,
            password: form['password'].value,
        };
    
        let controller = new AbortController();
    
        let options = {
            method: 'POST',
            signal: controller.signal,
            body: JSON.stringify(nuevo),
            headers: {
                "Content-Type": "application/json"
            }
        };
        try {
           
            const response = await fetch( import.meta.env.VITE_LOGIN, options)
            const data = await response.json();
            console.log(data)
            if (data.login) {
                setLogin(true);
                setError(''); // Limpiar mensaje de error
            } else {
                setError(data.error || 'No se ha encontrado el usuario')
            }
        } catch (error) {
            console.error('Error fetching login:', error)
            setError('Error en el servidor')
        }
    };
    



   return (
   // Formulario de inicio de sesión. El inicio de sesión cuenta con tres usuarios proporcionados en los documentos del proyecto.
   // Cuando el login da error, este se muestra en el front.
   <>


    <div className='Form-wrapper'>
   
    
    <h1>Sumérgete en el mundo</h1>
        <img src={logo} alt={logo} className='Form-logo' />
        {error && <div className="error-message">{error}</div>}
            <form ref={formulario} onSubmit={ postLogin }>
                <div className="Form-wrapper--user user">
                    <label htmlFor="usuario">Usuario:</label>
                    <input type="text" id="username" name="usuario" placeholder='Escribe tu usuario' required/>
                </div>
                <div className="Form-wrapper--password password">
                    <label htmlFor="password">Contraseña:</label>
                    <input type="password" id="password" name="password" placeholder='Escribe tu contraseña' required />
                </div>
                <div className="Form-wrapper--button submit">
                    <button type="submit">Login</button>
                </div>
        </form>
    </div>
    <div className='Form-wrapper--index'>
    <video autoPlay muted loop id="video-background">
                    <source src="/videos/petals.mp4" type="video/mp4" />
                    
    </video>
    </div>
    </>
   )
}