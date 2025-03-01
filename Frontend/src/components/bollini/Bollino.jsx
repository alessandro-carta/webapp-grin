import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import LoadingButton from '../LoadingButton';

function Bollino(props){
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    // funzione invalida bollino
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
            }
            if(!response.ok) setLoading(false);
            
        } catch (error) { console.log(error); }
    }
    // funzione per resettare il bollino
    const resetBollino = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/activeBollino`, {
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
                props.bollino.erogato = 1;
                setLoading(false);
            }
            if(!response.ok) setLoading(true);
            
        } catch (error) { console.log(error); }
    }
    if(props.public){
        return <>
            <div className="text__content__table">{props.bollino.università}</div>
            <div className="text__content__table">{props.bollino.corsodistudio}</div>
            <div className="text__content__table">{props.bollino.annoaccademico}</div>
        </>
    }
    else{
        // link dimanico a seconda del tipo di utente
        let linkRichiesta = null;
        if(props.admin) linkRichiesta = <>
            <Link to={`/r/${props.bollino.regolamento}`} key={props.bollino.id} className="link"> Visualizza </Link>
        </>;
        else linkRichiesta = <>
            <Link to={`/dashboard/r/${props.bollino.regolamento}`} key={props.bollino.id} className="link"> Visualizza </Link>
        </>;
        // azioni: Revoca e Ripristina il bollino
        let btnAction = null;
        if(props.bollino.erogato){
            btnAction = <>
                <button className="button__action" onClick={invalidBollino}> Revoca </button>
            </>;
        } else{
            btnAction = <>
                <button className="button__action" onClick={resetBollino}> Ripristina </button>
            </>;
        }
        return (
            <>
                { props.admin && <div className="text__content__table"> {props.bollino.università} </div> }
                <div className="text__content__table">{props.bollino.corsodistudio}</div>
                <div className="text__content__table">{props.bollino.annoaccademico}</div>
                <div className="text__content__table">{props.bollino.erogato ? "Erogato" : "Revocato"}</div>
                <div className="text__content__table underline"> {linkRichiesta} </div>
                { props.admin && !loading && <div className="text__content__table"> {btnAction} </div > }
                { props.admin && loading && <div className="text__content__table">
                    <button className="button__action button__loading"> <LoadingButton /> </button>
                </div > }
            </>
        )

    }
    

}

export default Bollino;