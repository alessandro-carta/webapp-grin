import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function FormNewRegolamento(props) {

    const navigate = useNavigate();
    // dati del form
    const [formData, setFormData] = useState({
        annoaccademico: "",
        cds: props.cds
    })
    // messaggi di errore, result contiene la risposta della chiamata HTTP
    const [formErrors, setFormErros] = useState({
        annoaccademico: "",
        result: ""
    })

    const checkAnnoAccademico = () => {
        const testAnnoAccademico = /^\d{4}\/\d{4}$/;
        if(!formData.annoaccademico || !testAnnoAccademico.test(formData.annoaccademico)){
            setFormErros({
                ...formErrors,
                annoaccademico: "Inserire formato valido"
            })
            return false;
        }
        return true;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if(checkAnnoAccademico()){
                const response = await fetch(`/api/addRegolamento`, {
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
                if (response.ok) { navigate(`/dashboard/c/${props.cds}`); }
                // inserimento fallito
                // inserita una sottoarea con idSottoarea gia' esistente
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
                    {/* Anno Accademico */}
                    <div className="mb-4">
                        <label htmlFor="annoaccademico" className="form__label">Anno Accademico*</label>
                        <label className="form__label">Formato: AAAA/AAAA</label>
                        <input
                            type="text"
                            id="annoaccademico"
                            name="annoaccademico"
                            value={formData.annoaccademico}
                            onChange={handleChange}
                            className="form__input"
                        />
                        {formErrors.annoaccademico && <p className="error__message">{formErrors.annoaccademico}</p>}
                    </div>
                    {/* Bottone di invio e annulla */}
                    <div className="mb-4">
                        <p className="text-base mt-2">* Campi obbligatori</p>
                        <button
                            type="submit"
                            className="w-full button__principale"
                        >
                            CREA 
                        </button>

                        <Link
                            className="link"
                            to={`/dashboard/c/${props.cds}`}
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

export default FormNewRegolamento;