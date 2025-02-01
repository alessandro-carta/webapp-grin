import NavbarGrin from "../../components/NavbarGrin.jsx";
import Area from "../../components/aree/Area.jsx";
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

function AreePage(){
    const [aree, setAree] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [pageTitle, setPageTitle] = useState('Elenco delle aree');

    const loadAllAree = async () => {
        fetch('/api/aree')
            .then(res => res.json())
            .then(data => {
                // restituisce i dati se non sono capitati errori
                if(data.success){
                    setAree(data.data);
                    setLoading(false);
                }
            })
            .catch(error => console.error("Errore nel caricamento dei dati:", error));
    }

    useEffect(() => { document.title = pageTitle}, [pageTitle]); // eseguito ogni volta che cambia pageTitle
    useEffect(() => loadAllAree, []); // Non ha dipendenze, eseguito ad ogni render
    
    // funzioni button azioni
    const createNewArea = () => { navigate('/crea-una-nuova-area'); }
    const createNewSottoArea = () => { navigate('/crea-una-nuova-sottoarea'); }

    if(loading) return <p>LOADING...</p>
    return(
        <>
            <NavbarGrin />
            <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 p-2 items-center justify-center">
                <p className="text-xl">Azioni: </p>
                <button className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700" onClick={createNewArea}> Nuova Area</button>
                <button className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700" onClick={createNewSottoArea}> Nuova Sottoarea </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 p-5">
                <div className="font-semibold text-lg text-blue-800 p-2 border-b-2 border-blue-800">Sigla</div>
                <div className="font-semibold text-lg text-blue-800 p-2 border-b-2 border-blue-800">Nome</div>
                <div className="font-semibold text-lg text-blue-800 p-2 border-b-2 border-blue-800"></div>
                <div className="font-semibold text-lg text-blue-800 p-2 border-b-2 border-blue-800"></div>

                {aree.map(a => (
                    <Area key={a.idArea} area={a}/>
                ))}           
            </div>

        </>
    )


}

export default AreePage;