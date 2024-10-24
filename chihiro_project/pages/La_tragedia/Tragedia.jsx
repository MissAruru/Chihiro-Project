/* Tercera parte de la historia. En este caso solo se muestran los elementos , sin animaciones ni cambios. */ 

// Primero se importan las imagenes y el CSS correspondiente.

import tragedy from '../../assets/Tragedia.png'
import './Tragedia.css'

// Y después se añaden los elementos a la historia.
export const Tragedia = () => {
    return(
        <>
        <div className="Wrapper-tragedia" id="tragedia">
            <div className="Wrapper-tragedia--left">
                <h2 className='Wrapper-tragedia--h2'>La </h2>
                <h2 className='Wrapper-tragedia--h2 tragedia'>tragedia</h2>
                <h3 className='Wrapper-tragedia--h3'>王国の悲劇</h3>
            </div>
            <div className="Wrapper-tragedia--center">
               <p>A diferencia de otros países, en Chihiro existe un tratado de paz entre los seres de la noche y el día. </p>
               <p>Pero tras el repentino fallecimiento del rey del país, la situación entre las razas vuelve a ser conflictiva..</p>
            </div>
            <div className="Wrapper-tragedia--right">
                <img src={tragedy} alt="Img-tragedia"/>
            </div>
        </div>
        </>
    )
}