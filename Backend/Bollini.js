import { db } from "./database.js";

export async function addBollino(idBollino, Erogato, Richiesta) {
    // garantisco atomicità tramite l'uso di una transazione
    try {
        await db.beginTransaction();

        const queryBollino = 'INSERT INTO Bollini (idBollino, Erogato, Richiesta) VALUES (?, ?, ?)';
        await db.query(queryBollino, [idBollino, Erogato, Richiesta]);
        const queryRichiesta = `UPDATE Richieste SET Stato = "Approvata" WHERE idRichiesta = ?`;
        await db.query(queryRichiesta, [Richiesta]);

        await db.commit();
        return true;
    } catch (error) {
        // transazione fallita
        await db.rollback();
        return false;
    }
}


export async function getBollini() {
    const queryBollini = `
    SELECT Bollini.Richiesta AS "richiesta", Bollini.idBollino AS "id", Bollini.Erogato AS "erogato", Regolamenti.AnnoAccademico AS "annoaccademico", CorsiDiStudio.Nome AS "corsodistudio", Presidenti.Università AS "università"
    FROM Bollini, Richieste, Regolamenti, CorsiDiStudio, Presidenti
    WHERE idRichiesta = Richiesta AND idRegolamento = Regolamento AND idCDS = CDS AND idPresidente = Presidente `;
    const [result] = await db.query(queryBollini);
    return result;
}