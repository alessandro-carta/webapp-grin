import { Link, useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import { PDFViewer } from "@react-pdf/renderer";
import DocumentPdf from "../../components/pdf/DocumentPdf";
import { useEffect, useState } from "react";

function DownloadPdfPage(){
    const {idRegolamento} = useParams();
    // regolamento con anche informazione del corso e della richiesta
    const [loadingReg, setLoadingReg] = useState(true);
    const [regolamento, setRegolamento] = useState();
    const [presidente, setPresidente] = useState();
    const loadPresidente = async (id) => {
        try {
            const response = await fetch(`/api/presidente/${id}`, {
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
                return data;
            }
            
        } catch (error) { console.log(error); }
    }
    const loadRegolamento = async () => {
        try {
            const response = await fetch(`/api/regolamento/${idRegolamento}`, {
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
                // carico la richiesta
                let data = await response.json();
                setRegolamento(data.data);
                // carico le informazione del presidente
                data = await loadPresidente(data.data.presidente);
                setPresidente(data.data); 
                setLoadingReg(false);
            }
            
        } catch (error) { console.log(error); }
    }
    useEffect(() => loadRegolamento, []); // Non ha dipendenze, eseguito ad ogni render
    // carico tutti gli insegnamenti di questo regolamento
    const [loadingIns, setLoadingIns] = useState(true);
    const [insegnamenti, setInsegnamenti] = useState();
    const loadInsegnamenti = async () => {
        try {
            const response = await fetch(`/api/insegnamentiPresidente/${idRegolamento}`, {
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
                // carico la richiesta
                let data = await response.json();
                setInsegnamenti(data.data);
                setLoadingIns(false);
            }
            
        } catch (error) { console.log(error); }
    }
    useEffect(() => loadInsegnamenti, []); // Non ha dipendenze, eseguito ad ogni render
    // carico tutte le aree
    const [loadingAree, setLoadingAree] = useState(true);
    const [aree, setAree] = useState();
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
                // carico la richiesta
                let data = await response.json();
                setAree(data.data);
                setLoadingAree(false);
            }
            
        } catch (error) { console.log(error); }
    }
    useEffect(() => loadAllAree, []); // Non ha dipendenze, eseguito ad ogni render
    // carico tutte le sottoaree
    const [loadingSottoaree, setLoadingSottoaree] = useState(true);
    const [sottoaree, setSottoaree] = useState();
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
                // carico la richiesta
                let data = await response.json();
                setSottoaree(data.data);
                setLoadingSottoaree(false);
            }
            
        } catch (error) { console.log(error); }
    }
    useEffect(() => loadAllSottoaree, []); // Non ha dipendenze, eseguito ad ogni render


    if(loadingReg || loadingIns || loadingAree || loadingSottoaree) return <Loading />
    else {
        const anni = [];
        for(let i = 0; i < regolamento.duratacorso; i++) anni.push(i+1);
        return (        
            <div className='flex flex-col'>
                <PDFViewer showToolbar={true} className='w-full h-screen'>
                    <DocumentPdf 
                        regolamento={regolamento} 
                        presidente={presidente}
                        anni={anni}
                        insegnamenti={insegnamenti}
                        aree={aree}
                        sottoaree={sottoaree}
                    />
                </PDFViewer>
                <Link className="link" to={`/dashboard/r/${idRegolamento}`}>Annulla</Link>
            </div>
        )}



}
export default DownloadPdfPage;