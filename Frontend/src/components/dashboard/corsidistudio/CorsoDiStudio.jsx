import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react'; 

function CorsoDiStudio(props) {   
    const navigate = useNavigate();
    const [isDeleted, setIsDeleted] = useState(false); // tiene traccia se un CDS e' stata eliminata
    const [errDelete, setErrDelete] = useState(false); // tiene traccia se un'eliminazione non e' andata a buon fine per un errore
    const [message, setMessage] = useState('');

    const deleteCDS = async () => {
        try {
            const response = await fetch(`/api/deleteCDS/${props.corso.id}`, {
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
            <div className="p-1 border-b border-gray-300">{props.corso.corsodistudio}</div>
            <div className="p-1 border-b border-gray-300">{props.corso.università}</div>
            <div className="p-1 border-b border-gray-300">{props.corso.durata}</div>
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
            <div className="p-1 border-b border-gray-300">{props.corso.corsodistudio}</div>
            <div className="p-1 border-b border-gray-300">{props.corso.università}</div>
            <div className="p-1 border-b border-gray-300">{props.corso.durata}</div>
            <div className="p-1 underline border-b border-gray-300">
                <Link to={`/dashboard/regolamenti/${props.corso.id}`} key={props.corso.id}> Visualizza </Link>
            </div >
            <div className="p-1 underline border-b border-gray-300">
                <button className="m-1" onClick={deleteCDS}> Elimina </button>
            </div >
        </>
    )
}
  
export default CorsoDiStudio;