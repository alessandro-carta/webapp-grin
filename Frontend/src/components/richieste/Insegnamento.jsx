import { useState, useEffect } from "react";

function Insegnamento(props){
    const [clickedSottoaree, setClickedSottoaree] = useState(false);
    const showDetailSottoaree = () => { setClickedSottoaree(!clickedSottoaree) }
    let component;
    if(!clickedSottoaree){
        component = null;
    }
    if(clickedSottoaree){
        component = props.insegnamento.Sottoaree.map((sottoarea) => (
            <div key={sottoarea.idSottoarea} className="p-1">
                <p className="text-base">{sottoarea.Nome} ({sottoarea.CFU} CFU)</p>
            </div>
        ))
    }
    return(
        <div className="flex-1 bg-gray-100 rounded-lg p-4 m-2 max-w-[250px] min-w-[250px] w-full sm:w-auto hover:border border-blue-600">
            <p className="text-xl font-medium">{props.insegnamento.Nome}</p> 
            <p className="text-xl">({props.insegnamento.CFU} CFU {props.insegnamento.Settore})</p>
            {props.insegnamento.Sottoaree.length != 0 && <p className="text-base text-blue-800" onClick={showDetailSottoaree}>Sottoaree {clickedSottoaree ? '-' : '+'}</p>}
            {component}
        </div>
    )
}
export default Insegnamento;