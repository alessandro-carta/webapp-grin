import NavbarGrin from "../../components/NavbarGrin.jsx";
import FormNewArea from "../../components/aree/FormNewArea.jsx"
import { useState, useEffect } from "react";

function CreateNewAreaPage () {

    const [pageTitle, setPageTitle] = useState('Nuova Area');
    useEffect(() => { document.title = pageTitle}, [pageTitle]); // eseguito ogni volta che cambia pageTitle

    return(
        <>
            <NavbarGrin />
            <h1 className='text-blue-800'>{pageTitle}</h1>
            <FormNewArea />
        </>
    )
    
}

export default CreateNewAreaPage;