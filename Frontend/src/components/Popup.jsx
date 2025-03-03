import React from 'react';
import { unitCFU } from '../../ConfigClient';

function Popup (props) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-auto min-w-96">
        <p className="title text-base p-2">{props.title}</p>
        {props.data.map((sottoarea) => (
            <div key={sottoarea.id} className="p-1">
                <p className="text-base">{sottoarea.nome}  {unitCFU ? `(${parseInt(sottoarea.ore)/parseInt(CFUtoH)} CFU)` : `(${sottoarea.ore} H)`}</p>
            </div>
        ))}
        <button onClick={props.onClose} className="m-4 button__principale" >Chiudi</button>
      </div>
    </div>
  );
};

export default Popup;
 