import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function Presidente(props) {
    const navigate = useNavigate();
    const updatePresidente = async () => { navigate(`/modifica-account/${props.presidente.id}`); }
    
    return (
        <>
            <div className="p-1 border-b border-gray-300">{props.presidente.nome} {props.presidente.cognome}</div>
            <div className="p-1 border-b border-gray-300">{props.presidente.email}</div>
            <div className="p-1 border-b border-gray-300">{props.presidente.università}</div>
            <div className="p-1 underline border-b border-gray-300">
                <Link to={`/presidenti/${props.presidente.id}`} key={props.presidente.id}> Visualizza </Link>
                <button className="m-1" onClick={updatePresidente}> Modifica </button>
            </div >
        </>
    )
}
  
export default Presidente;