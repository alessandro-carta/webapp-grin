import React from 'react';
import { Link } from 'react-router-dom';

function Richiesta(props) {    
    return (
        <>
            <div className="p-1 border-b border-gray-300">{props.richiesta.Data.getDate()}/{props.richiesta.Data.getMonth()+1}/{props.richiesta.Data.getFullYear()}</div>
            <div className="p-1 border-b border-gray-300">{props.richiesta.Università}</div>
            <div className="p-1 border-b border-gray-300">{props.richiesta.Email}</div>
            <div className="p-1 border-b border-gray-300">{props.richiesta.Stato}</div>
            <div className="p-1 underline border-b border-gray-300">
                <Link to={`/richiesta/${props.richiesta.idRichiesta}`} key={props.richiesta.idRichiesta}> Visualizza </Link>
            </div >
        </>
    )
}
export default Richiesta;