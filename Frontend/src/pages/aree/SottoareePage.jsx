import NavbarGrin from "../../components/NavbarGrin.jsx";
import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import Sottoarea from "../../components/aree/Sottoarea.jsx";

function SottoareePage(){
    const [pageTitle, setPageTitle] = useState('Elenco delle sottoaree');
    const { idArea } = useParams();
    const [sottoaree, setSottoaree] = useState([]);
    const [area, setArea] = useState();
    const [loadingA, setLoadingA] = useState(true);
    const [loadingS, setLoadingS] = useState(true);
    
    const loadArea = async () => {
        fetch(`/api/area/${idArea}`)
            .then(res => res.json())
            .then(data => {
                if(data.success){
                    setArea(data.data);
                    setLoadingA(false);
                    setPageTitle('Elenco delle sottoaree'+" - "+data.data.Nome);
                }
            })
            .catch(error => console.error("Errore nel caricamento dei dati:", error));
    }
    const loadAllSottoaree = async () => {
        fetch(`/api/sottoaree/${idArea}`)
            .then(res => res.json())
            .then(data => {
                if(data.success){
                    setSottoaree(data.data);
                    setLoadingS(false);
                }
            })
            .catch(error => console.error("Errore nel caricamento dei dati:", error));
    }

    useEffect(() => { document.title = pageTitle}, [pageTitle]); // eseguito ogni volta che cambia pageTitle
    useEffect(() => {
        loadArea();
        loadAllSottoaree();
    } , []); // Non ha dipendenze, eseguito ad ogni render

    if(loadingA || loadingS) return <p>LOADING...</p>
    return(
        <>
            <NavbarGrin />
            <p className='text-4xl text-blue-800 p-2'>{pageTitle}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 p-5">
                <div className="font-semibold text-lg text-blue-800 p-2 border-b-2 border-blue-800">Sigla</div>
                <div className="font-semibold text-lg text-blue-800 p-2 border-b-2 border-blue-800">Nome</div>
                <div className="font-semibold text-lg text-blue-800 p-2 border-b-2 border-blue-800"></div>

                {sottoaree.map(s => (
                    <Sottoarea key={s.idSottoarea} sottoarea={s}/>
                ))}           
            </div>

        </>
    )


}

export default SottoareePage;