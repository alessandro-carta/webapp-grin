import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function FormNewSottoarea(props) {

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
        id: "",
        nome: "",
        area: props.area || "",

    })
    // messaggi di errore, result contiene la risposta della chiamata HTTP
    const [formErrors, setFormErros] = useState({
        id: "",
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

    const checkSigla = () => {
        if(!formData.id){
            setFormErros({
                ...formErrors,
                id: "Campo obbligatorio"
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
            if(checkSigla() && checkArea() && checkNome()){
                const response = await fetch(`/api/addSottoarea`, {
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
                if (response.ok) { navigate(`/sottoaree/${formData.area}/?Visual=admin`); }
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

    if(loading) return <p>LOADING...</p>
    return(
        <>
            <div className="w-full max-w-md bg-gray-100 p-8 rounded-lg">
                <form onSubmit={handleSubmit}>
                    {/* idSottoArea */}
                    <div className="mb-4">
                        <label htmlFor="sigla" className="block text-sm font-medium text-gray-700">Sigla*</label>
                        <input
                            type="text"
                            id="id"
                            name="id"
                            value={formData.id}
                            onChange={handleChange}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {formErrors.id && <p className="text-red-500">{formErrors.id}</p>}
                    </div>
                    {/* Nome */}
                    <div className="mb-4">
                        <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome*</label>
                        <input
                            type="text"
                            id="nome"
                            name="nome"
                            value={formData.nome}
                            onChange={handleChange}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {formErrors.nome && <p className="text-red-500">{formErrors.nome}</p>}
                    </div>
                    {/* Area */}
                    <div className="mb-4">
                        <label htmlFor="area" className="block text-sm font-medium text-gray-700">Area*</label>
                        <select
                            id="area"
                            name="area"
                            value={formData.area}
                            onChange={handleChange}
                        >
                            <option value="">Seleziona un elemento</option>
                            {aree.map(area => (
                                <option key={area.id} value={area.id}>{area.nome}</option> ))}
                        </select>
                        {formErrors.area && <p className="text-red-500">{formErrors.area}</p>}
                    </div>
                    <p className="text-base p-2">* Campi obbligatori</p>
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
                            to={'/aree/?Visual=admin'}
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

export default FormNewSottoarea;