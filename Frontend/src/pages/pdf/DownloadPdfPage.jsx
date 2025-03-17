import { Link, useLocation, useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import { PDFViewer } from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import DocumentPdf from "/Frontend/src/components/pdf/DocumentPdf";
import NavbarPresidente from "../../components/NavbarPresidente"

function DownloadPdfPage(){
    const {idRegolamento} = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const visual = queryParams.get('Visual');
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
            let linkFetch;
            if (visual === 'admin') linkFetch = `/api/regolamentoAdmin/${idRegolamento}`;
            else linkFetch = `/api/regolamento/${idRegolamento}`;
            const response = await fetch(linkFetch, {
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
            let linkFetch;
            if (visual === 'admin') linkFetch = `/api/insegnamenti/${idRegolamento}`;
            else linkFetch = `/api/insegnamentiPresidente/${idRegolamento}`;
            const response = await fetch(linkFetch, {
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
            <>   
            <NavbarPresidente />
            <div className='flex flex-col'>
                <div className='flex flex-col justify-center items-center m-4'>
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
                </div>
                <Link className="link" to={visual === "admin" ? `/r/${idRegolamento}` : `/dashboard/r/${idRegolamento}` }>Chiudi</Link>
            </div>
            </>
        )}



}
export default DownloadPdfPage;