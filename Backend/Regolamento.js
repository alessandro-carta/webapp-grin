import { db } from "./database.js";

export async function addRegola(idRegola, Descrizione, CFU, Tipologia, Selezioni, Count) {
    // garantisco atomicità tramite l'uso di una transazione che:
    // inserisce il record in Regole
    // inserisce k record nella tarella Regole* a seconda della tipologia della regola
    try {
        await db.beginTransaction();

        const queryRegola = 'INSERT INTO Regole (idRegola, Descrizione, CFU, Tipologia, Count) VALUES (?, ?, ?, ?, ?)';
        await db.query(queryRegola, [idRegola, Descrizione, CFU, Tipologia, Count]);

        let querySelezioni;
        if(Tipologia === 'area') querySelezioni = 'INSERT INTO RegoleAree (Regola, Area) VALUES ?';
        if(Tipologia === 'sottoarea') querySelezioni = 'INSERT INTO RegoleSottoaree (Regola, Sottoarea) VALUES ?';
        if(Tipologia === 'settore') querySelezioni = 'INSERT INTO RegoleSettori (Regola, Settore) VALUES ?';
        const valoriSelezioni = Selezioni.map(id => [idRegola, id]);
        await db.query(querySelezioni, [valoriSelezioni]);

        await db.commit();
        return true;
    } catch (error) {
        // transazione fallita
        console.log(error);
        await db.rollback();
        return false;
    }

    
}

export async function getRegole(){
    const [result] = await db.query("SELECT * FROM Regole");
    return result;
}
export async function getRegoleFull(){
    // contiene tutte le regole e per ogni regola anche l'elenco degli id delle
    // aree/sottoaree/settori a seconda della tipologia della regole
    let regoleFull = [];
    const regole = await getRegole();
    let queryRegole;
    for (let regola of regole){
        if(regola.Tipologia === 'area') 
            queryRegole = `
                SELECT RegoleAree.Area AS "id"
                FROM Regole, RegoleAree
                WHERE idRegola = Regola AND idRegola = ?`;
        if(regola.Tipologia === 'sottoarea') 
            queryRegole = `
                SELECT RegoleSottoaree.Sottoarea AS "id"
                FROM Regole, RegoleSottoaree
                WHERE idRegola = Regola AND idRegola = ?`;
        if(regola.Tipologia === 'settore') 
            queryRegole = `
                SELECT RegoleSettori.Settore AS "id"
                FROM Regole, RegoleSettori
                WHERE idRegola = Regola AND idRegola = ?`;
        // eseguo la query
        const [result] = await db.query(queryRegole, [regola.idRegola]);
        regoleFull.push({...regola, Riferimenti: result});
    }
    return regoleFull;
}

export async function deleteRegola(id) {
    const [result] = await db.query('DELETE FROM Regole WHERE idRegola = ?',[id]);
    return result
}