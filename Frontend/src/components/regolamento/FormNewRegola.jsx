import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';


function FormNewRegola() {
    const navigate = useNavigate();
    const tipologie = ['area', 'sottoarea', 'settore'];
    // dati del form
    const [formData, setFormData] = useState({
        CFU: 0,
        Descrizione: "",
        Tipologia: "",
        Selezioni: []
    });
    // dati del form
    const [formErrors, setFormErros] = useState({
        CFU: "",
        Descrizione: "",
        Tipologia: "",
        Selezioni: "",
        Result: ""
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
                setAree(data.data.map((item) => ({
                    id: item.idArea,
                    Nome: item.Nome
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
                setSottoaree(data.data.map((item) => ({
                    id: item.idSottoarea,
                    Nome: item.Nome
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
                setSettori(data.data.map((item) => ({
                    id: item.idSettore,
                    Nome: item.idSettore
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
            setFormData({...formData, Selezioni: [], Tipologia: value});
            setSel([]);
            if(value === 'area') setSel(aree);
            if(value === 'sottoarea') setSel(sottoaree);
            if(value === 'settore') setSel(settori);
        }
        else if(type === 'checkbox'){
            setFormData((prevFormData) => {
                const prevSelezioni = prevFormData.Selezioni || [];
                const updatedSelezioni = prevSelezioni.includes(value)
                    ? prevSelezioni.filter((item) => item !== value) // deselezione
                    : [...prevSelezioni, value]; // selezione

                return { ...prevFormData, Selezioni: updatedSelezioni };
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
    
    const checkCFU = () => {
        if(formData.CFU <= 0){
            setFormErros({
                ...formErrors,
                CFU: "Inserire un numero positivo"
            })
            return false;
        }
        return true;
    }
    const checkDescrizione = () => {
        if(!formData.Descrizione){
            setFormErros({
                ...formErrors,
                Descrizione: "Campo obbligatorio"
            })
            return false;
        }
        if(formData.Descrizione.length > 400){
            setFormErros({
                ...formErrors,
                Descrizione: "Inserire una descrizione più corta"
            })
            return false;
        }
        return true;
    }
    const checkTipologia = () => {
        if(!formData.Tipologia){
            setFormErros({
                ...formErrors,
                Tipologia: "Campo obbligatorio"
            })
            return false;
        }
        return true;
    }
    const checkSelezioni = () => {
        if(formData.Selezioni.length == 0){
            setFormErros({
                ...formErrors,
                Selezioni: "Campo obbligatorio"
            })
            return false;
        }
        return true;
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(checkCFU() && checkDescrizione() && checkTipologia() && checkSelezioni()){
            // generato idRegola da uuid
            const data = {...formData, idRegola: uuidv4()};
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
                setFormErros({...formErrors, Result: errorData.message})
            }
        }
    }
    return (
        <>
            <div className="w-full max-w-md bg-gray-100 p-8 rounded-lg">
                <form onSubmit={handleSubmit}>
                    {/* Numero dei CFU */}
                    <div className="mb-4">
                        <label htmlFor="CFU" className="block text-sm font-medium text-gray-700">Numero dei CFU *</label>
                        <input
                            type="number"
                            id="CFU"
                            name="CFU"
                            value={formData.CFU}
                            onChange={handleChange}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {formErrors.CFU && <p className="text-red-500">{formErrors.CFU}</p>}
                    </div>
                    {/* Descrizione */}
                    <div className="mb-4">
                        <label htmlFor="Descrizione" className="block text-sm font-medium text-gray-700">Descrizione *</label>
                        <textarea
                            type="text"
                            id="Descrizione"
                            name="Descrizione"
                            value={formData.Descrizione}
                            onChange={handleChange}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {formErrors.Descrizione && <p className="text-red-500">{formErrors.Descrizione}</p>}
                    </div>
                    {/* Selezione il tipo della regola */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Tipologia della regola: *</label>
                        {tipologie.map(tipo => (
                            <div key={tipo} className="flex items-center space-x-2 mb-2">
                                <input 
                                    type="radio"
                                    id={tipo}
                                    name="Tipologia"
                                    value={tipo}
                                    checked={formData.Tipologia === tipo}
                                    onChange={handleChange}
                                    className="h-4 w-4"
                                />
                                <label htmlFor={tipo} className="block text-sm font-medium text-gray-700">Regola per {tipo}</label>
                            </div>
                        ))}
                        {formErrors.Tipologia && <p className="text-red-500">{formErrors.Tipologia}</p>}
                    </div>
                    {/* Selezione l'elenco delle aree/sottoaree/settori */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Scegli: *</label>
                        <div className="flex flex-wrap space-x-4">
                            {sel.map((item) => (
                                <div key={item.id} className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="Selezioni"
                                    id={item.id} 
                                    value={item.id}
                                    checked={formData.Selezioni.includes(item.id)}
                                    onChange={handleChange}
                                    className="mr-2"
                                />
                                <label htmlFor={item.id}>{item.Nome}</label>
                                </div>
                            ))}
                        </div>
                        {formErrors.Selezioni && <p className="text-red-500">{formErrors.Selezioni}</p>}
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
                    {formErrors.Result && <p className="text-red-500">{formErrors.Result}</p>}
                </form>
            </div>
        </>
    )
}
export default FormNewRegola;