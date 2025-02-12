import NavbarGrin from "../../components/NavbarGrin.jsx";
import NavbarPresidente from "../../components/NavbarPresidente.jsx";
import Area from "../../components/aree/Area.jsx";
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";

function AreePage(){
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const visual = queryParams.get('Visual');
    const [admin, setAdmin] = useState(false);
    useEffect(() => {
        if (visual === 'admin') setAdmin(true);
    }, [visual]);

    const [aree, setAree] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [pageTitle, setPageTitle] = useState('Elenco delle aree');

    const loadAllAree = async () => {
        try {
            const response = await fetch('/api/aree', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            // risposta con successo
            if(response.ok){
                const data = await response.json();
                setAree(data.data);
                setLoading(false);
            }
            // accesso non consentito
            if(response.status == 403) navigate('/');
        } catch (error) {
            console.error(error);
        }
        
    }

    useEffect(() => { document.title = pageTitle}, [pageTitle]); // eseguito ogni volta che cambia pageTitle
    useEffect(() => loadAllAree, []); // Non ha dipendenze, eseguito ad ogni render
    
    // funzioni button azioni
    const createNewArea = () => { navigate('/crea-una-nuova-area'); }
    const createNewSottoArea = () => { navigate('/crea-una-nuova-sottoarea'); }

    let navbar;
    if(admin) navbar = <NavbarGrin />
    else navbar = <NavbarPresidente />

    if(loading) return <p>LOADING...</p>
    return(
        <>
            {navbar}
            { admin && 
            <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 p-2 items-center justify-center">
                <p className="text-xl">Azioni: </p>
                <button className="button__principale" onClick={createNewArea}> Nuova Area</button>
                <button className="button__principale" onClick={createNewSottoArea}> Nuova Sottoarea </button>
            </div> }
            <div className={`grid grid-cols-1 ${admin ? 'md:grid-cols-4' : 'md:grid-cols-3'} p-5`}>
                <div className="text__header__table">Sigla</div>
                <div className="text__header__table">Nome</div>
                <div className="text__header__table">Sottoaree</div>
                { admin && <div className="font-semibold text-lg text-blue-800 p-2 border-b-2 border-blue-800">Azioni</div> }
                {aree.map(a => ( <Area key={a.id} area={a} admin={admin}/> ))}           
            </div>

        </>
    )


}

export default AreePage;