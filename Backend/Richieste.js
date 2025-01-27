import { db } from "./database.js";
import { getRegole, getRegoleFull } from "./Regolamento.js";

export async function getRichieste(){
    const queryRichieste = `
        SELECT Richieste.idRichiesta, Richieste.Data, Richieste.Stato, Presidenti.Università, Presidenti.Email
        FROM Richieste, Regolamenti, CorsiDiStudio, Presidenti
        WHERE Regolamento = idRegolamento AND CDS = idCDS AND Presidente = idPresidente `;
    const [result] = await db.query(queryRichieste);
    return result;

}

export async function getRichiesta(id){
    const queryRichiesta = `
        SELECT Regolamenti.idRegolamento, CorsiDiStudio.Nome, Richieste.idRichiesta, Richieste.Data, Richieste.Stato, Regolamenti.AnnoAccademico, Presidenti.Università, Presidenti.Email, CorsiDiStudio.AnnoDurata
        FROM Richieste, Regolamenti, CorsiDiStudio, Presidenti
        WHERE Regolamento = idRegolamento AND CDS = idCDS AND Presidente = idPresidente AND idRichiesta = ? `;
    const [result] = await db.query(queryRichiesta, [id]);
    return result[0];

}

export async function getInsegnamenti(id){
    const queryInsegnamenti = `
        SELECT Insegnamenti.idInsegnamento, Insegnamenti.Nome, Insegnamenti.AnnoErogazione, Insegnamenti.CFU, Insegnamenti.Settore
        FROM Regolamenti, Insegnamenti, InsegnamentiRegolamenti
        WHERE idRegolamento = Regolamento AND idInsegnamento = Insegnamento AND idRegolamento = ? `;
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

function checkAree(insegnamenti, riferimenti, CFU){
    let totCFU = 0;
    for(let insegnamento of insegnamenti){
        for(let sottoarea of insegnamento.Sottoaree){
            if(riferimenti.includes(sottoarea.Area)){
                totCFU += sottoarea.CFU;
            }
        }
    }
    return totCFU >= CFU;
}
function checkSottoaree(insegnamenti, riferimenti, CFU){
    let totCFU = 0;
    for(let insegnamento of insegnamenti){
        for(let sottoarea of insegnamento.Sottoaree){
            if(riferimenti.includes(sottoarea.idSottoarea)){
                totCFU += sottoarea.CFU;
            }
        }
    }
    return totCFU >= CFU;
}
function checkSettori(insegnamenti, riferimenti, CFU){
    let totCFU = 0;
    for(let insegnamento of insegnamenti){
        if(riferimenti.includes(insegnamento.Settore)){
            totCFU += insegnamento.CFU;
        }
    }
    return totCFU >= CFU;
}
export async function checkRegole(id){
    const regole = await getRegoleFull();
    const insegnamenti = await getInsegnamentiFull(id);
    let result = [];
    for(let regola of regole){
        if(regola.Tipologia === 'area'){ 
            // check su aree
            const riferimenti = regola.Riferimenti;
            const aree = riferimenti.map(item => item.Area);
            result.push({...regola, Check: checkAree(insegnamenti, aree, regola.CFU)});
        }
        if(regola.Tipologia === 'sottoarea'){
            // check su sottoaree
            const riferimenti = regola.Riferimenti;
            const sottoaree = riferimenti.map(item => item.Sottoarea);
            result.push({...regola, Check: checkSottoaree(insegnamenti, sottoaree, regola.CFU)}); 
        }
        if(regola.Tipologia === 'settore'){
            const riferimenti = regola.Riferimenti;
            const settori = riferimenti.map(item => item.Settore);
            // check su settori 
            result.push({...regola, Check: checkSettori(insegnamenti, settori, regola.CFU)});
        }
             
    }
    return result;
}