import { checkRegole } from "../CheckRichiesta.js";
import { db } from "../database.js"; 
import { v4 as uuidv4 } from 'uuid';

export async function getRichieste(presidente){
    const queryRichieste = `
        SELECT Richieste.idRichiesta AS "id", Richieste.Data AS "data", Richieste.Stato AS "stato", Presidenti.Università AS "università", Presidenti.Email AS "email", CorsiDiStudio.Nome AS "corsodistudio", Regolamenti.AnnoAccademico AS "annoaccademico"
        FROM Richieste, Regolamenti, CorsiDiStudio, Presidenti
        WHERE Regolamento = idRegolamento AND CDS = idCDS AND Presidente = idPresidente AND idPresidente = ?`;
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
        const result = await addRichiesta(id, regolamento, "Bozza", data);
        return res.status(201).json({ 
            message: "Richiesta inserita con successo",
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
        if(richiesta == null) return res.status(404).json({ message: "Richiesta non trovata" });
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
        if(richiesta == null) return res.status(404).json({ message: "Richiesta non trovata" });
        if(richiesta.stato != "Invalidata" && richiesta.stato != "Bozza") return res.status(400).json({ message: "Non puoi eliminare questa richiesta" });
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
export async function handleSendRichiesta(req, res) {
    const id = req.body.richiesta;
    try {
        // risposta avvenuta con successo
        // controllo che la richiesta rispetti le regole per l'erogazione del bollino
        const richiesta = await getRichiesta(id);
        if(richiesta == null) return res.status(404).json({ message: "Richiesta non trovata" });
        const resultRegole = await checkRegole(id);
        const checkFinal = resultRegole.regole.filter((regola) => regola.check == false);
        if(checkFinal.length == 0 && resultRegole.anvur && richiesta.stato === 'Bozza'){
            // invio la richiesta
            await updateRichiesta(id, "Elaborazione");
            return res.status(201).json({
                message: "Richiesta inviata con successo",
                data: id
            });
        }
        else return res.status(400).json({ message: "Si è verificato un errore durante l'elaborazione della richiesta" });
    } catch (error) {
        // errore generale interno al server
        return res.status(500).json({
            message: "Si è verificato un errore durante l'elaborazione della richiesta",
            error: error.message || error
        });
    }
}