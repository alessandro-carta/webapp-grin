import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function FormNewSottoarea() {

    const navigate = useNavigate();
    const [aree, setAree] = useState([]); // elenco delle aree per il menu a tendina
    const [loading, setLoading] = useState(true);

    const loadAllAree = async () => {
            fetch('/api/aree')
                .then(res => res.json())
                .then(data => {
                    if(data.success){
                        setAree(data.data);
                        setLoading(false);
                    }
            })
            .catch(error => console.error("Errore nel caricamento dei dati:", error));
    }
    
    useEffect(() => loadAllAree, []); // Non ha dipendenze, eseguito ad ogni render

    // dati del form
    const [formData, setFormData] = useState({
        idSottoarea: "",
        Nome: "",
        Area: "",

    })
    // messaggi di errore, result contiene la risposta della chiamata HTTP
    const [formErrors, setFormErros] = useState({
        idSottoarea: "",
        Nome: "",
        Result: ""
    })

    const checkNome = () => {
        if(!formData.Nome){
            setFormErros({
                ...formErrors,
                Nome: "Campo obbligatorio"
            })
            return false;
        }
        if(formData.Nome.length > 45){
            setFormErros({
                ...formErrors,
                Nome: "Inserire un nome più corto"
            })
            return false;
        }
        return true;
    }

    const checkSigla = () => {
        if(!formData.idSottoarea){
            setFormErros({
                ...formErrors,
                idSottoarea: "Campo obbligatorio"
            })
            return false;
        }
        return true;
    }

    const checkArea = () => {
        if(!formData.Area){
            setFormErros({
                ...formErrors,
                Area: "Campo obbligatorio"
            })
            return false;
        }
        return true;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(checkSigla() && checkArea() && checkNome()){
            const response = await fetch(`/api/addSottoarea`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            // inserimento riuscito
            if (response.ok) { navigate(`/sottoaree/${formData.Area}`); }
            // inserimento fallito
            // inserita una sottoarea con idSottoarea gia' esistente
            if (!response.ok) {
                const errorData = await response.json();
                setFormErros({...formErrors, Result: errorData.message})
            }
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
            <div className="w-full max-w-md bg-gray-100 p-8 rounded-lg">
                <form onSubmit={handleSubmit}>
                    {/* idSottoArea */}
                    <div className="mb-4">
                        <label htmlFor="idArea" className="block text-sm font-medium text-gray-700">Sigla*</label>
                        <input
                            type="text"
                            id="idSottoarea"
                            name="idSottoarea"
                            value={formData.idSottoarea}
                            onChange={handleChange}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {formErrors.idSottoarea && <p style={{ color: 'red' }}>{formErrors.idSottoarea}</p>}
                    </div>
                    {/* Nome */}
                    <div className="mb-4">
                        <label htmlFor="Nome" className="block text-sm font-medium text-gray-700">Nome*</label>
                        <input
                            type="text"
                            id="Nome"
                            name="Nome"
                            value={formData.Nome}
                            onChange={handleChange}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {formErrors.Nome && <p style={{ color: 'red' }}>{formErrors.Nome}</p>}
                    </div>
                    {/* Area */}
                    <div className="mb-4">
                        <select
                            id="Area"
                            name="Area"
                            value={formData.Area.Nome}
                            onChange={handleChange}
                        >
                            <option value="">Scegli un'area</option>
                            {aree.map(area => (
                                <option key={area.idArea} value={area.idArea}>{area.Nome}</option> ))}
                        </select>
                        {formErrors.Area && <p style={{ color: 'red' }}>{formErrors.Area}</p>}
                    </div>
                    {/* Bottone di invio e annulla */}
                    <div className="mb-4">
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700"
                        >
                            CREA 
                        </button>

                        <Link
                            className="text-blue-500 hover:text-blue-700"
                            to={'/aree'}
                        >
                            Annulla
                        </Link>
                        {formErrors.Result && <p style={{ color: 'red' }}>{formErrors.Result}</p>}
                    </div>
                </form>
            </div>
            
        </>
    )
    
}

export default FormNewSottoarea;