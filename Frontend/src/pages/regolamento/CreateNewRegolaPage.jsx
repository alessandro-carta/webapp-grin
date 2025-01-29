import { useState, useEffect } from "react";
import NavbarGrin from "../../components/NavbarGrin";
import FormNewRegola from "../../components/regolamento/FormNewRegola";

function CreateNewRegolaPage(){
    const [pageTitle, setPageTitle] = useState('Nuova Regola');
    useEffect(() => { document.title = pageTitle}, [pageTitle]); // eseguito ogni volta che cambia pageTitle

    return(
        <>
            <NavbarGrin />
            <div className="flex justify-center">
                <FormNewRegola />
            </div>
        </>
    )
}
export default CreateNewRegolaPage;