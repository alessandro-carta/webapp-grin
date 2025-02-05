import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function FormNewCDS() {
    const navigate = useNavigate();
    // dati del form e messaggio di errore per ogni cambo
    const [formData, setFormData] = useState({
        nome: "",
        durata: 0
    })
    // result contiene il messaggio di errore inviato dal server
    const [formErrors, setFormErros] = useState({
        nome: "",
        durata: "",
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
    const checkDurata = () => {
        if(!formData.durata){
            setFormErros({
                ...formErrors,
                durata: "Campo obbligatorio"
            })
            return false;
        }
        if(formData.durata != 3){
            setFormErros({
                ...formErrors,
                durata: "Inserire un dato corretto"
            })
            return false;
        }
        return true;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if(checkNome() && checkDurata()){
                const response = await fetch(`/api/addCDS`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify(formData)
                });
                // accesso non consentito
                if(response.status == 403) navigate('/');
                if (response.ok) { navigate(`/dashboard`); }
                if (!response.ok) {
                    const errorData = await response.json();
                    setFormErros({...formErrors, result: errorData.message})
                }
            }
        } catch (error) {
            setFormErros({
                ...formErrors,
                result: "Errore nella comunicazione con il server. Si prega di riprovare"
            });
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
                    {/* Durata */}
                    <div className="mb-4">
                        <label htmlFor="durata" className="block text-sm font-medium text-gray-700">Durata*</label>
                        <input
                            type="number"
                            id="durata"
                            name="durata"
                            value={formData.durata}
                            onChange={handleChange}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {formErrors.durata && <p className="text-red-500">{formErrors.durata}</p>}
                    </div>
                    <p className="text-base p-2">* Campi obbligatori</p>
                    {/* Bottone di invio e annulla */}
                    <div className="mb-4">
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700"
                        >
                            Crea un nuovo corso
                        </button>

                        <Link
                            className="text-blue-500 hover:text-blue-700"
                            to={'/dashboard/corsidistudio'}
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
export default FormNewCDS;