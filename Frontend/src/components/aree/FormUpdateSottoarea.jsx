import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function FormUpdateSottoarea(props) {
    const navigate = useNavigate();
    const [aree, setAree] = useState([]); // elenco delle aree per il menu a tendina
    const [loading, setLoading] = useState(true);

    const loadAllAree = async () => {
        try {
            const response = await fetch(`/api/aree`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            })
            // accesso non consentito
            if(response.status == 403) navigate('/');
            // risposta con successo
            if(response.ok) {
                const data = await response.json();
                setAree(data.data);
                setLoading(false);
            }
            
        } catch (error) { console.log(error); }
    }
    
    useEffect(() => loadAllAree, []); // Non ha dipendenze, eseguito ad ogni render

    // dati del form
    const [formData, setFormData] = useState({
        id: props.sottoarea.id,
        nome: props.sottoarea.nome,
        area: props.sottoarea.area
    })
    // messaggi di errore
    const [formErrors, setFormErros] = useState({
        nome: "",
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

    const checkArea = () => {
        if(!formData.area){
            setFormErros({
                ...formErrors,
                area: "Campo obbligatorio"
            })
            return false;
        }
        return true;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if(checkNome() && checkArea()){
                const response = await fetch(`/api/updateSottoarea`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify(formData)
                });
                // accesso non consentito
                if(response.status == 403) navigate('/');
                // modifica riuscita
                if (response.ok) navigate(`/sottoaree/${formData.area}/?Visual=admin`);
                // modifica fallita
                if (!response.ok) {
                    const errorData = await response.json();
                    setFormErros({...formErrors, result: "Modifica non riuscita, si prega di riprovare"});
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
                    {/* Area */}
                    <div className="mb-4">
                        <label htmlFor="area" className="form__label">Area*</label>
                        <select
                            id="area"
                            name="area"
                            value={formData.area}
                            onChange={handleChange}
                            className="form__select"
                        >
                            {aree.map(area => (
                                <option key={area.id} value={area.id}>{area.nome}</option> ))}
                        </select>
                        {formErrors.area && <p className="error__message">{formErrors.area}</p>}
                    </div>
                    {/* Bottone di invio e annulla */}
                    <p className="text-base p-2">* Campi obbligatori</p>
                    <div className="mb-4">
                        <button
                            type="submit"
                            className="w-full button__principale"
                        >
                            MODIFICA
                        </button>
                        <Link
                            className="link"
                            to={`/sottoaree/${props.sottoarea.area}/?Visual=admin`}
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

export default FormUpdateSottoarea;