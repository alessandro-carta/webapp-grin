import { db } from "./database.js";



export async function getRichieste(){
    const queryRichieste = `
        SELECT Richieste.idRichiesta, Richieste.Data, Richieste.Stato, Presidenti.Università, Presidenti.Email, CorsiDiStudio.Nome, Regolamenti.AnnoAccademico
        FROM Richieste, Regolamenti, CorsiDiStudio, Presidenti
        WHERE Regolamento = idRegolamento AND CDS = idCDS AND Presidente = idPresidente `;
    const [result] = await db.query(queryRichieste);
    return result;

}
export async function getRichiesta(idRichiesta){
    const queryRichiesta = `
        SELECT Regolamenti.idRegolamento, CorsiDiStudio.Nome, Richieste.idRichiesta, Richieste.Data, Richieste.Stato, Regolamenti.AnnoAccademico, Presidenti.Università, Presidenti.Email, CorsiDiStudio.AnnoDurata, Regolamenti.Anvur
        FROM Richieste, Regolamenti, CorsiDiStudio, Presidenti
        WHERE Regolamento = idRegolamento AND CDS = idCDS AND Presidente = idPresidente AND idRichiesta = ? `;
    const [result] = await db.query(queryRichiesta, [idRichiesta]);
    return result[0];

}






export async function getInsegnamenti(id){
    const queryInsegnamenti = `
        SELECT Insegnamenti.idInsegnamento, Insegnamenti.Nome, Insegnamenti.AnnoErogazione, Insegnamenti.CFU, Insegnamenti.Settore
        FROM Regolamenti, Insegnamenti
        WHERE idRegolamento = Regolamento AND idRegolamento = ? `;
    const [result] = await db.query(queryInsegnamenti, [id]);
    return result;

}
export async function getInsegnamentoSottoaree(id){
    const querySottoaree = `
        SELECT Sottoaree.idSottoarea, Sottoaree.Area, Sottoaree.Nome, InsegnamentiSottoaree.CFU
        FROM Insegnamenti, InsegnamentiSottoaree, Sottoaree
        WHERE idInsegnamento = Insegnamento AND idSottoarea = Sottoarea AND idInsegnamento = ? `;
    const [result] = await db.query(querySottoaree, [id]);
    return result;

}
export async function getInsegnamentiFull(id) {
    // contiene l'elenco degli insegnamenti
    // per ogni insegnamento l'elenco delle sottoaree con cfu
    let insegnamentiFull = []; 
    const insegnamenti = await getInsegnamenti(id);
    for(let insegnamento of insegnamenti){
        const sottoaree = await getInsegnamentoSottoaree(insegnamento.idInsegnamento);
        insegnamentiFull.push({...insegnamento, Sottoaree: sottoaree});
    }
    return insegnamentiFull;
}

