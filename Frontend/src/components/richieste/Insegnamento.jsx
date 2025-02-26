import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Insegnamento(props){
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [clickedSottoaree, setClickedSottoaree] = useState(false);
    const showDetailSottoaree = () => { setClickedSottoaree(!clickedSottoaree) }
    const [isDeleted, setIsDeleted] = useState(false);
    // funzione modifica insegnamento
    const updateInsegnamento = () => { navigate(`/dashboard/r/${props.insegnamento.regolamento}/modifica-insegnamento/${props.insegnamento.id}`)}
    // funzione elimina insegnamento
    const deleteInsegnamento = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/deleteInsegnamento/${props.insegnamento.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({regolamento: props.insegnamento.regolamento})
            })
            // accesso non consentito
            if(response.status == 403) navigate('/');
            // risposta con successo
            if(response.ok) {
                setLoading(false);
                setIsDeleted(true);
            }
        } catch (error) { setLoading(false); console.log(error); }
    }

    let component;
    if(!clickedSottoaree) component = null;
    if(clickedSottoaree){
        component = props.insegnamento.sottoaree.map((sottoarea) => (
            <div key={sottoarea.id} className="p-1">
                <p className="text-base">{sottoarea.nome}  {sottoarea.ore == null ? `(${sottoarea.cfu} CFU)` : `(${sottoarea.ore} H)`}</p>
            </div>
        ))
    }
    if(isDeleted) return null;
    return(
        <div className="card__insegnamento w-full sm:w-auto">
            <p className="text-xl font-medium">{props.insegnamento.nome}</p> 
            <p className="text-xl">{props.insegnamento.oretot == null ? `${props.insegnamento.cfutot} CFU` : `${props.insegnamento.oretot} H`} ({props.insegnamento.settore})</p>
            {props.insegnamento.sottoaree.length != 0 && <p className="text-base link" onClick={showDetailSottoaree}>Sottoaree {clickedSottoaree ? '-' : '+'}</p>}
            {component}
            {props.edit && <div>
                <button className="link p-1" onClick={updateInsegnamento}> Modifica </button>
                {!loading && <button className="link p-1" onClick={deleteInsegnamento}> Elimina </button>}
                {loading && <button className="link p-1"> ... </button>}
            </div>}
        </div>
    )
}
export default Insegnamento;