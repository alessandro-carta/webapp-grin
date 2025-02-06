import NavbarPresidente from '../../../components/NavbarPresidente.jsx';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Richiesta from '../../../components/richieste/Richiesta.jsx';

function RichiestePresidentePage() {
  const [annoAccademico, setAnnoAccademico] = useState("All");
  const [stato, setStato] = useState("All");
  const navigate = useNavigate();

  const [richiesteAll, setRichiesteAll] = useState([]); 
  const [richieste, setRichieste] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [filtroAnni, setFiltroAnni] = useState([]);
  useEffect(() => loadAllRichieste, []); // non ha dipendenze, eseguito ad ogni render

  const [pageTitle, setPageTitle] = useState('Elenco delle richieste');
  useEffect(() => { document.title = pageTitle}, [pageTitle]); // eseguito ogni volta che cambia pageTitle

  const loadAllRichieste = async () => {
    try {
      const response = await fetch(`/api/richiestePresidente`, {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
          }
      })
      // accesso non consentito
      if(response.status == 403) navigate('/');
      // risposta con successo
      if(response.ok) {
          const data = await response.json();
          const newData = [];
          const anni = [];
          data.data.map((d) => {
              newData.push({...d, data: new Date(d.data)});
              if(!anni.includes(d.annoaccademico)) anni.push(d.annoaccademico);
          });
          setRichiesteAll(newData);
          setRichieste(newData);
          setFiltroAnni(anni);
          setLoading(false);
      }
      
    } catch (error) { console.log(error); }
  }

  // gestione dei filtri
  const filtraDati = () => {
    const res = [];
    richiesteAll.map(richiesta => {
      if(richiesta.annoaccademico === annoAccademico || annoAccademico === 'All')
        if(richiesta.stato === stato || stato === 'All')
          res.push(richiesta);
    })
    setRichieste(res);
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    if(name === 'filtroAnno') setAnnoAccademico(value);
    if(name === 'filtroStato') setStato(value);
  }
  useEffect(() => filtraDati(), [annoAccademico, stato]);

  // funzione per creare una nuova richiesta
  const creaNuovaRichiesta = () => { navigate(`/crea-una-nuova-richiesta`)};
  
  if(loading) return <p>LOADING...</p>
  return (
    <>
      <NavbarPresidente />
      <div className="flex space-x-4 p-4 items-center justify-center">
        <p className="text-xl">Azioni: </p>
        <button className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700" onClick={creaNuovaRichiesta}> Invia una nuova richiesta </button>
      </div>
      <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 p-2 items-center justify-center">
        <p className="text-xl"> Anno Accademico:</p>
        <select
            id="filtroAnno"
            name="filtroAnno"
            onChange={handleChange}
        >
            <option value="All">Tutti</option>
            {filtroAnni.map(anno => (
              <option key={anno} value={anno}>{anno}</option> ))}
        </select>
        <p className="text-xl">Stato: </p>
        <select
            id="filtroStato"
            name="filtroStato"
            onChange={handleChange}
        >
            <option value="All">Tutti</option>
            <option value="Elaborazione">Da Elaborare</option>
            <option value="Approvata">Approvate</option>
            <option value="Invalidata">Invalidate</option>
            <option value="Bozza">Bozza</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 p-5">
            <div className="font-semibold text-lg text-blue-800 p-1 border-b-2 border-blue-800">Corso di studio</div>
            <div className="font-semibold text-lg text-blue-800 p-1 border-b-2 border-blue-800">Anno accademico</div>
            <div className="font-semibold text-lg text-blue-800 p-1 border-b-2 border-blue-800">Stato</div>
            <div className="font-semibold text-lg text-blue-800 p-1 border-b-2 border-blue-800"></div>
            {richieste.map(r => ( <Richiesta key={r.id} richiesta={r} admin={false}/> ))}           
        </div>
    </>
  )
}
export default RichiestePresidentePage