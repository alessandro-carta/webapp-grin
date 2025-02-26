import Loading from '../../components/Loading.jsx';
import NavbarGrin from '../../components/NavbarGrin.jsx'
import Presidente from '../../components/presidenti/Presidente.jsx';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function PresidentiPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [pageTitle, setPageTitle] = useState('Elenco degli account');
  useEffect(() => { document.title = pageTitle}, [pageTitle]); // eseguito ogni volta che cambia pageTitle
  // elenco account presidenti
  const [presidenti, setPresidenti] = useState([]);
  const loadAllPresidenti = async () => {
    try {
      const response = await fetch(`/api/presidenti`, {
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
          setPresidenti(data.data);
          setLoading(false);
      }
      
    } catch (error) { console.log(error); }
  }
  useEffect(() => loadAllPresidenti, []); // Non ha dipendenze, eseguito ad ogni render
  // funzione crea un nuovo account
  const createNewPresidente = () => { navigate('/crea-un-nuovo-account')}
  
  if(loading) return <Loading/>
  else return (
    <>
      <NavbarGrin />
      <div className="flex space-x-4 p-4 items-center justify-center">
        <p className="text-xl">Azioni: </p>
        <button className="button__principale" onClick={createNewPresidente}> Crea nuovo account </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 p-5">
          <div className="text__header__table">Presidente</div>
          <div className="text__header__table">Email</div>
          <div className="text__header__table">Università</div>
          <div className="text__header__table">Azioni</div>
          {presidenti.map(p => ( <Presidente key={p.id} presidente={p}/> ))}           
      </div>
    </>
  )
}

export default PresidentiPage