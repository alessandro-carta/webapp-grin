import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import NavbarPresidente from "../../../components/NavbarPresidente";
import Regola from "../../../components/regolamento/Regola";
import Loading from "../../../components/Loading";

function ControlloRegolePresidentePage(){
    const navigate = useNavigate();
    const { idRegolamento } = useParams();
    const [loading, setLoading] = useState(true);
    // carico il regolamento
    const [regolamento, setRegolamento] = useState('');
    const loadRegolamento = async () => {
        try {
            const response = await fetch(`/api/regolamento/${idRegolamento}`, {
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
                setRegolamento(data.data);
            }
            
        } catch (error) { console.log(error); }
    }
    useEffect( () => loadRegolamento, [idRegolamento]); // eseguito ogni volta che cambia idRichiesta
    // controllo delle regole
    const [checkAnvur, setCheckAnvur] = useState(false);
    const [regole, setRegole] = useState([]);
    const checkRichiesta = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/checkRegolePresidente/${idRegolamento}`, {
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
            
        } catch (error) { setLoading(false); console.log(error); }
    }
    useEffect(() => checkRichiesta, [idRegolamento]); // Ogni volta che cambia idRichiesta
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
        setLoading(true);
        const today = new Date().toISOString().split('T')[0];
        const response = await fetch(`/api/sendRichiesta`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({regolamento: idRegolamento, data: today})
        });
        // accesso non consentito
        if(response.status == 403) navigate('/');
        // se ha successo torno alla pagina delle richieste
        if (response.ok) {
            const data = await response.json();
            navigate(`/dashboard/richieste`);
        }
        if(!response.ok) setLoading(false);
    }
    // btn per inviare la richiesta
    let btnSendRichiesta = null;
    if(resultErogazione() && regolamento.richiesta == null) btnSendRichiesta = <>
        <button className="button__principale" onClick={sendRichiesta}> Invia Richiesta </button>
    </>;

    const [pageTitle, setPageTitle] = useState('Controllo delle regole');
    useEffect(() => { document.title = pageTitle}, [pageTitle]); // eseguito ogni volta che cambia pageTitle

    if(loading) return <Loading />
    return(
        <>
            <NavbarPresidente />
            <div className="grid grid-cols-1 md:grid-cols-3 p-5">
                <div className="text__header__table md:col-span-2">Descrizione testuale</div>
                <div className="text__header__table">Esito</div>
                {regole.map((r, index) => (
                    <Regola key={index} regola={r} check={true}/>
                ))}
            </div>
            <p className="text-xl subtitle">Il corso di studio {checkAnvur ? "è" : "non è"} accreditato all'ANVUR</p>
            <p className="text-xl subtitle">La richiesta {resultErogazione() ? "ha" : "non ha"} suparato il controllo</p>

            <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 p-2 items-center justify-center">
                <p className="text-xl">Azioni: </p>
                {btnSendRichiesta}
            </div>
            <Link className="link" to={`/dashboard/r/${idRegolamento}`}>
                    Annulla
            </Link>
            
        </>
        
    )

}

export default ControlloRegolePresidentePage;