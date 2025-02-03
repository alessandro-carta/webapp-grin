import { useParams } from "react-router-dom";
import NavbarGrin from "../../components/NavbarGrin.jsx";
import { useState, useEffect } from "react";
import FormUpdatePresidente from "../../components/presidenti/FormUpdatePresidente.jsx";

function UpdatePresidentePage(){
    const { idPresidente } = useParams();
    const [presidente, setPresidente] = useState();
    const [loading, setLoading] = useState(true);
    useEffect( () => loadPresidente, [idPresidente]); // eseguito ogni volta che cambia idPresidente

    const [pageTitle, setPageTitle] = useState('Modifica Account');
    useEffect(() => { document.title = pageTitle}, [pageTitle]); // eseguito ogni volta che cambia pageTitle

    const loadPresidente = async () => {
        try {
            const response = await fetch(`/api/presidente/${idPresidente}`, {
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
                setPresidente(data.data);
                setLoading(false);
            }
            
        } catch (error) { console.log(error); }
    }
    
    if(loading) return <p>LOADING...</p>
    return(
        <>
            <NavbarGrin />
            <div className="flex justify-center">
                <FormUpdatePresidente presidente={presidente}/>
            </div>
        </>
    )
}
export default UpdatePresidentePage;