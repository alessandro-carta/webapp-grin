import { Link } from "react-router-dom";

function Bollino(props){
    
    const invalidBollino = async () => {
        const response = await fetch(`/api/invalidBollino/${props.bollino.id}`, {
            method: 'PUT'
        });
        // eliminazione avvenuta con successo
        if (response.ok) { window.location.reload(); }
    }

    // componenti nulli in caso di bollino revocato
    let linkRichiesta = null;
    let btnRevoca = null;
    if(props.bollino.erogato){
        linkRichiesta = <>
            <Link to={`/richiesta/${props.bollino.richiesta}`} key={props.bollino.id}> Visualizza </Link>
        </>;
        btnRevoca = <>
            <button className="m-1" onClick={invalidBollino}> Revoca </button>
        </>;
    }
    return (
        <>
            <div className="p-1 border-b border-gray-300">{props.bollino.università}</div>
            <div className="p-1 border-b border-gray-300">{props.bollino.corsodistudio}</div>
            <div className="p-1 border-b border-gray-300">{props.bollino.annoaccademico}</div>
            <div className="p-1 border-b border-gray-300">{props.bollino.erogato ? "Erogato" : "Revocato"}</div>
            <div className="p-1 underline border-b border-gray-300">
                {linkRichiesta}
            </div>
            <div className="p-1 underline border-b border-gray-300">
                {btnRevoca}
            </div >
        </>
    )

}

export default Bollino;