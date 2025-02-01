import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Regola from "../../components/regolamento/Regola";
import NavbarGrin from "../../components/NavbarGrin";

function ControlloRegolePage(){
    const navigate = useNavigate();
    const { idRichiesta } = useParams();
    const [loading, setLoading] = useState(true);
    // carico lo stato della richiesta
    const [statoRichiesta, setStatoRichiesta] = useState('');
    const loadRichiesta = async () => {
        fetch(`/api/richiesta/${idRichiesta}`)
            .then(res => res.json())
            .then(data => {
                // restituisce i dati se non sono capitati errori
                if(data.success) setStatoRichiesta(data.data.stato);
            })
            .catch(error => console.error("Errore nel caricamento dei dati:", error));
    }
    useEffect( () => loadRichiesta, [idRichiesta]); // eseguito ogni volta che cambia idRichiesta
    // controllo delle regole
    const [checkAnvur, setCheckAnvur] = useState(false);
    const [regole, setRegole] = useState([]);
    const checkRichiesta = async () => {
        fetch(`/api/checkRegole/${idRichiesta}`)
            .then(res => res.json())
            .then(data => {
                // restituisce i dati se non sono capitati errori
                if(data.success){
                    setRegole(data.data.regole);
                    setCheckAnvur(data.data.anvur);
                    setLoading(false);
                }
            })
            .catch(error => console.error("Errore nel caricamento dei dati:", error));
        
    }
    useEffect(() => checkRichiesta, [idRichiesta]); // Ogni volta che cambia idRichiesta
    // restituisce l'esito della richiesta
    const resultErogazione = () => {
        if(checkAnvur == false) return false;
        for(let regola of regole){
            if(regola.check == false) return false;
        }
        return true;
    }

    const [pageTitle, setPageTitle] = useState('Controllo delle regole');
    useEffect(() => { document.title = pageTitle}, [pageTitle]); // eseguito ogni volta che cambia pageTitle

    // funzione per erogare un bollino
    const erogaBollino = async () => {
        const data = {erogato: 1, richiesta: idRichiesta};
        const response = await fetch(`/api/addBollino`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });
        // se ha successo torno alla pagina richieste
        if (response.ok) navigate(`/richieste`);
    }
    // funzione per invalidare una richiesta
    const invalidRichiesta = async () => {
        const data = { id: idRichiesta };
        const response = await fetch(`/api/invalidRichiesta`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });
        // se ha successo torno alla pagina richieste
        if (response.ok) navigate(`/richieste`);
    }


    // btn Eroga Bollino
    let btnEroga = null;
    if(resultErogazione() && statoRichiesta === 'Elaborazione') btnEroga = <>
        <button className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700" onClick={erogaBollino}> Eroga Bollino </button>
    </>;
    // btn Invalida richiesta
    let btnInvalida = null;
    if(statoRichiesta === 'Elaborazione') btnInvalida = <>
        <button className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700" onClick={invalidRichiesta}> Invalida Richiesta </button>
    </>;
    
    if(loading) return <p>LOADING...</p>
    return(
        <>
            <NavbarGrin />
            <div className="grid grid-cols-1 md:grid-cols-3 p-5">
                <div className="font-semibold text-lg text-blue-800 p-2 border-b-2 border-blue-800 md:col-span-2">Descrizione testuale</div>
                <div className="font-semibold text-lg text-blue-800 p-2 border-b-2 border-blue-800"></div>
                {regole.map(r => (
                    <Regola key={r.idRegola} regola={r} check={true}/>
                ))}
            </div>
            <p className="text-2xl text-blue-700">Il corso di studio {checkAnvur ? "è" : "non è"} accreditato all'ANVUR</p>
            <p className="text-2xl text-blue-700">La richiesta {resultErogazione() ? "è" : "non è"} valida</p>

            <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 p-2 items-center justify-center">
                <p className="text-xl">Azioni: </p>
                {btnEroga}
                {btnInvalida}
            </div>
            <Link className="text-blue-500 hover:text-blue-700" to={`/richiesta/${idRichiesta}`}>
                    Annulla
            </Link>
            
        </>
        
    )

}

export default ControlloRegolePage;