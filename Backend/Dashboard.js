import jwt from 'jsonwebtoken';
import { keyJwt } from './Config.js';
import { db } from "./database.js";
import { v4 as uuidv4 } from 'uuid';


export async function getCorsiDiStudio(id) {
    const [result] = await db.query(`
        SELECT CorsiDiStudio.idCDS AS "id", CorsiDiStudio.Nome AS "corsodistudio", Presidenti.Università AS "università", CorsiDiStudio.AnnoDurata AS "durata"
        FROM CorsiDiStudio, Presidenti
        WHERE idPresidente = Presidente AND idPresidente = ?`, [id]);
    return result;
}
export async function addCDS(id, nome, durara, presidente){
    const [result] = await db.query(`INSERT INTO CorsiDiStudio (idCDS, Nome, AnnoDurata, Presidente) VALUES (?, ?, ?, ?)`, [id, nome, durara, presidente]);
    return result;
}
export async function deleteCDS(id) {
    const [result] = await db.query(`DELETE FROM CorsiDiStudio WHERE idCDS = ?`,[id]);
    return result;
}









export async function handleDashboard(req, res) {
    const token = req.headers['authorization']?.split(' ')[1];
    // estrapolo id dal token se valido
    let id;
    jwt.verify(token, keyJwt, (err, user) => {
            if (err) return res.status(403).json({ 
                success: false,
                error: 'Token non valido' 
            });
            id = user.userId;
    });
    try {
        // risposta con successo
        const result = await getCorsiDiStudio(id);
        return res.status(200).json({ 
            success: true,
            data: result
        });
    } catch (error) {
        // errore generale interno al server
        return res.status(500).json({
            success: false,
            message: "Si è verificato un errore durante il recupero dei corsi di studio.",
            error: error.message || error
        });
    }
}
export async function handleAddCDS(req, res) {
    const { nome, durata } = req.body;
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
        const result = await addCDS(id, nome, durata, presidente);
        return res.status(204).json({ 
            success: true
        });
    } catch (error) {
        // errore generale interno al server
        return res.status(500).json({
            success: false,
            message: "Si è verificato un errore durante il recupero dei corsi di studio.",
            error: error.message || error
        });
    }
}
export async function handleDeleteCDS(req, res) {
    const id  = req.params.idCDS;
    try {
        const result = await deleteCDS(id);
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
