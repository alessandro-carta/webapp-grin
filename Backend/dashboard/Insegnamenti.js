import jwt from 'jsonwebtoken';
import { keyJwt } from '../Config.js';
import { db } from "../database.js";
import { v4 as uuidv4 } from 'uuid';
import { getCorsoDiStudio } from './CorsiDiStudio.js';

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
export async function addInsegnamento(nome, annoerogazione, CFU, settore, regolamento, sottoaree) {
    // transazione
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
    const {nome, CFUTot, settore, richiesta, annoerogazione, sottoaree} = req.body;
    console.log(nome);
    console.log(CFUTot);
    console.log(settore);
    console.log(richiesta);
    console.log(annoerogazione);
    console.log(sottoaree);
}