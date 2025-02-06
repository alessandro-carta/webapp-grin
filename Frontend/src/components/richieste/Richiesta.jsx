import React from 'react';
import { Link } from 'react-router-dom';

function Richiesta(props) {
    let linkRichiesta = '';
    if(props.admin) linkRichiesta = `/richiesta/${props.richiesta.id}`;
    else linkRichiesta = `/dashboard/richiesta/${props.richiesta.id}`
    return (
        <>
            { props.admin && <div className="p-1 border-b border-gray-300">{props.richiesta.università}</div> }
            <div className="p-1 border-b border-gray-300">{props.richiesta.corsodistudio}</div>
            <div className="p-1 border-b border-gray-300">{props.richiesta.annoaccademico}</div>
            <div className="p-1 border-b border-gray-300">{props.richiesta.stato}</div>
            <div className="p-1 underline border-b border-gray-300">
                <Link to={linkRichiesta} key={props.richiesta.id}> Visualizza </Link>
            </div >
        </>
    )
}
export default Richiesta;