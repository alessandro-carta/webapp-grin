import { db } from "../database.js";
import { v4 as uuidv4 } from 'uuid';
import { getInsegnamentiFull } from "../Richieste.js";
import { addInsegnamento } from "./Insegnamenti.js";

export async function getRegolamenti(CDS) {
    const [result] = await db.query(`
        SELECT Regolamenti.idRegolamento AS "id", Regolamenti.AnnoAccademico AS "annoaccademico", Regolamenti.CDS AS "CDS"
        FROM Regolamenti, CorsiDiStudio, Presidenti
        WHERE CDS = idCDS AND Presidente = idPresidente AND idCDS = ?`, [CDS]);
    return result;
}
export async function getRegolamento(id) {
    const [result] = await db.query(`
        SELECT CorsiDiStudio.idCDS AS "CDS", Regolamenti.idRegolamento AS "id", Regolamenti.AnnoAccademico AS "annoaccademico", CorsiDiStudio.Nome AS "corsodistudio", CorsiDiStudio.AnnoDurata AS "duratacorso", Regolamenti.Anvur AS "anvur", CorsiDiStudio.Presidente AS "presidente"
        FROM Regolamenti, CorsiDiStudio
        WHERE idCDS = CDS AND idRegolamento = ?`, [id]);
    return result[0];
}
export async function addRegolamento(id, annoaccademico, CDS){
    const [result] = await db.query(`INSERT INTO Regolamenti (idRegolamento, AnnoAccademico, CDS, Anvur) VALUES (?, ?, ?, 1)`, [id, annoaccademico, CDS]);
    return result;
}
export async function deleteRegolamento(id) {
    const [result] = await db.query(`DELETE FROM Regolamenti WHERE idRegolamento = ?`,[id]);
    return result;
}
export async function duplicateRegolamento(id, annoaccademico, regolamento){
    try {
        await db.beginTransaction();
        const resultRegolamento = await getRegolamento(regolamento);
        await db.query(`
            INSERT INTO Regolamenti (idRegolamento, AnnoAccademico, CDS, Anvur)
            VALUES (?, ?, ?, 1) `, [id, annoaccademico, resultRegolamento.CDS]);
        const resultInsegnamenti = await getInsegnamentiFull(regolamento);
        for(let i = 0; i < resultInsegnamenti.length; i++){
            const idI = uuidv4();
            await db.query(`
                INSERT INTO Insegnamenti (idInsegnamento, Nome, AnnoErogazione, CFU, Settore, Regolamento) 
                VALUES (?, ?, ?, ?, ?, ?)`, [idI, resultInsegnamenti[i].nome, resultInsegnamenti[i].annoerogazione, resultInsegnamenti[i].cfutot, resultInsegnamenti[i].settore, id]);
            if(resultInsegnamenti[i].sottoaree.length > 0){
                const valoriSottoaree = resultInsegnamenti[i].sottoaree.map(sottoarea => [idI, sottoarea.id, sottoarea.cfu]);
                await db.query(`
                    INSERT INTO InsegnamentiSottoaree (Insegnamento, Sottoarea, CFU) 
                    VALUES ? `, [valoriSottoaree]);
            }            
        }
        await db.commit();
        return true;
    } catch (error) {
        // transazione fallita
        await db.rollback();
        return false;
    }
}




export async function handleAddRegolamento(req, res) {
    const { annoaccademico, CDS } = req.body;
    const id = uuidv4();
    const presidente = req.user.userId;
    try {
        // risposta con successo
        const result = await addRegolamento(id, annoaccademico, CDS);
        return res.status(204).json({ 
            success: true
        });
    } catch (error) {
        // violato vincolo di unicità
        if(error.code == 'ER_DUP_ENTRY') {
            return res.status(400).json({
                success: false,
                message: 'Anno accademico già presente'
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
export async function handleGetRegolamenti(req, res) {
    const CDS  = req.params.idCDS;
    try {
        // risposta con successo
        const result = await getRegolamenti(CDS);
        return res.status(200).json({ 
            success: true,
            data: result
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
export async function handleGetRegolamento(req, res) {
    const id  = req.params.idRegolamento;
    try {
        // risposta con successo
        const result = await getRegolamento(id);
        return res.status(200).json({ 
            success: true,
            data: result
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
export async function handleDeleteRegolamento(req, res) {
    const id  = req.params.idRegolamento;
    try {
        const result = await deleteRegolamento(id);
        // cancellazione avvenuta con successo
        return res.status(204).json({
            success: true
        });
    } catch (error) {
        // errore richieste presenti
        if(error.code == 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({
                success: false,
                message: 'Impossibile eliminare, richieste presenti'
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
export async function handleDuplicateRegolamento(req, res) {
    const { annoaccademico, regolamento } = req.body;
    const id = uuidv4();
    try {
        const result = await duplicateRegolamento(id, annoaccademico, regolamento);
        if(result) return res.status(204).json({ success: true });
        else return res.status(500).json({
            success: true,
            message: "Si è verificato un errore durante l'elaborazione della richiesta"
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