import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../../Loading"

function FormNewCDS() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    // dati del form e messaggio di errore per ogni cambo
    const [formData, setFormData] = useState({
        nome: "",
        durata: 0,
        anvur: false
    })
    // result contiene il messaggio di errore inviato dal server
    const [formErrors, setFormErros] = useState({
        nome: "",
        durata: "",
        result: "",
        anvur: false
    })

    const checkAnvur = () => {
        if(!formData.anvur){
            setFormErros({
                ...formErrors,
                anvur: true
            })
            return false;
        }
        return true
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
    const checkDurata = () => {
        if(!formData.durata){
            setFormErros({
                ...formErrors,
                durata: "Campo obbligatorio"
            })
            return false;
        }
        if(formData.durata != 3 && formData.durata != 2 && formData.durata != 5){
            setFormErros({
                ...formErrors,
                durata: "Valori possibile 3 per triennale, 2 per magistrale, 5 a ciclo unico"
            })
            return false;
        }
        return true;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if(checkNome() && checkDurata() && checkAnvur()){
                setLoading(true);
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
        const { name, value, type } = e.target;
        if(type == "checkbox") {
            const checked = e.target.checked;
            setFormData({...formData, anvur: checked});
            setFormErros({...formErrors, anvur: false});
        }
        else {
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
        
    }

    if(loading) return <Loading />
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
                    {/* Dichiarazione ANVUR */}
                    <div className="mb-4 flex items-center">
                        <input
                            type="checkbox"
                            name="anvur"
                            id="anvur"
                            value={true}
                            checked={formData.anvur}
                            onChange={handleChange}
                            className="mr-2"
                        />
                        {!formErrors.anvur && <label htmlFor="anvur" className="block text-sm">Dichiaro che il corso è accreditato all'ANVUR*</label>}
                        {formErrors.anvur && <label htmlFor="anvur" className="block text-sm text-cerror">Dichiaro che il corso è accreditato all'ANVUR*</label>}
                    </div>
                    <p className="text-base p-2">* Campi obbligatori</p>
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