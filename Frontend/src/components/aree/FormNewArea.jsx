import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function FormNewArea() {

    const navigate = useNavigate();

    // dati del form
    const [formData, setFormData] = useState({
        idArea: "",
        Nome: "",

    })
    // messaggi di errore, result contiene la risposta della chiamata HTTP
    const [formErrors, setFormErros] = useState({
        idArea: "",
        Nome: "",
        Result: ""
    })

    const checkArea = () => {
        if(!formData.idArea){
            setFormErros({
                ...formErrors,
                idArea: "Campo obbligatorio"
            })
            return false;
        }
        if(formData.idArea.length != 1){
            setFormErros({
                ...formErrors,
                idArea: "Deve essere un singolo carattere"
            })
            return false;
        }
        return true;
    }

    const checkNome = () => {
        if(!formData.Nome){
            setFormErros({
                ...formErrors,
                Nome: "Campo obbligatorio"
            })
            return false;
        }
        if(formData.Nome.length > 45){
            setFormErros({
                ...formErrors,
                Nome: "Inserire un nome più corto"
            })
            return false;
        }
        return true;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(checkArea() && checkNome()){
            const response = await fetch(`http://localhost:8081/addArea`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            // inserimento riuscito
            if (response.ok) { navigate('/aree'); }
            // inserimento fallito
            // inserita un'area con idArea gia' esistente
            if (!response.ok) {
                const errorData = await response.json();
                setFormErros({...formErrors, Result: errorData.message})
            }
        }

    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        setFormErros({
            ...formErrors,
            [name]: "",
            Result: ""
        });
    }

    return(
        <>
            <div className="w-full max-w-md bg-gray-100 p-8 rounded-lg">
                <form onSubmit={handleSubmit}>
                    {/* idArea */}
                    <div className="mb-4">
                        <label htmlFor="idArea" className="block text-sm font-medium text-gray-700">Sigla*</label>
                        <input
                            type="text"
                            id="idArea"
                            name="idArea"
                            value={formData.idArea}
                            onChange={handleChange}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {formErrors.idArea && <p className="text-red-500">{formErrors.idArea}</p>}
                    </div>
                    {/* Nome */}
                    <div className="mb-4">
                        <label htmlFor="Nome" className="block text-sm font-medium text-gray-700">Nome*</label>
                        <input
                            type="text"
                            id="Nome"
                            name="Nome"
                            value={formData.Nome}
                            onChange={handleChange}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {formErrors.Nome && <p className="text-red-500">{formErrors.Nome}</p>}
                    </div>
                    {/* Bottone di invio e annulla */}
                    <div className="mb-4">
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700"
                        >
                            CREA 
                        </button>

                        <Link
                            className="text-blue-500 hover:text-blue-700"
                            to={'/aree'}
                        >
                            Annulla
                        </Link>
                        {formErrors.Result && <p className="text-red-500">{formErrors.Result}</p>}
                    </div>
                </form>
            </div>
            
        </>
    )
    
}

export default FormNewArea;