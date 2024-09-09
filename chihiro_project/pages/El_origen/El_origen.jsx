import React, { useState } from 'react';
import arrow from '../../assets/Arrow.png';
import origin_bunny from '../../assets/bunny_moon.webp';
import './El_origen.css';
import origenSlide from '../../assets/origen_2.png'
import lantern from '../../assets/chihiro_lantern.png'
import hand from '../../assets/chihiro_hand.png'

export const Origen = () => {
    const [historia, setHistoria] = useState('primera');

    const cambiarHistoria = () => {
        setHistoria(historia === 'primera' ? 'segunda' : 'primera')
    }

    return (
        <div className={`Origen-wrapper ${historia}`} id="origen">
            <h2 className='Wrapper-origenh2 left-letter'>El origen</h2>
            <h3 className='Wrapper-origenh3 right-letter'>物語の起源</h3>
            <div className='arrow'>
                <img src={arrow} alt="arrow" className='Wrapper-arrow' onClick={cambiarHistoria} />
            </div>
            <div className="Wrapper-origen-bottom left">
                {historia === 'primera' ? (
                    <>
                        <p className='Wrapper-text--first'>Según las viejas historias, el reino de Chihiro se remonta a antaño, cuando la diosa Inari se apiadó de un conejo blanco y lo subió hasta la luna.</p>
                        <img src={origin_bunny} alt="bunny-moon" className='Wrapper-bunny-moon' />
                        <p className='Wrapper-text--second'>El conejo, agradecido, le pidió un último favor. “Recoge a mi amigo el zorro, por favor”. La deidad aceptó y los dos animales pudieron estar finalmente juntos.</p>
                    </>
                ) : (
                    <>
                        <div className='Wrapper-container'>
                        <img src={origenSlide} alt="other-bunny" className='Wrapper-origen--img' />
                        <img src={lantern} alt="lantern_chihiro" className='Wrapper-origen--lantern' />
                        <p className='Wrapper-origen--text'>Desde entonces en ese país se realizan ofrendas a esa diosa compasiva y benevolente, pero algo está a punto de cambiar..</p>
                        <img src={hand} alt="hand_chihiro" className='Wrapper-origen--hand' />
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
