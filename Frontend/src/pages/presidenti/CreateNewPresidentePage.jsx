import NavbarGrin from "../../components/NavbarGrin.jsx";
import FormNewPresidente from "../../components/presidenti/FormNewPresidente.jsx";
import { useState, useEffect } from "react";

function CreateNewPresidentePage() {

    const [pageTitle, setPageTitle] = useState('Nuovo Account');
    useEffect(() => { document.title = pageTitle}, [pageTitle]); // eseguito ogni volta che cambia pageTitle

    return(
        <>
            <NavbarGrin />
            <div className="flex justify-center">
                <FormNewPresidente />
            </div>
            
        </>
    )
    
}

export default CreateNewPresidentePage;