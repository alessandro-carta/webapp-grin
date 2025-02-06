import jwt from 'jsonwebtoken';
import { keyJwt } from '../Config.js';
import { db } from "../database.js";
import { v4 as uuidv4 } from 'uuid';
import { getCorsoDiStudio } from './CorsiDiStudio.js';

export async function getRegolamenti(CDS, presidente) {
    const [result] = await db.query(`
        SELECT Regolamenti.idRegolamento AS "id", Regolamenti.AnnoAccademico AS "annoaccademico", Regolamenti.CDS AS "CDS"
        FROM Regolamenti, CorsiDiStudio, Presidenti
        WHERE CDS = idCDS AND Presidente = idPresidente AND idCDS = ? AND idPresidente = ? `, [CDS, presidente]);
    return result;
}
export async function getRegolamento(id, presidente) {
    const [result] = await db.query(`
        SELECT Regolamenti.idRegolamento AS "id", Regolamenti.AnnoAccademico AS "annoaccademico", CorsiDiStudio.Nome AS "corsodistudio", CorsiDiStudio.AnnoDurata AS "duratacorso", Regolamenti.Anvur AS "anvur"
        FROM Regolamenti, CorsiDiStudio
        WHERE idCDS = CDS AND Presidente = ? AND idRegolamento = ?`, [presidente, id]);
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




export async function handleAddRegolamento(req, res) {
    const { annoaccademico, CDS } = req.body;
    const token = req.headers['authorization']?.split(' ')[1];
    const id = uuidv4();
    // estrapolo id dal token se valido
    let presidente;
    jwt.verify(token, keyJwt, (err, user) => {
        if (err) return res.status(403).json({ 
            success: false,
            error: 'Token non valido' 
        });
        presidente = user.userId;
    });
    try {
        // risposta con successo
        // controllo che chi ha mandato la richiesta sia 
        // effettivamente il presidente del CDS
        const corso = await getCorsoDiStudio(CDS, presidente);
        if(corso == undefined) return res.status(403).json({ 
            success: false,
            error: 'Accesso non autorizzato' 
        });
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
    const token = req.headers['authorization']?.split(' ')[1];
    // estrapolo id dal token se valido
    let presidente;
    jwt.verify(token, keyJwt, (err, user) => {
        if (err) return res.status(403).json({ 
            success: false,
            error: 'Token non valido' 
        });
        presidente = user.userId;
    });
    try {
        // risposta con successo
        const result = await getRegolamenti(CDS, presidente);
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
    const { CDS } = req.body;
    const token = req.headers['authorization']?.split(' ')[1];
    // estrapolo id dal token se valido
    let presidente;
    jwt.verify(token, keyJwt, (err, user) => {
        if (err) return res.status(403).json({ 
            success: false,
            error: 'Token non valido' 
        });
        presidente = user.userId;
    });
    try {
        // controllo che chi ha mandato la richiesta sia 
        // effettivamente il presidente del CDS
        const corso = await getCorsoDiStudio(CDS, presidente);
        if(corso == undefined) return res.status(403).json({ 
            success: false,
            error: 'Accesso non autorizzato' 
        });
        const result = await deleteRegolamento(id);
        // cancellazione avvenuta con successo
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
export async function handleGetRegolamento(req, res) {
    const id  = req.params.idRegolamento;
    const token = req.headers['authorization']?.split(' ')[1];
    // estrapolo id dal token se valido
    let presidente;
    jwt.verify(token, keyJwt, (err, user) => {
        if (err) return res.status(403).json({ 
            success: false,
            error: 'Token non valido' 
        });
        presidente = user.userId;
    });
    try {
        // risposta con successo
        const result = await getRegolamento(id, presidente);
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