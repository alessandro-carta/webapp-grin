import { checkRegole } from "../CheckRichiesta.js";
import { db } from "../database.js"; 
import { v4 as uuidv4 } from 'uuid';

export async function getRichieste(presidente){
    const queryRichieste = `
        SELECT Richieste.idRichiesta AS "id", Richieste.Data AS "data", Richieste.Stato AS "stato", Presidenti.Universita AS "università", Presidenti.Email AS "email", CorsiDiStudio.Nome AS "corsodistudio", Regolamenti.AnnoAccademico AS "annoaccademico", Regolamenti.idRegolamento AS "regolamento"
        FROM Richieste, Regolamenti, CorsiDiStudio, Presidenti
        WHERE Regolamento = idRegolamento AND CDS = idCDS AND Presidente = idPresidente AND idPresidente = ? AND Richieste.Stato <> "Bozza" `;
    const [result] = await db.query(queryRichieste, [presidente]);
    return result;
}
export async function getRichiesta(id){
    const queryRichiesta = `
        SELECT Regolamenti.idRegolamento AS "regolamento", CorsiDiStudio.Nome AS "corsodistudio", Richieste.idRichiesta AS "id", Richieste.Data AS "data", Richieste.Stato AS "stato", Regolamenti.AnnoAccademico AS "annoaccademico", CorsiDiStudio.AnnoDurata AS "duratacorso", Regolamenti.Anvur AS "anvur", CorsiDiStudio.Presidente AS "presidente"
        FROM Richieste, Regolamenti, CorsiDiStudio
        WHERE Regolamento = idRegolamento AND CDS = idCDS AND idRichiesta = ?`;
    const [result] = await db.query(queryRichiesta, [id]);
    return result[0];
}
export async function addRichiesta(id, regolamento, stato, data) {
    const [result] = await db.query(`INSERT INTO Richieste (idRichiesta, Regolamento, Stato, Data) VALUES (?, ?, ?, ?)`, [id, regolamento, stato, data]);
    return result;
}
export async function sendRichiesta(id, stato, data){
    const [result] = await db.query(`UPDATE Richieste SET Stato = ?, Data = ? WHERE idRichiesta = ?`, [stato, data, id]);
    return result;
}
export async function updateRichiesta(id, stato){
    const [result] = await db.query(`UPDATE Richieste SET Stato = ? WHERE idRichiesta = ?`, [stato, id]);
    return result;
}
export async function deleteRichiesta(id) {
    const [result] = await db.query('DELETE FROM Richieste WHERE idRichiesta = ?',[id]);
    return result;
}




export async function handleGetRichiestePerPresidente(req, res) {
    const presidente = req.user.userId;
    try {
        // risposta con successo
        const richieste = await getRichieste(presidente);
        return res.status(200).json({
            message: "Elenco delle richieste",
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
}
export async function handleAddRichiesta(req, res) {
    const { regolamento, data } = req.body;
    const id = uuidv4();
    try {
        // risposta con successo
        const result = await addRichiesta(id, regolamento, "Elaborazione", data);
        return res.status(201).json({ 
            message: "Richiesta inviata con successo",
            data: id
        });
    } catch (error) {
        // violato vincolo di unicità
        if(error.code == 'ER_DUP_ENTRY') {
            return res.status(400).json({
                message: 'Richiesta già presente per questo anno accademico',
                error: error.message || error
            });
        }
        // errore generale interno al server
        console.log(error);
        return res.status(500).json({
            message: "Si è verificato un errore durante l'elaborazione della richiesta",
            error: error.message || error
        });
    }
}
export async function handleGetRichiestaPerPresidente(req, res) {
    const id = req.params.idRichiesta;
    try {
        // risposta con successo
        const richiesta = await getRichiesta(id);
        return res.status(200).json({
            message: "Richiesta",
            data: richiesta
        });
    } catch (error) {
        // errore generale interno al server
        return res.status(500).json({
            message: "Si è verificato un errore durante il recupero delle richieste .",
            error: error.message || error
        });
    }
}
export async function handleSaveRichiesta(req, res) {
    const id = req.body.richiesta;
    try {
        const richiesta = await getRichiesta(id);
        if(richiesta == null) return res.status(404).json({ message: "Richiesta non trovata" });
        if(richiesta.stato != "Invalidata") return res.status(400).json({ message: "Azione non permessa" });
        await updateRichiesta(id, "Bozza");
        // risposta con successo
        return res.status(204).json({
            message: "Richiesta salvata",
            data: id
        });
    } catch (error) {
        // errore generale interno al server
        return res.status(500).json({
            message: "Si è verificato un errore durante l'elaborazione della richiesta",
            error: error.message || error
        });
    }
}
export async function handleDeleteRichiesta(req, res) {
    const id = req.params.idRichiesta;
    try {
        const richiesta = await getRichiesta(id);
        if(richiesta.stato != "Invalidata") return res.status(400).json({ message: "Non puoi eliminare questa richiesta" });
        // risposta con successo
        await deleteRichiesta(id);
        return res.status(204).json({ });
    } catch (error) {
        // errore generale interno al server
        return res.status(500).json({
            message: "Si è verificato un errore durante l'elaborazione della richiesta",
            error: error.message || error
        });
    }
}