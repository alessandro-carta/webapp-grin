import { db } from "./database.js";
import { v4 as uuidv4 } from 'uuid';

export async function getPresidenti(){
    const [result] = await db.query(`
        SELECT idPresidente AS "id", Nome AS "nome", Cognome AS "cognome", Email AS "email", Università AS "università", Attivo AS "attivo", FirstPassword AS "firstpassword"
        FROM Presidenti`);
    return result;
}
export async function getPresidente(id){
    const [result] = await db.query(`
        SELECT idPresidente AS "id", Nome AS "nome", Cognome AS "cognome", Email AS "email", Università AS "università", Attivo AS "attivo", FirstPassword AS "firstpassword", Password AS "passPres"
        FROM Presidenti
        WHERE idPresidente = ? `, [id]);
    return result[0];
}
export async function addPresidente(id, nome, cognome, email, università){
    const [result] = await db.query(`INSERT INTO Presidenti (idPresidente, Nome, Cognome, Email, Università) VALUES (?, ?, ?, ?, ?)`, [id, nome, cognome, email, università]);
    return result;
}
export async function updatePresidente(id, nome, cognome, email, università, attivo){
    const [result] = await db.query(`UPDATE Presidenti SET Nome = ?, Cognome = ?, Email = ?, Università = ?, Attivo = ? WHERE idPresidente = ?`, [nome, cognome, email, università, attivo, id]);
    return result;
}




export async function handleGetPresidenti(req, res) {
    try {
        // risposta con successo
        const presidenti = await getPresidenti();
        return res.status(200).json({
            message: "Elenco dei presidenti",
            data: presidenti
        });
    } catch (error) {
        // errore generale interno al server
        return res.status(500).json({
            success: false,
            message: "Si è verificato un errore durante il recupero degli account.",
            error: error.message || error
        });
    }
    
}
export async function handleGetPresidente(req, res) {
    const id = req.params.idPresidente;
    try {
        // risposta avvenuta con successo
        const presidente = await getPresidente(id);
        if(presidente == null){
            return res.status(404).json({
                message: "Presidente non trovato"
            });
        }
        return res.status(200).json({
            message: "Presidente",
            data: presidente
        });
    } catch (error) {
        // errore generale interno al server
        return res.status(500).json({
            message: "Si è verificato un errore durante il recupero dell\'account .",
            error: error.message || error
        });
    }
    
}
export async function handleAddPresidente(req, res) {
    const { nome, cognome, email, università } = req.body;
    const id = uuidv4();
    try {
        // risposta avvenuta con successo
        const result = await addPresidente(id, nome, cognome, email, università);
        return res.status(201).json({
            message: "Presidente creato con successo",
            data: id
        });
    } catch (error) {
        if(error.code == 'ER_DUP_ENTRY') {
            return res.status(400).json({
                message: 'Email già esistente, riprovare con un\'altra',
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
export async function handleUpdatePresidente(req, res) {
    const { id, nome, cognome, email, università, attivo } = req.body;
    try {
        // risposta avvenuta con successo
        const result = await updatePresidente(id, nome, cognome, email, università, attivo);
        if(result.affectedRows == 0){
            return res.status(404).json({
                message: 'Presidente non trovato',
            });
        }
        return res.status(200).json({
            message: "Presidente modificato con successo",
            data: id
        });
    } catch (error) {
        if(error.code == 'ER_DUP_ENTRY') {
            return res.status(400).json({
                message: 'Email già esistente, riprovare con un\'altra',
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