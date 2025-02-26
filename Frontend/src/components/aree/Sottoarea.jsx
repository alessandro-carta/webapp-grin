import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import LoadingButton from '../LoadingButton';


function Sottoarea(props) {

    const navigate = useNavigate();
    const [isDeleted, setIsDeleted] = useState(false); // tiene traccia se un'area e' stata eliminata
    const [errDelete, setErrDelete] = useState(false); // tiene traccia se un'eliminazione non e' andata a buon fine per un errore
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const updateSottoarea = async () => { navigate(`/modifica-sottoarea/${props.sottoarea.id}`); }
    const deleteSottoarea = async () => {
        try {
            setLoading(true);
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
            <div className="text__content__table error__message">{props.sottoarea.nome}</div>
            <div className="text__content__table error__message underline"> {message} </div >
            <div className="text__content__table">
                <button className="button__action error__message" onClick={() => {setErrDelete(false);}}> OK </button>
            </div >
        </>)
    }
    return (
        <>
            <div className="text__content__table">{props.sottoarea.nome}</div>
            { props.admin && 
            <div className="text__content__table flex justify-center">
                <button className="button__action" onClick={updateSottoarea}> Modifica </button>
                {!loading && <button className="button__action" onClick={deleteSottoarea}> Elimina </button>}
                {loading && <button className="button__action"> <LoadingButton /> </button>}

            </div > }
        </>
    )
}
  
export default Sottoarea;