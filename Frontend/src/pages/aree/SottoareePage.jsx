import NavbarGrin from "../../components/NavbarGrin.jsx";
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import Sottoarea from "../../components/aree/Sottoarea.jsx";

function SottoareePage(){
    const [pageTitle, setPageTitle] = useState('Elenco delle sottoaree');
    const { idArea } = useParams();
    const [sottoaree, setSottoaree] = useState([]);
    const [area, setArea] = useState();
    const [loadingA, setLoadingA] = useState(true);
    const [loadingS, setLoadingS] = useState(true);
    const navigate = useNavigate();
    
    const loadArea = async () => {
        try {
            const response = await fetch(`/api/area/${idArea}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            // accesso non consentito
            if(response.status == 403) navigate('/');
            // risposta con successo
            if(response.ok){
                const data = await response.json();
                setArea(data.data);
                setLoadingA(false);
                setPageTitle('Elenco delle sottoaree per '+data.data.nome);
            }
        } catch (error) { console.log(error); }
    }
    const loadAllSottoaree = async () => {
        try {
            const response = await fetch(`/api/sottoaree/${idArea}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            // accesso non consentito
            if(response.status == 403) navigate('/');
            // risposta con successo
            if(response.ok){
                const data = await response.json();
                setSottoaree(data.data);
                setLoadingS(false);
            }
        } catch (error) { console.log(error); }
    }

    useEffect(() => { document.title = pageTitle}, [pageTitle]); // eseguito ogni volta che cambia pageTitle
    useEffect(() => {
        loadArea();
        loadAllSottoaree();
    } , []); // Non ha dipendenze, eseguito ad ogni render

    const createNewSottoArea = () => { navigate(`/crea-una-nuova-sottoarea/${idArea}`); }

    if(loadingA || loadingS) return <p>LOADING...</p>
    return(
        <>
            <NavbarGrin />
            <p className='text-4xl text-blue-800 p-2'>{pageTitle}</p>
            <div className="flex space-x-4 p-4 items-center justify-center">
                <p className="text-xl">Azioni: </p>
                <button className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700" onClick={createNewSottoArea}> Nuova Sottoarea </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 p-5">
                <div className="font-semibold text-lg text-blue-800 p-2 border-b-2 border-blue-800">Sigla</div>
                <div className="font-semibold text-lg text-blue-800 p-2 border-b-2 border-blue-800">Nome</div>
                <div className="font-semibold text-lg text-blue-800 p-2 border-b-2 border-blue-800"></div>

                {sottoaree.map(s => (
                    <Sottoarea key={s.id} sottoarea={s}/>
                ))}           
            </div>

        </>
    )


}

export default SottoareePage;