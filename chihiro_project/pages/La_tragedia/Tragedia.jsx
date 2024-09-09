import tragedy from '../../assets/Tragedia.png'
import './Tragedia.css'

export const Tragedia = () => {
    return(
        <>
        <div className="Wrapper-tragedia" id="tragedia">
            <div className="Wrapper-tragedia--left">
                <h2 className='Wrapper-tragedia--h2'>La tragedia</h2>
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