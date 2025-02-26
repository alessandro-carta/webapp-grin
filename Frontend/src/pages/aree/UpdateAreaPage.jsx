import { useParams } from "react-router-dom";
import NavbarGrin from "../../components/NavbarGrin.jsx";
import { useState, useEffect } from "react";
import FormUpdateArea from "../../components/aree/FormUpdateArea.jsx";
import Loading from "../../components/Loading.jsx";

function UpdateAreaPage(){

    const { idArea } = useParams();
    const [area, setArea] = useState();
    const [loading, setLoading] = useState(true);
    const [pageTitle, setPageTitle] = useState('Modifica Area');

    const loadArea = async () => {
        try {
            const response = await fetch(`/api/area/${idArea}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
    
            if(response.ok){
                const data = await response.json();
                setArea(data.data);
                setLoading(false);
            }
            if(!response.ok){
                navigate('/admin-login');
            }
            
        } catch (error) {
            console.error(error);
        }
        
    }

    useEffect(() => { document.title = pageTitle}, [pageTitle]); // eseguito ogni volta che cambia pageTitle
    useEffect( () => loadArea, [idArea]);

    if(loading) return <Loading />
    return(
        <>
            <NavbarGrin />
            <div className="flex justify-center">
                <FormUpdateArea area={area}/>
            </div>
        </>
    )

}

export default UpdateAreaPage;