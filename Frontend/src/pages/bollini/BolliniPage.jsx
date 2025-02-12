import { useState, useEffect } from "react";
import NavbarGrin from "../../components/NavbarGrin";
import Bollino from "../../components/bollini/Bollino";
import { useNavigate } from "react-router-dom";


function BolliniPage(){
    const navigate = useNavigate();
    const [pageTitle, setPageTitle] = useState('Elenco dei bollini');
    useEffect(() => { document.title = pageTitle }, [pageTitle]); // eseguito ogni volta che cambia pageTitle

    const [loading, setLoading] = useState(true);
    const [bollini, setBollini] = useState([]);
    const [bolliniAll, setBolliniAll] = useState([]);
    const loadBollini = async () => {
        try {
            const response = await fetch(`/api/bollini`, {
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
                setBollini(data.data);
                setBolliniAll(data.data);
                setLoading(false);
            }
            
        } catch (error) { console.log(error); }
    }
    useEffect(() => loadBollini, []);

    // funzione per il filtro sullo stato del bollino
    const handleChange = (e) => {
        const {  value } = e.target;
        if(value === "All") setBollini(bolliniAll);
        if(value === "Erogato") setBollini(bolliniAll.filter((bollino) => bollino.erogato == 1));
        if (value === "Revocato") setBollini(bolliniAll.filter((bollino) => bollino.erogato == 0));
    }

    if(loading) return <p>LOADING...</p>
    return (
        <>
            <NavbarGrin />
            <div className="flex space-x-4 p-2 items-center justify-center">
                <p className="text-xl">Stato: </p>
                <select
                    id="filtroBollino"
                    name="filtroBollino"
                    onChange={handleChange}
                >
                    <option value="All">Tutti</option>
                    <option value="Erogato">Erogato</option>
                    <option value="Revocato">Revocato</option>
                </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-6 p-5">
                <div className="text__header__table">Università</div>
                <div className="text__header__table">Corso Di Studio</div>
                <div className="text__header__table">Anno Accademico</div>
                <div className="text__header__table">Stato</div>
                <div className="text__header__table">Richiesta</div>
                <div className="text__header__table">Azioni</div>
                {bollini.map(bollino => ( <Bollino key={bollino.id} bollino={bollino} admin={true}/>))}
            </div>
        </>
    )

}

export default BolliniPage;