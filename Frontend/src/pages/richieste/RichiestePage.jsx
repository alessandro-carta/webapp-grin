import NavbarGrin from '../../components/NavbarGrin.jsx'
import Richiesta from '../../components/richieste/Richiesta.jsx';
import React, { useState, useEffect } from 'react';

function RichiestePage() {
  const [annoAccademico, setAnnoAccademico] = useState("All");
  const [stato, setStato] = useState("All");

  const [richiesteAll, setRichiesteAll] = useState([]); 
  const [richieste, setRichieste] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [filtroAnni, setFiltroAnni] = useState([]);
  useEffect(() => loadAllRichieste, []); // non ha dipendenze, eseguito ad ogni render

  const [pageTitle, setPageTitle] = useState('Elenco delle richieste');
  useEffect(() => { document.title = pageTitle}, [pageTitle]); // eseguito ogni volta che cambia pageTitle

  const loadAllRichieste = async () => {
    fetch('/api/richieste')
        .then(res => res.json())
        .then(data => {
          // restituisce i dati se non sono capitati errori
          if(data.success){
            const newData = [];
            const anni = []
            data.data.map((item) => {
                const dateObj = new Date(item.Data);
                newData.push({...item, Data: dateObj});
                if(!anni.includes(item.AnnoAccademico)) anni.push(item.AnnoAccademico);
            });
            setRichiesteAll(newData);
            setRichieste(newData);
            setFiltroAnni(anni);
            setLoading(false);
          }
        })
        .catch(error => console.error("Errore nel caricamento dei dati:", error));
  }

  // gestione dei filtri
  const filtraDati = () => {
    const res = [];
    richiesteAll.map(richiesta => {
      if(richiesta.AnnoAccademico === annoAccademico || annoAccademico === 'All')
        if(richiesta.Stato === stato || stato === 'All')
          res.push(richiesta);
    })
    setRichieste(res);
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    if(name === 'FiltroAnno') setAnnoAccademico(value);
    if(name === 'FiltroStato') setStato(value);
  }
  useEffect(() => filtraDati(), [annoAccademico, stato]);
  
  
  if(loading) return <p>LOADING...</p>
  return (
    <>
      <NavbarGrin />
      <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 p-2 items-center justify-center">
        <p className="text-xl">Anno Accademico: </p>
        <select
            id="FiltroAnno"
            name="FiltroAnno"
            onChange={handleChange}
        >
            <option value="All">Tutti</option>
            {filtroAnni.map(a => (
              <option key={a} value={a}>{a}</option> ))}
        </select>
        <p className="text-xl">Stato: </p>
        <select
            id="FiltroStato"
            name="FiltroStato"
            onChange={handleChange}
        >
            <option value="All">Tutti</option>
            <option value="Elaborazione">Da Elaborare</option>
            <option value="Approvata">Approvate</option>
            <option value="Invalidata">Invalidate</option>
        </select>
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