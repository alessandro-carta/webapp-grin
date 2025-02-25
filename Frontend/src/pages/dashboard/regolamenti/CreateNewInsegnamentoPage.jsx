import { useParams } from "react-router-dom";
import NavbarPresidente from "../../../components/NavbarPresidente.jsx";
import { useState, useEffect } from "react";
import FormNewInsegnamento from "../../../components/dashboard/regolamenti/FormNewInsegnamento.jsx";

function CreateNewInsegnamentoPage() {
    const { idRegolamento } = useParams();
    const [pageTitle, setPageTitle] = useState('Nuovo Insegnamento');
    useEffect(() => { document.title = pageTitle}, [pageTitle]); // eseguito ogni volta che cambia pageTitle

    return(
        <>
            <NavbarPresidente />
            <div className="flex justify-center">
                <FormNewInsegnamento regolamento={idRegolamento}/>
            </div>
            
        </>
    )
    
}

export default CreateNewInsegnamentoPage;