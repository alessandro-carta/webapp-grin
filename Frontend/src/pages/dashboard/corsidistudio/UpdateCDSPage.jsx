import { useState, useEffect } from "react";
import NavbarPresidente from "../../../components/NavbarPresidente.jsx";
import FormUpdateCDS from "../../../components/dashboard/corsidistudio/FormUpdateCDS.jsx";
import { useParams } from "react-router-dom";
import Loading from "../../../components/Loading.jsx";

function UpdateCDSPage() {

    const { idCDS } = useParams();
    const [loading, setLoading] = useState(true);
    const [pageTitle, setPageTitle] = useState('Modifica Corso di Studio');
    useEffect(() => { document.title = pageTitle}, [pageTitle]); // eseguito ogni volta che cambia pageTitle

    const [corsoDiStudio, setCorsoDiStudio] = useState();
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
                setLoading(false);
            }
            
        } catch (error) { console.log(error); }

    }
    useEffect(() => loadCorsoDiStudioPerPresidente, []); // Non ha dipendenze, eseguito ad ogni render

    if(loading) return <Loading />
    return(
        <>
            <NavbarPresidente />
            <div className="flex justify-center">
                <FormUpdateCDS cds={corsoDiStudio} />
            </div>
            
        </>
    )
    
}

export default UpdateCDSPage;