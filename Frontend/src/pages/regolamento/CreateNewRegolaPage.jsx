import { useState, useEffect } from "react";
import NavbarGrin from "../../components/NavbarGrin";
import FormNewRegola from "../../components/regolamento/FormNewRegola";
import { useLocation } from "react-router-dom";

function CreateNewRegolaPage(){
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const RegolaCFU = queryParams.get('RegolaCFU');

    const [pageTitle, setPageTitle] = useState("Nuova Regola per "+(RegolaCFU === "true" ? "CFU": "numero"));
    useEffect(() => { document.title = pageTitle}, [pageTitle]); // eseguito ogni volta che cambia pageTitle

    return(
        <>
            <NavbarGrin />
            <div className="flex justify-center">
                <FormNewRegola RegolaCFU={RegolaCFU === "true" ? true : false}/>
            </div>
        </>
    )
}
export default CreateNewRegolaPage;