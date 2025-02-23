import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CorsoDiStudio from "../../../components/dashboard/corsidistudio/CorsoDiStudio";
import NavbarPresidente from "../../../components/NavbarPresidente";

function CorsiDiStudioPage(){
    const navigate = useNavigate();
    const [corsiDiStudio, setCorsiDiStudio] = useState([]);
    const [loading, setLoading] = useState(true);
    const loadCorsiDiStudioPerPresidente = async () => {
        try {
            const response = await fetch(`/api/dashboard`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
            })
            // accesso non consentito
            if(response.status == 403) navigate('/');
            // risposta con successo
            if(response.ok) {
                const data = await response.json();
                setCorsiDiStudio(data.data);
                setLoading(false);
            }
            
        } catch (error) { console.log(error); }

    }
    useEffect(() => loadCorsiDiStudioPerPresidente, []); // Non ha dipendenze, eseguito ad ogni render

    const [pageTitle, setPageTitle] = useState('Elenco dei corsi di studio');
    useEffect(() => { document.title = pageTitle}, [pageTitle]); // eseguito ogni volta che cambia pageTitle

    // funzione crea un nuovo corso
    const createNewCDS = () => {
        navigate('/dashboard/crea-un-nuovo-corso');
    }

    if(loading) return <p>LOADING...</p>
    return (
      <>
        <NavbarPresidente />
        <div className="flex space-x-4 p-4 items-center justify-center">
          <p className="text-xl">Azioni: </p>
          <button className="button__principale" onClick={createNewCDS}> Crea un nuovo corso </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 p-5">
            <div className="text__header__table">Corso Di Studio</div>
            <div className="text__header__table">Università</div>
            <div className="text__header__table">Durata</div>
            <div className="text__header__table">Regolamenti</div>
            <div className="text__header__table">Azioni</div>
            {corsiDiStudio.map(corso => ( <CorsoDiStudio key={corso.id} corso={corso}/> ))}
        </div> 
      </>
    )
}

export default CorsiDiStudioPage;