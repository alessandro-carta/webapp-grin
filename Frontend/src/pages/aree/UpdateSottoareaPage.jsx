import { useParams } from "react-router-dom";
import NavbarGrin from "../../components/NavbarGrin.jsx";
import { useState, useEffect } from "react";
import FormUpdateSottoarea from "../../components/aree/FormUpdateSottoarea";

function UpdateSottoareaPage(){

    const { idSottoarea } = useParams();
    const [sottoarea, setSottoarea] = useState();
    const [loading, setLoading] = useState(true);
    const [pageTitle, setPageTitle] = useState('Modifica Sottoarea');

    const loadSottoarea = async () => {
        fetch(`/api/sottoarea/${idSottoarea}`)
            .then(res => res.json())
            .then(data => {
                if(data.success){
                    setSottoarea(data.data);
                    setLoading(false);
                }
            })
            .catch(error => console.error("Errore nel caricamento dei dati:", error));
    }

    useEffect(() => { document.title = pageTitle}, [pageTitle]); // eseguito ogni volta che cambia pageTitle
    useEffect( () => loadSottoarea, [idSottoarea]);

    if(loading) return <p>LOADING...</p>
    return(
        <>
            <NavbarGrin />
            <h1 className='text-blue-800'>{pageTitle}</h1>
            <div className="flex justify-center">
                <FormUpdateSottoarea sottoarea={sottoarea}/>
            </div>
        </>
    )

}

export default UpdateSottoareaPage;