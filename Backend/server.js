import express from "express"
import cors from "cors"
import { getPresidenti, addPresidente, getPresidente, updatePresidente} from "./Presidenti.js";
import { getAree, addArea, deleteArea, getArea, updateArea, addSottoarea, getSottoaree, getSottoarea, deleteSottoarea, updateSottoarea, getSottoareeAll, getSettori } from "./Aree.js";
import { addRegola, deleteRegola, getRegole } from "./Regolamento.js";
import { getRichieste, getRichiesta, getInsegnamenti, getInsegnamentoSottoaree, getInsegnamentiFull } from "./Richieste.js";
import { checkRegole } from "./CheckRichiesta.js";

const app = express();
app.use(cors());
app.use(express.json());
app.listen(8081, () => {
    console.log("> Server in ascolto sulla porta 8081");
})




// PRESIDENTI
// Operazioni:
// 1. Elenco di tutti i presidenti
// 2. Informazioni di un determinato presidente
app.get("/api/presidenti", async (req, res) => {
    try {
        // risposta con successo
        const presidenti = await getPresidenti();
        return res.status(200).json({
            success: true,
            data: presidenti
        });
    } catch (error) {
        // errore generale interno al server
        return res.status(500).json({
            success: false,
            message: "Si è verificato un errore durante il recupero degli account .",
            error: error.message || error
        });
    }
})
app.get("/api/presidenti/:idPresidente", async (req, res) => {
    const idPresidente = req.params.idPresidente;
    try {
        // risposta avvenuta con successo
        const presidente = await getPresidente(idPresidente);
        return res.status(200).json({
            success: true,
            data: presidente
        });
    } catch (error) {
        // errore generale interno al server
        return res.status(500).json({
            success: false,
            message: "Si è verificato un errore durante il recupero dell\'account .",
            error: error.message || error
        });
    }
})
// Operazioni:
// 1. Aggiungi un nuovo account presidente
// 2. Modifica un account già esistente
app.post("/api/addPresidente", async (req, res) => {
    const {idPresidente, Nome, Cognome, Email, Università } = req.body;
    try {
        // risposta avvenuta con successo
        const result = await addPresidente(idPresidente, Nome, Cognome, Email, Università);
        return res.status(201).json({
            success: true,
            data: result
        });
    } catch (error) {
        if(error.code == 'ER_DUP_ENTRY') {
            return res.status(400).json({
                success: false,
                message: 'Email già esistente, riprovare con un\'altra'
            });
        }
        // errore generale interno al server
        return res.status(500).json({
            success: false,
            message: "Si è verificato un errore durante l'elaborazione della richiesta",
            error: error.message || error
        });
    }
})
app.put("/api/updatePresidente", async (req, res) => {
    const {idPresidente, Nome, Cognome, Email, Università, Attivo } = req.body;
    try {
        // risposta avvenuta con successo
        const result = await updatePresidente(idPresidente, Nome, Cognome, Email, Università, Attivo);
        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        if(error.code == 'ER_DUP_ENTRY') {
            return res.status(400).json({
                success: false,
                message: 'Email già esistente, riprovare con un\'altra'
            });
        }
        // errore generale interno al server
        return res.status(500).json({
            success: false,
            message: "Si è verificato un errore durante l'elaborazione della richiesta",
            error: error.message || error
        });
    }
})






// AREE e SOTTOAREE
// Operazioni:
// 1. Elenco di tutte le aree
// 2. Informazioni di una determinata area
app.get("/api/aree", async (req, res) => {
    try {
        // risposta del server ha avuto successo
        const aree = await getAree();
        return res.status(200).json({
            success: true,
            data: aree
        });
    } catch (error) {
        // errore generale interno al server
        return res.status(500).json({
            success: false,
            message: "Si è verificato un errore durante il recupero delle aree.",
            error: error.message || error
        });
    }
})
app.get("/api/area/:idArea", async (req, res) => {
    const idArea = req.params.idArea;
    try {
        // risposta del server ha avuto successo
        const area = await getArea(idArea);
        return res.status(200).json({
            success: true,
            data: area
        });
    } catch (error) {
        // errore generale interno al server
        return res.status(500).json({
            success: false,
            message: "Si è verificato un errore durante il recupero dell\'area.",
            error: error.message || error
        });
    }
})
// Operazioni:
// 1. Aggiungi area
// 2. Elimina area
// 3. Modifica area
app.post("/api/addArea", async (req, res) => {
    const {idArea, Nome} = req.body;

    try {
        const result = await addArea(idArea, Nome);
        // inserimento avvenuto con successo
        return res.status(201).json({
            success: true,
            data: result
        });
    } catch (error) {
        // errore idArea già presente
        if(error.code == 'ER_DUP_ENTRY') {
            return res.status(400).json({
                success: false,
                message: 'Sigla già esistente, riprovare con un\'altra'
            });
        }
        // errore generale interno al server
        return res.status(500).json({
            success: false,
            message: "Si è verificato un errore durante l'elaborazione della richiesta",
            error: error.message || error
        });
    }
})
app.delete("/api/deleteArea/:idArea", async (req, res) => {
    const { idArea } = req.params;

    try {
        const result = await deleteArea(idArea);
        // eliminazione avvenuta con successo
        return res.status(200).json({
            success: true
        });
    } catch (error) {
        // errore sottoaree presenti
        if(error.code == 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({
                success: false,
                message: 'Impossibile eliminare, sottoaree presenti'
            });
        }
        // errore generale interno al server
        return res.status(500).json({
            success: false,
            message: "Si è verificato un errore durante l'elaborazione della richiesta",
            error: error.message || error
        });
    }
})
app.put("/api/updateArea", async (req, res) => {
    const {idArea, Nome } = req.body;

    try {
        const result = await updateArea(idArea, Nome);
        // modifica avvenuta con successo
        return res.status(200).json({
            success: true
        });
    } catch (error) {
        // errore generale interno al server
        return res.status(500).json({
            success: false,
            message: "Si è verificato un errore durante l'elaborazione della richiesta",
            error: error.message || error
        });
    }
})
// Operazioni:
// 1. Elenco di tutte le sottoarea di un'area
// 2. Informazioni di una determinata sottoarea
// 3. Elenco di tutte le sottoaree
app.get("/api/sottoaree/:idArea", async (req, res) => {
    const idArea = req.params.idArea;
    try {
         // risposta del server ha avuto successo
        const sottoaree = await getSottoaree(idArea);
        return res.status(200).json({
            success: true,
            data: sottoaree
        });
    } catch (error) {
        // errore generale interno al server
        return res.status(500).json({
            success: false,
            message: "Si è verificato un errore durante il recupero delle aree.",
            error: error.message || error
        });
    }
})
app.get("/api/sottoarea/:idSottoarea", async (req, res) => {
    const idSottoarea = req.params.idSottoarea;
    try {
        // risposta del server ha avuto successo
        const sottoarea = await getSottoarea(idSottoarea);
        return res.status(200).json({
            success: true,
            data: sottoarea
        });
    } catch (error) {
        // errore generale interno al server
        return res.status(500).json({
            success: false,
            message: "Si è verificato un errore durante il recupero delle aree.",
            error: error.message || error
        });
    }
})
app.get("/api/sottoaree", async (req, res) => {
    try {
         // risposta del server ha avuto successo
        const sottoaree = await getSottoareeAll();
        return res.status(200).json({
            success: true,
            data: sottoaree
        });
    } catch (error) {
        // errore generale interno al server
        return res.status(500).json({
            success: false,
            message: "Si è verificato un errore durante il recupero delle sottoaree.",
            error: error.message || error
        });
    }
})
// Operazioni:
// 1. Aggiungi sottoarea
// 2. Elimina sottoarea
// 3. Modifica sottoarea
app.post("/api/addSottoarea", async (req, res) => {
    const {idSottoarea, Nome, Area} = req.body;

    try {
        // inserimento avvenuto con successo
        const result = await addSottoarea(idSottoarea, Nome, Area);
        return res.status(201).json({
            success: true,
            data: result
        });
    } catch (error) {
        // errore idSottoarea già presente
        if(error.code == 'ER_DUP_ENTRY') {
            return res.status(400).json({
                success: false,
                message: 'Sigla già esistente, riprovare con un\'altra'
            });
        }
        // errore generale interno al server
        return res.status(500).json({
            success: false,
            message: "Si è verificato un errore durante l'elaborazione della richiesta",
            error: error.message || error
        });
    }
})
app.delete("/api/deleteSottoarea/:idSottoarea", async (req, res) => {
    const { idSottoarea } = req.params;

    try {
        const result = await deleteSottoarea(idSottoarea);
        // cancellazione avvenuta con successo
        return res.status(200).json({
            success: true
        });
    } catch (error) {
        // errore generale interno al server
        return res.status(500).json({
            success: false,
            message: "Si è verificato un errore durante l'elaborazione della richiesta",
            error: error.message || error
        });
    }
})
app.put("/api/updateSottoarea", async (req, res) => {
    const { idSottoarea, Nome, Area } = req.body;

    try {
        // modifica avvenuta con successo
        const result = await updateSottoarea(idSottoarea, Nome, Area);
        return res.status(200).json({
            success: true
        });
    } catch (error) {
        // errore generale interno al server
        return res.status(500).json({
            success: false,
            message: "Si è verificato un errore durante l'elaborazione della richiesta",
            error: error.message || error
        });
    }
})
// SETTORI
// Operazioni:
// 1. Elenco di tutti i settori
app.get("/api/settori", async (req, res) => {
    try {
         // risposta del server ha avuto successo
        const settori = await getSettori();
        return res.status(200).json({
            success: true,
            data: settori
        });
    } catch (error) {
        // errore generale interno al server
        return res.status(500).json({
            success: false,
            message: "Si è verificato un errore durante il recupero dei settori.",
            error: error.message || error
        });
    }
})



// REGOLAMENTO
// Operazioni:
// 1. Inserisci una nuova regola
// 2. Elenco di tutte le regole
// 3. Eliminare una regola
app.post("/api/addRegola", async (req, res) => {
    // selezioni contiene l'elenco degli id delle aree/sottoaree/settori
    let { idRegola, Descrizione, CFU, Tipologia, Selezioni, Count} = req.body;
    if(CFU == 0) CFU = null;
    if(Count == 0) Count = null;
    const result = await addRegola(idRegola, Descrizione, CFU, Tipologia, Selezioni, Count);

    if(result){
        // risposta avvenuta con successo
        return res.status(201).json({
            success: true,
            data: idRegola
        });
    } else{
        // errore durante l'esecuzione
        return res.status(500).json({
            success: false,
            message: "Si è verificato un errore durante l'eleborazione della richiesta.",
        });
    }
    

})
app.get("/api/regole", async (req, res) => {
    try {
        // risposta con successo
        // restituisco le regole
        const regole = await getRegole();
        return res.status(200).json({
            success: true,
            data: regole
        });
    } catch (error) {
        // errore generale interno al server
        return res.status(500).json({
            success: false,
            message: "Si è verificato un errore durante il recupero delle regole .",
            error: error.message || error
        });
    }
})
app.delete("/api/deleteRegola/:idRegola", async (req, res) => {
    const { idRegola } = req.params;

    try {
        const result = await deleteRegola(idRegola);
        // eliminazione avvenuta con successo
        return res.status(200).json({
            success: true
        });
    } catch (error) {
        // errore generale interno al server
        return res.status(500).json({
            success: false,
            message: "Si è verificato un errore durante l'elaborazione della richiesta",
            error: error.message || error
        });
    }
})




// RICHIESTE
// Operazioni:
// 1. Elenco delle richieste
// 2. Informazioni di una determinata richiesta
// 3. Elenco degli insegnamenti di una determinata richiesta
app.get("/api/richieste", async (req, res) => {
    try {
        // risposta con successo
        const richieste = await getRichieste();
        return res.status(200).json({
            success: true,
            data: richieste
        });
    } catch (error) {
        // errore generale interno al server
        return res.status(500).json({
            success: false,
            message: "Si è verificato un errore durante il recupero delle richieste .",
            error: error.message || error
        });
        
    }
})
app.get("/api/richiesta/:idRichiesta", async (req, res) => {
    const idRichiesta = req.params.idRichiesta;
    try {
        // risposta con successo
        const richiesta = await getRichiesta(idRichiesta);
        return res.status(200).json({
            success: true,
            data: richiesta
        });
    } catch (error) {
        // errore generale interno al server
        return res.status(500).json({
            success: false,
            message: "Si è verificato un errore durante il recupero della richiesta .",
            error: error.message || error
        });
        
    }
})
app.get("/api/insegnamenti/:idRegolamento", async (req, res) => {
    const idRegolamento = req.params.idRegolamento;
    try {
        // risposta con successo
        const insegnamenti = await getInsegnamentiFull(idRegolamento);
        return res.status(200).json({
            success: true,
            data: insegnamenti
        });
    } catch (error) {
        // errore generale interno al server
        return res.status(500).json({
            success: false,
            message: "Si è verificato un errore durante il recupero degli insegnamenti.",
            error: error.message || error
        });
        
    }
})
// Operazioni:
// 1. Controllo delle regole
app.get("/api/checkRegole/:idRichiesta", async (req, res) => {
    const idRichiesta = req.params.idRichiesta;
    try {
        // risposta con successo
        const result = await checkRegole(idRichiesta);
        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        // errore generale interno al server
        return res.status(500).json({
            success: false,
            message: "Si è verificato un errore durante il recupero della richiesta .",
            error: error.message || error
        });
        
    }
})