import NavbarGrin from '../../components/NavbarGrin.jsx';
import { useParams, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import Anno from '../../components/richieste/Anno.jsx';

function RichiestaPage() {
    const anni = []; // contiene il numero di anni di durata di un CDS
    const navigate = useNavigate();
    const { idRichiesta } = useParams();
    const [richiesta, setRichiesta] = useState();
    const [loading, setLoading] = useState(true);
    useEffect( () => loadRichiesta, [idRichiesta]); // eseguito ogni volta che cambia idPresidente

    const [pageTitle, setPageTitle] = useState('Richiesta');
    useEffect(() => { document.title = pageTitle}, [pageTitle]); // eseguito ogni volta che cambia pageTitle

    const loadRichiesta = async () => {
        fetch(`http://localhost:8081/richiesta/${idRichiesta}`)
            .then(res => res.json())
            .then(data => {
                // restituisce i dati se non sono capitati errori
                if(data.success){
                    const dateObj = new Date(data.data.Data);
                    const newData = {...data.data, Data: dateObj};
                    setRichiesta(newData);
                    setLoading(false);
                }
            })
            .catch(error => console.error("Errore nel caricamento dei dati:", error));
    }

    // funzione per controllare i requisiti di una richiesta
    const checkRichiesta = () => { navigate(`/controllo-regole/${richiesta.idRegolamento}`)}

    if(loading) return <p>LOADING...</p>
    else{
        for(let i = 0; i < richiesta.AnnoDurata; i++){
            anni.push(i+1);
        }
        return (
            <>
                <NavbarGrin />
                <h1 className="text-blue-800">{richiesta.Nome}</h1>
                <div className="flex space-x-4 p-4 items-center justify-center">
                <p className="text-xl">Azioni: </p>
                    <button className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700" onClick={checkRichiesta}> Controlla regole </button>
                </div>
                <p className="text-xl">Data: {richiesta.Data.getDate()}/{richiesta.Data.getMonth()+1}/{richiesta.Data.getFullYear()}</p>
                <p className="text-xl">Presidente: {richiesta.Email}</p>
                <p className="text-xl">Università: {richiesta.Università}</p>
                <p className="text-xl">Regolamento: {richiesta.AnnoAccademico}</p>
                <p className="text-xl">Durata corso: {richiesta.AnnoDurata}</p>
                <p className="text-xl">Stato: {richiesta.Stato}</p>

                {anni.map(a => (
                    <Anno key={a} idRegolamento={richiesta.idRegolamento} anno={a}/>
                ))}
            </>
        )
    }
    
}
export default RichiestaPage;