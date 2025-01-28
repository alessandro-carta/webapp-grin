import { useState, useEffect } from "react";
function Anno(props){
    const [loading, setLoading] = useState(true);
    const [clicked, setClicked] = useState(false);

    const [insegnamenti, setInsegnamenti] = useState([]);
    const loadInsegnamenti = async () => {
        fetch(`/api/insegnamenti/${props.idRegolamento}`)
            .then(res => res.json())
            .then(data => {
                // restituisce i dati se non sono capitati errori
                if(data.success){
                    const fil = data.data.filter(insegnamento => insegnamento.AnnoErogazione == props.anno);
                    setInsegnamenti(fil);
                    setLoading(false);
                }
            })
            .catch(error => console.error("Errore nel caricamento dei dati:", error));
    }
    useEffect(() => loadInsegnamenti, []); // Non ha dipendenze, eseguito ad ogni render

    const showDetail = () => { setClicked(!clicked) }
    let component;
    if(!loading && !clicked){
        component = null;
    }
    if(!loading && clicked){
        component = insegnamenti.map((insegnamento) => (
            <div key={insegnamento.idInsegnamento} className="border-b border-gray-300">
                <p className="text-xl">Insegnamento: {insegnamento.Nome}</p>
                <p className="text-xl">CFU (totali): {insegnamento.CFU}</p>
                <p className="text-xl">Settore: {insegnamento.Settore}</p>
                <p className="text-xl text-blue-800">Sottoaree:</p>
                {insegnamento.Sottoaree.map((sottoarea) => (
                    <div key={sottoarea.idSottoarea}>
                        <p className="text-xl">{sottoarea.Nome} | CFU: {sottoarea.CFU}</p>
                    </div> ))}
            </div> ))}
    return (
        <div>
            <p className="text-2xl text-blue-800" onClick={showDetail}>Insegnamenti Anno: {props.anno} {clicked ? '-' : '+'}</p>
            {component}
        </div>
    )
}
export default Anno;