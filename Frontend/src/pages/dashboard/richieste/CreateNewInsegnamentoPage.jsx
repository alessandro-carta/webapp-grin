import { useParams } from "react-router-dom";
import NavbarPresidente from "../../../components/NavbarPresidente.jsx";
import { useState, useEffect } from "react";
import FormNewInsegnamento from "../../../components/dashboard/richieste/FormNewInsegnamento.jsx";

function CreateNewInsegnamentoPage() {

    const { idRichiesta } = useParams();
    const [pageTitle, setPageTitle] = useState('Nuovo Insegnamento');
    useEffect(() => { document.title = pageTitle}, [pageTitle]); // eseguito ogni volta che cambia pageTitle

    return(
        <>
            <NavbarPresidente />
            <div className="flex justify-center">
                <FormNewInsegnamento richiesta={idRichiesta} />
            </div>
            
        </>
    )
    
}

export default CreateNewInsegnamentoPage;