import { db } from "./database.js";


export async function addSottoarea(id, nome, area){
    const [result] = await db.query(`INSERT INTO Sottoaree (idSottoarea, Nome, Area) VALUES (?, ?, ?)`, [id, nome, area]);
    return result;
}
export async function getSottoareePerArea(area){
    const [result] = await db.query(`
        SELECT idSottoarea AS "id", Nome AS "nome", Area AS "area"
        FROM Sottoaree
        WHERE Area = ? `,[area]);
    return result;
}
export async function getSottoaree(){
    const [result] = await db.query(`
        SELECT idSottoarea AS "id", Nome AS "nome", Area AS "area"
        FROM Sottoaree `,[]);
    return result;
}
export async function getSottoarea(id){
    const [result] = await db.query(`
        SELECT idSottoarea AS "id", Nome AS "nome", Area AS "area"
        FROM Sottoaree
        WHERE idSottoarea = ? `, [id]);
    return result[0];
}
export async function deleteSottoarea(id) {
    const [result] = await db.query(`DELETE FROM Sottoaree WHERE idSottoarea = ?`,[id]);
    return result;
}
export async function updateSottoarea(id, nome, area){
    const [result] = await db.query(`UPDATE Sottoaree SET Nome = ?, Area = ? WHERE idSottoarea = ?`, [nome, area, id]);
    return result;
}



export async function handleGetSottoareePerArea(req, res) {
    const area = req.params.idArea;
    try {
        // risposta del server ha avuto successo
        const sottoaree = await getSottoareePerArea(area);
        return res.status(200).json({
            message: "Elenco delle sottoaree",
            data: sottoaree
        });
    } catch (error) {
        // errore generale interno al server
        return res.status(500).json({
            message: "Si è verificato un errore durante il recupero delle aree.",
            error: error.message || error
        });
    }
    
}
export async function handleGetSottoarea(req, res) {
    const id = req.params.idSottoarea;
    try {
        // risposta del server ha avuto successo
        const sottoarea = await getSottoarea(id);
        if(sottoarea == null){
            return res.status(404).json({
                message: "Sottoarea non trovata"
            });
        }
        return res.status(200).json({
            data: sottoarea
        });
    } catch (error) {
        // errore generale interno al server
        return res.status(500).json({
            message: "Si è verificato un errore durante il recupero delle aree.",
            error: error.message || error
        });
    }
    
}
export async function handleGetSottoaree(req, res) {
    try {
        // risposta del server ha avuto successo
        const sottoaree = await getSottoaree();
        return res.status(200).json({
            message: "Elenco delle sottoaree",
            data: sottoaree
        });
    } catch (error) {
        // errore generale interno al server
        return res.status(500).json({
            message: "Si è verificato un errore durante il recupero delle sottoaree.",
            error: error.message || error
        });
    }
    
}
export async function handleAddSottoarea(req, res) {
    const {id, nome, area} = req.body;
    try {
        // inserimento avvenuto con successo
        const result = await addSottoarea(id, nome, area);
        return res.status(201).json({
            message: "Sottoarea aggiunta con successo",
            data: id
        });
    } catch (error) {
        // errore idSottoarea già presente
        if(error.code == 'ER_DUP_ENTRY') {
            return res.status(400).json({
                message: 'Sigla già esistente, riprovare con un\'altra',
                error: error.message || error
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
export async function handleDeleteSottoarea(req, res) {
    const id  = req.params.idSottoarea;
    try {
        const result = await deleteSottoarea(id);
        if(result.affectedRows == 0){
            return res.status(404).json({
                message: "Sottoarea non trovata"
            });
        }
        // cancellazione avvenuta con successo
        return res.status(204).json({});
    } catch (error) {
        // errore generale interno al server
        return res.status(500).json({
            success: false,
            message: "Si è verificato un errore durante l'elaborazione della richiesta",
            error: error.message || error
        });
    }
}
export async function handleUpdateSottoarea(req, res) {
    const { id, nome, area } = req.body;
    try {
        // modifica avvenuta con successo
        const result = await updateSottoarea(id, nome, area);
        if(result.affectedRows == 0){
            return res.status(404).json({
                message: "Sottoarea non trovata"
            });
        }
        return res.status(201).json({
            message: "Sottoarea modificata con successo",
            data: id
        });
    } catch (error) {
        // errore generale interno al server
        return res.status(500).json({
            message: "Si è verificato un errore durante l'elaborazione della richiesta",
            error: error.message || error
        });
    }
}
