import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import NavbarPresidente from "../../../components/NavbarPresidente";
import Regola from "../../../components/regolamento/Regola";

function ControlloRegolePresidentePage(){
    const navigate = useNavigate();
    const { idRichiesta } = useParams();
    const [loading, setLoading] = useState(true);
    // carico lo stato della richiesta
    const [statoRichiesta, setStatoRichiesta] = useState('');
    const loadRichiesta = async () => {
        try {
            const response = await fetch(`/api/richiestaPresidente/${idRichiesta}`, {
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
            const response = await fetch(`/api/checkRegolePresidente/${idRichiesta}`, {
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
    // funzione per inviare una richiesta
    const sendRichiesta = async () => {
        const response = await fetch(`/api/sendRichiesta`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({richiesta: idRichiesta})
        });
        // accesso non consentito
        if(response.status == 403) navigate('/');
        // se ha successo torno alla pagina delle richieste
        if (response.ok) navigate(`/dashboard/richieste/`);
    }
    // btn per inviare la richiesta
    let btnSendRichiesta = null;
    if(resultErogazione() && statoRichiesta === 'Bozza') btnSendRichiesta = <>
        <button className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700" onClick={sendRichiesta}> Invia Richiesta </button>
    </>;

    const [pageTitle, setPageTitle] = useState('Controllo delle regole');
    useEffect(() => { document.title = pageTitle}, [pageTitle]); // eseguito ogni volta che cambia pageTitle

    if(loading) return <p>LOADING...</p>
    return(
        <>
            <NavbarPresidente />
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
                {btnSendRichiesta}
            </div>
            <Link className="text-blue-500 hover:text-blue-700" to={`/dashboard/richiesta/${idRichiesta}`}>
                    Annulla
            </Link>
            
        </>
        
    )

}

export default ControlloRegolePresidentePage;