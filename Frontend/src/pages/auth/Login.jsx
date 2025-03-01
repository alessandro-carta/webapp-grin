import FormLoginPresidente from '../../components/auth/FormLoginPresidente.jsx';
import { useState, useEffect } from "react";

function Login() {
    const [pageTitle, setPageTitle] = useState('Accesso Area Riservata');
    useEffect(() => { document.title = pageTitle }, [pageTitle]); // eseguito ogni volta che cambia pageTitle

    return (
        <>
        <div className='flex flex-col items-center gap-4 justify-center'>
            <p className="title text-3xl">{pageTitle}</p>
            <FormLoginPresidente />
        </div>
        
        </>
    )

}
export default Login;