import express from "express"
import cors from "cors"
import { handleGetPresidenti, handleGetPresidente, handleAddPresidente, handleUpdatePresidente} from "./Presidenti.js";
import { handleGetAree, handleGetArea, handleAddArea, handleDeleteArea, handleUpdateArea, handleGetSettori } from "./Aree.js";
import { handleAddRegola, handleDeleteRegola, handleGetRegole } from "./Regolamento.js";
import { handleGetRichieste, handleGetRichiesta, handleGetInsegnamenti, handleCheckRegole, handleInvalidRichiesta } from "./Richieste.js";
import { handleAddBollino, handleBollini, handleInvalidBollino } from "./Bollini.js";
import { handleAddSottoarea, handleGetSottoarea, handleGetSottoareePerArea, handleGetSottoaree, handleDeleteSottoarea, handleUpdateSottoarea } from "./Sottoaree.js";

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
// 3. Aggiungi un nuovo account presidente
// 4. Modifica un account già esistente
app.get("/api/presidenti", async (req, res) => {
    return handleGetPresidenti(req, res);
})
app.get("/api/presidente/:idPresidente", async (req, res) => {
    return handleGetPresidente(req, res);
})
app.post("/api/addPresidente", async (req, res) => {
    return handleAddPresidente(req, res);
})
app.put("/api/updatePresidente", async (req, res) => {
    return handleUpdatePresidente(req, res);
})
// AREE
// Operazioni:
// 1. Elenco di tutte le aree
// 2. Informazioni di una determinata area
// 3. Aggiungi area
// 4. Elimina area
// 5. Modifica area
app.get("/api/aree", async (req, res) => {
    return handleGetAree(req, res);
})
app.get("/api/area/:idArea", async (req, res) => {
    return handleGetArea(req, res);
})
app.post("/api/addArea", async (req, res) => {
    return handleAddArea(req, res);
})
app.delete("/api/deleteArea/:idArea", async (req, res) => {
    return handleDeleteArea(req, res);
})
app.put("/api/updateArea", async (req, res) => {
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
app.get("/api/sottoaree/:idArea", async (req, res) => {
    return handleGetSottoareePerArea(req, res);
})
app.get("/api/sottoarea/:idSottoarea", async (req, res) => {
    return handleGetSottoarea(req, res);
})
app.get("/api/sottoaree", async (req, res) => {
    return handleGetSottoaree(req, res);
})
app.post("/api/addSottoarea", async (req, res) => {
    return handleAddSottoarea(req, res);
})
app.delete("/api/deleteSottoarea/:idSottoarea", async (req, res) => {
    return handleDeleteSottoarea(req, res);
})
app.put("/api/updateSottoarea", async (req, res) => {
    return handleUpdateSottoarea(req, res);
})
// SETTORI
// Operazioni:
// 1. Elenco di tutti i settori
app.get("/api/settori", async (req, res) => {
    return handleGetSettori(req, res);
})



// REGOLAMENTO
// Operazioni:
// 1. Inserisci una nuova regola
// 2. Elenco di tutte le regole
// 3. Eliminare una regola
app.post("/api/addRegola", async (req, res) => {
    return handleAddRegola(req, res);
})
app.get("/api/regole", async (req, res) => {
    return handleGetRegole(req, res);
})
app.delete("/api/deleteRegola/:idRegola", async (req, res) => {
    return handleDeleteRegola(req, res);
})
// RICHIESTE
// Operazioni:
// 1. Elenco delle richieste
// 2. Informazioni di una determinata richiesta
// 3. Elenco degli insegnamenti di una determinata richiesta
// 4. Controllo delle regole
// 5. Invalida una richiesta
app.get("/api/richieste", async (req, res) => {
    return handleGetRichieste(req, res);
})
app.get("/api/richiesta/:idRichiesta", async (req, res) => {
    return handleGetRichiesta(req, res);
})
app.get("/api/insegnamenti/:idRegolamento", async (req, res) => {
    return handleGetInsegnamenti(req, res);
})
app.get("/api/checkRegole/:idRichiesta", async (req, res) => {
    return handleCheckRegole(req, res);
})
app.put("/api/invalidRichiesta", async (req, res) => {
    return handleInvalidRichiesta(req, res);
})
// BOLLINI
// Operazioni:
// 1. Erogare un bollino
// 2. Elenco dei bollini
// 3. Revocare un bollino
app.post("/api/addBollino", async (req, res) => {
    return handleAddBollino(req, res);
})
app.get("/api/bollini", async (req, res) => {
    return handleBollini(req, res);
})
app.put("/api/invalidBollino/:idBollino", async (req, res) => {
    return handleInvalidBollino(req, res);
})