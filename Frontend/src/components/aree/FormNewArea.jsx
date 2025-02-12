import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function FormNewArea() {

    const navigate = useNavigate();

    // dati del form
    const [formData, setFormData] = useState({
        id: "",
        nome: ""
    })
    // messaggi di errore, result contiene la risposta della chiamata HTTP
    const [formErrors, setFormErros] = useState({
        id: "",
        nome: "",
        result: ""
    })

    const checkArea = () => {
        if(!formData.id){
            setFormErros({
                ...formErrors,
                id: "Campo obbligatorio"
            })
            return false;
        }
        if(formData.id.length != 1){
            setFormErros({
                ...formErrors,
                id: "Deve essere un singolo carattere"
            })
            return false;
        }
        return true;
    }

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if(checkArea() && checkNome()){
                const response = await fetch(`/api/addArea`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify(formData)
                });
                // accesso non consentito
                if(response.status == 403) navigate('/');
                // inserimento riuscito
                if (response.ok) { navigate('/aree/?Visual=admin'); }
                // inserimento fallito
                // inserita un'area con idArea gia' esistente
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
            Result: ""
        });
    }

    return(
        <>
            <div className="form__container">
                <form onSubmit={handleSubmit}>
                    {/* idArea */}
                    <div className="mb-4">
                        <label htmlFor="id" className="form__label">Sigla*</label>
                        <input
                            type="text"
                            id="id"
                            name="id"
                            value={formData.id}
                            onChange={handleChange}
                            className="form__input"
                        />
                        {formErrors.id && <p className="error__message">{formErrors.id}</p>}
                    </div>
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
                    <p className="text-base p-2">* Campi obbligatori</p>
                    {/* Bottone di invio e annulla */}
                    <div className="mb-4">
                        <button
                            type="submit"
                            className="w-full button__principale"
                        >
                            CREA 
                        </button>
                        <Link
                            className="link"
                            to={'/aree/?Visual=admin'}
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

export default FormNewArea;