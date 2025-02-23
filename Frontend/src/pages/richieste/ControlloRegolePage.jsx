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
                setStatoRichiesta(data.data.stato)
            }
            
        } catch (error) { console.log(error); }
    }
    useEffect( () => loadRichiesta, [idRichiesta]); // eseguito ogni volta che cambia idRichiesta
    // controllo delle regole
    const [checkAnvur, setCheckAnvur] = useState(false);
    const [regole, setRegole] = useState([]);
    const checkRichiesta = async () => {
        try {
            const response = await fetch(`/api/checkRegole/${idRichiesta}`, {
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
                setRegole(data.data.regole);
                setCheckAnvur(data.data.anvur);
                setLoading(false);
            }
            
        } catch (error) { console.log(error); }
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
        setLoading(true);
        const response = await fetch(`/api/addBollino`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(data)
        });
        // accesso non consentito
        if(response.status == 403) navigate('/');
        // se ha successo torno alla pagina richieste
        if (response.ok) navigate(`/richieste`);
    }
    // funzione per invalidare una richiesta
    const invalidRichiesta = async () => {
        const data = { id: idRichiesta };
        setLoading(true);
        const response = await fetch(`/api/invalidRichiesta`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(data)
        });
        // accesso non consentito
        if(response.status == 403) navigate('/');
        // se ha successo torno alla pagina richieste
        if (response.ok) navigate(`/richieste`);
    }


    // btn Eroga Bollino
    let btnEroga = null;
    if(resultErogazione() && statoRichiesta === 'Elaborazione') btnEroga = <>
        <button className="button__principale" onClick={erogaBollino}> Eroga Bollino </button>
    </>;
    // btn Invalida richiesta
    let btnInvalida = null;
    if(statoRichiesta === 'Elaborazione') btnInvalida = <>
        <button className="button__principale" onClick={invalidRichiesta}> Invalida Richiesta </button>
    </>;
    
    if(loading) return <p>LOADING...</p>
    return(
        <>
            <NavbarGrin />
            <div className="grid grid-cols-1 md:grid-cols-3 p-5">
                <div className="text__header__table md:col-span-2">Descrizione testuale</div>
                <div className="text__header__table">Esito</div>
                {regole.map(r => ( <Regola key={r.idRegola} regola={r} check={true}/> ))}
            </div>
            <p className="text-xl subtitle">Il corso di studio {checkAnvur ? "è" : "non è"} accreditato all'ANVUR</p>
            <p className="text-xl subtitle">La richiesta {resultErogazione() ? "è" : "non è"} valida</p>

            <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 p-2 items-center justify-center">
                <p className="text-xl">Azioni: </p>
                {btnEroga}
                {btnInvalida}
            </div>
            <Link className="link" to={`/r/${idRichiesta}`}>
                    Annulla
            </Link>
            
        </>
        
    )

}

export default ControlloRegolePage;