import express from "express"
import cors from "cors"
import jwt from 'jsonwebtoken';
import { keyJwt, port } from "./Config.js";
import { handleGetPresidenti, handleGetPresidente, handleAddPresidente, handleUpdatePresidente, handleResetPassword} from "./Presidenti.js";
import { handleGetAree, handleGetArea, handleAddArea, handleDeleteArea, handleUpdateArea, handleGetSettori } from "./Aree.js";
import { handleAddRegola, handleDeleteRegola, handleGetRegole } from "./Regole.js";
import { handleGetRichieste, handleGeRegolamentoAdmin, handleGetInsegnamenti, handleInvalidRichiesta } from "./Richieste.js";
import { handleActiveBollino, handleAddBollino, handleBollini, handleBolliniPublic, handleBollinoRichiesta, handleInvalidBollino } from "./Bollini.js";
import { handleAddSottoarea, handleGetSottoarea, handleGetSottoareePerArea, handleGetSottoaree, handleDeleteSottoarea, handleUpdateSottoarea } from "./Sottoaree.js";
import { handleAdminLogin, handleChangePassword, handlePresidenteLogin } from "./Auth.js";
import { getCorsoDiStudio, handleAddCDS, handleDashboard, handleDeleteCDS, handleUpdateCDS, hanldeCorsoDiStudio } from "./dashboard/CorsiDiStudio.js";
import { handleGetBolliniPerPresidente } from "./dashboard/Bollini.js";
import { getRegolamento, handleAddRegolamento, handleDeleteRegolamento, handleDuplicateRegolamento, handleGetRegolamenti, handleGetRegolamento } from "./dashboard/RegolamentiCDS.js";
import { getRichiesta, handleAddRichiesta, handleDeleteRichiesta, handleGetRichiestaPerPresidente, handleGetRichiestePerPresidente, handleSaveRichiesta } from "./dashboard/Richieste.js";
import { handleAddInsegnamento, handleDeleteInsegnamento, handleGetInsegnamentiPresidente, handleGetInsegnamentoPresidente, handleUpdateInsegnamento } from "./dashboard/Insegnamenti.js";
import { handleCheckRegole } from "./CheckRichiesta.js";

const app = express();
app.use(cors());
app.use(express.json());

const server = app.listen(port, async () => {
    console.log(`Server in ascolto sulla porta > ${port}`);
});

server.on('error', (err) => {
    console.error('Errore durante l\'avvio del server:', err.message);
    process.exit(1);
});


// middleware che controlla la validità del token
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(403).json({ message: 'Token mancante' });
    jwt.verify(token, keyJwt, (err, user) => {
      if (err) return res.status(403).json({ message: 'Token non valido' });
      req.user = user;
      next();
    });
};
// middleware che controlla il ruolo del client
const authorizeRole = (roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Accesso vietato: ruolo non autorizzato' });
      }
      next();
    };
};
// middleware che controlla il presidente del CDS
const authorizePresidenteCDS = async (req, res, next) => {
    let id;
    if(req.params.idCDS != undefined) id = req.params.idCDS;
    else {
        if(req.body.cds != undefined) id = req.body.cds;
        else return res.status(403).json({ message: "Non sei autorizzato ad accedere a questa risorsa" });
    }
    const presidente = req.user.userId;
    try {
        const cds = await getCorsoDiStudio(id);
        if(cds == null) return res.status(404).json({ message: "Corso di studio non trovato" })
        if (cds.presidente !== presidente) return res.status(403).json({ message: "Non sei autorizzato ad accedere a questa risorsa" });
        next();
    } catch (error) {
        // errore generale interno al server
        return res.status(500).json({
            message: "Si è verificato un errore durante l'elaborazione della richiesta",
            error: error.message || error
        });
    }
}
// middleware che controlla il presidente del regolamento
const authorizePresidenteRegolamento = async (req, res, next) => {
    let id;
    if(req.params.idRegolamento != undefined) id = req.params.idRegolamento;
    else id = req.body.regolamento;
    const presidente = req.user.userId;
    try {
        const regolamento = await getRegolamento(id);
        if(regolamento == null) return res.status(404).json({ message: "Regolamento non trovato" });
        if (regolamento.presidente !== presidente) return res.status(403).json({ message: "Non sei autorizzato ad accedere a questa risorsa" });
        next();
    } catch (error) {
        // errore generale interno al server
        return res.status(500).json({
            message: "Si è verificato un errore durante l'elaborazione della richiesta",
            error: error.message || error
        });
    }
}
// middleware che controlla il presidente della richiesta
const authorizePresidenteRichiesta = async (req, res, next) => {
    let id;
    if(req.params.idRichiesta != undefined) id = req.params.idRichiesta;
    else id = req.body.richiesta;
    const presidente = req.user.userId;
    try {
        const richiesta = await getRichiesta(id);
        if(richiesta == null) return res.status(404).json({ message: "Richiesta non trovata" });
        if (richiesta.presidente !== presidente) return res.status(403).json({ message: "Non sei autorizzato ad accedere a questa risorsa" });
        next();
    } catch (error) {
        // errore generale interno al server
        return res.status(500).json({
            message: "Si è verificato un errore durante l'elaborazione della richiesta",
            error: error.message || error
        });
    }
}

// AUTH
// Operazioni:
// 1. Accesso Admin Grin
// 2. Accesso Presidente
// 3. Cambio password Presidente
app.post("/api/adminLogin", async (req, res) => {
    return handleAdminLogin(req, res);
})
app.post("/api/presidenteLogin", async (req, res) => {
    return handlePresidenteLogin(req, res);
})
app.put("/api/changePassword", authenticateToken, authorizeRole(['presidente']), async (req, res) => {
    return handleChangePassword(req, res);
})

// DASHBORAD/CORSIDISTUDIO
// Operazioni
// 1. Elenco dei propri corsi di studio
// 2. Aggiungere un cds
// 3. Eliminare un cds
// 4. Informazioni di un singolo corso di studio
// 5. Modificare un cds
app.get("/api/dashboard", authenticateToken, authorizeRole(['presidente']),  async (req, res) => {
    return handleDashboard(req, res);
})
app.post("/api/addCDS", authenticateToken, authorizeRole(['presidente']),  async (req, res) => {
    return handleAddCDS(req, res);
})
app.delete("/api/deleteCDS/:idCDS", authenticateToken, authorizeRole(['presidente']), authorizePresidenteCDS, async (req, res) => {
    return handleDeleteCDS(req, res);
})
app.get("/api/corsodistudio/:idCDS", authenticateToken, authorizeRole(['presidente']), authorizePresidenteCDS, async (req, res) => {
    return hanldeCorsoDiStudio(req, res);
})
app.put("/api/updateCDS", authenticateToken, authorizeRole(['presidente']), authorizePresidenteCDS, async (req, res) => {
    return handleUpdateCDS(req, res);
})
// DASHBORAD/REGOLAMENTI
// Operazioni
// 1. Aggiungere un regolamento
// 2. Elenco dei regolamenti di un cds
// 3. Informazioni di un determinato regolamento
// 4. Eliminare un regolamento di un cds
// 5. Elenco degli insegnamenti di un determinato regolamento
// 6. Aggiungere un nuovo insegnamento
// 7. Eliminare un insegnamento
// 8. Informazioni di un determinato insegnamento
// 9. Modificare un insegnamento
// 10. Duplica un regolamento
app.post("/api/addRegolamento/", authenticateToken, authorizeRole(['presidente']), authorizePresidenteCDS, async (req, res) => {
    return handleAddRegolamento(req, res);
})
app.get("/api/regolamenti/:idCDS", authenticateToken, authorizeRole(['presidente']), authorizePresidenteCDS, async (req, res) => {
    return handleGetRegolamenti(req, res);
})
app.get("/api/regolamento/:idRegolamento", authenticateToken, authorizeRole(['presidente']), authorizePresidenteRegolamento, async (req, res) => {
    return handleGetRegolamento(req, res);
})
app.delete("/api/deleteRegolamento/:idRegolamento", authenticateToken, authorizeRole(['presidente']), authorizePresidenteRegolamento, async (req, res) => {
    return handleDeleteRegolamento(req, res);
})
app.get("/api/insegnamentiPresidente/:idRegolamento", authenticateToken, authorizeRole(['presidente']), authorizePresidenteRegolamento, async (req, res) => {
    return handleGetInsegnamentiPresidente(req, res);
})
app.post("/api/addInsegnamento/", authenticateToken, authorizeRole(['presidente']), authorizePresidenteRegolamento, async (req, res) => {
    return handleAddInsegnamento(req, res);
})
app.delete("/api/deleteInsegnamento/:idInsegnamento", authenticateToken, authorizeRole(['presidente']), authorizePresidenteRegolamento, async (req, res) => {
    return handleDeleteInsegnamento(req, res);
})
app.get("/api/insegnamento/:idRegolamento/:idInsegnamento", authenticateToken, authorizeRole(['presidente']), authorizePresidenteRegolamento, async (req, res) => {
    return handleGetInsegnamentoPresidente(req, res);
})
app.put("/api/updateInsegnamento/", authenticateToken, authorizeRole(['presidente']), authorizePresidenteRegolamento, async (req, res) => {
    return handleUpdateInsegnamento(req, res);
})
app.post("/api/duplicateRegolamento/", authenticateToken, authorizeRole(['presidente']), authorizePresidenteRegolamento, async (req, res) => {
    return handleDuplicateRegolamento(req, res);
})
// DASHBORAD/RICHIESTE
// Operazioni:
// 1. Elenco delle richieste di un presidente
// 2. Inviare una richiesta
// 3. Informazioni di una determinata richiesta
// 4. Salvare in stato di bozza una richiesta
// 5. Elimare una richiesta
// 6. Controllo regole di una richiesta
// 7. Inviare una richiesta
app.get("/api/richiestePresidente", authenticateToken, authorizeRole(['presidente']), async (req, res) => {
    return handleGetRichiestePerPresidente(req, res);
})
app.put("/api/sendRichiesta/", authenticateToken, authorizeRole(['presidente']), authorizePresidenteRegolamento, async (req, res) => {
    return handleAddRichiesta(req, res);
})
app.get("/api/richiestaPresidente/:idRichiesta", authenticateToken, authorizeRole(['presidente']), authorizePresidenteRichiesta, async (req, res) => {
    return handleGetRichiestaPerPresidente(req, res);
})
// controllare se si può eliminare
app.put("/api/saveRichiesta/", authenticateToken, authorizeRole(['presidente']), authorizePresidenteRichiesta, async (req, res) => {
    return handleSaveRichiesta(req, res);
}) 
app.delete("/api/deleteRichiesta/:idRichiesta", authenticateToken, authorizeRole(['presidente']), authorizePresidenteRichiesta, async (req, res) => {
    return handleDeleteRichiesta(req, res);
})
app.get("/api/checkRegolePresidente/:idRegolamento", authenticateToken, authorizeRole(['presidente']), authorizePresidenteRegolamento, async (req, res) => {
    return handleCheckRegole(req, res);
})

// DASHBOARD/BOLLINI
// Operazioni:
// 1. Elenco dei bollini di un presidente
// 2. Informazioni di un bollino a partire da una richiesta
app.get("/api/bolliniPresidente", authenticateToken, authorizeRole(['presidente']), async (req, res) => {
    return handleGetBolliniPerPresidente(req, res);
})
app.get("/api/bollinoRichiestaPresidente/:idRichiesta", authenticateToken, authorizeRole(['presidente']), authorizePresidenteRichiesta, async (req, res) => {
    return handleBollinoRichiesta(req, res);
})

// PRESIDENTI
// Operazioni:
// 1. Elenco di tutti i presidenti
// 2. Informazioni di un determinato presidente
// 3. Aggiungi un nuovo account presidente
// 4. Modifica un account già esistente
app.get("/api/presidenti", authenticateToken, authorizeRole(['admin']), async (req, res) => {
    return handleGetPresidenti(req, res);
})
app.get("/api/presidente/:idPresidente", authenticateToken, authorizeRole(['admin', 'presidente']), async (req, res) => {
    return handleGetPresidente(req, res);
})
app.post("/api/addPresidente", authenticateToken, authorizeRole(['admin']), async (req, res) => {
    return handleAddPresidente(req, res);
})
app.put("/api/updatePresidente", authenticateToken, authorizeRole(['admin']), async (req, res) => {
    return handleUpdatePresidente(req, res);
})
app.put("/api/resetPassword", authenticateToken, authorizeRole(['admin']), async (req, res) => {
    return handleResetPassword(req, res);
})

// AREE
// Operazioni:
// 1. Elenco di tutte le aree
// 2. Informazioni di una determinata area
// 3. Aggiungi area
// 4. Elimina area
// 5. Modifica area
/*app.get("/api/aree", authenticateToken, authorizeRole(['admin','presidente']), async (req, res) => {
    return handleGetAree(req, res);
})*/
app.get("/api/aree", async (req, res) => {
    return handleGetAree(req, res);
})
app.get("/api/area/:idArea", authenticateToken, authorizeRole(['admin','presidente']), async (req, res) => {
    return handleGetArea(req, res);
})
app.post("/api/addArea", authenticateToken, authorizeRole(['admin']), async (req, res) => {
    return handleAddArea(req, res);
})
app.delete("/api/deleteArea/:idArea", authenticateToken, authorizeRole(['admin']), async (req, res) => {
    return handleDeleteArea(req, res);
})
app.put("/api/updateArea", authenticateToken, authorizeRole(['admin']), async (req, res) => {
    return handleUpdateArea(req, res);
})

// SOTTOAREE
// Operazioni:
// 1. Elenco di tutte le sottoarea di un'area
// 2. Informazioni di una determinata sottoarea
// 3. Elenco di tutte le sottoaree
// 4. Aggiungi sottoarea
// 5. Elimina sottoarea
// 6. Modifica sottoarea
app.get("/api/sottoaree/:idArea", authenticateToken, authorizeRole(['admin','presidente']), async (req, res) => {
    return handleGetSottoareePerArea(req, res);
})
app.get("/api/sottoarea/:idSottoarea", authenticateToken, authorizeRole(['admin','presidente']), async (req, res) => {
    return handleGetSottoarea(req, res);
})
app.get("/api/sottoaree", authenticateToken, authorizeRole(['admin','presidente']), async (req, res) => {
    return handleGetSottoaree(req, res);
})
app.post("/api/addSottoarea", authenticateToken, authorizeRole(['admin']), async (req, res) => {
    return handleAddSottoarea(req, res);
})
app.delete("/api/deleteSottoarea/:idSottoarea", authenticateToken, authorizeRole(['admin']), async (req, res) => {
    return handleDeleteSottoarea(req, res);
})
app.put("/api/updateSottoarea", authenticateToken, authorizeRole(['admin']), async (req, res) => {
    return handleUpdateSottoarea(req, res);
})

// SETTORI
// Operazioni:
// 1. Elenco di tutti i settori
app.get("/api/settori", authenticateToken, authorizeRole(['admin','presidente']), async (req, res) => {
    return handleGetSettori(req, res);
})

// REGOLAMENTO
// Operazioni:
// 1. Inserisci una nuova regola
// 2. Elenco di tutte le regole
// 3. Eliminare una regola
app.post("/api/addRegola", authenticateToken, authorizeRole(['admin']), async (req, res) => {
    return handleAddRegola(req, res);
})
app.get("/api/regole", authenticateToken, authorizeRole(['admin','presidente']), async (req, res) => {
    return handleGetRegole(req, res);
})
app.delete("/api/deleteRegola/:idRegola", authenticateToken, authorizeRole(['admin']), async (req, res) => {
    return handleDeleteRegola(req, res);
})

// RICHIESTE
// Operazioni:
// 1. Elenco delle richieste
// 2. Informazioni di una determinata richiesta
// 3. Elenco degli insegnamenti di una determinata richiesta
// 4. Controllo delle regole
// 5. Invalida una richiesta
app.get("/api/richieste", authenticateToken, authorizeRole(['admin']), async (req, res) => {
    return handleGetRichieste(req, res);
})
app.get("/api/regolamentoAdmin/:idRegolamento", authenticateToken, authorizeRole(['admin']), async (req, res) => {
    return handleGeRegolamentoAdmin(req, res);
})
app.get("/api/insegnamenti/:idRegolamento", authenticateToken, authorizeRole(['admin']),  async (req, res) => {
    return handleGetInsegnamenti(req, res);
})
app.get("/api/checkRegole/:idRegolamento", authenticateToken, authorizeRole(['admin']), async (req, res) => {
    return handleCheckRegole(req, res);
})
app.put("/api/invalidRichiesta", authenticateToken, authorizeRole(['admin']), async (req, res) => {
    return handleInvalidRichiesta(req, res);
})

// BOLLINI
// Operazioni:
// 1. Erogare un bollino
// 2. Elenco dei bollini
// 3. Revocare un bollino
// 4. Riattivare un bollino
// 5. Informazioni di un bollino a partire da una richiesta
// 6. Elenco dei bollini per la visualizzazione pubblica
app.post("/api/addBollino", authenticateToken, authorizeRole(['admin']), async (req, res) => {
    return handleAddBollino(req, res);
})
app.get("/api/bollini", authenticateToken, authorizeRole(['admin']), async (req, res) => {
    return handleBollini(req, res);
})
app.put("/api/invalidBollino/", authenticateToken, authorizeRole(['admin']), async (req, res) => {
    return handleInvalidBollino(req, res);
})
app.put("/api/activeBollino/", authenticateToken, authorizeRole(['admin']), async (req, res) => {
    return handleActiveBollino(req, res);
})
app.get("/api/bollinoRichiesta/:idRichiesta", authenticateToken, authorizeRole(['admin']), async (req, res) => {
    return handleBollinoRichiesta(req, res);
})
app.get("/api/bolliniPublic", async (req, res) => {
    return handleBolliniPublic(req, res);
})