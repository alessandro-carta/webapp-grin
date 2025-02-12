import NavbarGrin from '../../components/NavbarGrin.jsx';
import { useParams, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import Anno from '../../components/richieste/Anno.jsx';

function RichiestaPage() {
    const { idRichiesta } = useParams();
    const navigate = useNavigate();

    const [totCFU, setTotCFU] = useState(0);
    const countTotCFU = async (regolamento) => {
        try {
            const response = await fetch(`/api/insegnamenti/${regolamento}`, {
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
                let count = 0;
                data.data.map((insegnamento) =>{
                    count += insegnamento.cfutot;
                });
                setTotCFU(count);
                setLoading(false);
            }
            
        } catch (error) { console.log(error); }
    }

    const [loading, setLoading] = useState(true);
    const [richiesta, setRichiesta] = useState();
    const loadRichiesta = async () => {
        try {
            const response = await fetch(`/api/richiesta/${idRichiesta}`, {
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
                countTotCFU(newData.regolamento);
            }
            
        } catch (error) { console.log(error); }
    }
    useEffect( () => loadRichiesta, [idRichiesta]); // eseguito ogni volta che cambia idRichiesta

    const [pageTitle, setPageTitle] = useState('Richiesta');
    useEffect(() => { document.title = pageTitle}, [pageTitle]); // eseguito ogni volta che cambia pageTitle
    
    // funzione per controllare i requisiti di una richiesta
    const checkRichiesta = () => { navigate(`/controllo-regole/${idRichiesta}`)}

    const anni = []; // contiene il numero di anni di durata di un CDS
    if(loading) return <p>LOADING...</p>
    else{
        for(let i = 0; i < richiesta.duratacorso; i++) anni.push(i+1);
        return (
            <>
                <NavbarGrin />
                <div className="flex space-x-4 p-4 items-center justify-center">
                    <p className="text-xl">Azioni: </p>
                    <button className="button__principale" onClick={checkRichiesta}> Controlla regole </button>
                </div>
                <p className="text-xl title">{richiesta.corsodistudio} - Regolamento AA: {richiesta.annoaccademico}</p>
                <p className="text-xl">Data richiesta: {richiesta.data.getDate()}/{richiesta.data.getMonth()+1}/{richiesta.data.getFullYear()} - Stato: {richiesta.stato}</p>
                <p className="text-xl">{richiesta.università} - {richiesta.email}</p>
                <p className="text-xl">Durata corso: {richiesta.duratacorso} - Totale CFU: {totCFU}</p>
                { anni.map(a => ( <Anno key={a} richiesta={richiesta.id} regolamento={richiesta.regolamento} anno={a} admin={true} edit={false}/> )) }
            </>
        )
    }
    
}
export default RichiestaPage;