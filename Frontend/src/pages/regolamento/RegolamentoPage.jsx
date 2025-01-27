import NavbarGrin from '../../components/NavbarGrin.jsx'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Regola from '../../components/regolamento/Regola.jsx'

function RegolamentoPage(){
    const navigate = useNavigate();
    const [pageTitle, setPageTitle] = useState('Elenco delle regole');
    useEffect(() => { document.title = pageTitle}, [pageTitle]); // eseguito ogni volta che cambia pageTitle
    
    const [regole, setRegole] = useState([]); // stato che contiene l'elenco delle regole
    const [loading, setLoading] = useState(true); // stato per il caricamento dei dati
    const loadAllRegole = async () => {
        fetch('http://localhost:8081/regole')
            .then(res => res.json())
            .then(data => {
              // restituisce i dati se non sono capitati errori
              if(data.success){
                setRegole(data.data);
                setLoading(false);
              }
            })
            .catch(error => console.error("Errore nel caricamento dei dati:", error));
    }
    useEffect(() => loadAllRegole, []); // Non ha dipendenze, eseguito ad ogni render
    // funzione btn crea una nuova regola
    const createNewRegola = () => {navigate('/crea-una-nuova-regola');}

    if(loading) return <p>LOADING...</p>
    return (
        <>
            <NavbarGrin />
            <h1 className='text-blue-800'>{pageTitle}</h1>
            <div className="flex space-x-4 p-4 items-center justify-center">
                <p className="text-xl">Azioni: </p>
                <button className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700" onClick={createNewRegola}> Aggiungi una regola </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 p-5">
                <div className="font-semibold text-lg text-blue-800 p-2 border-b-2 border-blue-800 md:col-span-2">Descrizione testuale</div>
                <div className="font-semibold text-lg text-blue-800 p-2 border-b-2 border-blue-800"></div> 

                {regole.map(r => (
                    <Regola key={r.idRegola} regola={r} check={false}/>
                ))}       
            </div>
        </>
    )

}
export default RegolamentoPage;