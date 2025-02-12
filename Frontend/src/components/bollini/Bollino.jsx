import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Bollino(props){
    const navigate = useNavigate();
    
    const invalidBollino = async () => {
        try {
            const response = await fetch(`/api/invalidBollino/${props.bollino.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            })
            // accesso non consentito
            if(response.status == 403) navigate('/');
            // risposta con successo
            if(response.ok) window.location.reload();
            
        } catch (error) { console.log(error); }
    }

    // componenti nulli in caso di bollino revocato
    let linkRichiesta = null;
    let btnRevoca = null;
    if(props.bollino.erogato){
        if(props.admin) linkRichiesta = <>
            <Link to={`/richiesta/${props.bollino.richiesta}`} key={props.bollino.id} className="link"> Visualizza </Link>
        </>;
        else linkRichiesta = <>
            <Link to={`/dashboard/richiesta/${props.bollino.richiesta}`} key={props.bollino.id} className="link"> Visualizza </Link>
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
            { props.admin && <div className="text__content__table"> {btnRevoca} </div > }
        </>
    )

}

export default Bollino;