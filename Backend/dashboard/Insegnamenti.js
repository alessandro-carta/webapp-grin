import { db } from "../database.js";
import { v4 as uuidv4 } from 'uuid';
import { getCorsoDiStudio } from './CorsiDiStudio.js';
import { getRegolamento } from './RegolamentiCDS.js';
import { getRichiesta } from '../Richieste.js';

export async function getInsegnamenti(regolamento){
    const queryInsegnamenti = `
        SELECT Insegnamenti.idInsegnamento AS "id", Insegnamenti.Nome AS "nome", Insegnamenti.AnnoErogazione AS "annoerogazione", Insegnamenti.CFU AS "cfutot", Insegnamenti.Settore AS "settore"
        FROM Regolamenti, Insegnamenti
        WHERE idRegolamento = Regolamento AND idRegolamento = ? `;
    const [result] = await db.query(queryInsegnamenti, [regolamento]);
    return result;
}
export async function getInsegnamentoSottoaree(id){
    const querySottoaree = `
        SELECT Sottoaree.idSottoarea AS "id", Sottoaree.Area AS "area", Sottoaree.Nome AS "nome", InsegnamentiSottoaree.CFU AS "cfu"
        FROM Insegnamenti, InsegnamentiSottoaree, Sottoaree
        WHERE idInsegnamento = Insegnamento AND idSottoarea = Sottoarea AND idInsegnamento = ? `;
    const [result] = await db.query(querySottoaree, [id]);
    return result;
}
export async function getInsegnamentiFull(regolamento) {
    // contiene l'elenco degli insegnamenti
    // per ogni insegnamento l'elenco delle sottoaree con cfu
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
        SELECT Insegnamenti.idInsegnamento AS "id", Insegnamenti.Nome AS "nome", Insegnamenti.AnnoErogazione AS "annoerogazione", Insegnamenti.CFU AS "cfutot", Insegnamenti.Settore AS "settore"
        FROM Insegnamenti
        WHERE idInsegnamento = ? `;
    const [result] = await db.query(queryInsegnamenti, [id]);
    return result;
}
export async function getInsegnamentoFull(id) {
    // contiene insegnamento con l'elenco delle sottoaree con cfu
    const [insegnamento] = await getInsegnamento(id);
    const sottoaree = await getInsegnamentoSottoaree(id);
    return {...insegnamento, sottoaree: sottoaree}
}

export async function addInsegnamento(id, nome, annoerogazione, cfutot, settore, regolamento, sottoaree) {
    // transazione
    try {
        await db.beginTransaction();
        const queryInsegnamento = 'INSERT INTO Insegnamenti (idInsegnamento, Nome, AnnoErogazione, CFU, Settore, Regolamento) VALUES (?, ?, ?, ?, ?, ?)';
        await db.query(queryInsegnamento, [id, nome, annoerogazione, cfutot, settore, regolamento]);
        if(sottoaree.length > 0){
            const queryInsegnamentoSottoarea = 'INSERT INTO InsegnamentiSottoaree (Insegnamento, Sottoarea, CFU) VALUES ?';
            const valoriSottoaree = sottoaree.map(sottoarea => [id, sottoarea.id, sottoarea.cfu]);
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
export async function updateInsegnamento(id, nome, annoerogazione, CFU, settore, sottoaree) {
    // transazione
    try {
        await db.beginTransaction();
        await db.query(`
            UPDATE Insegnamenti 
            SET Nome = ?, AnnoErogazione = ?, CFU = ?, Settore = ?
            WHERE idInsegnamento = ?`, [nome, annoerogazione, CFU, settore, id]);
        await db.query(`
            DELETE FROM InsegnamentiSottoaree
            WHERE Insegnamento = ?`, [id]);
        if(sottoaree.length > 0){
            const valoriSottoaree = sottoaree.map(sottoarea => [id, sottoarea.id, sottoarea.cfu]);
            await db.query(`
                INSERT INTO InsegnamentiSottoaree (Insegnamento, Sottoarea, CFU) 
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
    const { nome, cfutot, settore, richiesta, annoerogazione, sottoaree } = req.body;
    const id =  uuidv4();
    try {
        const resultRichiesta = await getRichiesta(richiesta);
        if(resultRichiesta == null) return res.status(404).json({ message: "Richiesta non trovata" });
        if(resultRichiesta.stato != "Bozza") return res.status(400).json({ message: "Richiesta non può essere modificata" });
        
        const resultRegolamento = await getRegolamento(resultRichiesta.regolamento);
        if(resultRegolamento == null) return res.status(404).json({ message: "Regolamento non trovato" });
        
        const resultCDS = await getCorsoDiStudio(resultRegolamento.cds);
        if(resultCDS == null) return res.status(404).json({ message: "Corso di studio non trovato" });
        if(annoerogazione > resultCDS.durata) return res.status(400).json({ message: "Anno di erogazione errato" });

        const result = await addInsegnamento(id, nome, annoerogazione, cfutot, settore, resultRichiesta.regolamento, sottoaree);
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
    const richiesta = req.body.richiesta;
    try {
        const resultRichiesta = await getRichiesta(richiesta);
        if(resultRichiesta == null) return res.status(404).json({ message: "Richiesta non trovata" });
        if(resultRichiesta.stato != "Bozza") return res.status(400).json({ message: "Richiesta non può essere modificata" });
        
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
    const {id, nome, cfutot, settore, richiesta, annoerogazione, sottoaree} = req.body;
    try {
        const resultRichiesta = await getRichiesta(richiesta);
        if(resultRichiesta == null) return res.status(404).json({ message: "Richiesta non trovata" });
        if(resultRichiesta.stato != "Bozza") return res.status(400).json({ message: "Richiesta non può essere modificata" });
        
        const resultRegolamento = await getRegolamento(resultRichiesta.regolamento);
        if(resultRegolamento == null) return res.status(404).json({ message: "Regolamento non trovato" });

        const resultCDS = await getCorsoDiStudio(resultRegolamento.cds);
        if(resultCDS == null) return res.status(404).json({ message: "Corso di studio non trovato" });
        if(annoerogazione > resultCDS.durata)return res.status(400).json({ message: "Anno di erogazione errato" });

        const result = await updateInsegnamento(id, nome, annoerogazione, cfutot, settore, sottoaree);
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