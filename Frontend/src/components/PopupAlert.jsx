import React from 'react';

function PopupAlert(props) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <p className="text-base p-2">{props.message}</p>
        <button onClick={props.handleYes} className="m-4 button__principale">SI</button>
        <button onClick={props.handleNo} className="m-4 link"> Annulla </button>
      </div>
    </div>
  );
};

export default PopupAlert;
 