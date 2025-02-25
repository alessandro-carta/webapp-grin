import { getRegolamento } from "./dashboard/RegolamentiCDS.js";
import { db } from "./database.js";
import { getRegoleFull } from "./Regole.js";

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



export async function checkRegole(regolamento){
    const regole = await getRegoleFull(); // insieme delle regole
    const objRegolamento = await getRegolamento(regolamento);    
    if(objRegolamento == null) throw {message: "Regolamento non trovata", code: 404};
    let result = {anvur: objRegolamento.anvur ? true : false, regole: []};

    for(let regola of regole){
        // regola per numero
        let resObj;
        if(regola.count != null) {
            // restituisce l'elenco delle aree coperte da un regolamento
            // e ogni area rispetta il numero minimo di CFU
            if(regola.tipologia === 'area') resObj = await CFUperArea(regolamento, regola.cfu);
            // restituisce l'elenco delle sottoaree coperte da un regolamento
            // e ogni sottoarea rispetta il numero minimo di CFU
            if(regola.tipologia === 'sottoarea') resObj = await CFUperSottoarea(regolamento, regola.cfu);
            // restituisce l'elenco delle aree coperte da un regolamento
            // e ogni area rispetta il numero minimo di CFU
            if(regola.tipologia === 'settore') resObj = await CFUperSettore(regolamento, regola.cfu);

            const resValues = resObj.map(r => r.id);
            const regValues = regola.riferimenti.map(r => r.id);
            // intersezioni tra i due array
            const intersection = resValues.filter(item => regValues.includes(item));
            // la lunghezza dell'intersezione deve essere almeno pari a regola.Count
            result.regole.push({...regola, check: intersection.length >= regola.count});
        }
        // regola per CFU
        else{
            let sumCFU = 0; // accumulatore per il totale dei CFU
            let resObj;
            if(regola.tipologia === 'area') resObj = await CFUperArea(regolamento, 0);
            if(regola.tipologia === 'sottoarea') resObj = await CFUperSottoarea(regolamento, 0);
            if(regola.tipologia === 'settore') resObj = await CFUperSettore(regolamento, 0);

            const regValues = regola.riferimenti.map(r => r.id);
            resObj.map((obj) => { if(regValues.includes(obj.id)) sumCFU += parseInt(obj.CFUTot); });
            // la somma dei CFU della richiesta deve essere almeno pari ai CFU della regola
            result.regole.push({...regola, check: sumCFU >= regola.cfu});
        }
    }
    return result;
}

export async function handleCheckRegole(req, res) {
    const regolamento = req.params.idRegolamento;
    try {
        // risposta con successo
        const result = await checkRegole(regolamento);
        return res.status(200).json({
            message: "Risultato controllo regole",
            data: result
        });
    } catch (error) {
        if(error.code == 404){
            return res.status(404).json({
                message: "Regolamento non trovato",
                error: error.message || error
            });
        }
        // errore generale interno al server
        return res.status(500).json({
            message: "Si è verificato un errore durante il recupero della richiesta .",
            error: error.message || error
        });
    }
}