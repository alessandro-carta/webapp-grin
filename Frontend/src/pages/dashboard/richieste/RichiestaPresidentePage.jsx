import { useParams, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import NavbarPresidente from "../../../components/NavbarPresidente.jsx";
import Anno from "../../../components/richieste/Anno.jsx";

function RichiestaPresidentePage() {
    const { idRichiesta } = useParams();
    const navigate = useNavigate();    

    const [loading, setLoading] = useState(true);
    const [richiesta, setRichiesta] = useState();
    const loadRichiesta = async () => {
        try {
            const response = await fetch(`/api/richiestaPresidente/${idRichiesta}`, {
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
                const newData = {...data.data, data: new Date(data.data.data)};
                setRichiesta(newData);
                setLoading(false);
            }
            
        } catch (error) { console.log(error); }
    }
    useEffect( () => loadRichiesta, [idRichiesta]); // eseguito ogni volta che cambia idRichiesta

    const [pageTitle, setPageTitle] = useState('Richiesta');
    useEffect(() => { document.title = pageTitle}, [pageTitle]); // eseguito ogni volta che cambia pageTitle
    // funzione per salvare una richiesta in stato di bozza
    const saveRichiesta = async () => {
        try {
            const response = await fetch(`/api/saveRichiesta`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({richiesta: idRichiesta})
            });
            // accesso non consentito
            if(response.status == 403) navigate('/');
            if(response.ok) { navigate('/dashboard/richieste'); }
        } catch (error) { console.log(error); }
    }
    // funzione per eliminare una richiesta
    const deleteRichiesta = async () => {
        try {
            const response = await fetch(`/api/deleteRichiesta/${idRichiesta}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });
            // accesso non consentito
            if(response.status == 403) navigate('/');
            if(response.ok) { navigate('/dashboard/richieste'); }
        } catch (error) { console.log(error); }
    }
    // funzione aggiungere un nuovo insegnamento
    const addInsegnamento = () => { navigate(`/crea-un-nuovo-insegnamento/${idRichiesta}`)}
    // funzione controllo regole
    const checkRegole = () => { navigate(`/dashboard/controllo-regole/${idRichiesta}`)}

    const anni = []; // contiene il numero di anni di durata di un CDS
    if(loading) return <p>LOADING...</p>
    else{
        for(let i = 0; i < richiesta.duratacorso; i++) anni.push(i+1);
        return (
            <>
                <NavbarPresidente />
                { /* Azioni possibili solo per richieste in stato di bozza */
                (richiesta.stato === "Bozza") &&  
                <div className="flex space-x-4 p-4 items-center justify-center">
                    <p className="text-xl">Azioni: </p>
                    <button className="button__principale" onClick={checkRegole}> Invia richiesta </button>
                    <button className="button__principale" onClick={addInsegnamento}> Aggiungi insegnamento </button>
                    <button className="button__principale" onClick={deleteRichiesta}> Elimina richiesta </button>
                </div> }
                { /* Azioni possibili solo per richieste invalidate */
                (richiesta.stato === "Invalidata") &&  
                <div className="flex space-x-4 p-4 items-center justify-center">
                    <p className="text-xl">Azioni: </p>
                    <button className="button__principale" onClick={saveRichiesta}> Modifica Richiesta </button>
                    <button className="button__principale" onClick={deleteRichiesta}> Elimina richiesta </button>
                </div> }
                <p className="text-xl title">{richiesta.corsodistudio} - Regolamento AA: {richiesta.annoaccademico}</p>
                <p className="text-xl">Data richiesta: {richiesta.data.getDate()}/{richiesta.data.getMonth()+1}/{richiesta.data.getFullYear()} - Stato: {richiesta.stato}</p>
                <p className="text-xl">Durata corso: {richiesta.duratacorso}</p>
                { anni.map(a => ( <Anno key={a} richiesta={richiesta.id} regolamento={richiesta.regolamento} anno={a} edit={(richiesta.stato === "Bozza" || richiesta.stato === "Invalidata")} admin={false}/> )) }
            </>
        )
    }
    
}
export default RichiestaPresidentePage;