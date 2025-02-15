import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function FormNewRichiesta(props) {

    const navigate = useNavigate();
    const [corsiDiStudio, setCorsiDiStudio] = useState([]); // elenco dei cds per il menu a tendina
    const [regolamenti, setRegolamenti] = useState([]); // elenco dei cds per il menu a tendina
    const [loading, setLoading] = useState(true); 

    // dati del form
    const [formData, setFormData] = useState({
        corsodistudio: "",
        regolamento: "",
    })
    // messaggi di errore, result contiene la risposta della chiamata HTTP
    const [formErrors, setFormErros] = useState({
        corsodistudio: "",
        regolamento: "",
        result: ""
    })

    const loadCorsiDiStudio = async () => {
        try {
            const response = await fetch(`/api/dashboard`, {
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
                setCorsiDiStudio(data.data);
                setLoading(false);
            }
            
        } catch (error) { console.log(error); }
    }
    useEffect(() => loadCorsiDiStudio, []); // Non ha dipendenze, eseguito ad ogni render

    const loadRegolamentiPerCDS = async (cds) => {
        try {
            const response = await fetch(`/api/regolamenti/${cds}`, {
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
                setRegolamenti(data.data);
                setLoading(false);
            }
            
        } catch (error) { console.log(error); }
    }

    const checkCDS = () => {
        if(!formData.corsodistudio){
            setFormErros({
                ...formErrors,
                corsodistudio: "Campo obbligatorio"
            })
            return false;
        }
        return true;
    }

    const checkRegolamento = () => {
        if(!formData.regolamento){
            setFormErros({
                ...formErrors,
                regolamento: "Campo obbligatorio"
            })
            return false;
        }
        return true;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const today = new Date().toISOString().split('T')[0];
        try {
            if(checkCDS() && checkRegolamento()){
                const response = await fetch(`/api/addRichiesta`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({...formData, data: today})
                });
                // accesso non consentito
                if(response.status == 403) navigate('/');
                // inserimento riuscito
                if (response.ok) { 
                    const data = await response.json();
                    navigate(`/dashboard/r/${data.data}`); 
                }
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
        if(name === "corsodistudio") loadRegolamentiPerCDS(value);
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
                    {/* Corsi Di Studio */}
                    <div className="mb-4">
                        <label htmlFor="corsodistudio" className="form__label">Corso Di Studio*</label>
                        <select
                            id="corsodistudio"
                            name="corsodistudio"
                            value={formData.corsodistudio}
                            onChange={handleChange}
                            className="form__select"
                        >
                            <option value="">Seleziona un corso</option>
                            {corsiDiStudio.map(corso => (
                                <option key={corso.id} value={corso.id}>{corso.corsodistudio}</option> ))}
                        </select>
                        {formErrors.corsodistudio && <p className="error__message">{formErrors.corsodistudio}</p>}
                    </div>
                    {/* Regolamento */}
                    <div className="mb-4">
                        <label htmlFor="regolamento" className="form__label">Regolamento*</label>
                        <select
                            id="regolamento"
                            name="regolamento"
                            value={formData.regolamento}
                            onChange={handleChange}
                            className="form__select"
                        >
                            <option value="">Seleziona un regolamento</option>
                            {regolamenti.map(reg => (
                                <option key={reg.id} value={reg.id}>{reg.annoaccademico}</option> ))}
                        </select>
                        {formErrors.regolamento && <p className="error__message">{formErrors.regolamento}</p>}
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
                            to={`/dashboard/richieste`}
                        >
                            Annulla
                        </Link>
                        {formErrors.result && <p className="text-red-500">{formErrors.result}</p>}
                    </div>
                </form>
            </div>
            
        </>
    )
    
}

export default FormNewRichiesta;