import { useNavigate, useParams } from "react-router-dom";
import NavbarPresidente from "../../../components/NavbarPresidente"
import { useState, useEffect } from "react";
import Anno from "../../../components/richieste/Anno";
import Loading from "../../../components/Loading";

function RegolamentoCDSPage() {
    const { idRegolamento } = useParams();
    const navigate = useNavigate();
    // loading dei contenuti dinamici
    const [loading, setLoading] = useState(true);
    const [loadingBollino, setLoadingBollino] = useState(true);
    const [showPdf, setShowPdf] = useState(false);
    // titolo della pagina
    const [pageTitle, setPageTitle] = useState('Regolamento');
    useEffect(() => { document.title = pageTitle}, [pageTitle]); // eseguito ogni volta che cambia pageTitle
    // recupero un eventuale bollino associato
    const [bollino, setBollino] = useState();
    const loadBollino = async (richiesta) => {
        try {
            const response = await fetch(`/api/bollinoRichiestaPresidente/${richiesta}`, {
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
                setLoadingBollino(false);
                return data.data;
            }
            setLoadingBollino(false);
            return null;
        } catch (error) { console.log(error); }
    }
    // regolamento con anche informazione del corso e della richiesta
    const [regolamento, setRegolamento] = useState();
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
                if(data.data.richiesta != null && data.data.stato == "Approvata"){
                    const statoBollino = await loadBollino(data.data.richiesta);
                    setBollino(statoBollino);
                }
                setLoadingBollino(false);
                setRegolamento(data.data);
                setLoading(false);
            }
            
        } catch (error) { console.log(error); }
    }
    useEffect(() => loadRegolamento, []); // Non ha dipendenze, eseguito ad ogni render

    const anni = []; // contiene il numero di anni di durata di un CDS
    if(loading || loadingBollino) return <Loading />
    else {
        for(let i = 0; i < regolamento.duratacorso; i++) anni.push(i+1);
        return (
            <>
                <NavbarPresidente />
                <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 p-2 items-center justify-center">
                    <p className="text-xl">Azioni: </p>
                    {regolamento.richiesta == null && <><button className="button__principale" onClick={() => {navigate(`/dashboard/controllo-regole/${idRegolamento}`)}}> Invia richiesta </button>
                    <button className="button__principale" onClick={() => {navigate(`/dashboard/r/${idRegolamento}/crea-un-nuovo-insegnamento`)}}> Aggiungi insegnamento </button></>}
                    <button className="button__principale" onClick={() => {navigate(`/dashboard/r/${idRegolamento}/genera-pdf`)}}> Esporta in PDF </button>
                </div>
                {regolamento.stato == "Approvata" && <p className="text-2xl success__message p-4">Richiesta approvata</p>}
                {regolamento.stato == "Invalidata" && <p className="text-2xl error__message p-4">Richiesta invalidata</p>}
                {regolamento.stato == "Elaborazione" && <p className="text-2xl title p-4">Richiesta in fase di elaborazione</p>}
                {bollino != null && bollino.erogato == 1 && 
                <div className="button__img"> 
                    <div className='button__img__content'>
                        <p className='text-base'>Bollino | </p>
                        <img src="../../../../public/logo-grin.png" alt="Logo GRIN" />
                    </div>
                </div>}
                <p className="text-xl title">{regolamento.corsodistudio} - Regolamento AA: {regolamento.annoaccademico}</p>
                <p className="text-xl">Durata corso: {regolamento.duratacorso}</p>
                { anni.map(a => ( <Anno key={a} richiesta={regolamento.richiesta} regolamento={regolamento.id} anno={a} edit={(regolamento.richiesta == null)} admin={false}/> )) }
            </>
        )
    }
    
}

export default RegolamentoCDSPage