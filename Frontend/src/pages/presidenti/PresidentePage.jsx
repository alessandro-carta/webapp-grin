import NavbarGrin from '../../components/NavbarGrin.jsx';
import { useParams, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';

function PresidentePage() {
    const navigate = useNavigate();
    const { idPresidente } = useParams();
    const [presidente, setPresidente] = useState();
    const [loading, setLoading] = useState(true);
    const [messageResult, setMessageResult] = useState(); // contiene un messaggio per visualizzare l'esito dell'azione
    useEffect( () => loadPresidente, [idPresidente]); // eseguito ogni volta che cambia idPresidente

    const [pageTitle, setPageTitle] = useState('Presidente');
    useEffect(() => { document.title = pageTitle}, [pageTitle]); // eseguito ogni volta che cambia pageTitle

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

    // funzione per disabilitare l'account di un presidente
    // Attivo: 0
    const offPresidente = async () => {
        setLoading(true);
        const data = {...presidente, attivo: 0};
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
                setPresidente({...presidente, attivo: 0});
                let component = <>
                    <p className="success__message">Account disattivato con successo!</p>
                </>;
                setMessageResult(component);
            }
            if(!response.ok){
                setLoading(false);
                let component = <>
                    <p className="error__message">Impossibile disattivare l'account</p>
                </>;
                setMessageResult(component);
            }
        } catch (error) { console.log(error); }
    }

    // funzione per riattivare l'account di un presidente
    // Attivo: 1
    const onPresidente = async () => {
        setLoading(true);
        const data = {...presidente, attivo: 1};
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
                setPresidente({...presidente, attivo: 1});
                let component = <>
                    <p className="success__message">Account attivato con successo!</p>
                </>;
                setMessageResult(component);
            }
            if(!response.ok){
                setLoading(false);
                let component = <>
                    <p className="error__message">Impossibile attivare l'account</p>
                </>;
                setMessageResult(component);
            }
            
        } catch (error) { console.log(error); }
    }

    if(loading) return <p>LOADING...</p>
    return (
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
                    <button className="button__principale" onClick={offPresidente}> Disabilita account </button> :
                    <button className="button__principale" onClick={onPresidente}> Riattiva account </button> }
            </div>
            {messageResult}
        </>
    )
}
export default PresidentePage;