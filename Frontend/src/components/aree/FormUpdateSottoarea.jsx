import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function FormUpdateSottoarea(props) {
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
        if(checkNome() && checkArea()){
            const response = await fetch(`/api/updateSottoarea`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            // modifica riuscita
            if (response.ok) {
                navigate(`/sottoaree/${formData.area}`);
            }
            // modifica fallita
            if (!response.ok) {
                const errorData = await response.json();
                setFormErros({...formErrors, result: "Modifica non riuscita, si prega di riprovare"});
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
                            {aree.map(area => (
                                <option key={area.id} value={area.id}>{area.nome}</option> ))}
                        </select>
                        {formErrors.area && <p className="text-red-500">{formErrors.area}</p>}
                    </div>
                    {/* Bottone di invio e annulla */}
                    <p className="text-base p-2">* Campi obbligatori</p>
                    <div className="mb-4">
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700"
                        >
                            MODIFICA
                        </button>
                        <Link
                            className="text-blue-500 hover:text-blue-700"
                            to={`/sottoaree/${props.sottoarea.area}`}
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

export default FormUpdateSottoarea;