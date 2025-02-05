import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';


function Sottoarea(props) {

    const navigate = useNavigate();
    const [isDeleted, setIsDeleted] = useState(false); // tiene traccia se un'area e' stata eliminata
    const [errDelete, setErrDelete] = useState(false); // tiene traccia se un'eliminazione non e' andata a buon fine per un errore
    const [message, setMessage] = useState('');

    const updateSottoarea = async () => { navigate(`/modifica-sottoarea/${props.sottoarea.id}`); }
    const deleteSottoarea = async () => {

        try {
            const response = await fetch(`/api/deleteSottoarea/${props.sottoarea.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            })
            // accesso non consentito
            if(response.status == 403) navigate('/');
            // eliminazione avvenuta con successo
            if (response.ok) setIsDeleted(true);
            // errore nell'eliminazione
            if (!response.ok) {
                const errorData = await response.json();
                setMessage(errorData.message);
                setErrDelete(true);
            }
        } catch (error) { console.log(error); }
    }

    if (isDeleted) return null
    if(errDelete){
        return (<>
            <div className="p-2 border-b border-gray-300 text-red-500">{props.sottoarea.id}</div>
            <div className="p-2 border-b border-gray-300 text-red-500">{props.sottoarea.nome}</div>
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
            <div className="p-2 border-b border-gray-300">{props.sottoarea.id}</div>
            <div className="p-2 border-b border-gray-300">{props.sottoarea.nome}</div>
            { props.admin && <div className="p-2 underline border-b border-gray-300">
                <button className="m-1" onClick={updateSottoarea}> Modifica </button>
                <button className="m-1" onClick={deleteSottoarea}> Elimina </button>
            </div > }
        </>
    )
}
  
export default Sottoarea;