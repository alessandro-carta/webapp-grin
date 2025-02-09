import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Regolamento(props) {
    const navigate = useNavigate();
    const [isDeleted, setIsDeleted] = useState(false); // tiene traccia se un regolamento è stato eliminato
    const [errDelete, setErrDelete] = useState(false); // tiene traccia se un'eliminazione non è andata a buon fine per un errore
    const [message, setMessage] = useState('');

    const deleteRegolamento = async () => {
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
            if (response.ok) { setIsDeleted(true); }
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
            <div className="p-1 border-b border-gray-300">{props.regolamento.annoaccademico}</div>
            <div className="p-1 underline border-b border-gray-300">
                <button className="m-1" onClick={deleteRegolamento}> Elimina </button>
            </div >
        </>
    )
}
  
export default Regolamento;