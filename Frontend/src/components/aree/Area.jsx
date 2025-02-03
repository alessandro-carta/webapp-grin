import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';


function Area(props) {

    const navigate = useNavigate();
    const [isDeleted, setIsDeleted] = useState(false); // tiene traccia se un'area e' stata eliminata
    const [errDelete, setErrDelete] = useState(false); // tiene traccia se un'eliminazione non e' andata a buon fine per un errore
    const [message, setMessage] = useState('');

    const updateArea = async () => { navigate(`/modifica-area/${props.area.id}`); }
    const deleteArea = async () => {
        try {
            const response = await fetch(`/api/deleteArea/${props.area.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            // accesso non consentito
            if(response.status == 403) navigate('/admin-login');
            // eliminazione avvenuta con successo
            if (response.ok) { setIsDeleted(true); }
            // errore nell'eliminazione
            // sottoaree presenti nell'area che si voleva eliminare
            if (!response.ok) {
                const errorData = await response.json();
                setMessage(errorData.message);
                setErrDelete(true);
            }
        } catch (error) {
            console.log(error);
        }
        
        
    }


    if (isDeleted) return null
    if(errDelete){
        return (<>
            <div className="p-2 border-b border-gray-300 text-red-500">{props.area.id}</div>
            <div className="p-2 border-b border-gray-300 text-red-500">{props.area.nome}</div>
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
            <div className="p-2 border-b border-gray-300">{props.area.id}</div>
            <div className="p-2 border-b border-gray-300">{props.area.nome}</div>
            <div className="p-2 underline border-b border-gray-300">
                <Link to={`/sottoaree/${props.area.id}`}> Elenco sottoaree </Link>
            </div >

            <div className="p-2 underline border-b border-gray-300">
                <button className="m-1" onClick={updateArea}> Modifica </button>
                <button className="m-1" onClick={deleteArea}> Elimina </button>
            </div >
        </>
    )
}
  
export default Area;