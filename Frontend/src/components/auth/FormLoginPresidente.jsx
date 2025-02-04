import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function FormLoginPresidente() {
    const navigate = useNavigate();
    // dati del form e messaggio di errore per ogni cambo
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })
    // result contiene il messaggio di errore inviato dal server
    const [formErrors, setFormErros] = useState({
        email: "",
        password: "",
        result: ""
    })

    const checkEmail = () => {
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if(!formData.email || !emailPattern.test(formData.email)){
            setFormErros({
                ...formErrors,
                email: "Inserisci email valida"
            })
            return false;
        }
        return true;
    }

    const checkPassword = () => {
        if(!formData.password){
            setFormErros({
                ...formErrors,
                password: "Campo obbligatorio"
            })
            return false;
        }
        return true;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(checkEmail() && checkPassword()){
            try {
                const response = await fetch(`/api/presidenteLogin`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                })
                // risposta con successo
                if(response.ok) {
                    const data = await response.json();
                    localStorage.setItem('token', data.data.token);
                    if(data.data.changePassword) navigate(`/cambio-password`);
                }
                if(!response.ok){
                    const { error } = await response.json();
                    setFormErros({...formErrors, result: error});
                }
                
            } catch (error) { console.log(error); }
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
                    {/* Email */}
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email*</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {formErrors.email && <p className="text-red-500">{formErrors.email}</p>}
                    </div>
                    {/* Passowrd */}
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password*</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {formErrors.password && <p className="text-red-500">{formErrors.password}</p>}
                    </div>
                    <p className="text-base p-2">* Campi obbligatori</p>
                    {/* Bottone di invio e annulla */}
                    <div className="mb-4">
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700"
                        >
                            Accedi
                        </button>
                        {formErrors.result && <p className="text-red-500">{formErrors.result}</p>}
                    </div>
                </form>
            </div>
        </>
    )
}
export default FormLoginPresidente;