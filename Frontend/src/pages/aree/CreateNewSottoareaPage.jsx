import FormNewSottoarea from "../../components/aree/FormNewSottoarea.jsx";
import NavbarGrin from "../../components/NavbarGrin.jsx";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function CreateNewSottoareaPage () {

    const [pageTitle, setPageTitle] = useState('Nuova Sottoarea');
    useEffect(() => { document.title = pageTitle}, [pageTitle]); // eseguito ogni volta che cambia pageTitle
    const { idArea } = useParams();

    return(
        <>
            <NavbarGrin />
            <div className="flex justify-center">
                <FormNewSottoarea area={idArea}/>
            </div>
        </>
    )
    
}

export default CreateNewSottoareaPage;