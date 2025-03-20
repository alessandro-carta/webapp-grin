import { db } from "./database.js"; 



export async function getRichieste(){
    const queryRichieste = `
        SELECT Richieste.idRichiesta AS "id", Richieste.Data AS "data", Richieste.Stato AS "stato", Presidenti.Universita AS "università", Presidenti.Email AS "email", CorsiDiStudio.Nome AS "corsodistudio", Regolamenti.AnnoAccademico AS "annoaccademico", Regolamenti.idRegolamento AS "regolamento"
        FROM Richieste, Regolamenti, CorsiDiStudio, Presidenti
        WHERE Regolamento = idRegolamento AND CDS = idCDS AND Presidente = idPresidente AND Stato <> "Bozza"`;
    const [result] = await db.query(queryRichieste);
    return result;
}
export async function getRichiesta(id){
    const queryRichiesta = `
        SELECT Regolamenti.idRegolamento AS "regolamento", CorsiDiStudio.Nome AS "corsodistudio", Richieste.idRichiesta AS "id", Richieste.Data AS "data", Richieste.Stato AS "stato", Regolamenti.AnnoAccademico AS "annoaccademico", Presidenti.Universita AS "università", Presidenti.Email AS "email", CorsiDiStudio.AnnoDurata AS "duratacorso", Regolamenti.Anvur AS "anvur"
        FROM Richieste, Regolamenti, CorsiDiStudio, Presidenti
        WHERE Regolamento = idRegolamento AND CDS = idCDS AND Presidente = idPresidente AND idRichiesta = ? `;
    const [result] = await db.query(queryRichiesta, [id]);
    return result[0];
}
export async function updateRichiesta(id, stato) {
    const [result] = await db.query(`UPDATE Richieste SET Stato = ? WHERE idRichiesta = ?`, [stato, id]);
    return result;
}

export async function getInsegnamenti(regolamento){
    const queryInsegnamenti = `
        SELECT Insegnamenti.idInsegnamento AS "id", Insegnamenti.Nome AS "nome", Insegnamenti.AnnoErogazione AS "annoerogazione", Insegnamenti.Settore AS "settore", Insegnamenti.Ore AS "oretot"
        FROM Regolamenti, Insegnamenti
        WHERE idRegolamento = Regolamento AND idRegolamento = ? `;
    const [result] = await db.query(queryInsegnamenti, [regolamento]);
    return result;
}
export async function getInsegnamentoSottoaree(id){
    const querySottoaree = `
        SELECT Sottoaree.idSottoarea AS "id", Sottoaree.Area AS "area", Sottoaree.Nome AS "nome", InsegnamentiSottoaree.Ore AS "ore"
        FROM Insegnamenti, InsegnamentiSottoaree, Sottoaree
        WHERE idInsegnamento = Insegnamento AND idSottoarea = Sottoarea AND idInsegnamento = ? `;
    const [result] = await db.query(querySottoaree, [id]);
    return result;
}
export async function getInsegnamentiFull(regolamento) {
    // contiene l'elenco degli insegnamenti
    // per ogni insegnamento l'elenco delle sottoaree con le ore
    let insegnamentiFull = []; 
    const insegnamenti = await getInsegnamenti(regolamento);
    for(let insegnamento of insegnamenti){
        const sottoaree = await getInsegnamentoSottoaree(insegnamento.id);
        insegnamentiFull.push({...insegnamento, sottoaree: sottoaree});
    }
    return insegnamentiFull;
}

export async function getRegolamento(id) {
    const [result] = await db.query(`
        SELECT CorsiDiStudio.idCDS AS "cds", Regolamenti.idRegolamento AS "id", Regolamenti.AnnoAccademico AS "annoaccademico", CorsiDiStudio.Nome AS "corsodistudio", CorsiDiStudio.AnnoDurata AS "duratacorso", Regolamenti.Anvur AS "anvur", CorsiDiStudio.Presidente AS "presidente", Richieste.idRichiesta AS "richiesta", Richieste.Stato AS "stato", Presidenti.Email AS "email", Presidenti.Universita AS "università"
        FROM Regolamenti JOIN CorsiDiStudio ON Regolamenti.CDS = CorsiDiStudio.idCDS JOIN Presidenti ON CorsiDiStudio.Presidente = Presidenti.idPresidente LEFT JOIN Richieste ON Richieste.Regolamento = Regolamenti.idRegolamento
        WHERE Regolamenti.idRegolamento = ?`, [id]);
    return result[0];
}




export async function handleGetRichieste(req, res) {
    try {
        // risposta con successo
        const richieste = await getRichieste();
        return res.status(200).json({
            message: "Elenco delle richieste",
            data: richieste
        });
    } catch (error) {
        // errore generale interno al server
        return res.status(500).json({
            message: "Si è verificato un errore durante il recupero delle richieste .",
            error: error.message || error
        });
        
    }
}
export async function handleGeRegolamentoAdmin(req, res) {
    const id = req.params.idRegolamento;
    try {
        // risposta con successo
        const regolamento = await getRegolamento(id);
        if(regolamento == null) return res.status(404).json({ message: "Regolamento non trovato" });
        return res.status(200).json({
            message: "Regolamento",
            data: regolamento
        });
    } catch (error) {
        // errore generale interno al server
        console.log(error);
        return res.status(500).json({
            message: "Si è verificato un errore durante il recupero della richiesta .",
            error: error.message || error
        });
    } 
}
export async function handleGetInsegnamenti(req, res) {
    const regolamento = req.params.idRegolamento;
    try {
        // risposta con successo
        const insegnamenti = await getInsegnamentiFull(regolamento);
        return res.status(200).json({
            message: "Elenco insegnamenti",
            data: insegnamenti
        });
    } catch (error) {
        // errore generale interno al server
        return res.status(500).json({
            message: "Si è verificato un errore durante il recupero degli insegnamenti.",
            error: error.message || error
        });
    }
}
export async function handleInvalidRichiesta(req, res) {
    const { id } = req.body;
    try {
        // risposta con successo
        const richiesta = await getRichiesta(id);
        if(richiesta == null) return res.status(404).json({ message: "Richiesta non trovata" });
        if(richiesta.stato == 'Elaborazione'){
            const result = await updateRichiesta(id, 'Invalidata');
            return res.status(204).json({
                message: "Richiesta invalidata",
                data: id
            });
        }
        return res.status(400).json({
            message: "Non è stato possibile accettare la modifica, dati errati",
        });
    } catch (error) {
        // errore generale interno al server
        return res.status(500).json({
            message: "Si è verificato un errore durante l'elaborazione della richiesta.",
            error: error.message || error
        });
    }
}
