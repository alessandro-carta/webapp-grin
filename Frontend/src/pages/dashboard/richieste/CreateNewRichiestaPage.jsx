import FormNewRichiesta from "../../../components/dashboard/richieste/FormNewRichiesta.jsx";
import NavbarPresidente from "../../../components/NavbarPresidente.jsx";
import { useState, useEffect } from "react";

function CreateNewRichiestaPage() {

    const [pageTitle, setPageTitle] = useState('Nuova Richiesta');
    useEffect(() => { document.title = pageTitle}, [pageTitle]); // eseguito ogni volta che cambia pageTitle

    return(
        <>
            <NavbarPresidente />
            <div className="flex justify-center">
                <FormNewRichiesta />
            </div>
            
        </>
    )
    
}

export default CreateNewRichiestaPage;