import { db } from "../database.js";

export async function getBollini(presidente) {
    const queryBollini = `
        SELECT Bollini.idBollino AS "id", Bollini.Erogato AS "erogato", Regolamenti.AnnoAccademico AS "annoaccademico", CorsiDiStudio.Nome AS "corsodistudio", Bollini.Richiesta AS "richiesta"
        FROM Bollini, Richieste, Regolamenti, CorsiDiStudio
        WHERE idRichiesta = Richiesta AND idRegolamento = Regolamento AND idCDS = CDS AND Presidente = ? `;
    const [result] = await db.query(queryBollini, [presidente]);
    return result;
}

export async function handleGetBolliniPerPresidente(req, res) {
    const presidente = req.user.userId;
    try {
        // risposta con successo
        const result = await getBollini(presidente);
        return res.status(200).json({ 
            message: "Elenco dei bollini",
            data: result
        });
    } catch (error) {
        // errore generale interno al server
        return res.status(500).json({
            message: "Si è verificato un errore durante l'elaborazione della richiesta.",
            error: error.message || error
        });
    }
    
}