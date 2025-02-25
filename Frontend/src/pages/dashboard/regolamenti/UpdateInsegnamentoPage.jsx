import { useParams } from "react-router-dom";
import NavbarPresidente from "../../../components/NavbarPresidente.jsx";
import { useState, useEffect } from "react";
import FormNewInsegnamento from "../../../components/dashboard/regolamenti/FormNewInsegnamento.jsx";
import FormUpdateInsegnamento from "../../../components/dashboard/regolamenti/FormUpdateInsegnamento.jsx";

function UpdateNewInsegnamentoPage() {
    const { idRegolamento, idInsegnamento } = useParams();
    const [loading, setLoading] = useState(true);
    // recupero le informazioni dell'insegnamento con anche il regolamento
    const [insegnamento, setInsegnamento] = useState();
    const loadInsegnamento = async () => {
        try {
            const response = await fetch(`/api/insegnamento/${idRegolamento}/${idInsegnamento}`, {
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
                console.log(data);
                setInsegnamento(data.data);
                setLoading(false);
            }
            if(!response.ok) {
                const error = await response.json();
                console.log(error);
            }
            
        } catch (error) { console.log(error); }
    }
    useEffect( () => loadInsegnamento, [idInsegnamento]); // eseguito ogni volta che cambia idInsegnamento

    const [pageTitle, setPageTitle] = useState('Modifica Insegnamento');
    useEffect(() => { document.title = pageTitle}, [pageTitle]); // eseguito ogni volta che cambia pageTitle

    if(loading) return <p>LOADING...</p>
    return(
        <>
            <NavbarPresidente />
            <div className="flex justify-center">
                <FormUpdateInsegnamento insegnamento={insegnamento}/>
            </div>
            
        </>
    )
    
}

export default UpdateNewInsegnamentoPage;