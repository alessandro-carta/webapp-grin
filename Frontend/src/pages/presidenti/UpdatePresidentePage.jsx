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
        fetch(`/api/presidenti/${idPresidente}`)
            .then(res => res.json())
            .then(data => {
                // restituisce i dati se non sono capitati errori
                if(data.success){
                    setPresidente(data.data);
                    setLoading(false);
                }
            })
            .catch(error => console.error("Errore nel caricamento dei dati:", error));
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