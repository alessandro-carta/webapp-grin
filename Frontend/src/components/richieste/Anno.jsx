import { useState, useEffect } from "react";
import Insegnamento from "./Insegnamento";
import { useNavigate } from "react-router-dom";

function Anno(props){
    const navigate = useNavigate();
    const [clickedAnno, setClickedAnno] = useState(false);
    
    /*useEffect(() => {
        let linkFetch;
        if(!props.admin) linkFetch = `/api/insegnamentiPresidente/${props.regolamento}`;
        else linkFetch = `/api/insegnamenti/${props.regolamento}`;
        loadInsegnamenti(linkFetch);
    }, [props.admin]);

    const [loading, setLoading] = useState(true);
    const [insegnamenti, setInsegnamenti] = useState([]);
    const loadInsegnamenti = async (linkFetch) => {
        try {
            const response = await fetch(linkFetch, {
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
    }*/

    const showDetailAnno = () => { setClickedAnno(!clickedAnno) }
    let component;
    if(!clickedAnno) component = null;
    if(clickedAnno){
        component = <>
            <div className="grid grid-cols-1 md:grid-cols-4 p-5">
                <div className="text__header__table">Nome</div>
                <div className="text__header__table">Ore</div>
                <div className="text__header__table">Sottoaree</div>
                <div className="text__header__table">Azioni</div>
                {props.insegnamenti.map((i) => (<Insegnamento key={i.id} insegnamento={i} edit={props.edit}/>))}
            </div> 
        </>;
    }
    return (
        <>
            <div className="anno__container">
                <p className="text-2xl title" onClick={showDetailAnno}>Insegnamenti Anno: {props.anno} {clickedAnno ? '-' : '+'}</p>
                {component}
            </div>
        </>
    )
}
export default Anno;