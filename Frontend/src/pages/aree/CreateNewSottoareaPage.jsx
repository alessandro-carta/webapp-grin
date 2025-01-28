import FormNewSottoarea from "../../components/aree/FormNewSottoarea.jsx";
import NavbarGrin from "../../components/NavbarGrin.jsx";
import { useState, useEffect } from "react";

function CreateNewSottoareaPage () {

    const [pageTitle, setPageTitle] = useState('Nuova Sottoarea');
    useEffect(() => { document.title = pageTitle}, [pageTitle]); // eseguito ogni volta che cambia pageTitle

    return(
        <>
            <NavbarGrin />
            <h1 className='text-blue-800'>{pageTitle}</h1>
            <div className="flex justify-center">
                <FormNewSottoarea />
            </div>
        </>
    )
    
}

export default CreateNewSottoareaPage;