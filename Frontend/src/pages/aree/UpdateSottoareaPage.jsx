import { useParams } from "react-router-dom";
import NavbarGrin from "../../components/NavbarGrin.jsx";
import { useState, useEffect } from "react";
import FormUpdateSottoarea from "../../components/aree/FormUpdateSottoarea";
import Loading from "../../components/Loading.jsx";

function UpdateSottoareaPage(){

    const { idSottoarea } = useParams();
    const [sottoarea, setSottoarea] = useState();
    const [loading, setLoading] = useState(true);
    const [pageTitle, setPageTitle] = useState('Modifica Sottoarea');

    const loadSottoarea = async () => {
        try {
            const response = await fetch(`/api/sottoarea/${idSottoarea}`, {
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
                setSottoarea(data.data);
                setLoading(false);
            }
            
        } catch (error) { console.log(error); }
    }

    useEffect(() => { document.title = pageTitle}, [pageTitle]); // eseguito ogni volta che cambia pageTitle
    useEffect( () => loadSottoarea, [idSottoarea]);

    if(loading) return <Loading />
    return(
        <>
            <NavbarGrin />
            <div className="flex justify-center">
                <FormUpdateSottoarea sottoarea={sottoarea}/>
            </div>
        </>
    )

}

export default UpdateSottoareaPage;