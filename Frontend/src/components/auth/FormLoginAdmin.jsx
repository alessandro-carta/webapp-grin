import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function FormLoginAdmin() {
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
        if(checkPassword()){
            try {
                const response = await fetch(`/api/adminLogin`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                })
                // accesso non consentito
                if(response.status == 403) navigate('/');
                // risposta con successo
                if(response.ok) {
                    const data = await response.json();
                    localStorage.setItem('token', data.data);
                    navigate('/presidenti');
                }
                if(!response.ok){
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

    return(
        <>
            <div className="form__container">
                <form onSubmit={handleSubmit}>
                    {/* Passowrd */}
                    <div className="mb-4">
                        <label htmlFor="password" className="form__label">Password*</label>
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
                    {/* Bottone di invio e annulla */}
                    <div className="mb-4">
                        <button
                            type="submit"
                            className="w-full button__principale"
                        >
                            Accedi
                        </button>

                        <Link
                            className="link"
                            to={'/'}
                        >
                            Annulla
                        </Link>
                        {formErrors.result && <p className="error__message">{formErrors.result}</p>}
                    </div>
                </form>
            </div>
        </>
    )
}
export default FormLoginAdmin;