import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { Link, useNavigate } from "react-router-dom";

function FormNewPresidente() {
    const navigate = useNavigate();
    // dati del form e messaggio di errore per ogni cambo
    const [formData, setFormData] = useState({
        Nome: "",
        Cognome: "",
        Email: "",
        Università: ""
    })
    // result contiene il messaggio di errore inviato dal server
    const [formErrors, setFormErros] = useState({
        Nome: "",
        Cognome: "",
        Email: "",
        Università: "",
        Result: ""
    })

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
    const checkCognome = () => {
        if(!formData.Cognome){
            setFormErros({
                ...formErrors,
                Cognome: "Campo obbligatorio"
            })
            return false;
        }
        if(formData.Cognome.length > 45){
            setFormErros({
                ...formErrors,
                Cognome: "Inserire un cognome più corto"
            })
            return false;
        }
        return true;
    }

    const checkEmail = () => {
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if(!formData.Email || !emailPattern.test(formData.Email)){
            setFormErros({
                ...formErrors,
                Email: "Inserisci email valida"
            })
            return false;
        }
        if(formData.Email.length > 45){
            setFormErros({
                ...formErrors,
                Email: "Inserire una email più corta"
            })
            return false;
        }
        return true;
    }

    const checkUniversità = () => {
        if(!formData.Università){
            setFormErros({
                ...formErrors,
                Università: "Campo obbligatorio"
            })
            return false;
        }
        if(formData.Università.length > 45){
            setFormErros({
                ...formErrors,
                Università: "Inserire un'università più corta"
            })
            return false;
        }
        return true;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(checkNome() && checkCognome() && checkEmail() && checkUniversità()){
            // generato idPresidente da uuid
            const data = {...formData, idPresidente: uuidv4()};
            const response = await fetch(`http://localhost:8081/addPresidente`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            // inserimento avvenuto con successo
            if (response.ok) {
                navigate('/presidenti');
            }
            // inserimento fallito
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
                    {/* Cognome */}
                    <div className="mb-4">
                        <label htmlFor="Cognome" className="block text-sm font-medium text-gray-700">Cognome*</label>
                        <input
                            type="text"
                            id="Cognome"
                            name="Cognome"
                            value={formData.Cognome}
                            onChange={handleChange}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {formErrors.Cognome && <p className="text-red-500">{formErrors.Cognome}</p>}
                    </div>
                    {/* Email */}
                    <div className="mb-4">
                        <label htmlFor="Email" className="block text-sm font-medium text-gray-700">Email*</label>
                        <input
                            type="text"
                            id="Email"
                            name="Email"
                            value={formData.Email}
                            onChange={handleChange}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {formErrors.Email && <p className="text-red-500">{formErrors.Email}</p>}
                    </div>
                    {/* Università */}
                    <div className="mb-4">
                        <label htmlFor="Università" className="block text-sm font-medium text-gray-700">Università*</label>
                        <input
                            type="text"
                            id="Università"
                            name="Università"
                            value={formData.Università}
                            onChange={handleChange}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {formErrors.Università && <p className="text-red-500">{formErrors.Università}</p>}
                    </div>
                    {/* Bottone di invio e annulla */}
                    <div className="mb-4">
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700"
                        >
                            Crea un nuovo account
                        </button>

                        <Link
                            className="text-blue-500 hover:text-blue-700"
                            to={'/presidenti'}
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
export default FormNewPresidente;