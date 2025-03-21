import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import NavbarPresidente from "../../../components/NavbarPresidente";
import Regola from "../../../components/regolamento/Regola";
import Loading from "../../../components/Loading";
import PopupAlert from "../../../components/PopupAlert";

function ControlloRegolePresidentePage(){
    const [showSendPopup, setShowSendPopup] = useState(false); // per gestire la visualizzazione del popup inviare una richiesta
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
        setShowSendPopup(false);
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
        <button className="button__principale" onClick={()=>{setShowSendPopup(true)}}> Invia Richiesta </button>
    </>;

    const [pageTitle, setPageTitle] = useState('Controllo delle regole');
    useEffect(() => { document.title = pageTitle}, [pageTitle]); // eseguito ogni volta che cambia pageTitle
    // componente per popup send
    let component = null;
    if(showSendPopup) component = <PopupAlert message="Confermi a voler inviare una richiesta?" handleYes={sendRichiesta} handleNo={() => {setShowSendPopup(false)}} />
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
            {checkAnvur && <p className="text-xl success__message">Il corso di studio è accreditato all'ANVUR</p>}
            {!checkAnvur && <p className="text-xl error__message">Il corso di studio non è accreditato all'ANVUR</p>}
            {resultErogazione() && <p className="p-2 text-xl subtitle">Il regolamento ha superato il controllo, puoi inviare una richiesta!</p>}
            {!resultErogazione() && <p className="text-xl subtitle">Impossibile inviare una richiesta! (Controlli non superati)</p>}
            {resultErogazione() && <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 p-2 items-center justify-center">
                <p className="text-xl">Azioni: </p>
                {btnSendRichiesta}
            </div>}
            <Link className="link" to={`/dashboard/r/${idRegolamento}`}>
                    Torna a modificare
            </Link>
            {component}
        </>
        
    )

}

export default ControlloRegolePresidentePage;