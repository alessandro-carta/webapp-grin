import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Area(props) {

    const navigate = useNavigate();
    const [isDeleted, setIsDeleted] = useState(false); // tiene traccia se un'area e' stata eliminata
    const [errDelete, setErrDelete] = useState(false); // tiene traccia se un'eliminazione non e' andata a buon fine per un errore
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const updateArea = async () => { navigate(`/modifica-area/${props.area.id}`); }
    const deleteArea = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/deleteArea/${props.area.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            // accesso non consentito
            if(response.status == 403) navigate('/admin-login');
            // eliminazione avvenuta con successo
            if (response.ok) { 
                setLoading(false);
                setIsDeleted(true); 
            }
            // errore nell'eliminazione
            // sottoaree presenti nell'area che si voleva eliminare
            if (!response.ok) {
                setLoading(false);
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
            <div className="text__content__table error__message">{props.area.nome}</div>
            <div className="text__content__table error__message underline">{message}</div >
            <div className="text__content__table">
                <button className="button__action error__message" onClick={() => {setErrDelete(false);}}> OK </button>
            </div >
        </>)
    }

    return (
        <>
            <div className="text__content__table">{props.area.nome}</div>
            <div className="text__content__table underline">
                <Link to={`/a/${props.area.id}/sottoaree/?Visual=${props.admin ? "admin" : "presidente"}`} className='link'> Elenco sottoaree </Link>
            </div >

            {props.admin && 
            <div className="text__content__table">
                <button className="button__action" onClick={updateArea}> Modifica </button>
                {!loading && <button className="button__action" onClick={deleteArea}> Elimina </button>}
            </div>} 
        </>
    )
}
  
export default Area;