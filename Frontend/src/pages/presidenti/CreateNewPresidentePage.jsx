import NavbarGrin from "../../components/NavbarGrin.jsx";
import FormNewPresidente from "../../components/presidenti/FormNewPresidente.jsx";
import { useState, useEffect } from "react";

function CreateNewPresidentePage() {

    const [pageTitle, setPageTitle] = useState('Nuovo Account');
    useEffect(() => { document.title = pageTitle}, [pageTitle]); // eseguito ogni volta che cambia pageTitle

    return(
        <>
            <NavbarGrin />
            <h1 className='text-blue-800'>{pageTitle}</h1>
            <FormNewPresidente />
        </>
    )
    
}

export default CreateNewPresidentePage;