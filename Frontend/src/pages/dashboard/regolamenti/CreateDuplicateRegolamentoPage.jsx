import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import NavbarPresidente from "../../../components/NavbarPresidente.jsx";
import FormDuplicateRegolamento from "../../../components/dashboard/regolamenti/FormDuplicateRegolamento.jsx";

function CreateDuplicateRegolamentoPage () {

    const [pageTitle, setPageTitle] = useState('Duplica Regolamento');
    useEffect(() => { document.title = pageTitle}, [pageTitle]); // eseguito ogni volta che cambia pageTitle
    const { idRegolamento, idCDS } = useParams();

    return(
        <>
            <NavbarPresidente />
            <div className="flex justify-center">
                <FormDuplicateRegolamento regolamento={idRegolamento} cds={idCDS}/>
            </div>
        </>
    )
    
}

export default CreateDuplicateRegolamentoPage;