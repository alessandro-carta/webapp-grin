import NavbarGrin from '../../components/NavbarGrin.jsx'
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Regola from '../../components/regolamento/Regola.jsx'
import NavbarPresidente from '../../components/NavbarPresidente.jsx';

function RegolePage(){
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const visual = queryParams.get('Visual');
    const [admin, setAdmin] = useState(false);
    useEffect(() => {
        if (visual === 'admin') setAdmin(true);
    }, [visual]);

    const navigate = useNavigate();
    const [pageTitle, setPageTitle] = useState('Elenco delle regole');
    useEffect(() => { document.title = pageTitle}, [pageTitle]); // eseguito ogni volta che cambia pageTitle
    
    const [regole, setRegole] = useState([]); // stato che contiene l'elenco delle regole
    const [regoleFil, setRegoleFil] = useState([]); // stato che contiene l'elenco delle regole filtrare
    const [loading, setLoading] = useState(true); // stato per il caricamento dei dati
    const loadAllRegole = async () => {
        try {
            const response = await fetch(`/api/regole`, {
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
                setRegole(data.data);
                setRegoleFil(data.data);
                setLoading(false);
            }
            
        } catch (error) { console.log(error); }
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

    let navbar;
    if(admin) navbar = <NavbarGrin />
    else navbar = <NavbarPresidente />

    let azioni;
    if(admin) azioni = <>
        <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 p-2 items-center justify-center">
            <p className="text-xl">Azioni: </p>
            <button className="button__principale" onClick={createNewRegolaCFU}> Aggiungi una regola per CFU </button>
            <button className="button__principale" onClick={createNewRegolaCount}> Aggiungi una regola per numero </button>
        </div>
    </>;
    else azioni = null;

    if(loading) return <p>LOADING...</p>
    return (
        <>
            {navbar}
            {azioni}
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
            <div className={`grid grid-cols-1 ${admin ? 'md:grid-cols-3' : 'md:grid-cols-2'} p-5`}>
                <div className="text__header__table md:col-span-2">Descrizione</div>
                {admin && <div className="text__header__table">Azioni</div> }
                {regoleFil.map(r => ( <Regola key={r.id} regola={r} check={false} admin={admin}/> ))}       
            </div>
        </>
    )

}
export default RegolePage;