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





export async function handleAddBollino(req, res) {
    const { erogato, richiesta } = req.body;
    const id =  uuidv4();

    try {
        // risposta avvenuta con successo
        // controllo che la richiesta rispetti le regole per l'erogazione del bollino
        const resultRegole = await checkRegole(richiesta);
        const objRichiesta = await getRichiesta(richiesta);
        const checkFinal = resultRegole.regole.filter((regola) => regola.check == false);
        if(checkFinal.length == 0 && resultRegole.anvur && objRichiesta.stato === 'Elaborazione'){
            // creo un nuovo bollino
            const result = await addBollino(id, erogato, richiesta);
            if(result)
                return res.status(204).json({
                    success: true,
                });
            else 
                return res.status(500).json({
                    success: false,
                    message: "Si è verificato un errore durante l'elaborazione della richiesta",
                });
        }
        return res.status(400).json({
            success: false,
            message: "Si è verificato un errore durante l'elaborazione della richiesta"
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
export async function handleBollini(req, res) {
    try {
        // risposta con successo
        const result = await getBollini();
        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        // errore generale interno al server
        return res.status(500).json({
            success: false,
            message: "Si è verificato un errore durante il recupero dei bollini.",
            error: error.message || error
        });
        
    }
}