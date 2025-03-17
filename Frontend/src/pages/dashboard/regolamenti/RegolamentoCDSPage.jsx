import { useNavigate, useParams } from "react-router-dom";
import NavbarPresidente from "../../../components/NavbarPresidente"
import { useState, useEffect } from "react";
import Anno from "../../../components/richieste/Anno";
import Loading from "../../../components/Loading";
import { CFUtoH, unitCFU } from "../../../../ConfigClient";

function RegolamentoCDSPage() {
    const { idRegolamento } = useParams();
    const navigate = useNavigate();
    // loading dei contenuti dinamici
    const [loadingReg, setLoadingReg] = useState(true);
    const [loadingBollino, setLoadingBollino] = useState(true);
    const [loadingIns, setLoadingIns] = useState(true);
    const [loadingAree, setLoadingAree] = useState(true);
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
    // carico il regolamento con anche informazione del corso e della richiesta
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
                setLoadingReg(false);
            }
            
        } catch (error) { console.log(error); }
    }
    useEffect(() => loadRegolamento, []); // Non ha dipendenze, eseguito ad ogni render
    // carico gli insegnamenti
    const [insegnamenti, setInsegnamenti] = useState([]);
    const loadInsegnamenti = async () => {
        try {
            const response = await fetch(`/api/insegnamentiPresidente/${idRegolamento}`, {
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
                setInsegnamenti(data.data);
                setLoadingIns(false);
            }
        } catch (error) { console.log(error); }
    }
    useEffect(() => loadInsegnamenti, []); // Non ha dipendenze, eseguito ad ogni render
    // carico le aree
    const [aree, setAree] = useState();
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
                setLoadingAree(false);
            }
            // accesso non consentito
            if(response.status == 403) navigate('/');
        } catch (error) {
            console.error(error);
        }
    }
    useEffect(() => loadAllAree, []); // Non ha dipendenze, eseguito ad ogni render
    // restituisce l'elenco delle aree, id e nome, che l'insegnamento copre
    const getAreePerInsegnamento = (sottoareeIns, aree) => {
        const idsAree = sottoareeIns.map(sottoarea => sottoarea.area); // elenco idArea che contiene un insegnamento
        const areeFiltrate = aree.filter(area => idsAree.includes(area.id));
        let areeResult = [];
        for(let area of areeFiltrate){
            let sum = 0;
            for(let sottoarea of sottoareeIns) if(area.id == sottoarea.area) sum += sottoarea.ore
            if(sum > 0) areeResult.push({...area, oretot: sum});
        }
        return areeResult;
    }
    // restituisce l'elenco delle aree con il totale per tutto il regolamento
    const getAreePerRegolamento = (insegnamenti, aree) => {
        let areeMap = new Map(); // hash map che contiene le aree con le oretot
        for(let area of aree) areeMap.set(area.id, {...area, oretot: 0}); // carico la hash map con tutte le aree a zero
        for(let ins of insegnamenti){
            let areeIns = getAreePerInsegnamento(ins.sottoaree, aree);
            for(let areaIns of areeIns){
                let getArea = areeMap.get(areaIns.id)
                if(getArea) areeMap.set(areaIns.id, {...getArea, oretot: getArea.oretot+areaIns.oretot}); 
            }
        }
        return Array.from(areeMap.values());
    }

    const anni = []; // contiene il numero di anni di durata di un CDS
    if(loadingReg || loadingBollino || loadingIns || loadingAree) return <Loading />
    else {
        for(let i = 0; i < regolamento.duratacorso; i++) anni.push(i+1);
        return (
            <>
                <NavbarPresidente />
                {regolamento.richiesta == null && <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 p-2 items-center justify-center">
                    <p className="text-xl">Azioni: </p>
                    <button className="button__principale" onClick={() => {navigate(`/dashboard/controllo-regole/${idRegolamento}`)}}> Invia richiesta </button>
                    <button className="button__principale" onClick={() => {navigate(`/dashboard/r/${idRegolamento}/crea-un-nuovo-insegnamento`)}}> Aggiungi insegnamento </button>
                </div>}
                {regolamento.stato == "Approvata" && <p className="text-2xl success__message p-4">Richiesta approvata</p>}
                {regolamento.stato == "Invalidata" && <p className="text-2xl error__message p-4">Richiesta invalidata</p>}
                {regolamento.stato == "Elaborazione" && <p className="text-2xl title p-4">Richiesta in fase di elaborazione</p>}
                {bollino != null && bollino.erogato == 1 && 
                <div className="button__img"> 
                    <div className='button__img__content'>
                        <p className='text-base'>Bollino </p>
                        <img src="../../../../public/logo-grin.png" alt="Logo GRIN" />
                    </div>
                </div>}
                <p className="text-xl title">{regolamento.corsodistudio} - Regolamento AA: {regolamento.annoaccademico}</p>
                <p className="text-xl">Durata corso: {regolamento.duratacorso}</p>
                { anni.map(a => ( <Anno key={a} richiesta={regolamento.richiesta} regolamento={regolamento.id} anno={a} edit={(regolamento.richiesta == null)} admin={false} insegnamenti={insegnamenti.filter(ins => ins.annoerogazione == a)}/> )) }
                <div className="flex flex-col items-start m-4">
                    <p className="title">Riepilogo</p>
                    <div className="flex flex-col items-start m-4">
                        {getAreePerRegolamento(insegnamenti, aree).map((area, keyArea) => (
                            <>
                                {(parseInt(area.oretot) == 0) && <p className="text-xl text-gray-400" key={keyArea}>{area.nome}: {unitCFU ? `${parseInt(area.oretot)/CFUtoH} CFU` : `${area.oretot}h`}</p>}
                                {(parseInt(area.oretot) != 0) && <p className="text-xl" key={keyArea}>{area.nome}: {unitCFU ? `${parseInt(area.oretot)/CFUtoH} CFU` : `${area.oretot}h`}</p>}
                            </>
                        ))}
                    </div>
                    <button className="button__action" onClick={() => {navigate(`/dashboard/r/${idRegolamento}/genera-pdf/?Visual=presidente`)}}> Maggiori dettagli </button>
                </div>
            </>
        )
    }
    
}

export default RegolamentoCDSPage