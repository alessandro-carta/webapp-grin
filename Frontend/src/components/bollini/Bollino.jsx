import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Bollino(props){
    console.log(props);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    
    const invalidBollino = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/invalidBollino`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({id: props.bollino.id})
            })
            // accesso non consentito
            if(response.status == 403) navigate('/');
            // risposta con successo
            if(response.ok) {
                props.bollino.erogato = 0;
                setLoading(false);
                //window.location.reload();
            }
            if(!response.ok) setLoading(false);
            
        } catch (error) { console.log(error); }
    }

    // componenti nulli in caso di bollino revocato
    let linkRichiesta = null;
    let btnRevoca = null;
    if(props.bollino.erogato){
        if(props.admin) linkRichiesta = <>
            <Link to={`/r/${props.bollino.regolamento}`} key={props.bollino.id} className="link"> Visualizza </Link>
        </>;
        else linkRichiesta = <>
            <Link to={`/dashboard/r/${props.bollino.regolamento}`} key={props.bollino.id} className="link"> Visualizza </Link>
        </>;
        btnRevoca = <>
            <button className="button__action" onClick={invalidBollino}> Revoca </button>
        </>;
    }
    return (
        <>
            { props.admin && <div className="text__content__table"> {props.bollino.università} </div> }
            <div className="text__content__table">{props.bollino.corsodistudio}</div>
            <div className="text__content__table">{props.bollino.annoaccademico}</div>
            <div className="text__content__table">{props.bollino.erogato ? "Erogato" : "Revocato"}</div>
            <div className="text__content__table underline"> {linkRichiesta} </div>
            { props.admin && !loading && <div className="text__content__table"> {btnRevoca} </div > }
            { props.admin && loading && <div className="text__content__table">
                <button className="button__action"> LOADING... </button>
            </div > }
        </>
    )

}

export default Bollino;