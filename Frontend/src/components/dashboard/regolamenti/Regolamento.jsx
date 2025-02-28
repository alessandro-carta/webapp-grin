import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import LoadingButton from '../../LoadingButton'

function Regolamento(props) {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [isDeleted, setIsDeleted] = useState(false); // tiene traccia se un regolamento è stato eliminato
    const [errDelete, setErrDelete] = useState(false); // tiene traccia se un'eliminazione non è andata a buon fine per un errore
    const [message, setMessage] = useState('');

    // azioni possibili su un regolamento
    const duplicateRegolamento = async () => { navigate(`/dashboard/c/${props.regolamento.cds}/duplica-regolamento/${props.regolamento.id}`) }
    const deleteRegolamento = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/deleteRegolamento/${props.regolamento.id}`, {
                method: 'DELETE',
                headers: { 
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ CDS: props.regolamento.CDS })
            });
            // accesso non consentito
            if(response.status == 403) navigate('/');
            // eliminazione avvenuta con successo
            if (response.ok) { 
                setLoading(false);
                setIsDeleted(true); 
            }
            // errore nell'eliminazione
            if (!response.ok) {
                setLoading(false);
                const errorData = await response.json();
                setMessage(errorData.message);
                setErrDelete(true);
            }
        } catch (error) { console.log(error); }
    }

    if (isDeleted) return null
    if(errDelete){
        return (<>
            <div className="text__content__table underline error__message">
                {message}
            </div >
            <div className="text__content__table error__message">
                <button className="button__action error__message" onClick={() => {setErrDelete(false);}}> OK </button>
            </div >
        </>)
    }
    return (
        <>
            <div className="text__content__table">{props.regolamento.annoaccademico}</div>
            <div className="text__content__table flex justify-center">
                <button className="button__action" onClick={duplicateRegolamento}> Duplica </button>
                <button className="button__action" onClick={()=>{navigate(`/dashboard/r/${props.regolamento.id}`)}}> {props.regolamento.richiesta == null ? "Modifica" : "Visualizza"} </button>
                {!loading && props.regolamento.richiesta == null && <button className="button__action" onClick={deleteRegolamento}> Elimina </button>}
                {loading && <button className="button__action button__loading"> <LoadingButton /> </button>}
            </div >
            
        </>
    )
}
  
export default Regolamento;