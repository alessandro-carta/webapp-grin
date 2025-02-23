import { useState, useEffect } from "react";
import NavbarGrin from "../../components/NavbarGrin";
import Bollino from "../../components/bollini/Bollino";
import { useNavigate } from "react-router-dom";


function BolliniPage(){
    // dati per la gestione dei filtri
    const [annoAccademico, setAnnoAccademico] = useState("All");
    const [stato, setStato] = useState("All");
    const [filtroAnni, setFiltroAnni] = useState([]);

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
                const anni = [];
                data.data.map((d) => { 
                    if(!anni.includes(d.annoaccademico)) anni.push(d.annoaccademico); 
                });
                setBollini(data.data);
                setBolliniAll(data.data);
                setFiltroAnni(anni);
                setLoading(false);
            }
            
        } catch (error) { console.log(error); }
    }
    useEffect(() => loadBollini, []);

    // gestione dei filtri
    const filtraDati = () => {
        const boll = [];
        bolliniAll.map(bollino => {
            if(bollino.annoaccademico === annoAccademico || annoAccademico === 'All')
            if(bollino.erogato+"" === stato || stato === 'All')
                boll.push(bollino);
        })
        setBollini(boll);
    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        if(name === 'filtroAnno') setAnnoAccademico(value);
        if(name === 'filtroStato') setStato(value);
    }
    useEffect(() => filtraDati(), [annoAccademico, stato]);

    if(loading) return <p>LOADING...</p>
    return (
        <>
            <NavbarGrin />
            <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 p-2 items-center justify-center">
                <p className="text-xl">Anno Accademico: </p>
                <select
                    id="filtroAnno"
                    name="filtroAnno"
                    onChange={handleChange}
                >
                    <option value="All">Tutti</option>
                    {filtroAnni.map(anno => (
                    <option key={anno} value={anno}>{anno}</option> ))}
                </select>
                <p className="text-xl">Stato: </p>
                <select
                    id="filtroStato"
                    name="filtroStato"
                    onChange={handleChange}
                >
                    <option value="All">Tutti</option>
                    <option value="1">Erogato</option>
                    <option value="0">Revocato</option>
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