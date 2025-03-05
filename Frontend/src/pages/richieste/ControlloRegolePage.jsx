import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Regola from "../../components/regolamento/Regola";
import NavbarGrin from "../../components/NavbarGrin";
import Loading from "../../components/Loading";
import PopupAlert from "../../components/PopupAlert";


function ControlloRegolePage(){
    const [showInvalidaPopup, setShowInvalidaPopup] = useState(false); // per gestire la visualizzazione del popup quando invalido una richiesta
    const [showErogaPopup, setShowErogaPopup] = useState(false); // per gestire la visualizzazione del popup quando erogo un bollino
    const navigate = useNavigate();
    const { idRegolamento } = useParams();
    const [loading, setLoading] = useState(true);
    // carico lo stato della richiesta
    const [regolamento, setRegolamento] = useState('');
    const loadRegolamento = async () => {
        try {
            const response = await fetch(`/api/regolamentoAdmin/${idRegolamento}`, {
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
            const response = await fetch(`/api/checkRegole/${idRegolamento}`, {
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
    useEffect(() => checkRichiesta, [idRegolamento]); // Ogni volta che cambia idRichiesta
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
        setShowErogaPopup(false);
        const data = {erogato: 1, richiesta: regolamento.richiesta};
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
        setShowInvalidaPopup(false);
        const data = { id: regolamento.richiesta };
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
    if(resultErogazione() && regolamento.richiesta != null && regolamento.stato == "Elaborazione") btnEroga = <>
        <button className="button__principale" onClick={() => {setShowErogaPopup(true)}}> Eroga Bollino </button>
    </>;
    // btn Invalida richiesta
    let btnInvalida = null;
    if(regolamento.richiesta != null && regolamento.stato == "Elaborazione") btnInvalida = <>
        <button className="button__principale" onClick={() => {setShowInvalidaPopup(true)}}> Invalida Richiesta </button>
    </>;
    // componente per la gestione del popup e del suo tipo
    let component = null;
    if(showInvalidaPopup) component = <PopupAlert message="Sei sicuro di voler invalidare questa richiesta?" handleYes={invalidRichiesta} handleNo={() => {setShowInvalidaPopup(false)}} />
    if(showErogaPopup) component = <PopupAlert message="Sei sicuro di voler erogare il bollino per questa richiesta?" handleYes={erogaBollino} handleNo={() => {setShowErogaPopup(false)}} />
    if(loading) return <Loading />
    return(
        <>
            <NavbarGrin />
            <div className="grid grid-cols-1 md:grid-cols-3 p-5">
                <div className="text__header__table md:col-span-2">Descrizione testuale</div>
                <div className="text__header__table">Esito</div>
                {regole.map((r, index) => ( <Regola key={index} regola={r} check={true}/> ))}
            </div>
            {checkAnvur && <p className="text-xl success__message">Il corso di studio è accreditato all'ANVUR</p>}
            {!checkAnvur && <p className="text-xl error__message">Il corso di studio non è accreditato all'ANVUR</p>}
            {resultErogazione() && <p className="p-2 text-xl subtitle">La richiesta ha superato il controllo, puoi erogare il Bollino!</p>}
            {!resultErogazione() && <p className="p-2 text-xl subtitle">Impossibile erogare il Bollino! (Controlli non superati)</p>}
            
            <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 p-2 items-center justify-center">
                <p className="text-xl">Azioni: </p>
                {btnEroga}
                {btnInvalida}
            </div>
            <Link className="link" to={`/r/${idRegolamento}`}>
                    Torna alla richiesta
            </Link>
            {component}
        </>
        
    )

}

export default ControlloRegolePage;