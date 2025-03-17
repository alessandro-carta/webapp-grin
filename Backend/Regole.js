import { db } from "./database.js";
import { v4 as uuidv4 } from 'uuid';


export async function addRegola(id, descrizione, ore, centrale, tipologia, selezioni) {
    // garantisco atomicità tramite l'uso di una transazione che:
    // inserisce il record in Regole
    // inserisce k record nella tarella Regole* a seconda della tipologia della regola
    try {
        await db.beginTransaction();
        if(selezioni.length == 0) return {ok: false, error: "Selezioni obbligatorie"};
        const queryRegola = 'INSERT INTO Regole (idRegola, Descrizione, Ore, Centrale, Tipologia) VALUES (?, ?, ?, ?, ?)';
        await db.query(queryRegola, [id, descrizione, ore, centrale, tipologia]);
        let querySelezioni;
        if(tipologia === 'area') querySelezioni = 'INSERT INTO RegoleAree (Regola, Area) VALUES ?';
        if(tipologia === 'sottoarea') querySelezioni = 'INSERT INTO RegoleSottoaree (Regola, Sottoarea) VALUES ?';
        if(tipologia === 'settore') querySelezioni = 'INSERT INTO RegoleSettori (Regola, Settore) VALUES ?';
        const valoriSelezioni = selezioni.map(selezione => [id, selezione]);
        await db.query(querySelezioni, [valoriSelezioni]);
        await db.commit();
        return {ok: true, error: ""};
    } catch (error) {
        // transazione fallita
        await db.rollback();
        return {ok: false, error: error};;
    } 
}
export async function getRegole(){
    const [result] = await db.query(`
        SELECT idRegola AS "id", Descrizione AS "descrizione", Tipologia AS "tipologia", Ore AS "ore", Centrale AS "centrale"
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
    let { descrizione, ore, centrale, tipologia, selezioni } = req.body;
    const id = uuidv4();
    const result = await addRegola(id, descrizione, cfu, ore, centrale, tipologia, selezioni, count);
    if(result.ok){
        // risposta avvenuta con successo
        return res.status(201).json({ 
            message: "Regola creata con successo",
            data: id
        });
    } else{
        // errore durante l'esecuzione
        return res.status(500).json({
            message: "Si è verificato un errore durante l'eleborazione della richiesta.",
            error: result.error
        });
    }
    
}
export async function handleGetRegole(req, res) {
    try {
        // risposta con successo
        const regole = await getRegole();
        return res.status(200).json({
            message: "Elenco delle regole",
            data: regole
        });
    } catch (error) {
        console.log(error);
        // errore generale interno al server
        return res.status(500).json({
            message: "Si è verificato un errore durante il recupero delle regole .",
            error: error.message || error
        });
    } 
}
export async function handleDeleteRegola(req, res) {
    const id  = req.params.idRegola;
    try {
        const result = await deleteRegola(id);
        if(result.affectedRows == 0){
            return res.status(404).json({
                message: "Regola non trovata"
            });
        }
        // eliminazione avvenuta con successo
        return res.status(204).json({ });
    } catch (error) {
        // errore generale interno al server
        return res.status(500).json({
            message: "Si è verificato un errore durante l'elaborazione della richiesta",
            error: error.message || error
        });
    }
}