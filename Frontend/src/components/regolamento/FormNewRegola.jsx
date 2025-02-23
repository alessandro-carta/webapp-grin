import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function FormNewRegola(props) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
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
            }
            
        } catch (error) { console.log(error); }
    };
    const [sottoaree, setSottoaree] = useState([]);
    // funzione per caricare le sottoaree
    const loadAllSottoaree = async () => {
        try {
            const response = await fetch(`/api/sottoaree`, {
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
                setSottoaree(data.data);
            }
            
        } catch (error) { console.log(error); }
    };
    const [settori, setSettori] = useState([]);
    // funzione per caricare i settori
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
        try {
            if(checkInput() && checkDescrizione() && checkTipologia() && checkSelezioni()){
                setLoading(true);
                const response = await fetch(`/api/addRegola`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify(formData)
                });
                // accesso non consentito
                if(response.status == 403) navigate('/');
                if (response.ok) { navigate(`/regolamento/?Visual=admin`); }
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

    let component;
    if(props.regolaCFU){
        component = 
            <>
                {/* Numero dei CFU */}
                <div className="mb-4">
                    <label htmlFor="cfu" className="form__label">Numero minimo di CFU *</label>
                    <input
                        type="number"
                        id="cfu"
                        name="cfu"
                        value={formData.cfu}
                        onChange={handleChange}
                        className="form__input"
                    />
                    {formErrors.input && <p className="error__message">{formErrors.input}</p>}
                </div>
            </>
    }
    else{
        component =
            <>
                {/* Numero dei CFU */}
                <div className="mb-4">
                    <label htmlFor="cfu" className="form__label">Numero minimo di CFU *</label>
                    <input
                        type="number"
                        id="cfu"
                        name="cfu"
                        value={formData.cfu}
                        onChange={handleChange}
                        className="form__input"
                    />
                    {formErrors.input && <p className="text-red-500">{formErrors.input}</p>}
                </div>
                {/* Numero del count */}
                <div className="mb-4">
                    <label htmlFor="count" className="form__label">Numero minimo *</label>
                    <input
                        type="number"
                        id="count"
                        name="count"
                        value={formData.count}
                        onChange={handleChange}
                        className="form__input"
                    />
                    {formErrors.input && <p className="error__message">{formErrors.input}</p>}
                </div>
            </>
    }
    if(loading) return <p>LOADING...</p>
    return (
        <>
            <div className="form__container">
                <form onSubmit={handleSubmit}>
                    {component}
                    {/* Descrizione */}
                    <div className="mb-4">
                        <label htmlFor="descrizione" className="form__label">Descrizione *</label>
                        <textarea
                            type="text"
                            id="descrizione"
                            name="descrizione"
                            value={formData.descrizione}
                            onChange={handleChange}
                            className="form__input"
                        />
                        {formErrors.descrizione && <p className="error__message">{formErrors.descrizione}</p>}
                    </div>
                    {/* Selezione il tipo della regola */}
                    <div className="mb-4">
                        <label className="form__label">Tipologia della regola: *</label>
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
                                <label htmlFor={tipo} className="block text-sm font-medium">Regola per {tipo}</label>
                            </div>
                        ))}
                        {formErrors.tipologia && <p className="error__message">{formErrors.tipologia}</p>}
                    </div>
                    {/* Selezione l'elenco delle aree/sottoaree/settori */}
                    <div className="mb-4">
                        <label className="form__label">Scegli: *</label>
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
                                <label htmlFor={item.id} className="block text-sm font-medium">{item.nome}</label>
                                </div>
                            ))}
                        </div>
                        {formErrors.selezioni && <p className="error__message">{formErrors.selezioni}</p>}
                    </div>
                    <button 
                        type="submit"
                        className="w-full button__principale" >
                        CREA
                    </button>
                    <Link
                        className="link"
                        to={`/regolamento/?Visual=admin`}
                    >
                        Annulla
                    </Link>
                    {formErrors.result && <p className="error__message">{formErrors.result}</p>}
                </form>
            </div>
        </>
    )
}
export default FormNewRegola;