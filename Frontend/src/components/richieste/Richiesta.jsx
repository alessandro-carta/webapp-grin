import React from 'react';
import { Link } from 'react-router-dom';

function Richiesta(props) {
    return (
        <>
            <div className="p-1 border-b border-gray-300">{props.richiesta.università}</div>
            <div className="p-1 border-b border-gray-300">{props.richiesta.corsodistudio}</div>
            <div className="p-1 border-b border-gray-300">{props.richiesta.annoaccademico}</div>
            <div className="p-1 border-b border-gray-300">{props.richiesta.stato}</div>
            <div className="p-1 underline border-b border-gray-300">
                <Link to={`/richiesta/${props.richiesta.id}`} key={props.richiesta.id}> Visualizza </Link>
            </div >
        </>
    )
}
export default Richiesta;