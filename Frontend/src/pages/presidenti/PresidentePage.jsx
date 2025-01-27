import NavbarGrin from '../../components/NavbarGrin.jsx';
import { useParams } from "react-router-dom";
import React, { useState, useEffect } from 'react';

function PresidentePage() {
    const { idPresidente } = useParams();
    const [presidente, setPresidente] = useState();
    const [loading, setLoading] = useState(true);
    useEffect( () => loadPresidente, [idPresidente]); // eseguito ogni volta che cambia idPresidente

    const [pageTitle, setPageTitle] = useState('Presidente');
    useEffect(() => { document.title = pageTitle}, [pageTitle]); // eseguito ogni volta che cambia pageTitle

    const loadPresidente = async () => {
        fetch(`http://localhost:8081/presidenti/${idPresidente}`)
            .then(res => res.json())
            .then(data => {
                // restituisce i dati se non sono capitati errori
                if(data.success){
                    setPresidente(data.data);
                    setLoading(false);
                    setPageTitle('Presidente - '+data.data.Nome+' '+data.data.Cognome);
                }
            })
            .catch(error => console.error("Errore nel caricamento dei dati:", error));
    }

    // funzione per disabilitare l'account di un presidente
    // Attivo: 0
    const offPresidente = async () => {
        const data = {...presidente, Attivo: 0};
        const response = await fetch(`http://localhost:8081/updatePresidente`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        // aggiorno presidente in caso di successo
        if (response.ok) {
            setPresidente(data);
        }
    }

    // funzione per riattivare l'account di un presidente
    // Attivo: 1
    const onPresidente = async () => {
        const data = {...presidente, Attivo: 1};
        const response = await fetch(`http://localhost:8081/updatePresidente`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        // aggiorno presidente in caso di successo
        if (response.ok) {
            setPresidente(data);
        }
    }

    if(loading) return <p>LOADING...</p>
    return (
        <>
            <NavbarGrin />
            <h1 className='text-blue-800'>{presidente.Università}</h1>
            <p className="text-xl">Presidente: {presidente.Nome} {presidente.Cognome}</p>
            <p className="text-xl">Contatto: {presidente.Email}</p>
            <p className="text-xl">Password per primo accesso: {presidente.FirstPassword}</p>
            <p className="text-xl">Stato account: {presidente.Attivo == 1 ? "Attivo" : "Disattivato"}</p>
            <div className="flex space-x-4 p-4 items-center justify-center">
                <p className="text-xl">Azioni: </p>
                { presidente.Attivo == 1 ? 
                    <button className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700" onClick={offPresidente}> Disabilita account </button> :
                    <button className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700" onClick={onPresidente}> Riattiva account </button> }
            </div>
        </>
    )
}
export default PresidentePage;