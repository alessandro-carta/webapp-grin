import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import NavbarPresidente from "../../components/NavbarPresidente.jsx";
import FormNewRegolamento from "../../components/dashboard/FormNewRegolamento.jsx";

function CreateNewRegolamentoPage () {

    const [pageTitle, setPageTitle] = useState('Nuovo Regolamento');
    useEffect(() => { document.title = pageTitle}, [pageTitle]); // eseguito ogni volta che cambia pageTitle
    const { idCDS } = useParams();

    return(
        <>
            <NavbarPresidente />
            <div className="flex justify-center">
                <FormNewRegolamento cds={idCDS} />
            </div>
        </>
    )
    
}

export default CreateNewRegolamentoPage;