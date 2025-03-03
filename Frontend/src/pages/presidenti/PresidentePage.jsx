import NavbarGrin from '../../components/NavbarGrin.jsx';
import { useParams, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import Loading from '../../components/Loading.jsx';
import PopupAlert from '../../components/PopupAlert.jsx';

function PresidentePage() {
    const [showResetPopup, setShowResetPopup] = useState(false); // popup per reset della password
    const [showAbilitaPopup, setShowAbilitaPopup] = useState(false); // popup per abilitare account presidente
    const [showDisabilitaPopup, setShowDisabilitaPopup] = useState(false); // popup per disabilitare account presidente

    const navigate = useNavigate();
    const { idPresidente } = useParams();
    const [loading, setLoading] = useState(true);
    const [messageResult, setMessageResult] = useState(); // contiene un messaggio per visualizzare l'esito dell'azione
    const [pageTitle, setPageTitle] = useState('Presidente');
    useEffect(() => { document.title = pageTitle}, [pageTitle]); // eseguito ogni volta che cambia pageTitle
    // carico il presidente
    const [presidente, setPresidente] = useState();
    const loadPresidente = async () => {
        try {
            const response = await fetch(`/api/presidente/${idPresidente}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            })
            // accesso non consentito
            if(response.status == 403) navigate('/');
            // risposta con successo
            if(response.ok) {
                const data = await response.json();
                setPresidente(data.data);
                setLoading(false);
                setPageTitle('Presidente - '+data.data.nome+' '+data.data.cognome);
            }
            
        } catch (error) { console.log(error); }
    }
    useEffect( () => loadPresidente, []); // eseguito ogni volta che cambia idPresidente
    // funzione per attivare/disattivare l'account di un presidente
    const abilita = () => {updatePresidente(1)}
    const disabilita = () => {updatePresidente(0)}
    const updatePresidente = async (val) => {
        setLoading(true);
        const data = {...presidente, attivo: val};
        try {
            const response = await fetch(`/api/updatePresidente`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            // accesso non consentito
            if(response.status == 403) navigate('/');
            // risposta con successo
            if(response.ok) {
                setLoading(false);
                setPresidente({...presidente, attivo: val});
                let component = <>
                    <p className="success__message">Account {val == 0 ? "disattivato" : "attivato"} con successo!</p>
                </>;
                setMessageResult(component);
            }
            if(!response.ok){
                setLoading(false);
                let component = <>
                    <p className="error__message">Impossibile {val == 0 ? "disattivare" : "attivare"} l'account</p>
                </>;
                setMessageResult(component);
            }
            setShowAbilitaPopup(false);
            setShowDisabilitaPopup(false);
            
        } catch (error) { console.log(error); }
    }
    // funzione per il reset della password
    const resetPassword = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/resetPassword`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({presidente: idPresidente})
            })
            // accesso non consentito
            if(response.status == 403) navigate('/');
            // risposta con successo
            if(response.ok) {
                setLoading(false);
                let component = <>
                    <p className="success__message">Passoword resettata con successo!</p>
                </>;
                setMessageResult(component);
            }
            if(!response.ok){
                setLoading(false);
                let component = <>
                    <p className="error__message">Impossibile resettare la password!</p>
                </>;
                setMessageResult(component);
            }
            setShowResetPopup(false);
            
        } catch (error) { console.log(error); }
    }
    // gestisce la visualizzazione del popup e anche che tipo di popup
    let component = null;
    if(showResetPopup) component = <PopupAlert message="Sei sicuro di resettare la password?" handleYes={resetPassword} handleNo={() => {setShowResetPopup(false)}} />
    if(showAbilitaPopup) component = <PopupAlert message="Sei sicuro di abilitare l'account?" handleYes={abilita} handleNo={() => {setShowAbilitaPopup(false)}} />
    if(showDisabilitaPopup) component = <PopupAlert message="Sei sicuro di disabilitare l'account?" handleYes={disabilita} handleNo={() => {setShowDisabilitaPopup(false)}} />
    if(loading) return <Loading />
    else return (
        <>
            <NavbarGrin />
            <p className='text-2xl title'>{presidente.università}</p>
            <p className="text-xl">Presidente: {presidente.nome} {presidente.cognome}</p>
            <p className="text-xl">Contatto: {presidente.email}</p>
            <p className="text-xl">Password per primo accesso: {presidente.firstpassword}</p>
            <p className="text-xl">Stato account: {presidente.attivo == 1 ? "Attivo" : "Disattivato"}</p>
            <div className="flex space-x-4 p-4 items-center justify-center">
                <p className="text-xl">Azioni: </p>
                { presidente.attivo == 1 ? 
                    <button className="button__principale" onClick={() => {setShowDisabilitaPopup(true)}}> Disabilita account </button> :
                    <button className="button__principale" onClick={() => {setShowAbilitaPopup(true)}}> Riattiva account </button> }
                <button className="button__principale" onClick={() => {setShowResetPopup(true)}}> Reset password </button>
            </div>
            {component}
            {messageResult}
        </>
    )
}
export default PresidentePage;