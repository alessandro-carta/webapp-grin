import NavbarGrin from '../../components/NavbarGrin.jsx'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Regola from '../../components/regolamento/Regola.jsx'

function RegolamentoPage(){
    const navigate = useNavigate();
    const [pageTitle, setPageTitle] = useState('Elenco delle regole');
    useEffect(() => { document.title = pageTitle}, [pageTitle]); // eseguito ogni volta che cambia pageTitle
    
    const [regole, setRegole] = useState([]); // stato che contiene l'elenco delle regole
    const [regoleFil, setRegoleFil] = useState([]); // stato che contiene l'elenco delle regole filtrare
    const [loading, setLoading] = useState(true); // stato per il caricamento dei dati
    const loadAllRegole = async () => {
        fetch('/api/regole')
            .then(res => res.json())
            .then(data => {
              // restituisce i dati se non sono capitati errori
              if(data.success){
                setRegole(data.data);
                setRegoleFil(data.data);
                setLoading(false);
              }
            })
            .catch(error => console.error("Errore nel caricamento dei dati:", error));
    }
    useEffect(() => loadAllRegole, []); // Non ha dipendenze, eseguito ad ogni render
    // funzione btn crea una nuova regola
    const createNewRegolaCFU = () => {navigate(`/crea-una-nuova-regola/?RegolaCFU=${true}`)}
    const createNewRegolaCount = () => {navigate(`/crea-una-nuova-regola/?RegolaCFU=${false}`)}

    const handleChange = (e) => {
        const {  value } = e.target;
        if(value === "tutto") setRegoleFil(regole);
        else setRegoleFil(regole.filter((regola) => regola.tipologia === value));
    }

    if(loading) return <p>LOADING...</p>
    return (
        <>
            <NavbarGrin />
            <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 p-2 items-center justify-center">
                <p className="text-xl">Azioni: </p>
                <button className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700" onClick={createNewRegolaCFU}> Aggiungi una regola per CFU </button>
                <button className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700" onClick={createNewRegolaCount}> Aggiungi una regola per numero </button>
            </div>
            <div className="flex space-x-4 p-2 items-center justify-center">
                <p className="text-xl">Filtra per: </p>
                <select
                    id="filtroRegola"
                    name="filtroRegola"
                    onChange={handleChange}
                >
                    <option value="tutto">Tutto</option>
                    <option value="settore">Settore</option>
                    <option value="area">Area</option>
                    <option value="sottoarea">Sottoarea</option>
                </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 p-5">
                <div className="font-semibold text-lg text-blue-800 p-2 border-b-2 border-blue-800 md:col-span-2">Descrizione testuale</div>
                <div className="font-semibold text-lg text-blue-800 p-2 border-b-2 border-blue-800"></div> 

                {regoleFil.map(r => (
                    <Regola key={r.id} regola={r} check={false}/>
                ))}       
            </div>
        </>
    )

}
export default RegolamentoPage;