import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';


function FormNewRegola(props) {
    const navigate = useNavigate();
    const tipologie = ['area', 'sottoarea', 'settore'];
    // dati del form
    const [formData, setFormData] = useState({
        cfu: 0,
        count: 0,
        descrizione: "",
        tipologia: "",
        selezioni: []
    });
    // dati del form errori
    const [formErrors, setFormErros] = useState({
        input: "",
        descrizione: "",
        tipologia: "",
        selezioni: "",
        result: ""
    });
    const [sel, setSel] = useState([]);
    const [aree, setAree] = useState([]);
    // funzione per caricare le aree
    const loadAllAree = async () => {
        fetch('/api/aree')
        .then(res => res.json())
        .then(data => {
            // restituisce i dati se non ci sono errori
            if (data.success) {
                setAree(data.data.map((area) => ({
                    id: area.id,
                    nome: area.nome
                })));
            }
        })
        .catch(error => console.error("Errore nel caricamento dei dati:", error));
    };
    const [sottoaree, setSottoaree] = useState([]);
    // funzione per caricare le sottoaree
    const loadAllSottoaree = async () => {
        fetch('/api/sottoaree')
        .then(res => res.json())
        .then(data => {
            // restituisce i dati se non ci sono errori
            if (data.success) {
                setSottoaree(data.data.map((sottoarea) => ({
                    id: sottoarea.id,
                    nome: sottoarea.nome
                })));
            }
        })
        .catch(error => console.error("Errore nel caricamento dei dati:", error));
    };
    const [settori, setSettori] = useState([]);
    // funzione per caricare i settori
    const loadAllSettori = async () => {
        fetch('/api/settori')
        .then(res => res.json())
        .then(data => {
            // restituisce i dati se non ci sono errori
            if (data.success) {
                setSettori(data.data.map((settore) => ({
                    id: settore.id,
                    nome: settore.id
                })));
            }
        })
        .catch(error => console.error("Errore nel caricamento dei dati:", error));
    };
    // recupera i dati dinamici all'avvio
    useEffect(() => {
        loadAllAree();
        loadAllSottoaree();
        loadAllSettori();
    }, []);  // nessuna dipendenza, eseguito ad ogni render

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        // scelta tipologia regola
        if(type === 'radio') {
            setFormData({...formData, selezioni: [], tipologia: value});
            setSel([]);
            if(value === 'area') setSel(aree);
            if(value === 'sottoarea') setSel(sottoaree);
            if(value === 'settore') setSel(settori);
        }
        else if(type === 'checkbox'){
            setFormData((prevFormData) => {
                const prevSelezioni = prevFormData.selezioni || [];
                const updatedSelezioni = prevSelezioni.includes(value)
                    ? prevSelezioni.filter((item) => item !== value) // deselezione
                    : [...prevSelezioni, value]; // selezione

                return { ...prevFormData, selezioni: updatedSelezioni };
            })
        }
        else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
        setFormErros({
            ...formErrors,
            [name]: "",
            Selezioni: ""
        })
    }
    
    const checkInput = () => {
        if((formData.count <= 0) && (formData.cfu <= 0)){
            setFormErros({
                ...formErrors,
                input: "Inserire un numero positivo"
            })
            return false;
        }
        return true;
    }
    const checkDescrizione = () => {
        if(!formData.descrizione){
            setFormErros({
                ...formErrors,
                descrizione: "Campo obbligatorio"
            })
            return false;
        }
        if(formData.descrizione.length > 400){
            setFormErros({
                ...formErrors,
                descrizione: "Inserire una descrizione più corta"
            })
            return false;
        }
        return true;
    }
    const checkTipologia = () => {
        if(!formData.tipologia){
            setFormErros({
                ...formErrors,
                tipologia: "Campo obbligatorio"
            })
            return false;
        }
        return true;
    }
    const checkSelezioni = () => {
        if(formData.selezioni.length == 0){
            setFormErros({
                ...formErrors,
                selezioni: "Campo obbligatorio"
            })
            return false;
        }
        return true;
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(checkInput() && checkDescrizione() && checkTipologia() && checkSelezioni()){
            // generato idRegola da uuid
            const data = {...formData, id: uuidv4()};
            const response = await fetch(`/api/addRegola`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            // inserimento avvenuto con successo
            if (response.ok) {
                navigate('/regolamento');
            }
            // inserimento fallito
            if (!response.ok) {
                const errorData = await response.json();
                setFormErros({...formErrors, result: errorData.message})
            }
        }
    }

    let component;
    if(props.regolaCFU){
        component = 
            <>
                {/* Numero dei CFU */}
                <div className="mb-4">
                    <label htmlFor="cfu" className="block text-sm font-medium text-gray-700">Numero minimo di CFU *</label>
                    <input
                        type="number"
                        id="cfu"
                        name="cfu"
                        value={formData.cfu}
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {formErrors.input && <p className="text-red-500">{formErrors.input}</p>}
                </div>
            </>
    }
    else{
        component =
            <>
                {/* Numero dei CFU */}
                <div className="mb-4">
                    <label htmlFor="cfu" className="block text-sm font-medium text-gray-700">Numero minimo di CFU *</label>
                    <input
                        type="number"
                        id="cfu"
                        name="cfu"
                        value={formData.cfu}
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {formErrors.input && <p className="text-red-500">{formErrors.input}</p>}
                </div>
                {/* Numero del count */}
                <div className="mb-4">
                    <label htmlFor="count" className="block text-sm font-medium text-gray-700">Numero minimo *</label>
                    <input
                        type="number"
                        id="count"
                        name="count"
                        value={formData.count}
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {formErrors.input && <p className="text-red-500">{formErrors.input}</p>}
                </div>
            </>
    }
    return (
        <>
            <div className="w-full max-w-md bg-gray-100 p-8 rounded-lg">
                <form onSubmit={handleSubmit}>
                    {component}
                    
                    {/* Descrizione */}
                    <div className="mb-4">
                        <label htmlFor="descrizione" className="block text-sm font-medium text-gray-700">Descrizione *</label>
                        <textarea
                            type="text"
                            id="descrizione"
                            name="descrizione"
                            value={formData.descrizione}
                            onChange={handleChange}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {formErrors.descrizione && <p className="text-red-500">{formErrors.descrizione}</p>}
                    </div>
                    {/* Selezione il tipo della regola */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Tipologia della regola: *</label>
                        {tipologie.map(tipo => (
                            <div key={tipo} className="flex items-center space-x-2 mb-2">
                                <input 
                                    type="radio"
                                    id={tipo}
                                    name="tipologis"
                                    value={tipo}
                                    checked={formData.tipologia === tipo}
                                    onChange={handleChange}
                                    className="h-4 w-4"
                                />
                                <label htmlFor={tipo} className="block text-sm font-medium text-gray-700">Regola per {tipo}</label>
                            </div>
                        ))}
                        {formErrors.tipologia && <p className="text-red-500">{formErrors.tipologia}</p>}
                    </div>
                    {/* Selezione l'elenco delle aree/sottoaree/settori */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Scegli: *</label>
                        <div className="flex flex-wrap space-x-4">
                            {sel.map((item) => (
                                <div key={item.id} className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="selezioni"
                                    id={item.id} 
                                    value={item.id}
                                    checked={formData.selezioni.includes(item.id)}
                                    onChange={handleChange}
                                    className="mr-2"
                                />
                                <label htmlFor={item.id}>{item.nome}</label>
                                </div>
                            ))}
                        </div>
                        {formErrors.selezioni && <p className="text-red-500">{formErrors.selezioni}</p>}
                    </div>
                    <button 
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700" >
                        Aggiungi Regola
                    </button>
                    <Link
                        className="text-blue-500 hover:text-blue-700"
                        to={'/regolamento'}
                    >
                        Annulla
                    </Link>
                    {formErrors.result && <p className="text-red-500">{formErrors.result}</p>}
                </form>
            </div>
        </>
    )
}
export default FormNewRegola;