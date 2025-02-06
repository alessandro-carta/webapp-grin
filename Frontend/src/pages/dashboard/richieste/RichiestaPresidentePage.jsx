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

    const anni = []; // contiene il numero di anni di durata di un CDS
    if(loading) return <p>LOADING...</p>
    else{
        for(let i = 0; i < richiesta.duratacorso; i++) anni.push(i+1);
        return (
            <>
                <NavbarPresidente />
                { /* Azioni possibili solo per richieste ancora non inviate o invalidate */
                (richiesta.stato === "Bozza" || richiesta.stato === "Invalidata") &&  
                <div className="flex space-x-4 p-4 items-center justify-center">
                    <p className="text-xl">Azioni: </p>
                    <button className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700"> Invia richiesta </button>
                    <button className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700"> Aggiungi insegnamento </button>
                    <button className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700"> Salva come bozza </button>
                    <button className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700"> Elimina richiesta </button>
                </div> }
                <p className="text-xl text-blue-800">{richiesta.corsodistudio} - Regolamento AA: {richiesta.annoaccademico}</p>
                <p className="text-xl">Data richiesta: {richiesta.data.getDate()}/{richiesta.data.getMonth()+1}/{richiesta.data.getFullYear()} - Stato: {richiesta.stato}</p>
                <p className="text-xl">{richiesta.università} - {richiesta.email}</p>
                <p className="text-xl">Durata corso: {richiesta.duratacorso}</p>
                { anni.map(a => ( <Anno key={a} regolamento={richiesta.regolamento} anno={a} edit={(richiesta.stato === "Bozza" || richiesta.stato === "Invalidata")} admin={false}/> )) }
            </>
        )
    }
    
}
export default RichiestaPresidentePage;