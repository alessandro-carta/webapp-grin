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
                password: "Inserisci una password valida"
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
            <div className="form__container">
                <form onSubmit={handleSubmit}>
                    {/* Passowrd */}
                    <div className="mb-4">
                        <label htmlFor="password" className="form__label">Inserisci la nuova password*</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="form__input"
                        />
                        {formErrors.password && <p className="error__message">{formErrors.password}</p>}
                    </div>
                    <p className="text-base p-2">Deve contenerene almeno 8 caratteri, almeno una lettera maiuscola, almeno un numero e un carattere speciale.</p>
                    <p className="text-base p-2">* Campi obbligatori</p>
                    {/* Bottone di invio e annulla */}
                    <div className="mb-4">
                        <button
                            type="submit"
                            className="w-full button__principale"
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