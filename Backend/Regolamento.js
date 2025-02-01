import { db } from "./database.js";

export async function addRegola(id, descrizione, cfu, tipologia, selezioni, count) {
    // garantisco atomicità tramite l'uso di una transazione che:
    // inserisce il record in Regole
    // inserisce k record nella tarella Regole* a seconda della tipologia della regola
    try {
        await db.beginTransaction();
        const queryRegola = 'INSERT INTO Regole (idRegola, Descrizione, CFU, Tipologia, Count) VALUES (?, ?, ?, ?, ?)';
        await db.query(queryRegola, [id, descrizione, cfu, tipologia, count]);
        let querySelezioni;
        if(tipologia === 'area') querySelezioni = 'INSERT INTO RegoleAree (Regola, Area) VALUES ?';
        if(tipologia === 'sottoarea') querySelezioni = 'INSERT INTO RegoleSottoaree (Regola, Sottoarea) VALUES ?';
        if(tipologia === 'settore') querySelezioni = 'INSERT INTO RegoleSettori (Regola, Settore) VALUES ?';
        const valoriSelezioni = selezioni.map(selezione => [id, selezione]);
        await db.query(querySelezioni, [valoriSelezioni]);
        await db.commit();
        return true;
    } catch (error) {
        // transazione fallita
        await db.rollback();
        return false;
    } 
}
export async function getRegole(){
    const [result] = await db.query(`
        SELECT idRegola AS "id", Descrizione AS "descrizione", CFU AS "cfu", Tipologia AS "tipologia", Count AS "count"
        FROM Regole` );
    return result;
}
export async function getRegoleFull(){
    // contiene tutte le regole e per ogni regola anche l'elenco degli id delle
    // aree/sottoaree/settori a seconda della tipologia della regole
    let regoleFull = [];
    const regole = await getRegole();
    let queryRegole;
    for (let regola of regole){
        if(regola.tipologia === 'area') 
            queryRegole = `
                SELECT RegoleAree.Area AS "id"
                FROM Regole, RegoleAree
                WHERE idRegola = Regola AND idRegola = ?`;
        if(regola.tipologia === 'sottoarea') 
            queryRegole = `
                SELECT RegoleSottoaree.Sottoarea AS "id"
                FROM Regole, RegoleSottoaree
                WHERE idRegola = Regola AND idRegola = ?`;
        if(regola.tipologia === 'settore') 
            queryRegole = `
                SELECT RegoleSettori.Settore AS "id"
                FROM Regole, RegoleSettori
                WHERE idRegola = Regola AND idRegola = ?`;
        // eseguo la query
        const [result] = await db.query(queryRegole, [regola.id]);
        regoleFull.push({...regola, riferimenti: result});
    }
    return regoleFull;
}

export async function deleteRegola(id) {
    const [result] = await db.query('DELETE FROM Regole WHERE idRegola = ?',[id]);
    return result
}





export async function handleAddRegola(req, res) {
    // selezioni contiene l'elenco degli id delle aree/sottoaree/settori
    let { id, descrizione, cfu, tipologia, selezioni, count } = req.body;
    if(cfu == 0) cfu = null;
    if(count == 0) count = null;
    const result = await addRegola(id, descrizione, cfu, tipologia, selezioni, count);
    if(result){
        // risposta avvenuta con successo
        return res.status(204).json({ success: true });
    } else{
        // errore durante l'esecuzione
        return res.status(500).json({
            success: false,
            message: "Si è verificato un errore durante l'eleborazione della richiesta.",
        });
    }
    
}
export async function handleGetRegole(req, res) {
    try {
        // risposta con successo
        // restituisco le regole
        const regole = await getRegole();
        return res.status(200).json({
            success: true,
            data: regole
        });
    } catch (error) {
        // errore generale interno al server
        return res.status(500).json({
            success: false,
            message: "Si è verificato un errore durante il recupero delle regole .",
            error: error.message || error
        });
    } 
}
export async function handleDeleteRegola(req, res) {
    const id  = req.params.idRegola;
    try {
        const result = await deleteRegola(id);
        // eliminazione avvenuta con successo
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