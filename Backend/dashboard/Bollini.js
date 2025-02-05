import jwt from 'jsonwebtoken';
import { keyJwt } from '../Config.js';
import { db } from "../database.js";

export async function getBollini(presidente) {
    const queryBollini = `
        SELECT Bollini.idBollino AS "id", Bollini.Erogato AS "erogato", Regolamenti.AnnoAccademico AS "annoaccademico", CorsiDiStudio.Nome AS "corsodistudio", Regolamenti.idRegolamento AS "regolamento"
        FROM Bollini, Richieste, Regolamenti, CorsiDiStudio
        WHERE idRichiesta = Richiesta AND idRegolamento = Regolamento AND idCDS = CDS AND Presidente = ? `;
    const [result] = await db.query(queryBollini, [presidente]);
    return result;
}

export async function handleGetBolliniPerPresidente(req, res) {
    const token = req.headers['authorization']?.split(' ')[1];
    // estrapolo id dal token se valido
    let presidente;
    jwt.verify(token, keyJwt, (err, user) => {
        if (err) return res.status(403).json({ 
            success: false,
            error: 'Token non valido' 
        });
        presidente = user.userId;
    });
    try {
        // risposta con successo
        const result = await getBollini(presidente);
        return res.status(200).json({ 
            success: true,
            data: result
        });
    } catch (error) {
        // errore generale interno al server
        return res.status(500).json({
            success: false,
            message: "Si è verificato un errore durante l'elaborazione della richiesta.",
            error: error.message || error
        });
    }
    
}