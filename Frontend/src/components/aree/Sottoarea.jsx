import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';


function Sottoarea(props) {

    const navigate = useNavigate();
    const [isDeleted, setIsDeleted] = useState(false); // tiene traccia se un'area e' stata eliminata
    const [errDelete, setErrDelete] = useState(false); // tiene traccia se un'eliminazione non e' andata a buon fine per un errore
    const [message, setMessage] = useState('');

    const updateSottoarea = async () => { navigate(`/modifica-sottoarea/${props.sottoarea.idSottoarea}`); }
    const deleteSottoarea = async () => {
        const response = await fetch(`/api/deleteSottoarea/${props.sottoarea.idSottoarea}`, {
            method: 'DELETE'
        });
        // eliminazione avvenuta con successo
        if (response.ok) { setIsDeleted(true); }

        // errore nell'eliminazione
        if (!response.ok) {
            const errorData = await response.json();
            setMessage(errorData.message);
            setErrDelete(true);
        }
        
    }

    if (isDeleted) return null
    if(errDelete){
        return (<>
            <div className="p-2 border-b border-gray-300 text-red-500">{props.sottoarea.idSottoarea}</div>
            <div className="p-2 border-b border-gray-300 text-red-500">{props.sottoarea.Nome}</div>
            <div className="p-2 underline border-b border-gray-300 text-red-500">
                {message}
            </div >
            <div className="p-2 underline border-b border-gray-300  text-red-500">
                <button className="m-1" onClick={() => {setErrDelete(false);}}> OK </button>
            </div >
        </>)
    }

    return (
        <>
            <div className="p-2 border-b border-gray-300">{props.sottoarea.idSottoarea}</div>
            <div className="p-2 border-b border-gray-300">{props.sottoarea.Nome}</div>

            <div className="p-2 underline border-b border-gray-300">
                <button className="m-1" onClick={updateSottoarea}> Modifica </button>
                <button className="m-1" onClick={deleteSottoarea}> Elimina </button>
            </div >
        </>
    )
}
  
export default Sottoarea;