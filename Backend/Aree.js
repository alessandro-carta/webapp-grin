import { db } from "./database.js";

// AREE
export async function getAree(){
    const [result] = await db.query(`
        SELECT idArea AS "id", Nome AS "nome"
        FROM Aree `);
    return result;
}
export async function getArea(id){
    const [result] = await db.query(`
        SELECT idArea AS "id", Nome AS "nome"
        FROM Aree
        WHERE idArea = ?`,[id]);
    return result[0];
}
export async function addArea(id, nome){
    const [result] = await db.query(`INSERT INTO Aree (idArea, Nome) VALUES (?, ?)`, [id, nome]);
    return result;
}
export async function deleteArea(id) {
    const [result] = await db.query('DELETE FROM Aree WHERE idArea = ?',[id]);
    return result
}
export async function updateArea(id, nome){
    const [result] = await db.query(`UPDATE Aree SET Nome = ? WHERE idArea = ?`, [nome, id]);
    return result;
}




export async function handleGetAree(req, res) {
    try {
        // risposta del server ha avuto successo
        const aree = await getAree();
        return res.status(200).json({
            success: true,
            data: aree
        });
    } catch (error) {
        // errore generale interno al server
        return res.status(500).json({
            success: false,
            message: "Si è verificato un errore durante il recupero delle aree.",
            error: error.message || error
        });
    }
}
export async function handleGetArea(req, res) {
    const id = req.params.idArea;
    try {
        // risposta del server ha avuto successo
        const area = await getArea(id);
        return res.status(200).json({
            success: true,
            data: area
        });
    } catch (error) {
        // errore generale interno al server
        return res.status(500).json({
            success: false,
            message: "Si è verificato un errore durante il recupero dell\'area.",
            error: error.message || error
        });
    }
}
export async function handleAddArea(req, res) {
    const {id, nome} = req.body;
    try {
        const result = await addArea(id, nome);
        // inserimento avvenuto con successo
        return res.status(201).json({
            success: true,
            data: result
        });
    } catch (error) {
        // errore idArea già presente
        if(error.code == 'ER_DUP_ENTRY') {
            return res.status(400).json({
                success: false,
                message: 'Sigla già esistente, riprovare con un\'altra'
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
export async function handleDeleteArea(req, res) {
    const id = req.params.idArea;
    try {
        const result = await deleteArea(id);
        // eliminazione avvenuta con successo
        return res.status(200).json({
            success: true
        });
    } catch (error) {
        // errore sottoaree presenti
        if(error.code == 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({
                success: false,
                message: 'Impossibile eliminare, sottoaree presenti'
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
export async function handleUpdateArea(req, res) {
    const {id, nome} = req.body;
    try {
        const result = await updateArea(id, nome);
        // modifica avvenuta con successo
        return res.status(200).json({
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
// SETTORI
export async function getSettori(){
    const [result] = await db.query(`SELECT idSettore AS "id", idSettore AS "nome" FROM Settori`,[]);
    return result;
}




export async function handleGetSettori(req, res) {
    try {
        // risposta del server ha avuto successo
        const settori = await getSettori();
        return res.status(200).json({
            success: true,
            data: settori
        });
    } catch (error) {
        // errore generale interno al server
        return res.status(500).json({
            success: false,
            message: "Si è verificato un errore durante il recupero dei settori.",
            error: error.message || error
        });
    }
    
}