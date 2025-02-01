import NavbarGrin from '../../components/NavbarGrin.jsx';
import { useParams, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import Anno from '../../components/richieste/Anno.jsx';

function RichiestaPage() {
    const { idRichiesta } = useParams();
    const navigate = useNavigate();

    const [totCFU, setTotCFU] = useState(0);
    const countTotCFU = async (regolamento) => {
        fetch(`/api/insegnamenti/${regolamento}`)
            .then(res => res.json())
            .then(data => {
                // restituisce i dati se non sono capitati errori
                if(data.success){
                    let count = 0;
                    data.data.map((insegnamento) =>{
                        count += insegnamento.cfutot;
                    });
                    setTotCFU(count);
                    setLoading(false);
                }
            })
            .catch(error => console.error("Errore nel caricamento dei dati:", error));
    }

    const [loading, setLoading] = useState(true);
    const [richiesta, setRichiesta] = useState();
    const loadRichiesta = async () => {
        fetch(`/api/richiesta/${idRichiesta}`)
            .then(res => res.json())
            .then(data => {
                // restituisce i dati se non sono capitati errori
                if(data.success){
                    const newData = {...data.data, data: new Date(data.data.data)};
                    setRichiesta(newData);
                    countTotCFU(newData.regolamento);
                }
            })
            .catch(error => console.error("Errore nel caricamento dei dati:", error));
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
                    <button className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700" onClick={checkRichiesta}> Controlla regole </button>
                </div>
                <p className="text-xl text-blue-800">{richiesta.corsodistudio} - Regolamento AA: {richiesta.annoaccademico}</p>
                <p className="text-xl">Data richiesta: {richiesta.data.getDate()}/{richiesta.data.getMonth()+1}/{richiesta.data.getFullYear()} - Stato: {richiesta.stato}</p>
                <p className="text-xl">{richiesta.università} - {richiesta.email}</p>
                <p className="text-xl">Durata corso: {richiesta.duratacorso} - Totale CFU: {totCFU}</p>
                { anni.map(a => ( <Anno key={a} regolamento={richiesta.regolamento} anno={a}/> )) }
            </>
        )
    }
    
}
export default RichiestaPage;