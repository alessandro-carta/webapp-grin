import { useState } from "react";

function Insegnamento(props){
    const [clickedSottoaree, setClickedSottoaree] = useState(false);
    const showDetailSottoaree = () => { setClickedSottoaree(!clickedSottoaree) }

    let component;
    if(!clickedSottoaree) component = null;
    if(clickedSottoaree){
        component = props.insegnamento.sottoaree.map((sottoarea) => (
            <div key={sottoarea.id} className="p-1">
                <p className="text-base">{sottoarea.nome} ({sottoarea.cfu} CFU)</p>
            </div>
        ))
    }
    return(
        <div className="flex-1 bg-gray-100 rounded-lg p-4 m-2 max-w-[250px] min-w-[250px] w-full sm:w-auto hover:border border-blue-600">
            <p className="text-xl font-medium">{props.insegnamento.nome}</p> 
            <p className="text-xl">({props.insegnamento.cfu} CFU {props.insegnamento.settore})</p>
            {props.insegnamento.sottoaree.length != 0 && <p className="text-base text-blue-800" onClick={showDetailSottoaree}>Sottoaree {clickedSottoaree ? '-' : '+'}</p>}
            {component}
        </div>
    )
}
export default Insegnamento;