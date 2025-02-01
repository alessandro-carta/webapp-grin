import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function FormUpdatePresidente(props) {
    const navigate = useNavigate();
    // dati del form ed messaggio di errore per ogni campo
    // Result contiene eventuali errori del server
    const [formData, setFormData] = useState({
        id: props.presidente.id,
        nome: props.presidente.nome,
        cognome: props.presidente.cognome,
        email: props.presidente.email,
        università: props.presidente.università,
        attivo: props.presidente.attivo
    })
    const [formErrors, setFormErros] = useState({
        nome: "",
        cognome: "",
        email: "",
        università: "",
        result: ""
    })

    const checkNome = () => {
        if(!formData.nome){
            setFormErros({
                ...formErrors,
                nome: "Campo obbligatorio"
            })
            return false;
        }
        if(formData.nome.length > 45){
            setFormErros({
                ...formErrors,
                nome: "Inserire un nome più corto"
            })
            return false;
        }
        return true;
    }
    const checkCognome = () => {
        if(!formData.cognome){
            setFormErros({
                ...formErrors,
                cognome: "Campo obbligatorio"
            })
            return false;
        }
        if(formData.cognome.length > 45){
            setFormErros({
                ...formErrors,
                cognome: "Inserire un cognome più corto"
            })
            return false;
        }
        return true;
    }
    const checkEmail = () => {
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if(!formData.email || !emailPattern.test(formData.email)){
            setFormErros({
                ...formErrors,
                email: "Inserisci email valida"
            })
            return false;
        }
        if(formData.email.length > 45){
            setFormErros({
                ...formErrors,
                email: "Inserire una email più corta"
            })
            return false;
        }
        return true;
    }
    const checkUniversità = () => {
        if(!formData.università){
            setFormErros({
                ...formErrors,
                università: "Campo obbligatorio"
            })
            return false;
        }
        if(formData.università.length > 45){
            setFormErros({
                ...formErrors,
                università: "Inserire un'università più corta"
            })
            return false;
        }
        return true;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(checkNome() && checkCognome() && checkEmail() && checkUniversità()){
            const response = await fetch(`/api/updatePresidente`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            // aggiornamento avvenuto con successo
            if (response.ok) {
                navigate('/presidenti');
            }
            // aggiornamento fallito
            if (!response.ok) {
                const errorData = await response.json();
                setFormErros({...formErrors, result: errorData.message})
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
            result: ""
        });
    }

    return(
        <>
            <div className="w-full max-w-md bg-gray-100 p-8 rounded-lg">
                <form onSubmit={handleSubmit}>
                    {/* Nome */}
                    <div className="mb-4">
                        <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome*</label>
                        <input
                            type="text"
                            id="nome"
                            name="nome"
                            value={formData.nome}
                            onChange={handleChange}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {formErrors.nome && <p className="text-red-500">{formErrors.nome}</p>}
                    </div>
                    {/* Cognome */}
                    <div className="mb-4">
                        <label htmlFor="cognome" className="block text-sm font-medium text-gray-700">Cognome*</label>
                        <input
                            type="text"
                            id="cognome"
                            name="cognome"
                            value={formData.cognome}
                            onChange={handleChange}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {formErrors.cognome && <p className="text-red-500">{formErrors.cognome}</p>}
                    </div>
                    {/* Email */}
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email*</label>
                        <input
                            type="text"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {formErrors.email && <p className="text-red-500">{formErrors.email}</p>}
                    </div>
                    {/* Università */}
                    <div className="mb-4">
                        <label htmlFor="università" className="block text-sm font-medium text-gray-700">Università*</label>
                        <input
                            type="text"
                            id="università"
                            name="università"
                            value={formData.università}
                            onChange={handleChange}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {formErrors.università && <p className="text-red-500">{formErrors.università}</p>}
                    </div>
                    <p className="text-base p-2">* Campi obbligatori</p>
                    {/* Bottone di invio e annulla */}
                    <div className="mb-4">
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700"
                        >
                            Modifica account
                        </button>
                        <Link
                            className="text-blue-500 hover:text-blue-700"
                            to={'/presidenti'}
                        >
                            Annulla
                        </Link>
                        {formErrors.result && <p className="text-red-500">{formErrors.result}</p>}
                    </div>
                </form>
            </div>
        </>
    )
}
export default FormUpdatePresidente;