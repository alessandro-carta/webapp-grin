import { useState, useEffect } from "react";
import FormChangePassword from "../../components/auth/FormChangePassword";

function PasswordChangePage(){
    const [pageTitle, setPageTitle] = useState('Cambio Password');
    useEffect(() => { document.title = pageTitle }, [pageTitle]); // eseguito ogni volta che cambia pageTitle
    
    return(
        <>
            <div className="flex flex-col items-center gap-4 justify-center">
                <p className="text-blue-800 text-4xl">Azione Richiesta: {pageTitle}</p>
                <FormChangePassword />
            </div>
        </>
    )
}

export default PasswordChangePage;