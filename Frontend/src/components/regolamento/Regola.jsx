import React from 'react';
import { useState } from 'react';
import LoadingButton from '../LoadingButton';

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
            <div className="text__content__table flex justify-center">
                {!loading && <button className="button__action" onClick={deleteRegola}> Elimina </button>}
                {loading && <button className="button__action button__loading"> <LoadingButton /> </button>}
            </div> }
            {/* Visualizzazione nel caso di controllo requisiti*/}
            {props.check &&
            <div className="text__content__table">
                {props.regola.check && 
                <p className="text-base success__message">Positivo</p>}
                {!props.regola.check && 
                <p className="text-base error__message">Negativo</p>}
            </div> }
        </>
    )
}
export default Regola;