import NavbarGrin from '../../components/NavbarGrin.jsx'
import Presidente from '../../components/presidenti/Presidente.jsx';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function PresidentiPage() {
  const navigate = useNavigate();
  const [presidenti, setPresidenti] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => loadAllPresidenti, []); // Non ha dipendenze, eseguito ad ogni render

  const [pageTitle, setPageTitle] = useState('Elenco degli account');
  useEffect(() => { document.title = pageTitle}, [pageTitle]); // eseguito ogni volta che cambia pageTitle

  const loadAllPresidenti = async () => {
    fetch('/api/presidenti')
        .then(res => res.json())
        .then(data => {
          // restituisce i dati se non sono capitati errori
          if(data.success){
            setPresidenti(data.data);
            setLoading(false);
          }
        })
        .catch(error => console.error("Errore nel caricamento dei dati:", error));
  }

  // funzione crea un nuovo account
  const createNewPresidente = () => {
    navigate('/crea-un-nuovo-account');
  }
  
  if(loading) return <p>LOADING...</p>
  return (
    <>
      <NavbarGrin />
      <div className="flex space-x-4 p-4 items-center justify-center">
        <p className="text-xl">Azioni: </p>
        <button className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700" onClick={createNewPresidente}> Crea nuovo account </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 p-5">
            <div className="font-semibold text-lg text-blue-800 p-1 border-b-2 border-blue-800">Presidente</div>
            <div className="font-semibold text-lg text-blue-800 p-1 border-b-2 border-blue-800">Email</div>
            <div className="font-semibold text-lg text-blue-800 p-1 border-b-2 border-blue-800">Università</div>
            <div className="font-semibold text-lg text-blue-800 p-1 border-b-2 border-blue-800"></div>

            {presidenti.map(p => (
                <Presidente key={p.idPresidente} presidente={p}/>
            ))}           
        </div>
    </>
  )
}

export default PresidentiPage