import { useNavigate, useParams } from "react-router-dom";
import NavbarPresidente from "../../../components/NavbarPresidente"
import { useState, useEffect } from "react";
import Anno from "../../../components/richieste/Anno";



function RegolamentoCDSPage() {
    const { idRegolamento } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    // titolo della pagina
    const [pageTitle, setPageTitle] = useState('Regolamento');
    useEffect(() => { document.title = pageTitle}, [pageTitle]); // eseguito ogni volta che cambia pageTitle
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
                setRegolamento(data.data);
                setLoading(false);
            }
            
        } catch (error) { console.log(error); }
    }
    useEffect(() => loadRegolamento, []); // Non ha dipendenze, eseguito ad ogni render

    const anni = []; // contiene il numero di anni di durata di un CDS
    if(loading) return <p>LOADING...</p>
    else {
        for(let i = 0; i < regolamento.duratacorso; i++) anni.push(i+1);
        return (
            <>
                <NavbarPresidente />
                { /* Azioni possibili solo per richieste non presenti */
                regolamento.richiesta == null &&  
                <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 p-2 items-center justify-center">
                    <p className="text-xl">Azioni: </p>
                    <button className="button__principale" onClick={() => {navigate(`/dashboard/controllo-regole/${idRegolamento}`)}}> Invia richiesta </button>
                    <button className="button__principale" onClick={() => {navigate(`/dashboard/r/${idRegolamento}/crea-un-nuovo-insegnamento`)}}> Aggiungi insegnamento </button>
                </div> }
                {regolamento.stato == "Approvata" && <p className="text-2xl success__message p-4">Richiesta approvata</p>}
                {regolamento.stato == "Invalidata" && <p className="text-2xl error__message p-4">Richiesta invalidata</p>}
                {regolamento.stato == "Elaborazione" && <p className="text-2xl title p-4">Richiesta in fase di elaborazione</p>}
                <p className="text-xl title">{regolamento.corsodistudio} - Regolamento AA: {regolamento.annoaccademico}</p>
                <p className="text-xl">Durata corso: {regolamento.duratacorso}</p>
                { anni.map(a => ( <Anno key={a} richiesta={regolamento.richiesta} regolamento={regolamento.id} anno={a} edit={(regolamento.richiesta == null)} admin={false}/> )) }
            </>
        )
    }
    
}

export default RegolamentoCDSPage