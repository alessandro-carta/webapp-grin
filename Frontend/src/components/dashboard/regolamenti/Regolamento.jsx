import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Regolamento(props) {
    const navigate = useNavigate();
    const [isDeleted, setIsDeleted] = useState(false); // tiene traccia se un regolamento e' stato eliminato

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
        } catch (error) {
            console.log(error);
        }
    }

    if (isDeleted) return null
    return (
        <>
            <div className="p-1 border-b border-gray-300">{props.regolamento.annoaccademico}</div>
            <div className="p-1 underline border-b border-gray-300">
                <Link to={``} key={props.regolamento.id}> Visualizza </Link>
            </div >
            <div className="p-1 underline border-b border-gray-300">
                <button className="m-1" onClick={deleteRegolamento}> Elimina </button>
            </div >
        </>
    )
}
  
export default Regolamento;