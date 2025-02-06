import jwt from 'jsonwebtoken';
import { keyJwt } from '../Config.js';
import { db } from "../database.js"; 
import { v4 as uuidv4 } from 'uuid';
import { getRegolamento } from './RegolamentiCDS.js';

export async function getRichieste(presidente){
    const queryRichieste = `
        SELECT Richieste.idRichiesta AS "id", Richieste.Data AS "data", Richieste.Stato AS "stato", Presidenti.Università AS "università", Presidenti.Email AS "email", CorsiDiStudio.Nome AS "corsodistudio", Regolamenti.AnnoAccademico AS "annoaccademico"
        FROM Richieste, Regolamenti, CorsiDiStudio, Presidenti
        WHERE Regolamento = idRegolamento AND CDS = idCDS AND Presidente = idPresidente AND idPresidente = ?`;
    const [result] = await db.query(queryRichieste, [presidente]);
    return result;
}
export async function getRichiesta(id, presidente){
    const queryRichiesta = `
        SELECT Regolamenti.idRegolamento AS "regolamento", CorsiDiStudio.Nome AS "corsodistudio", Richieste.idRichiesta AS "id", Richieste.Data AS "data", Richieste.Stato AS "stato", Regolamenti.AnnoAccademico AS "annoaccademico", Presidenti.Università AS "università", Presidenti.Email AS "email", CorsiDiStudio.AnnoDurata AS "duratacorso", Regolamenti.Anvur AS "anvur"
        FROM Richieste, Regolamenti, CorsiDiStudio, Presidenti
        WHERE Regolamento = idRegolamento AND CDS = idCDS AND Presidente = idPresidente AND idRichiesta = ?  AND idPresidente = ? `;
    const [result] = await db.query(queryRichiesta, [id, presidente]);
    return result[0];
}
export async function addRichiesta(id, regolamento, stato, data) {
    const [result] = await db.query(`INSERT INTO Richieste (idRichiesta, Regolamento, Stato, Data) VALUES (?, ?, ?, ?)`, [id, regolamento, stato, data]);
    return result;
}




export async function handleGetRichiestePerPresidente(req, res) {
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
        // effettivamente il presidente del CDS collegato al regolamento
        const corso = await getRegolamento(regolamento, presidente);
        if(corso == undefined) return res.status(403).json({ 
            success: false,
            error: 'Accesso non autorizzato' 
        });
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
        const richiesta = await getRichiesta(id, presidente);
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