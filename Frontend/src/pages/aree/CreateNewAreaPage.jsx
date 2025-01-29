import NavbarGrin from "../../components/NavbarGrin.jsx";
import FormNewArea from "../../components/aree/FormNewArea.jsx"
import { useState, useEffect } from "react";

function CreateNewAreaPage () {

    const [pageTitle, setPageTitle] = useState('Nuova Area');
    useEffect(() => { document.title = pageTitle}, [pageTitle]); // eseguito ogni volta che cambia pageTitle

    return(
        <>
            <NavbarGrin />
            <div className="flex justify-center">
                <FormNewArea />
            </div>
        </>
    )
    
}

export default CreateNewAreaPage;