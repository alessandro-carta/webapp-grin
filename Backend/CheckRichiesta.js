import { db } from "./database.js";
import { getRegoleFull } from "./Regolamento.js";
import { getRichiesta } from "./Richieste.js";

export async function CFUperArea(idRegolamento, minCFUperArea) {
    const query = `
        SELECT Aree.idArea AS "id", SUM(InsegnamentiSottoaree.CFU) AS "CFUTot"
        FROM Regolamenti, Insegnamenti, InsegnamentiSottoaree, Sottoaree, Aree
        WHERE idRegolamento = Regolamento AND idInsegnamento = Insegnamento AND idSottoarea = Sottoarea AND idArea = Area AND idRegolamento = ?
        GROUP BY Aree.idArea
        HAVING SUM(InsegnamentiSottoaree.CFU) >= ? `;
    const [result] = await db.query(query, [idRegolamento, minCFUperArea]);
    return result;
}
export async function CFUperSottoarea(idRegolamento, minCFUperSottoarea) {
    const query = `
        SELECT Sottoaree.idSottoarea AS "id", SUM(InsegnamentiSottoaree.CFU) AS "CFUTot"
        FROM Regolamenti, Insegnamenti, InsegnamentiSottoaree, Sottoaree
        WHERE idRegolamento = Regolamento AND idInsegnamento = Insegnamento AND idSottoarea = Sottoarea AND idRegolamento = ?
        GROUP BY Sottoaree.idSottoarea
        HAVING SUM(InsegnamentiSottoaree.CFU) >= ? `;
    const [result] = await db.query(query, [idRegolamento, minCFUperSottoarea]);
    return result;
}
export async function CFUperSettore(idRegolamento, minCFUperSettore) {
    const query = `
        SELECT Insegnamenti.Settore AS "id", SUM(Insegnamenti.CFU) AS "CFUTot"
        FROM Regolamenti, Insegnamenti
        WHERE idRegolamento = Regolamento AND idRegolamento = ?
        GROUP BY Insegnamenti.Settore
        HAVING SUM(Insegnamenti.CFU) >= ? `;
    const [result] = await db.query(query, [idRegolamento, minCFUperSettore]);
    return result;
}



export async function checkRegole(idRichiesta){
    const regole = await getRegoleFull(); // insieme delle regole
    // controllo per ANVUR
    const richiesta = await getRichiesta(idRichiesta);
    const id = richiesta.idRegolamento;
    let result = {Anvur: richiesta.Anvur ? true : false, Regole: []};

    for(let regola of regole){
        // regola per numero
        let resObj;
        if(regola.Count != null) {
            // restituisce l'elenco delle aree coperte da un regolamento
            // e ogni area rispetta il numero minimo di CFU
            if(regola.Tipologia === 'area') resObj = await CFUperArea(id,regola.CFU);
            // restituisce l'elenco delle sottoaree coperte da un regolamento
            // e ogni sottoarea rispetta il numero minimo di CFU
            if(regola.Tipologia === 'sottoarea') resObj = await CFUperSottoarea(id,regola.CFU);
            // restituisce l'elenco delle aree coperte da un regolamento
            // e ogni area rispetta il numero minimo di CFU
            if(regola.Tipologia === 'settore') resObj = await CFUperSettore(id,regola.CFU);

            const resValues = resObj.map(r => r.id);
            const regValues = regola.Riferimenti.map(r => r.id);
            // intersezioni tra i due array
            const intersection = resValues.filter(item => regValues.includes(item));
            // la lunghezza dell'intersezione deve essere almeno pari a regola.Count
            result.Regole.push({...regola, Check: intersection.length >= regola.Count});
        }
        // regola per CFU
        else{
            let sumCFU = 0; // accumulatore per il totale dei CFU
            let resObj;
            if(regola.Tipologia === 'area') resObj = await CFUperArea(id,0);
            if(regola.Tipologia === 'sottoarea') resObj = await CFUperSottoarea(id,0);
            if(regola.Tipologia === 'settore') resObj = await CFUperSettore(id,0);

            const regValues = regola.Riferimenti.map(r => r.id);
            resObj.map((obj) => { if(regValues.includes(obj.id)) sumCFU += parseInt(obj.CFUTot); });
            // la somma dei CFU della richiesta deve essere almeno pari ai CFU della regola
            result.Regole.push({...regola, Check: sumCFU >= regola.CFU});
        }
    }
    return result;
}
