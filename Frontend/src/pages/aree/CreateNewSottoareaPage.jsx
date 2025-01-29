import FormNewSottoarea from "../../components/aree/FormNewSottoarea.jsx";
import NavbarGrin from "../../components/NavbarGrin.jsx";
import { useState, useEffect } from "react";

function CreateNewSottoareaPage () {

    const [pageTitle, setPageTitle] = useState('Nuova Sottoarea');
    useEffect(() => { document.title = pageTitle}, [pageTitle]); // eseguito ogni volta che cambia pageTitle

    return(
        <>
            <NavbarGrin />
            <div className="flex justify-center">
                <FormNewSottoarea />
            </div>
        </>
    )
    
}

export default CreateNewSottoareaPage;