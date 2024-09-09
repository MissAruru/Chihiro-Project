import './login.css'
import logo from '../../assets/chihiro.png'
import { useEffect, useState } from 'react'
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'


export const Login = () => {

    const [login, setLogin] = useState(false)

    const navigate = useNavigate()

    useEffect( ()=> {
        if (login) {
            navigate('/inicio')
        }

    }, [login, navigate])



    const formulario = useRef()

    const postLogin = async (e) => {

        e.preventDefault()

        const { current : form } = formulario
        
        const nuevo = {
            usuario: form['usuario'].value,
            password: form['password'].value,
        }

        console.log(nuevo)
        
        let controller = new AbortController()

        let options = {
            method : 'POST',
            signal : controller.signal,
            body : JSON.stringify(nuevo),
            headers : {
                "Content-type" : "application/json"
            }
        }

        try {
            const response = await fetch('http://localhost:3000/login', options)
            const data = await response.json()
            setLogin(data.login); 
        } catch (error) {
            console.error('Error fetching login:', error)
            
        }


    }



   return (
   <>
    <div className='Form-wrapper'>
    <h1>Sumérgete en el mundo</h1>
        <img src={logo} alt={logo} className='Form-logo' />
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
    </>
   )
}