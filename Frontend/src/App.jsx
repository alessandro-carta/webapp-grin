import './App.css';
import { useState, useEffect } from "react";
import Loading from './components/Loading';
import NavbarPublic from './components/NavbarPublic';
import Bollino from './components/bollini/Bollino';

function App() {
  // dati per la gestione dei filtri
  const [annoAccademico, setAnnoAccademico] = useState("All");
  const [filtroAnni, setFiltroAnni] = useState([]);

  const [loading, setLoading] = useState(true);
  const [bollini, setBollini] = useState([]);
  const [bolliniAll, setBolliniAll] = useState([]);
  const loadBollini = async () => {
    try {
      const response = await fetch(`/api/bolliniPublic`, {
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
          const anni = [];
          data.data.map((d) => { 
              if(!anni.includes(d.annoaccademico)) anni.push(d.annoaccademico); 
          });
          setBollini(data.data);
          setBolliniAll(data.data);
          setFiltroAnni(anni);
          setLoading(false);
      }
      
    } catch (error) { console.log(error); }
  }
  useEffect(() => loadBollini, []);

  // gestione dei filtri
  const filtraDati = () => {
    const boll = [];
    bolliniAll.map(bollino => {
        if(bollino.annoaccademico === annoAccademico || annoAccademico === 'All')
            boll.push(bollino);
    })
    setBollini(boll);
  }
  const handleChange = (e) => {
      const { name, value } = e.target;
      if(name === 'filtroAnno') setAnnoAccademico(value);
  }
  useEffect(() => filtraDati(), [annoAccademico]);


  const [pageTitle, setPageTitle] = useState('Homepage | Bollino GRIN');
  useEffect(() => { document.title = pageTitle }, [pageTitle]); // eseguito ogni volta che cambia pageTitle
  

  if(loading) return <Loading />
  return (
    <>
      <NavbarPublic />
      <p className='title text-3xl p-5'>Bollino GRIN</p>
      <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 p-2 items-center justify-center">
        <p className="text-xl">Anno Accademico: </p>
        <select
            id="filtroAnno"
            name="filtroAnno"
            onChange={handleChange}
        >
            <option value="All">Tutti</option>
            {filtroAnni.map(anno => (
            <option key={anno} value={anno}>{anno}</option> ))}
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 p-5">
          <div className="text__header__table">Università</div>
          <div className="text__header__table">Corso Di Studio</div>
          <div className="text__header__table">Anno Accademico</div>
          {bollini.map(bollino => ( <Bollino key={bollino.id} bollino={bollino} admin={true} public={true}/>))}
      </div>
    </>
  )
}

export default App
