import { useParams } from "react-router-dom";
import NavbarGrin from "../../components/NavbarGrin.jsx";
import { useState, useEffect } from "react";
import FormUpdateArea from "../../components/aree/FormUpdateArea.jsx";

function UpdateAreaPage(){

    const { idArea } = useParams();
    const [area, setArea] = useState();
    const [loading, setLoading] = useState(true);
    const [pageTitle, setPageTitle] = useState('Modifica Area');

    const loadArea = async () => {
        fetch(`http://localhost:8081/area/${idArea}`)
            .then(res => res.json())
            .then(data => {
                if(data.success){
                    setArea(data.data);
                    setLoading(false);
                }
            })
            .catch(error => console.error("Errore nel caricamento dei dati:", error));
    }

    useEffect(() => { document.title = pageTitle}, [pageTitle]); // eseguito ogni volta che cambia pageTitle
    useEffect( () => loadArea, [idArea]);

    if(loading) return <p>LOADING...</p>
    return(
        <>
            <NavbarGrin />
            <h1 className='text-blue-800'>{pageTitle}</h1>
            <FormUpdateArea area={area}/>
        </>
    )

}

export default UpdateAreaPage;