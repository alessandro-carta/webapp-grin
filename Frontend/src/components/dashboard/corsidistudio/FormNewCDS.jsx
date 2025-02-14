import { useState } from "react";
import { data, Link, useNavigate } from "react-router-dom";

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
                if (response.ok) { 
                    const data = await response.json();
                    navigate(`/dashboard/c/${data.data}`); 
                }
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
                    {/* Durata */}
                    <div className="mb-4">
                        <label htmlFor="durata" className="form__label">Durata*</label>
                        <input
                            type="number"
                            id="durata"
                            name="durata"
                            value={formData.durata}
                            onChange={handleChange}
                            className="form__input"
                        />
                        {formErrors.durata && <p className="error__message">{formErrors.durata}</p>}
                    </div>
                    <p className="text-base p-2">* Campi obbligatori</p>
                    <p className="text-base mb-2">cliccando su CREA, si dichiara che il Corso Di Studio è accreditato all'ANVUR.</p>
                    {/* Bottone di invio e annulla */}
                    <div className="mb-4">
                        <button
                            type="submit"
                            className="button__principale w-full"
                        >
                            CREA
                        </button>

                        <Link
                            className="link"
                            to={'/dashboard/corsidistudio'}
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
export default FormNewCDS;