import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../Loading";

function FormLoginPresidente() {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
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
            setLoading(true);
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
                    else navigate(`/dashboard/corsidistudio`);
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
                    {/* Email */}
                    <div className="mb-4">
                        <label htmlFor="email" className="form__label">Email*</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="form__input"
                        />
                        {formErrors.email && <p className="error__message">{formErrors.email}</p>}
                    </div>
                    {/* Passowrd */}
                    <div className="mb-4 flex flex-col">
                        <div className="flex flex-col justify-center mb-1">
                            <label htmlFor="password" className="form__label">Password*</label>
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
                    <p className="text-base p-2">* Campi obbligatori</p>
                    {/* Bottone di invio e annulla */}
                    <div className="mb-4">
                        <button
                            type="submit"
                            className="w-full button__principale"
                        >
                            Accedi
                        </button>
                        <Link className="link p-2" to={'/admin-login'}>
                            Accedi come admin
                        </Link>
                        <Link className="link p-2" to={'/'}>
                            Torna alla homepage
                        </Link>
                        {formErrors.result && <p className="error__message">{formErrors.result}</p>}
                    </div>
                </form>
            </div>
        </>
    )
}
export default FormLoginPresidente;