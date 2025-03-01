import { checkRegole } from "./CheckRichiesta.js";
import { db } from "./database.js";
import { v4 as uuidv4 } from 'uuid';
import { getRichiesta } from "./Richieste.js";

export async function addBollino(id, erogato, richiesta) {
    // garantisco atomicità tramite l'uso di una transazione
    try {
        await db.beginTransaction();
        const queryBollino = 'INSERT INTO Bollini (idBollino, Erogato, Richiesta) VALUES (?, ?, ?)';
        await db.query(queryBollino, [id, erogato, richiesta]);
        const queryRichiesta = `UPDATE Richieste SET Stato = "Approvata" WHERE idRichiesta = ?`;
        await db.query(queryRichiesta, [richiesta]);
        await db.commit();
        return {ok: true, error: ""};
    } catch (error) {
        // transazione fallita
        await db.rollback();
        return {ok: false, error: error};
    }
}
export async function getBollini() {
    const queryBollini = `
        SELECT Bollini.Richiesta AS "richiesta", Bollini.idBollino AS "id", Bollini.Erogato AS "erogato", Regolamenti.AnnoAccademico AS "annoaccademico", CorsiDiStudio.Nome AS "corsodistudio", Presidenti.Università AS "università", Regolamenti.idRegolamento AS "regolamento"
        FROM Bollini, Richieste, Regolamenti, CorsiDiStudio, Presidenti
        WHERE idRichiesta = Richiesta AND idRegolamento = Regolamento AND idCDS = CDS AND idPresidente = Presidente `;
    const [result] = await db.query(queryBollini);
    return result;
}
export async function getBolliniPublic() {
    const queryBollini = `
        SELECT Bollini.idBollino AS "id", Regolamenti.AnnoAccademico AS "annoaccademico", CorsiDiStudio.Nome AS "corsodistudio", Presidenti.Università AS "università"
        FROM Bollini, Richieste, Regolamenti, CorsiDiStudio, Presidenti
        WHERE idRichiesta = Richiesta AND idRegolamento = Regolamento AND idCDS = CDS AND idPresidente = Presidente AND Erogato = 1`;
    const [result] = await db.query(queryBollini);
    return result;
}
export async function getBollino(id) {
    const queryBollini = `
        SELECT Bollini.Richiesta AS "richiesta", Bollini.idBollino AS "id", Bollini.Erogato AS "erogato"
        FROM Bollini, Richieste
        WHERE idRichiesta = Richiesta AND idBollino = ?`;
    const [result] = await db.query(queryBollini, [id]);
    return result[0];
}
export async function getBollinoRichiesta(id) {
    const queryBollini = `
        SELECT Bollini.idBollino AS "id", Bollini.Erogato AS "erogato"
        FROM Bollini, Richieste
        WHERE idRichiesta = Richiesta AND idRichiesta = ?`;
    const [result] = await db.query(queryBollini, [id]);
    return result[0];
}
export async function updateBollino(id, erogato) {
    try {
        // garantisco atomicità tramite l'uso di una transazione
        await db.beginTransaction();
        const bollino = await getBollino(id);
        if(bollino == null) {
            await db.rollback();
            return {ok: false, error: "Bollino non trovato"}
        }
        let queryRichiesta;
        if(erogato == 0) queryRichiesta = `UPDATE Richieste SET Stato = "Invalidata" WHERE idRichiesta = ?`;
        if(erogato == 1) queryRichiesta = `UPDATE Richieste SET Stato = "Approvata" WHERE idRichiesta = ?`;
        await db.query(`UPDATE Bollini SET Erogato = ? WHERE idBollino = ?`, [erogato, id]);
        await db.query(queryRichiesta, [bollino.richiesta]);
        await db.commit();
        return {ok: true, error: null}
    } catch (err) {
        // transazione fallita
        await db.rollback();
        return {result: false, error: err}
    }
}





export async function handleAddBollino(req, res) {
    const { erogato, richiesta } = req.body;
    const id =  uuidv4();

    try {
        // risposta avvenuta con successo
        // controllo che la richiesta rispetti le regole per l'erogazione del bollino
        const objRichiesta = await getRichiesta(richiesta);
        const resultRegole = await checkRegole(objRichiesta.regolamento);
        const checkFinal = resultRegole.regole.filter((regola) => regola.check == false);
        if(checkFinal.length == 0 && resultRegole.anvur && objRichiesta.stato === 'Elaborazione'){
            // creo un nuovo bollino
            const result = await addBollino(id, erogato, richiesta);
            if(result.ok)
                return res.status(201).json({
                    message: "Bollino creato con successo",
                    data: id
                });
            else 
                return res.status(500).json({
                    message: "Si è verificato un errore durante l'elaborazione della richiesta",
                    error: result.error
                });
        }
        return res.status(400).json({
            message: "Non può essere erogato il bollino"
        });
    } catch (error) {
        // errore generale interno al server
        return res.status(500).json({
            message: "Si è verificato un errore durante l'elaborazione della richiesta",
            error: error.message || error
        });
    }
    
}
export async function handleBollini(req, res) {
    try {
        // risposta con successo
        const result = await getBollini();
        return res.status(200).json({
            message: "Elenco dei bollini",
            data: result
        });
    } catch (error) {
        // errore generale interno al server
        return res.status(500).json({
            message: "Si è verificato un errore durante il recupero dei bollini.",
            error: error.message || error
        });
        
    }
}
export async function handleBollinoRichiesta(req, res) {
    const richiesta = req.params.idRichiesta;
    try {
        // risposta con successo
        const result = await getBollinoRichiesta(richiesta);
        return res.status(200).json({
            message: "Bollino",
            data: result
        });
    } catch (error) {
        // errore generale interno al server
        return res.status(500).json({
            message: "Si è verificato un errore durante il recupero dei bollini.",
            error: error.message || error
        });
        
    }
}
export async function handleInvalidBollino(req, res) {
    const { id } = req.body;
    try {
        const result = await updateBollino(id, 0);
        if(!result.ok) return res.status(404).json({ message: "Impossibile revocare bollino" });
        // modifica avvenuta con successo
        return res.status(204).json({ });
    } catch (error) {
        // errore generale interno al server
        return res.status(500).json({
            message: "Si è verificato un errore durante l'elaborazione della richiesta",
            error: error.message || error
        });
    }
    
}
export async function handleActiveBollino(req, res) {
    const { id } = req.body;
    try {
        const result = await updateBollino(id, 1);
        if(!result.ok) return res.status(404).json({ message: "Impossibile riattivare il bollino" });
        // modifica avvenuta con successo
        return res.status(204).json({ });
    } catch (error) {
        // errore generale interno al server
        return res.status(500).json({
            message: "Si è verificato un errore durante l'elaborazione della richiesta",
            error: error.message || error
        });
    }
    
}
export async function handleBolliniPublic(req, res) {
    try {
        // risposta con successo
        const result = await getBolliniPublic();
        return res.status(200).json({
            message: "Elenco dei bollini",
            data: result
        });
    } catch (error) {
        // errore generale interno al server
        return res.status(500).json({
            message: "Si è verificato un errore durante il recupero dei bollini.",
            error: error.message || error
        });
        
    }
}