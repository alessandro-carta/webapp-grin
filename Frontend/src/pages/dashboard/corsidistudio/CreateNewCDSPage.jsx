import { useState, useEffect } from "react";
import NavbarPresidente from "../../../components/NavbarPresidente.jsx";
import FormNewCDS from "../../../components/dashboard/corsidistudio/FormNewCDS.jsx";

function CreateNewCDSPage() {

    const [pageTitle, setPageTitle] = useState('Nuovo Corso di Studio');
    useEffect(() => { document.title = pageTitle}, [pageTitle]); // eseguito ogni volta che cambia pageTitle

    return(
        <>
            <NavbarPresidente />
            <div className="flex justify-center">
                <FormNewCDS />
            </div>
            
        </>
    )
    
}

export default CreateNewCDSPage;