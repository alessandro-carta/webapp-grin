import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingButton from "../LoadingButton";
import { CFUtoH, unitCFU } from "../../../ConfigClient";

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
                <p className="text-base">{sottoarea.nome}  {unitCFU ? `(${parseInt(sottoarea.ore)/parseInt(CFUtoH)} CFU)` : `(${sottoarea.ore} H)`}</p>
            </div>
        ))
    }
    if(isDeleted) return null;
    return(
        <>
            <div className="text__content__table">{props.insegnamento.nome}</div>
            <div className="text__content__table">{unitCFU ? `${parseInt(props.insegnamento.oretot)/parseInt(CFUtoH)} CFU` : `${props.insegnamento.oretot} H`} ({props.insegnamento.settore})</div>
            <div className="text__content__table">
                {props.insegnamento.sottoaree.length != 0 &&
                <p className="text-base link" onClick={showDetailSottoaree}> {clickedSottoaree ? 'Nascondi' : 'Mostra'}</p>}
                {component}
            </div>
            {props.edit &&
            <div className="text__content__table flex justify-center">
                <button className="button__action" onClick={updateInsegnamento}> Modifica </button>
                {!loading && <button className="button__action" onClick={deleteInsegnamento}> Elimina </button>}
                {loading && <button className="button__action button__loading"> <LoadingButton /> </button>}
            </div>}
            {!props.edit && <div className="text__content__table flex justify-center"></div>}
        </>
    )
}
export default Insegnamento;