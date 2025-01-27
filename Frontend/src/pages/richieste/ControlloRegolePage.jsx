import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Regola from "../../components/regolamento/Regola";
import NavbarGrin from "../../components/NavbarGrin";

function ControlloRegolePage(){
    const { idRegolamento } = useParams();
    const [regole, setRegole] = useState([]);
    const [loading, setLoading] = useState(true);
    const checkRichiesta = async () => {
        fetch(`http://localhost:8081/checkRegole/${idRegolamento}`)
            .then(res => res.json())
            .then(data => {
                // restituisce i dati se non sono capitati errori
                if(data.success){
                    setRegole(data.data);
                    setLoading(false);
                    console.log(data.data);
                }
            })
            .catch(error => console.error("Errore nel caricamento dei dati:", error));
        
    }
    useEffect(() => checkRichiesta, [idRegolamento]); // Ogni volta che cambia idRichiesta

    // restituisce l'esito della richiesta
    const resultErogazione = () => {
        for(let regola of regole){
            if(regola.Check == false) return false;
        }
        return true;
    }

    const [pageTitle, setPageTitle] = useState('Controllo delle regole');
    useEffect(() => { document.title = pageTitle}, [pageTitle]); // eseguito ogni volta che cambia pageTitle

    if(loading) return <p>LOADING...</p>
    return(
        <>
            <NavbarGrin />
            <h1 className='text-blue-800'>{pageTitle}</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 p-5">
                <div className="font-semibold text-lg text-blue-800 p-2 border-b-2 border-blue-800 md:col-span-2">Descrizione testuale</div>
                <div className="font-semibold text-lg text-blue-800 p-2 border-b-2 border-blue-800"></div>
                {regole.map(r => (
                    <Regola key={r.idRegola} regola={r} check={true}/>
                ))}
            </div>
            <p className="text-2xl text-blue-700">La richiesta è {resultErogazione() ? "accettata" : "rifiutata"}</p>
            
        </>
        
    )

}

export default ControlloRegolePage;