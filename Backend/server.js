import express from "express"
import cors from "cors"
import { handleGetPresidenti, handleGetPresidente, handleAddPresidente, handleUpdatePresidente} from "./Presidenti.js";
import { handleGetAree, handleGetArea, handleAddArea, handleDeleteArea, handleUpdateArea, handleGetSettori } from "./Aree.js";
import { handleAddRegola, handleDeleteRegola, handleGetRegole } from "./Regolamento.js";
import { handleGetRichieste, handleGetRichiesta, handleGetInsegnamenti, handleCheckRegole, handleInvalidRichiesta } from "./Richieste.js";
import { handleAddBollino, handleBollini, handleInvalidBollino } from "./Bollini.js";
import { handleAddSottoarea, handleGetSottoarea, handleGetSottoareePerArea, handleGetSottoaree, handleDeleteSottoarea, handleUpdateSottoarea } from "./Sottoaree.js";
import { handleAdminLogin, handleChangePassword, handleGetEmail, handlePresidenteLogin } from "./Auth.js";
import jwt from 'jsonwebtoken';
import { keyJwt, port } from "./Config.js";
import { handleAddCDS, handleDashboard, handleDeleteCDS, hanldeCorsoDiStudio } from "./dashboard/CorsiDiStudio.js";
import { handleGetBolliniPerPresidente } from "./dashboard/Bollini.js";
import { handleAddRegolamento, handleDeleteRegolamento, handleGetRegolamenti, handleGetRegolamento } from "./dashboard/RegolamentiCDS.js";
import { handleAddRichiesta, handleGetRichiestePerPresidente } from "./dashboard/Richieste.js";

const app = express();
app.use(cors());
app.use(express.json());
app.listen(port, () => {
    console.log(`Server in ascolto sulla porta > ${port}`);
})

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(403).json({ error: 'Token mancante' });
    jwt.verify(token, keyJwt, (err, user) => {
      if (err) return res.status(403).json({ error: 'Token non valido' });
      req.user = user;
      next();
    });
};
const authorizeRole = (roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Accesso vietato: ruolo non autorizzato' });
      }
      next();
    };
};

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
app.put("/api/changePassword", async (req, res) => {
    return handleChangePassword(req, res);
})
app.get("/api/getEmail", authenticateToken, authorizeRole(['presidente']),  async (req, res) => {
    return handleGetEmail(req, res);
})

// DASHBORAD/CORSIDISTUDIO
// Operazioni
// 1. Elenco dei propri corsi di studio
// 2. Aggiungere un cds
// 3. Eliminare un cds
// 4. Informazioni di un singolo corso di studio
app.get("/api/dashboard", authenticateToken, authorizeRole(['presidente']),  async (req, res) => {
    return handleDashboard(req, res);
})
app.post("/api/addCDS", authenticateToken, authorizeRole(['presidente']),  async (req, res) => {
    return handleAddCDS(req, res);
})
app.delete("/api/deleteCDS/:idCDS", authenticateToken, authorizeRole(['presidente']), async (req, res) => {
    return handleDeleteCDS(req, res);
})
app.get("/api/corsodistudio/:idCDS", authenticateToken, authorizeRole(['presidente']),  async (req, res) => {
    return hanldeCorsoDiStudio(req, res);
})

// DASHBORAD/REGOLAMENTI
// Operazioni
// 1. Aggiungere un regolamento
// 2. Elenco dei regolamenti di un cds
// 3. Elimanare un regolamento di un cds
app.post("/api/addRegolamento/", authenticateToken, authorizeRole(['presidente']),  async (req, res) => {
    return handleAddRegolamento(req, res);
})
app.get("/api/regolamenti/:idCDS", authenticateToken, authorizeRole(['presidente']),  async (req, res) => {
    return handleGetRegolamenti(req, res);
})
app.get("/api/regolamento/:idRegolamento", authenticateToken, authorizeRole(['presidente']),  async (req, res) => {
    return handleGetRegolamento(req, res);
})
app.delete("/api/deleteRegolamento/:idRegolamento", authenticateToken, authorizeRole(['presidente']), async (req, res) => {
    return handleDeleteRegolamento(req, res);
})

// DASHBORAD/RICHIESTE
// Operazioni:
// 1. Elenco delle richieste di un presidente
// 2. Aggiungere una nuova richiesta
app.get("/api/richiestePresidente", authenticateToken, authorizeRole(['presidente']),  async (req, res) => {
    return handleGetRichiestePerPresidente(req, res);
})
app.post("/api/addRichiesta/", authenticateToken, authorizeRole(['presidente']),  async (req, res) => {
    return handleAddRichiesta(req, res);
})


// DASHBOARD/BOLLINI
// Operazioni:
// 1. Elenco dei bollini di un presidente
app.get("/api/bolliniPresidente", authenticateToken, authorizeRole(['presidente']),  async (req, res) => {
    return handleGetBolliniPerPresidente(req, res);
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
app.get("/api/presidente/:idPresidente", authenticateToken, authorizeRole(['admin']), async (req, res) => {
    return handleGetPresidente(req, res);
})
app.post("/api/addPresidente", authenticateToken, authorizeRole(['admin']), async (req, res) => {
    return handleAddPresidente(req, res);
})
app.put("/api/updatePresidente", authenticateToken, authorizeRole(['admin']), async (req, res) => {
    return handleUpdatePresidente(req, res);
})

// AREE
// Operazioni:
// 1. Elenco di tutte le aree
// 2. Informazioni di una determinata area
// 3. Aggiungi area
// 4. Elimina area
// 5. Modifica area
app.get("/api/aree", authenticateToken, authorizeRole(['admin','presidente']), async (req, res) => {
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
app.get("/api/settori", authenticateToken, authorizeRole(['admin']), async (req, res) => {
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
app.get("/api/richiesta/:idRichiesta", authenticateToken, authorizeRole(['admin']), async (req, res) => {
    return handleGetRichiesta(req, res);
})
app.get("/api/insegnamenti/:idRegolamento", authenticateToken, authorizeRole(['admin']),  async (req, res) => {
    return handleGetInsegnamenti(req, res);
})
app.get("/api/checkRegole/:idRichiesta", authenticateToken, authorizeRole(['admin']), async (req, res) => {
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
app.post("/api/addBollino", authenticateToken, authorizeRole(['admin']), async (req, res) => {
    return handleAddBollino(req, res);
})
app.get("/api/bollini", authenticateToken, authorizeRole(['admin']), async (req, res) => {
    return handleBollini(req, res);
})
app.put("/api/invalidBollino/:idBollino", authenticateToken, authorizeRole(['admin']), async (req, res) => {
    return handleInvalidBollino(req, res);
})