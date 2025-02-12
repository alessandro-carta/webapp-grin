import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function FormUpdateInsegnamento(props){
    const navigate = useNavigate();
    const [settori, setSettori] = useState([]); // elenco dei settori
    const [aree, setAree] = useState([]); // elenco delle aree
    const [sottoaree, setSottoaree] = useState([]); // elenco delle sottoaree
    const [showSottoaree, setShowSottoaree] = useState(false); // visualizzazione dimanica delle sottoaree
    const [loading, setLoading] = useState(true);
    const [duratacorso, setDurataCorso] = useState();
    const loadRichiesta = async () => {
        try {
            const response = await fetch(`/api/richiestaPresidente/${props.richiesta}`, {
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
                setDurataCorso(data.data.duratacorso);
                setLoading(false);
            }
            
        } catch (error) { console.log(error); }
    }
    useEffect( () => loadRichiesta, []); // eseguito ogni volta che cambia idRichiesta
    // dati del form
    const [formData, setFormData] = useState({
        nome: props.insegnamento.nome,
        CFUTot: props.insegnamento.cfutot,
        settore: props.insegnamento.settore,
        annoerogazione: props.insegnamento.annoerogazione,
        richiesta: props.richiesta,
        sottoaree: props.insegnamento.sottoaree,
        area: "",
        sottoarea: "",
        cfu: 0
    })
    // messaggi di errore, result contiene la risposta della chiamata HTTP
    const [formErrors, setFormErros] = useState({
        nome: "",
        CFUTot: "",
        settore: "",
        sottoaree: "",
        annoerogazione: ""
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
            }
            
        } catch (error) { console.log(error); }
    }
    useEffect(() => loadAllAree, []); // Non ha dipendenze, eseguito ad ogni render
    // recupero le sottoaree
    const loadAllSottoaree = async (idArea) => {
        try {
            const response = await fetch(`/api/sottoaree/${idArea}`, {
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
    const checkAnnoErogazione = () => {
        if(!formData.annoerogazione){
            setFormErros({
                ...formErrors,
                annoerogazione: "Campo obbligatorio"
            })
            return false;
        }
        return true;
    }
    const checkSottoarea = (id) => {
        if(id === "" || formData.cfu <= 0){
            setFormErros({
                ...formErrors,
                sottoaree: "Inserire i campi obbligatori"
            })
            return false;
        }
        const sottoaree = formData.sottoaree.filter((s) => (s.id === id));
        if(sottoaree.length != 0){
            setFormErros({
                ...formErrors,
                sottoaree: "Sottoarea già presente"
            })
            return false;
        }
        return true;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        if(name === "area" || name === "sottoarea" || name === "CFU"){
            setFormErros({
                ...formErrors,
                [name]: "aa",
                result: "",
                sottoaree: ""
            });
        }
        else{
            setFormErros({
                ...formErrors,
                [name]: "",
                result: ""
            });
        }
        if(name === "area") {
            if(value) setShowSottoaree(true);
            if(!value) setShowSottoaree(false);
            setFormData({
                ...formData,
                [name]: value,
                sottoarea: "",
                cfu: 0
            });
            loadAllSottoaree(value);
        }
        else{
            setFormData({
                ...formData,
                [name]: value
            });
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if(checkNome() && checkCFUTot() && checkSettore() && checkAnnoErogazione){
                const response = await fetch(`/api/updateInsegnamento/`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                                        id: props.insegnamento.id,
                                        nome: formData.nome, 
                                        CFUTot: formData.CFUTot,
                                        settore: formData.settore,
                                        annoerogazione: formData.annoerogazione,
                                        richiesta: formData.richiesta,
                                        sottoaree: formData.sottoaree })
                });
                // accesso non consentito
                if(response.status == 403) navigate('/');
                if (response.ok) { navigate(`/dashboard/richiesta/${props.richiesta}`); }
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
    // funzione per aggiugere una sottoarea all'insegnamento
    const addNewInsSottoarea = () => {
        const id = formData.sottoarea.split('-')[0];
        const sottoarea = formData.sottoarea.split('-')[1];
        if(checkSottoarea(id)){
            setFormData({
                ...formData,
                sottoaree: [...formData.sottoaree, {id: id, nome: sottoarea, cfu: formData.cfu}]
            });
            setFormErros({
                ...formErrors,
                sottoaree: ""
            });
        }
    }
    // funzione per eliminare una sottoarea all'insegnamento
    const deleteInsSottoarea = (id) => {
        const sottoaree = formData.sottoaree.filter((s) => (s.id != id));
        setFormData({
            ...formData,
            sottoaree: sottoaree
        });
    }

    const anni = []; // contiene il numero di anni di durata di un CDS
    if(loading) return null;
    else {
        for(let i = 0; i < duratacorso; i++) anni.push(i+1);
        return(
            <>
                <div className="form__container">
                    <form onSubmit={handleSubmit}>
                        {/* Nome insegnamento */}
                        <div className="mb-4">
                            <label htmlFor="nomeInsegnamento" className="form__label">Nome insegnamento*</label>
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
                        {/* CFU Totali */}
                        <div className="mb-4">
                            <label htmlFor="CFUTot" className="form__label">CFU Totali*</label>
                            <input
                                type="number"
                                id="CFUTot"
                                name="CFUTot"
                                value={formData.CFUTot}
                                onChange={handleChange}
                                className="form__input"
                            />
                            {formErrors.CFUTot && <p className="error__message">{formErrors.CFUTot}</p>}
                        </div>
                        {/* Settore */}
                        <div className="mb-4">
                            <label htmlFor="settore" className="form__label">Settore*</label>
                            <select
                                id="settore"
                                name="settore"
                                value={formData.settore}
                                onChange={handleChange}
                                className="form__select"
                            >
                                <option value="">Seleziona un settore</option>
                                {settori.map(s => (
                                    <option key={s.id} value={s.id}>{s.id}</option> ))}
                            </select>
                            {formErrors.settore && <p className="error__message">{formErrors.settore}</p>}
                        </div>
                        {/* Anno Erogazione */}
                        <div className="mb-4">
                            <label htmlFor="annoerogazione" className="form__label">Anno di erogazione*</label>
                            <select
                                id="annoerogazione"
                                name="annoerogazione"
                                value={formData.annoerogazione}
                                onChange={handleChange}
                                className="form__select"
                            >
                                <option value="">Seleziona un anno di erogazione</option>
                                {anni.map(a => (
                                    <option key={a} value={a}>{a}</option> ))}
                            </select>
                            {formErrors.annoerogazione && <p className="error__message">{formErrors.annoerogazione}</p>}
                        </div>
                        {/* Aggiungi una sottoarea all'insegnamento */}
                        <div className="mb-4">
                            <div className="flex flex-col items-center">
                                <label htmlFor="insegnamentosottoarea" className="form__label">Aggiungi sottoarea: </label>
                                <select
                                    id="area"
                                    name="area"
                                    value={formData.area}
                                    onChange={handleChange}
                                    className="form__select mb-2" 
                                >
                                    <option value="">Seleziona area</option>
                                    {aree.map(a => ( <option key={a.id} value={a.id}>{a.nome}</option> ))}
                                </select>
                                {showSottoaree && <>
                                    <select
                                        id="sottoarea"
                                        name="sottoarea"
                                        value={formData.sottoarea}
                                        onChange={handleChange}
                                        className="form__select mb-2"
                                    >
                                        <option value="">Seleziona sottoarea*</option>
                                        {sottoaree.map(s => ( <option key={s.id} value={s.id+"-"+s.nome}>{s.nome}</option> ))}
                                    </select>
                                    <input
                                        type="number"
                                        id="cfu"
                                        name="cfu"
                                        value={formData.cfu}
                                        onChange={handleChange}
                                        className="form__select mb-4"
                                        placeholder="CFU*"
                                    />
                                    <button type="button" className="button__principale" onClick={addNewInsSottoarea}>
                                        Aggiungi
                                    </button>
                                </>}
                            </div>
                            {formErrors.sottoaree && <p className="error__message">{formErrors.sottoaree}</p>}
                        </div>
                        
                        {/* Elenco delle sottoarea */}
                        <div className="mb-4">
                            {formData.sottoaree.length != 0 && <label htmlFor="settore" className="form__label">Sottoaree: </label>}
                            {formData.sottoaree.map((elemento, index) => ( 
                                <div className="flex flex-col md:flex-row justify-center items-center p-2">
                                    <p className="text-base p-2" key={index}>{elemento.nome} (CFU: {elemento.cfu})</p> 
                                    <button type="button" className="button__action" onClick={() => deleteInsSottoarea(elemento.id)}>
                                        Elimina
                                    </button>
                                </div>
                            ))}
                        </div>
                        <p className="text-base p-2">* Campi obbligatori</p>
                        {/* Bottone di invio e annulla */}
                        <div className="mb-4">
                            <button type="submit" className="w-full button__principale">
                                Modifica 
                            </button>
                            <Link className="link" to={`/dashboard/richiesta/${props.richiesta}`}>
                                Annulla
                            </Link>
                            {formErrors.result && <p className="error__message">{formErrors.result}</p>}
                        </div>
                    </form>
                </div>
            </>
        )
    }
}

export default FormUpdateInsegnamento;