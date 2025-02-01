import React from 'react';
import { useState } from 'react';

function Regola(props) {
    // props
    // regola: Object
    // check: boolean, true: controllo regole - false: elenco regole
    const [isDeleted, setIsDeleted] = useState(false); // tiene traccia se una regola e' stata eliminata
    const deleteRegola = async () => {
        const response = await fetch(`/api/deleteRegola/${props.regola.id}`, {
            method: 'DELETE'
        });
        // eliminazione avvenuta con successo
        if (response.ok) { setIsDeleted(true); }
    }
    
    // se regola viene cancellata si elimina dall'elenco
    if (isDeleted) return null
    return (
        <>
            <div className="p-1 border-b border-gray-300 md:col-span-2">{props.regola.descrizione}</div>
            {/* Visualizzazione nel caso di modifiche al regolamento*/}
            {!props.check && 
            <div className="p-1 underline border-b border-gray-300">
                <button className="m-1" onClick={deleteRegola}> Elimina </button>
            </div> }
            {/* Visualizzazione nel caso di controllo requisiti*/}
            {props.check &&
            <div className="p-1 border-b border-gray-300">
                <p className="text-blue-700">Esito: {props.regola.check ? "Positivo" : "Negativo"}</p>
            </div> }
            
        </>
    )
}
export default Regola;