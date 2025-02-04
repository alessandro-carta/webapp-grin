import { useState, useEffect } from "react";
import FormLoginAdmin from "../../components/auth/FormLoginAdmin";

function LoginAdminPage(){

    const [pageTitle, setPageTitle] = useState('Login Admin');
    useEffect(() => { document.title = pageTitle }, [pageTitle]); // eseguito ogni volta che cambia pageTitle

    return(
        <>
            <div className="flex flex-col items-center gap-4 justify-center">
                <p className="text-blue-800 text-4xl">{pageTitle}</p>
                <FormLoginAdmin />
            </div>
        </>
    )

}

export default LoginAdminPage;