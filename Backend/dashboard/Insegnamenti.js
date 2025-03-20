import { db } from "../database.js";
import { v4 as uuidv4 } from 'uuid';
import { getRegolamento } from './RegolamentiCDS.js';

export async function getInsegnamenti(regolamento){
    const queryInsegnamenti = `
        SELECT Insegnamenti.idInsegnamento AS "id", Insegnamenti.Nome AS "nome", Insegnamenti.AnnoErogazione AS "annoerogazione", Insegnamenti.Ore AS "oretot", Insegnamenti.Settore AS "settore", Regolamenti.idRegolamento AS "regolamento"
        FROM Regolamenti, Insegnamenti
        WHERE idRegolamento = Regolamento AND idRegolamento = ? `;
    const [result] = await db.query(queryInsegnamenti, [regolamento]);
    return result;
}
export async function getInsegnamentoSottoaree(id){
    const querySottoaree = `
        SELECT Sottoaree.idSottoarea AS "id", Sottoaree.Area AS "area", Sottoaree.Nome AS "nome", InsegnamentiSottoaree.Ore AS "ore"
        FROM Insegnamenti, InsegnamentiSottoaree, Sottoaree
        WHERE idInsegnamento = Insegnamento AND idSottoarea = Sottoarea AND idInsegnamento = ? `;
    const [result] = await db.query(querySottoaree, [id]);
    return result;
}
export async function getInsegnamentiFull(regolamento) {
    // contiene l'elenco degli insegnamenti
    // per ogni insegnamento l'elenco delle sottoaree con le ore
    let insegnamentiFull = []; 
    const insegnamenti = await getInsegnamenti(regolamento);
    for(let insegnamento of insegnamenti){
        const sottoaree = await getInsegnamentoSottoaree(insegnamento.id);
        insegnamentiFull.push({...insegnamento, sottoaree: sottoaree});
    }
    return insegnamentiFull;
}
export async function getInsegnamento(id){
    const queryInsegnamenti = `
        SELECT Insegnamenti.idInsegnamento AS "id", Insegnamenti.Nome AS "nome", Insegnamenti.AnnoErogazione AS "annoerogazione", Insegnamenti.Ore AS "oretot", Insegnamenti.Settore AS "settore", Insegnamenti.Regolamento AS "regolamento"
        FROM Insegnamenti
        WHERE idInsegnamento = ? `;
    const [result] = await db.query(queryInsegnamenti, [id]);
    return result;
}
export async function getInsegnamentoFull(id) {
    // contiene insegnamento con l'elenco delle sottoaree con le ore
    const [insegnamento] = await getInsegnamento(id);
    const sottoaree = await getInsegnamentoSottoaree(id);
    return {...insegnamento, sottoaree: sottoaree}
}

export async function addInsegnamento(id, nome, annoerogazione, oretot, settore, regolamento, sottoaree) {
    // transazione
    try {
        await db.beginTransaction();
        const queryInsegnamento = 'INSERT INTO Insegnamenti (idInsegnamento, Nome, AnnoErogazione, Ore, Settore, Regolamento) VALUES (?, ?, ?, ?, ?, ?)';
        await db.query(queryInsegnamento, [id, nome, annoerogazione, oretot, settore, regolamento]);
        if(sottoaree.length > 0){
            const queryInsegnamentoSottoarea = 'INSERT INTO InsegnamentiSottoaree (Insegnamento, Sottoarea, Ore) VALUES ?';
            const valoriSottoaree = sottoaree.map(sottoarea => [id, sottoarea.id, sottoarea.ore]);
            await db.query(queryInsegnamentoSottoarea, [valoriSottoaree]);
        }
        await db.commit();
        return {ok: true, message: ""};
    } catch (error) {
        // transazione fallita
        await db.rollback();
        return {ok: false, message: error};
    }
}
export async function updateInsegnamento(id, nome, annoerogazione, ore, settore, sottoaree) {
    // transazione
    try {
        await db.beginTransaction();
        await db.query(`
            UPDATE Insegnamenti 
            SET Nome = ?, AnnoErogazione = ?, Ore = ?, Settore = ?
            WHERE idInsegnamento = ?`, [nome, annoerogazione, ore, settore, id]);
        await db.query(`
            DELETE FROM InsegnamentiSottoaree
            WHERE Insegnamento = ?`, [id]);
        if(sottoaree.length > 0){
            const valoriSottoaree = sottoaree.map(sottoarea => [id, sottoarea.id, sottoarea.ore]);
            await db.query(`
                INSERT INTO InsegnamentiSottoaree (Insegnamento, Sottoarea, Ore) 
                VALUES ?`, [valoriSottoaree]);
        }
        await db.commit();
        return {ok: true, message: ""};
    } catch (error) {
        // transazione fallita
        await db.rollback();
        return {ok: false, message: error};
    }
}
export async function deleteInsegnamento(id) {
    const [result] = await db.query(`DELETE FROM Insegnamenti WHERE idInsegnamento = ?`,[id]);
    return result;
}





export async function handleGetInsegnamentiPresidente(req, res) {
    const regolamento  = req.params.idRegolamento;
    try {
        // risposta con successo
        const result = await getInsegnamentiFull(regolamento);
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
export async function handleAddInsegnamento(req, res) {
    const { nome, oretot, settore, regolamento, annoerogazione, sottoaree } = req.body;
    const id =  uuidv4();
    try {
        const objRegolamento = await getRegolamento(regolamento);
        if(objRegolamento == null) return res.status(404).json({ message: "Regolamento non trovato" });
        if(objRegolamento.richiesta != null) return res.status(400).json({ message: "Regolamento non può essere modificato" });
        // controllo su anno erogazione
        if(annoerogazione > objRegolamento.duratacorso) return res.status(400).json({ message: "Anno di erogazione errato" });
        // tutto pronto per inserire un nuovo insegnamento
        const result = await addInsegnamento(id, nome, annoerogazione, oretot, settore, regolamento, sottoaree);
        if(result.ok) return res.status(201).json({ 
            message: "Insegnamento aggiunto con successo",
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
export async function handleDeleteInsegnamento(req, res) {
    const id = req.params.idInsegnamento;
    const regolamento = req.body.regolamento;
    try {
        // controlli sul regolamento e lo stato della richiesta
        const objRegolamento = await getRegolamento(regolamento);
        if(objRegolamento == null) return res.status(404).json({ message: "Regolamento non trovato" });
        if(objRegolamento.richiesta != null) return res.status(400).json({ message: "Regolamento non può essere modificato" });
        // tutto pronto per eliminare
        const result = await deleteInsegnamento(id);
        if(result.affectedRows == 0) return res.status(404).json({ message: "Insegnamento non trovato" });
        return res.status(204).json({ });
    } catch (error) {
        // errore generale interno al server
        return res.status(500).json({
            message: "Si è verificato un errore durante l'elaborazione della richiesta",
            error: error.message || error
        });
    }
}
export async function handleGetInsegnamentoPresidente(req, res) {
    const id = req.params.idInsegnamento;
    try {
        // risposta con successo
        const result = await getInsegnamentoFull(id);
        if(result == null) return res.status(404).json({ message: "Insegnamento non trovato" });
        return res.status(200).json({ 
            message: "insegnamento",
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
export async function handleUpdateInsegnamento(req, res) {
    const {id, nome, oretot, settore, regolamento, annoerogazione, sottoaree} = req.body;
    try {
        const objRegolamento = await getRegolamento(regolamento);
        if(objRegolamento == null) return res.status(404).json({ message: "Regolamento non trovato" });
        if(objRegolamento.richiesta != null) return res.status(400).json({ message: "Regolamento non può essere modificato" });
        // controllo su anno erogazione
        if(annoerogazione > objRegolamento.duratacorso) return res.status(400).json({ message: "Anno di erogazione errato" });
        // tutto pronto per inserire un nuovo insegnamento
        const result = await updateInsegnamento(id, nome, annoerogazione, oretot, settore, sottoaree);
        if(result.ok) return res.status(201).json({ 
            message: "Insegnamento modificato",
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