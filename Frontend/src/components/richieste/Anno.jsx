import { useState, useEffect } from "react";
import Insegnamento from "./Insegnamento";

function Anno(props){
    const [clickedAnno, setClickedAnno] = useState(false);

    const [loading, setLoading] = useState(true);
    const [insegnamenti, setInsegnamenti] = useState([]);
    const loadInsegnamenti = async () => {
        try {
            const response = await fetch(`/api/insegnamenti/${props.regolamento}`, {
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
                const fil = data.data.filter(insegnamento => insegnamento.annoerogazione == props.anno);
                setInsegnamenti(fil);
                setLoading(false);
            }
            
        } catch (error) { console.log(error); }
    }
    useEffect(() => loadInsegnamenti, []); // non ha dipendenze, eseguito ad ogni render

    const showDetailAnno = () => { setClickedAnno(!clickedAnno) }
    let component;
    if(!loading && !clickedAnno) component = null;
    if(!loading && clickedAnno){
        component = insegnamenti.map((i) => (
            <Insegnamento key={i.id} insegnamento={i}/>
        ))}
    return (
        <>
            <div className="border p-1 m-2 border-gray-300">
                <p className="text-2xl text-blue-800" onClick={showDetailAnno}>Insegnamenti Anno: {props.anno} {clickedAnno ? '-' : '+'}</p>
                <div className="flex flex-wrap items-start justify-center md:justify-start">
                    {component}
                </div>
            </div>
        </>
    )
}
export default Anno;