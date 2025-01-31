import NavbarGrin from '../../components/NavbarGrin.jsx'
import Richiesta from '../../components/richieste/Richiesta.jsx';
import React, { useState, useEffect } from 'react';

function RichiestePage() {
  const [richieste, setRichieste] = useState([]); // elenco delle richieste da elaborare
  const [richiesteAll, setRichiesteAll] = useState([]); // elenco di tutte le richieste
  const [loading, setLoading] = useState(true);
  const [allBtnClicked, setAllBtnClicked] = useState(true);
  useEffect(() => loadAllRichieste, []); // non ha dipendenze, eseguito ad ogni render

  const [pageTitle, setPageTitle] = useState('Elenco delle richieste');
  useEffect(() => { document.title = pageTitle}, [pageTitle]); // eseguito ogni volta che cambia pageTitle

  const loadAllRichieste = async () => {
    fetch('/api/richieste')
        .then(res => res.json())
        .then(data => {
          // restituisce i dati se non sono capitati errori
          if(data.success){
            const newData = []
            data.data.map((item) => {
                const dateObj = new Date(item.Data);
                newData.push({...item, Data: dateObj});
            });
            setRichieste(newData);
            setRichiesteAll(newData);
            setLoading(false);
          }
        })
        .catch(error => console.error("Errore nel caricamento dei dati:", error));
  }

  // seleziona tutto
  const filterAll = () => {
    setRichieste(richiesteAll);
    setAllBtnClicked(true);
  }
  // da elaborare
  const filterToDo = () => {
    const filteredRichieste = richiesteAll.filter(richiesta => richiesta.Stato === "Elaborazione");
    setRichieste(filteredRichieste);
    setAllBtnClicked(false);
  }
  
  if(loading) return <p>LOADING...</p>
  return (
    <>
      <NavbarGrin />
      <div className="flex space-x-4 p-4 items-center justify-center">
        <p className="text-xl">Azioni: </p>
        <button
            className={`p-2 rounded-md text-white ${
                allBtnClicked ? "bg-blue-700" : "bg-blue-500 hover:bg-blue-700"
            }`}
            onClick={filterAll}
        >
        Seleziona Tutto
        </button>
        <button
            className={`p-2 rounded-md text-white ${
                !allBtnClicked ? "bg-blue-700" : "bg-blue-500 hover:bg-blue-700"
            }`}
            onClick={filterToDo}
        >
        Da Elaborare
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 p-5">
            <div className="font-semibold text-lg text-blue-800 p-1 border-b-2 border-blue-800">Università</div>
            <div className="font-semibold text-lg text-blue-800 p-1 border-b-2 border-blue-800">Corso di studio</div>
            <div className="font-semibold text-lg text-blue-800 p-1 border-b-2 border-blue-800">Anno accademico</div>
            <div className="font-semibold text-lg text-blue-800 p-1 border-b-2 border-blue-800">Stato</div>
            <div className="font-semibold text-lg text-blue-800 p-1 border-b-2 border-blue-800"></div>

            {richieste.map(r => (
                <Richiesta key={r.idRichiesta} richiesta={r}/>
            ))}           
        </div>
    </>
  )
}
export default RichiestePage