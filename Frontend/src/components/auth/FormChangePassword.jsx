import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../Loading";

function FormChangePassword() {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
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
            setLoading(true);
            try {
                const response = await fetch(`/api/changePassword`, {
                    method: 'PUT',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                     },
                    
                    body: JSON.stringify({...formData, token: localStorage.getItem('token')})
                })
                // accesso non consentito
                //if(response.status == 403) navigate('/');
                // risposta con successo
                if(response.ok) {
                    localStorage.removeItem('token');
                    navigate('/');
                }
                if(!response.ok){
                    setLoading(false);
                    const { error, message } = await response.json();
                    setFormErros({...formErrors, result: message});
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

    if(loading) return <Loading />
    return(
        <>
            <div className="form__container">
                <form onSubmit={handleSubmit}>
                    {/* Passowrd */}
                    <div className="mb-4 flex flex-col">
                        <div className="flex flex-col justify-center mb-1">
                            <label htmlFor="password" className="form__label">Inserisci la nuova password*</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="form__input"
                            />
                        </div>
                        <div className="flex items-cente">
                            <button type="button" onClick={ (e) => { e.preventDefault(); setShowPassword(!showPassword) } }>
                                <p className="title text-sm">{showPassword ? "Nascondi" : "Mostra"}</p>
                            </button>
                        </div>
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
                        {formErrors.result && <p className="error__message">{formErrors.result}</p>}
                    </div>
                </form>
            </div>
        </>
    )
}
export default FormChangePassword;