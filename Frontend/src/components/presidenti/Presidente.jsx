import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function Presidente(props) {
    const navigate = useNavigate();
    const updatePresidente = async () => { navigate(`/modifica-account/${props.presidente.id}`); }
    
    return (
        <>
            <div className="text__content__table">{props.presidente.nome} {props.presidente.cognome}</div>
            <div className="text__content__table">{props.presidente.email}</div>
            <div className="text__content__table">{props.presidente.università}</div>
            <div className="text__content__table underline">
                <Link to={`/p/${props.presidente.id}`} key={props.presidente.id} className='link'> Visualizza </Link>
                <button className="button__action" onClick={updatePresidente}> Modifica </button>
            </div >
        </>
    )
}
  
export default Presidente;