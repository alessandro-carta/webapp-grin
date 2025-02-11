import React from 'react';
import { Link } from 'react-router-dom';

function Richiesta(props) {
    let linkRichiesta = '';
    if(props.admin) linkRichiesta = `/richiesta/${props.richiesta.id}`;
    else linkRichiesta = `/dashboard/richiesta/${props.richiesta.id}`
    return (
        <>
            { props.admin && <div className="text__content__table">{props.richiesta.università}</div> }
            <div className="text__content__table">{props.richiesta.corsodistudio}</div>
            <div className="text__content__table">{props.richiesta.annoaccademico}</div>
            <div className="text__content__table">{props.richiesta.stato}</div>
            <div className="text__content__table underline">
                <Link to={linkRichiesta} key={props.richiesta.id} className='link'> Visualizza </Link>
            </div >
        </>
    )
}
export default Richiesta;