import NavbarGrin from '../../components/NavbarGrin.jsx';
import { useParams, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import Anno from '../../components/richieste/Anno.jsx';
import Loading from '../../components/Loading.jsx';

function RegolamentoPage() {
    const { idRegolamento } = useParams();
    const navigate = useNavigate();
    // loading dei componenti dinamici
    const [loading, setLoading] = useState(true);
    const [loadingCountUnit, setLoadingCountUnit] = useState(true);
    const [loadingBollino, setLoadingBollino] = useState(true);
    const [totUnit, setTotUnit] = useState(0);
    const [unitLocalCFU, setUnitLocalCFU] = useState(true);
    const countTotUnit = async () => {
        try {
            const response = await fetch(`/api/insegnamenti/${idRegolamento}`, {
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
                let count = 0;
                data.data.map((insegnamento) =>{
                    if(insegnamento.oretot == null){
                        setUnitLocalCFU(true);
                        count += insegnamento.cfutot;
                    }
                    else {
                        setUnitLocalCFU(false);
                        count += insegnamento.oretot;
                    }
                });
                setTotUnit(count);
                setLoadingCountUnit(false);
            }
            
        } catch (error) { console.log(error); }
    }
    useEffect( () => countTotUnit, [idRegolamento]);

    const [bollino, setBollino] = useState();
    const loadBollino = async (richiesta) => {
        try {
            const response = await fetch(`/api/bollinoRichiesta/${richiesta}`, {
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
                setLoadingBollino(false);
                return data.data;
            }
            setLoadingBollino(false);
            return null;
        } catch (error) { console.log(error); }
    }

    const [regolamento, setRegolamento] = useState();
    const loadRegolamento = async () => {
        try {
            const response = await fetch(`/api/regolamentoAdmin/${idRegolamento}`, {
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
                if(data.data.richiesta != null && data.data.stato == "Approvata"){
                    const statoBollino = await loadBollino(data.data.richiesta);
                    setBollino(statoBollino);
                }
                setLoadingBollino(false);
                setRegolamento(data.data);
                setLoading(false);
            }
            
        } catch (error) { console.log(error); }
    }
    useEffect( () => loadRegolamento, [idRegolamento]); // eseguito ogni volta che cambia idRichiesta
    
    const [pageTitle, setPageTitle] = useState('Regolamento');
    useEffect(() => { document.title = pageTitle}, [pageTitle]); // eseguito ogni volta che cambia pageTitle
    // funzione per controllare i requisiti di una richiesta
    const checkRichiesta = () => { navigate(`/controllo-regole/${idRegolamento}`)}

    const anni = []; // contiene il numero di anni di durata di un CDS
    if(loading || loadingCountUnit || loadingBollino) return <Loading />
    else{
        for(let i = 0; i < regolamento.duratacorso; i++) anni.push(i+1);
        return (
            <>
                <NavbarGrin />
                {regolamento.stato == "Elaborazione" &&
                <div className="flex space-x-4 p-4 items-center justify-center">
                    <p className="text-xl">Azioni: </p>
                     <button className="button__principale" onClick={checkRichiesta}> Controlla regole </button>
                </div>}
                {regolamento.stato == "Approvata" && <p className="text-2xl success__message p-4">Approvato</p>}
                {regolamento.stato == "Invalidata" && <p className="text-2xl error__message p-4">Invalidato</p>}
                {regolamento.stato == "Elaborazione" && <p className="text-2xl title p-4">In Elaborazione</p>}
                {bollino != null && bollino.erogato == 1 && 
                    <div className="button__img"> 
                        <div className='button__img__content'>
                            <p className='text-base'>Bollino | </p>
                            <img src="../../../public/logo-grin.png" alt="Logo GRIN" />
                        </div>
                    </div>}
                <p className="text-xl title">{regolamento.corsodistudio} - Regolamento AA: {regolamento.annoaccademico}</p>
                <p className="text-xl">{regolamento.università} - {regolamento.email}</p>
                <p className="text-xl">Durata corso: {regolamento.duratacorso} - Totale: {totUnit} {unitLocalCFU ? " CFU" : " Ore"}</p>
                { anni.map(a => ( <Anno key={a} richiesta={regolamento.richiesta} regolamento={regolamento.id} anno={a} admin={true} edit={false}/> )) }
            </>
        )
    }
    
}
export default RegolamentoPage;