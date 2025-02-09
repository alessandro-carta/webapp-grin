import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Insegnamento(props){
    const navigate = useNavigate();
    const [clickedSottoaree, setClickedSottoaree] = useState(false);
    const showDetailSottoaree = () => { setClickedSottoaree(!clickedSottoaree) }
    const [isDeleted, setIsDeleted] = useState(false);
    // funzione modifica insegnamento
    const updateInsegnamento = () => { navigate(`/modifica-insegnamento/${props.richiesta}/${props.insegnamento.id}`)}
    // funzione elimina insegnamento
    const deleteInsegnamento = async () => {
        try {
            const response = await fetch(`/api/deleteInsegnamento/${props.insegnamento.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({richiesta: props.richiesta})
            })
            // accesso non consentito
            if(response.status == 403) navigate('/');
            // risposta con successo
            if(response.ok) {
                setIsDeleted(true);
            }
            
        } catch (error) { console.log(error); }
    }

    let component;
    if(!clickedSottoaree) component = null;
    if(clickedSottoaree){
        component = props.insegnamento.sottoaree.map((sottoarea) => (
            <div key={sottoarea.id} className="p-1">
                <p className="text-base">{sottoarea.nome} ({sottoarea.cfu} CFU)</p>
            </div>
        ))
    }
    if(isDeleted) return null;
    return(
        <div className="flex-1 bg-gray-100 rounded-lg p-4 m-2 max-w-[250px] min-w-[250px] w-full sm:w-auto hover:border border-blue-600">
            <p className="text-xl font-medium">{props.insegnamento.nome}</p> 
            <p className="text-xl">{props.insegnamento.cfutot} CFU ({props.insegnamento.settore})</p>
            {props.insegnamento.sottoaree.length != 0 && <p className="text-base text-blue-800" onClick={showDetailSottoaree}>Sottoaree {clickedSottoaree ? '-' : '+'}</p>}
            {component}
            {props.edit && <div>
                <button className="m-1" onClick={updateInsegnamento}> Modifica </button>
                <button className="m-1" onClick={deleteInsegnamento}> Elimina </button>
            </div>}
        </div>
    )
}
export default Insegnamento;