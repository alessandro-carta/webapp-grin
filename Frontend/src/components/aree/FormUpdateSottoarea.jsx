import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function FormUpdateSottoarea(props) {

    const navigate = useNavigate();

    // dati del form
    const [formData, setFormData] = useState({
        idSottoarea: props.sottoarea.idSottoarea,
        Nome: props.sottoarea.Nome,
        Area: props.sottoarea.Area
    })
    // messaggi di errore
    const [formErrors, setFormErros] = useState({
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(checkNome()){
            const response = await fetch(`/api/updateSottoarea`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            // modifica riuscita
            if (response.ok) {
                navigate(`/sottoaree/${props.sottoarea.Area}`);
            }
            // modifica fallita
            if (!response.ok) {
                const errorData = await response.json();
                setFormErros({...formErrors, Result: "Modifica non riuscita, si prega di riprovare"});
                console.error(errorData.message);
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

    return(
        <>
            <div className="w-full max-w-md bg-gray-100 p-8 rounded-lg">
                <form onSubmit={handleSubmit}>
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
                    {/* Bottone di invio e annulla */}
                    <div className="mb-4">
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700"
                        >
                            MODIFICA
                        </button>

                        <Link
                            className="text-blue-500 hover:text-blue-700"
                            to={`/sottoaree/${props.sottoarea.Area}`}
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

export default FormUpdateSottoarea;