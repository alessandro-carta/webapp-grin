import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavbarPresidente from "../../../components/NavbarPresidente";
import Regolamento from "../../../components/dashboard/regolamenti/Regolamento";

function CorsoDiStudioPage(){
    const { idCDS } = useParams();
    const navigate = useNavigate();
    const [corsoDiStudio, setCorsoDiStudio] = useState();
    const [regolamenti, setRegolamenti] = useState([]);
    const [loading, setLoading] = useState(true);
    const loadCorsoDiStudioPerPresidente = async () => {
        try {
            const response = await fetch(`/api/corsodistudio/${idCDS}`, {
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
                setCorsoDiStudio(data.data);
                setPageTitle(data.data.corsodistudio);
                setLoading(false);
            }
            
        } catch (error) { console.log(error); }

    }
    useEffect(() => loadCorsoDiStudioPerPresidente, []); // Non ha dipendenze, eseguito ad ogni render

    const loadRegolamenti = async () => {
        try {
            const response = await fetch(`/api/regolamenti/${idCDS}`, {
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
                setRegolamenti(data.data);
            }
            
        } catch (error) { console.log(error); }

    }
    useEffect(() => loadRegolamenti, []); // Non ha dipendenze, eseguito ad ogni render

    const [pageTitle, setPageTitle] = useState('Corso di studio');
    useEffect(() => { document.title = pageTitle}, [pageTitle]); // eseguito ogni volta che cambia pageTitle

    // funzione crea un nuovo regolamento
    const createNewRegolamento = () => {
        navigate(`/crea-un-nuovo-regolamento/${idCDS}`);
    }

    if(loading) return <p>LOADING...</p>
    return (
      <>
        <NavbarPresidente />
        <div className="flex space-x-4 p-4 items-center justify-center">
          <p className="text-xl">Azioni: </p>
          <button className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700" onClick={createNewRegolamento}> Crea un nuovo regolamento </button>
        </div>
        <p className='text-xl text-blue-800'>{corsoDiStudio.corsodistudio}</p>
        <p className="text-xl">{corsoDiStudio.università}</p>
        <p className="text-xl">Durata: {corsoDiStudio.durata}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 p-5">
          <div className="font-semibold text-lg text-blue-800 p-1 border-b-2 border-blue-800">Anno Accademico</div>
          <div className="font-semibold text-lg text-blue-800 p-1 border-b-2 border-blue-800"></div>
          {regolamenti.map(regolamento => ( <Regolamento key={regolamento.id} regolamento={regolamento}/>))}           
        </div>
      </>
    )
}

export default CorsoDiStudioPage;