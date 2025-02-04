import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function FormChangePassword() {
    const navigate = useNavigate();
    // dati del form e messaggio di errore per ogni cambo
    const [formData, setFormData] = useState({
        password: ""
    })
    // result contiene il messaggio di errore inviato dal server
    const [formErrors, setFormErros] = useState({
        password: "",
        result: ""
    })

    const checkPassword = () => {
        const passwordPattern = /^(?=.*\d)(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
        if(!formData.password || !passwordPattern.test(formData.password)){
            setFormErros({
                ...formErrors,
                password: "Inserisci una email valida"
            })
            return false;
        }
        return true;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(checkPassword()){
            try {
                const response = await fetch(`/api/changePassword`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({...formData, token: localStorage.getItem('token')})
                })
                // accesso non consentito
                if(response.status == 403) navigate('/');
                // risposta con successo
                if(response.ok) {
                    localStorage.removeItem('token');
                    navigate('/');
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
                    {/* Passowrd */}
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Inserisci la nuova password*</label>
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
                    <p className="text-base p-2">Deve contenerene almeno 8 caratteri, almeno una lettera maiuscola, almeno un numero e un carattere speciale.</p>
                    <p className="text-base p-2">* Campi obbligatori</p>
                    {/* Bottone di invio e annulla */}
                    <div className="mb-4">
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700"
                        >
                            Cambia
                        </button>
                        {formErrors.result && <p className="text-red-500">{formErrors.result}</p>}
                    </div>
                </form>
            </div>
        </>
    )
}
export default FormChangePassword;