import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function FormUpdatePresidente(props) {
    const [loading, setLoading] = useState(false);
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
        try {
            if(checkNome() && checkCognome() && checkEmail() && checkUniversità()){
                setLoading(true);
                const response = await fetch(`/api/updatePresidente`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify(formData)
                });
                // accesso non consentito
                if(response.status == 403) navigate('/');
                if (response.ok) { 
                    const data = await response.json();
                    navigate(`/p/${data.data}`); 
                }
                if (!response.ok) {
                    setLoading(false);
                    const errorData = await response.json();
                    setFormErros({...formErrors, result: errorData.message})
                }
            }
        } catch (error) {
            setLoading(false);
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

    if(loading) return <p>LOADING...</p>
    return(
        <>
            <div className="form__container">
                <form onSubmit={handleSubmit}>
                    {/* Nome */}
                    <div className="mb-4">
                        <label htmlFor="nome" className="form__label">Nome*</label>
                        <input
                            type="text"
                            id="nome"
                            name="nome"
                            value={formData.nome}
                            onChange={handleChange}
                            className="form__input"
                        />
                        {formErrors.nome && <p className="error__message">{formErrors.nome}</p>}
                    </div>
                    {/* Cognome */}
                    <div className="mb-4">
                        <label htmlFor="cognome" className="form__label">Cognome*</label>
                        <input
                            type="text"
                            id="cognome"
                            name="cognome"
                            value={formData.cognome}
                            onChange={handleChange}
                            className="form__input"
                        />
                        {formErrors.cognome && <p className="error__message">{formErrors.cognome}</p>}
                    </div>
                    {/* Email */}
                    <div className="mb-4">
                        <label htmlFor="email" className="form__label">Email*</label>
                        <input
                            type="text"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="form__input"
                        />
                        {formErrors.email && <p className="error__message">{formErrors.email}</p>}
                    </div>
                    {/* Università */}
                    <div className="mb-4">
                        <label htmlFor="università" className="form__label">Università*</label>
                        <input
                            type="text"
                            id="università"
                            name="università"
                            value={formData.università}
                            onChange={handleChange}
                            className="form__input"
                        />
                        {formErrors.università && <p className="error__message">{formErrors.università}</p>}
                    </div>
                    <p className="text-base p-2">* Campi obbligatori</p>
                    {/* Bottone di invio e annulla */}
                    <div className="mb-4">
                        <button
                            type="submit"
                            className="w-full button__principale"
                        >
                            Modifica account
                        </button>
                        <Link
                            className="link"
                            to={'/presidenti'}
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
export default FormUpdatePresidente;