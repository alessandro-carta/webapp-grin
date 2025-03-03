import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingButton from '../LoadingButton';
import PopupAlert from '../PopupAlert';

function Richiesta(props) {
    const [showDeletePopup, setShowDeletePopup] = useState(false); // per gestire la visualizzazione del popup elimina una richiesta
    const navigate = useNavigate();
    const data = new Date(props.richiesta.data);
    const formattedDate = data.toLocaleDateString('it-IT'); // data nel formato gg/mm/aaaa
    const [loading, setLoading] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false); // tiene traccia se una richiesta e' stata eliminata
    const [errDelete, setErrDelete] = useState(false); // tiene traccia se un'eliminazione non e' andata a buon fine per un errore
    const [message, setMessage] = useState('');
    // funzione che richiede la modifica una richiesta invalidata
    const updateRichiesta = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/deleteRichiesta/${props.richiesta.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            })
            // accesso non consentito
            if(response.status == 403) navigate('/');
            // risposta con successo
            if(response.ok) navigate(`/dashboard/r/${props.richiesta.regolamento}`)
            if(!response.ok) {
                setLoading(false);
                const errorData = await response.json();
                setMessage(errorData.message);
                setErrDelete(true);
            }
            
        } catch (error) { console.log(error); }
    }
    // funzione che richiede l'eliminazione di una richiesta invalidata
    const deleteRichiesta = async () => {
        try {
            setShowDeletePopup(false);
            setLoading(true);
            const response = await fetch(`/api/deleteRichiesta/${props.richiesta.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            })
            // accesso non consentito
            if(response.status == 403) navigate('/');
            // risposta con successo
            if(response.ok) {
                setLoading(false);
                setIsDeleted(true);
            }
            if(!response.ok) {
                setLoading(false);
                const errorData = await response.json();
                setMessage(errorData.message);
                setErrDelete(true);
            }
            
        } catch (error) { console.log(error); }
    }
    let linkRichiesta = '';
    if(props.admin) linkRichiesta = `/r/${props.richiesta.regolamento}`;
    else linkRichiesta = `/dashboard/r/${props.richiesta.regolamento}`;
    // componente per popup delete
    let component = null;
    if(showDeletePopup) component = <PopupAlert message="Sei sicuro? Conferma eliminazione" handleYes={deleteRichiesta} handleNo={() => {setShowDeletePopup(false)}} />
    // gestione eliminazione
    if (isDeleted) return null
    if(errDelete){
        return (<>
            { props.admin && <div className="text__content__table error__message">{props.richiesta.università}</div> }
            <div className="text__content__table error__message">{props.richiesta.corsodistudio}</div>
            <div className="text__content__table error__message">{props.richiesta.annoaccademico}</div>
            <div className="text__content__table error__message">{props.richiesta.stato}</div>
            <div className="text__content__table error__message underline">{message}</div >
            <div className="text__content__table md:col-span-2">
                <button className="button__action error__message" onClick={() => {setErrDelete(false);}}> OK </button>
            </div >
        </>)
    }
    return (
        <>
            { props.admin && <div className="text__content__table">{props.richiesta.università}</div> }
            <div className="text__content__table">{props.richiesta.corsodistudio}</div>
            <div className="text__content__table">{props.richiesta.annoaccademico}</div>
            <div className="text__content__table">{props.richiesta.stato}</div>
            <div className="text__content__table">{formattedDate}</div>
            <div className="text__content__table flex justify-center md:col-span-2">
                {!loading && !props.admin && props.richiesta.stato == "Invalidata" && <button className="button__action" onClick={updateRichiesta}> Modifica </button>}
                {!loading && !props.admin && props.richiesta.stato == "Invalidata" && <button className="button__action" onClick={()=> {setShowDeletePopup(true)}}> Elimina </button>}
                {loading && <button className="button__action button__loading"> <LoadingButton /> </button>}
                <button className="button__action" onClick={()=>{navigate(linkRichiesta)}}> Visualizza </button>
            </div >
            {component}
        </>
    )
}
export default Richiesta;