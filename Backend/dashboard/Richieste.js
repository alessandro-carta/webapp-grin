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
export async function saveRichiesta(id){
    const [result] = await db.query(`UPDATE Richieste SET Stato = "Bozza" WHERE idRichiesta = ?`, [id]);
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
}
export async function handleAddRichiesta(req, res) {
    const { regolamento, data } = req.body;
    const id = uuidv4();
    try {
        // risposta con successo
        const result = await addRichiesta(id, regolamento, "Bozza", data);
        return res.status(204).json({ 
            success: true
        });
    } catch (error) {
        // violato vincolo di unicità
        if(error.code == 'ER_DUP_ENTRY') {
            return res.status(400).json({
                success: false,
                message: 'Richiesta già presente per questo anno accademico'
            });
        }
        // errore generale interno al server
        return res.status(500).json({
            success: false,
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
            success: true,
            data: richiesta
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
export async function handleSaveRichiesta(req, res) {
    const id = req.body.richiesta;
    try {
        // risposta con successo
        const richiesta = await getRichiesta(id);
        if(richiesta.stato != "Invalidata" && richiesta.stato != "Bozza"){
            return res.status(400).json({
                success: false,
                message: "Azione non permessa"
            });
        }
        await saveRichiesta(id);
        return res.status(204).json({
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
}
export async function handleDeleteRichiesta(req, res) {
    const id = req.params.idRichiesta;
    try {
        // risposta con successo
        const richiesta = await getRichiesta(id);
        if(richiesta.stato != "Invalidata" && richiesta.stato != "Bozza"){
            return res.status(400).json({
                success: false,
                message: "Azione non permessa"
            });
        }
        await deleteRichiesta(id);
        return res.status(204).json({
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
}