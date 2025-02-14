import { db } from "../database.js";
import { v4 as uuidv4 } from 'uuid';
import { getInsegnamentiFull } from "../Richieste.js";
import { addInsegnamento } from "./Insegnamenti.js";

export async function getRegolamenti(cds) {
    const [result] = await db.query(`
        SELECT Regolamenti.idRegolamento AS "id", Regolamenti.AnnoAccademico AS "annoaccademico", Regolamenti.CDS AS "cds"
        FROM Regolamenti, CorsiDiStudio, Presidenti
        WHERE CDS = idCDS AND Presidente = idPresidente AND idCDS = ?`, [cds]);
    return result;
}
export async function getRegolamento(id) {
    const [result] = await db.query(`
        SELECT CorsiDiStudio.idCDS AS "cds", Regolamenti.idRegolamento AS "id", Regolamenti.AnnoAccademico AS "annoaccademico", CorsiDiStudio.Nome AS "corsodistudio", CorsiDiStudio.AnnoDurata AS "duratacorso", Regolamenti.Anvur AS "anvur", CorsiDiStudio.Presidente AS "presidente"
        FROM Regolamenti, CorsiDiStudio
        WHERE idCDS = CDS AND idRegolamento = ?`, [id]);
    return result[0];
}
export async function addRegolamento(id, annoaccademico, cds){
    const [result] = await db.query(`INSERT INTO Regolamenti (idRegolamento, AnnoAccademico, CDS, Anvur) VALUES (?, ?, ?, 1)`, [id, annoaccademico, cds]);
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
            VALUES (?, ?, ?, 1) `, [id, annoaccademico, resultRegolamento.cds]);
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
        return {ok: true, error: ""};
    } catch (error) {
        // transazione fallita
        await db.rollback();
        return {ok: false, error: error};
    }
}




export async function handleAddRegolamento(req, res) {
    const { annoaccademico, cds } = req.body;
    const id = uuidv4();
    try {
        // risposta con successo
        const result = await addRegolamento(id, annoaccademico, cds);
        return res.status(201).json({ 
            message: "Regolamento aggiunto con successo",
            data: id
        });
    } catch (error) {
        // violato vincolo di unicità
        if(error.code == 'ER_DUP_ENTRY') {
            return res.status(400).json({
                message: 'Anno accademico già presente',
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
export async function handleGetRegolamenti(req, res) {
    const cds  = req.params.idCDS;
    try {
        // risposta con successo
        const result = await getRegolamenti(cds);
        return res.status(200).json({ 
            message: "Elenco dei regolamenti",
            data: result
        });
    } catch (error) {
        // errore generale interno al server
        return res.status(500).json({
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
            message: "Regolamento",
            data: result
        });
    } catch (error) {
        // errore generale interno al server
        return res.status(500).json({
            message: "Si è verificato un errore durante l'elaborazione della richiesta",
            error: error.message || error
        });
    }
}
export async function handleDeleteRegolamento(req, res) {
    const id  = req.params.idRegolamento;
    try {
        const result = await deleteRegolamento(id);
        if(result.affectedRows == 0) return res.status(404).json({ message: "Regolamento non trovato" });
        // cancellazione avvenuta con successo
        return res.status(204).json({ });
    } catch (error) {
        // errore richieste presenti
        if(error.code == 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({
                message: 'Impossibile eliminare, richieste presenti',
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
export async function handleDuplicateRegolamento(req, res) {
    const { annoaccademico, regolamento } = req.body;
    const id = uuidv4();
    try {
        const result = await duplicateRegolamento(id, annoaccademico, regolamento);
        if(result.ok) return res.status(201).json({ 
            message: "Regolamento duplicato con successo",
            data: id 
        });
        else return res.status(500).json({
            message: "Si è verificato un errore durante l'elaborazione della richiesta",
            error: result.error
        });

    } catch (error) {
        // errore generale interno al server
        return res.status(500).json({
            message: "Si è verificato un errore durante l'elaborazione della richiesta",
            error: error.message || error
        });
    }
}