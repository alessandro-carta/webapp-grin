import React from 'react';
import { useState } from 'react';

function Regola(props) {
    // props
    // regola: Object
    // check: boolean, true: controllo regole - false: elenco regole
    const [isDeleted, setIsDeleted] = useState(false); // tiene traccia se una regola e' stata eliminata
    const [loading, setLoading] = useState(false);
    const deleteRegola = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/deleteRegola/${props.regola.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            })
            // accesso non consentito
            if(response.status == 403) navigate('/');
            // risposta con successo
            if(response.ok){
                setLoading(false); 
                setIsDeleted(true);
            }
            if(!response.ok) setLoading(false); 
            
        } catch (error) { console.log(error); }
    }
    
    // se regola viene cancellata si elimina dall'elenco
    if (isDeleted) return null
    return (
        <>
            <div className="text__content__table md:col-span-2">{props.regola.descrizione}</div>
            {/* Visualizzazione nel caso di modifiche al regolamento*/}
            {!props.check && props.admin &&
            <div className="text__content__table">
                {!loading && <button className="button__action" onClick={deleteRegola}> Elimina </button>}
            </div> }
            {/* Visualizzazione nel caso di controllo requisiti*/}
            {props.check &&
            <div className="text__content__table">
                <p className="text-base subtitle">{props.regola.check ? "Positivo" : "Negativo"}</p>
            </div> }
        </>
    )
}
export default Regola;