import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function FormNewInsegnamento(props){
    const navigate = useNavigate();
    const [settori, setSettori] = useState([]); // elenco dei settori
    const [loading, setLoading] = useState(true);

    // dati del form
    const [formData, setFormData] = useState({
        nome: "",
        CFUTot: 0,
        settore: "",
        richiesta: props.richiesta,
    })    
    // messaggi di errore, result contiene la risposta della chiamata HTTP
    const [formErrors, setFormErros] = useState({
        nome: "",
        CFUTot: 0,
        settore: ""
    })
    // recupero tutti i settori
    const loadAllSettori = async () => {
        try {
            const response = await fetch(`/api/settori`, {
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
                setSettori(data.data);
            }
            
        } catch (error) { console.log(error); }
    };
    useEffect(() => loadAllSettori, []); // Non ha dipendenze, eseguito ad ogni render
    // recupero tutte le aree
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
    // controlli sui dati del form
    const checkNome = () => {
        if(!formData.nome){
            setFormErros({
                ...formErrors,
                nome: "Campo obbligatorio"
            })
            return false;
        }
        return true;
    }
    const checkCFUTot = () => {
        if(formData.CFUTot <= 0){
            setFormErros({
                ...formErrors,
                CFUTot: "Inserire un numero positivo"
            })
            return false;
        }
        return true;
    }
    const checkSettore = () => {
        if(!formData.settore){
            setFormErros({
                ...formErrors,
                settore: "Campo obbligatorio"
            })
            return false;
        }
        return true;
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
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(checkNome() && checkCFUTot() && checkSettore())
            console.log(formData);
    }

    return(
        <>
            <div className="w-full max-w-md bg-gray-100 p-8 rounded-lg">
                <form onSubmit={handleSubmit}>
                    {/* Nome insegnamento */}
                    <div className="mb-4">
                        <label htmlFor="nomeInsegnamento" className="block text-sm font-medium text-gray-700">Nome insegnamento*</label>
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
                    {/* CFU Totali */}
                    <div className="mb-4">
                        <label htmlFor="CFUTot" className="block text-sm font-medium text-gray-700">CFU Totali *</label>
                        <input
                            type="number"
                            id="CFUTot"
                            name="CFUTot"
                            value={formData.CFUTot}
                            onChange={handleChange}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {formErrors.CFUTot && <p className="text-red-500">{formErrors.CFUTot}</p>}
                    </div>
                    {/* Settore */}
                    <div className="mb-4">
                        <label htmlFor="settore" className="block text-sm font-medium text-gray-700">Settore*</label>
                        <select
                            id="settore"
                            name="settore"
                            value={formData.settore}
                            onChange={handleChange}
                        >
                            <option value="">Seleziona un elemento</option>
                            {settori.map(s => (
                                <option key={s.id} value={s.id}>{s.id}</option> ))}
                        </select>
                        {formErrors.settore && <p className="text-red-500">{formErrors.settore}</p>}
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
                            to={`/dashboard/richiesta/${props.richiesta}`}
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

export default FormNewInsegnamento;