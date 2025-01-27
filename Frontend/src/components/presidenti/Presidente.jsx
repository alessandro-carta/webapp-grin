import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function Presidente(props) {
    const navigate = useNavigate();
    const updatePresidente = async () => { navigate(`/modifica-account/${props.presidente.idPresidente}`); }
    
    return (
        <>
            <div className="p-1 border-b border-gray-300">{props.presidente.Nome} {props.presidente.Cognome}</div>
            <div className="p-1 border-b border-gray-300">{props.presidente.Email}</div>
            <div className="p-1 border-b border-gray-300">{props.presidente.Università}</div>
            <div className="p-1 underline border-b border-gray-300">
                <Link to={`/presidenti/${props.presidente.idPresidente}`} key={props.presidente.idPresidente}> Visualizza </Link>
                <button className="m-1" onClick={updatePresidente}> Modifica </button>
            </div >
        </>
    )
}
  
export default Presidente;