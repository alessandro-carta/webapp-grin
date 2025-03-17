import { getRegolamento } from "./dashboard/RegolamentiCDS.js";
import { db } from "./database.js";
import { getRegoleFull } from "./Regole.js";

// controlla la copertura delle selezione di un regolamento
export async function checkCopertura(idRegolamento, selezioni, tipoRegola) {
    let query;
    if(tipoRegola === "area") query = `
        SELECT DISTINCT idArea AS "id"
        FROM Regolamenti, Insegnamenti, InsegnamentiSottoaree, Sottoaree, Aree
        WHERE idRegolamento = Regolamento AND idInsegnamento = Insegnamento AND idSottoarea = Sottoarea AND idArea = Area AND idRegolamento = ? AND InsegnamentiSottoaree.Ore > 0`;
    if(tipoRegola === "sottoarea") query = `
        SELECT DISTINCT Sottoarea AS "id"
        FROM Regolamenti, Insegnamenti, InsegnamentiSottoaree
        WHERE idRegolamento = Regolamento AND idInsegnamento = Insegnamento AND idRegolamento = ? AND InsegnamentiSottoaree.Ore > 0`;
    if(tipoRegola === "settore") query = `
        SELECT DISTINCT Settore AS "id"
        FROM Regolamenti, Insegnamenti
        WHERE idRegolamento = Regolamento AND idRegolamento = ? AND Ore > 0`;
    try {
        // restituisce true se un regolamento ha tutte le selezioni centrali della regola
        // false altrimenti
        const [elenco] = await db.query(query, [idRegolamento]);
        const elencoSelezioniReg = elenco.map(item => item.id);
        let res = true;
        for(let selezione of selezioni){
            if(elencoSelezioniReg.includes(selezione) == false) res = false;
        }
        return res;
    } catch (error) {
        console.log(error);
        return false
    }
}

// controlla la somma dei cfu di un regolamento
/*export async function checkSommaCfu(idRegolamento, selezioni, somma, tipoRegola) {
    let query;
    if(tipoRegola === "area") query = `
        SELECT Aree.idArea AS "id", SUM(InsegnamentiSottoaree.CFU) AS "cfutot"
        FROM Regolamenti, Insegnamenti, InsegnamentiSottoaree, Sottoaree, Aree
        WHERE idRegolamento = Regolamento AND idInsegnamento = Insegnamento AND idSottoarea = Sottoarea AND idArea = Area AND idRegolamento = ?
        GROUP BY Aree.idArea`;
    if(tipoRegola === "sottoarea") query = `
        SELECT Sottoaree.idSottoarea AS "id", SUM(InsegnamentiSottoaree.CFU) AS "cfutot"
        FROM Regolamenti, Insegnamenti, InsegnamentiSottoaree, Sottoaree
        WHERE idRegolamento = Regolamento AND idInsegnamento = Insegnamento AND idSottoarea = Sottoarea AND idRegolamento = ?
        GROUP BY Sottoaree.idSottoarea`;
    if(tipoRegola === "settore") query = `
        SELECT Insegnamenti.Settore AS "id", SUM(Insegnamenti.CFU) AS "cfutot"
        FROM Regolamenti, Insegnamenti
        WHERE idRegolamento = Regolamento AND idRegolamento = ?
        GROUP BY Insegnamenti.Settore`;
    try {
        // restituisce true se un regolamento ha tutte le selezioni centrali della regola
        // false altrimenti
        const [elenco] = await db.query(query, [idRegolamento]);
        const elencoSelezioniReg = elenco.map(item => item.id);
        let sum = 0;
        for(let elemento of elenco){
            if(selezioni.includes(elemento.id)) sum += parseInt(elemento.cfutot);
        }
        return sum >= somma;
    } catch (error) {
        console.log(error);
        return false
    }
}*/

// controlla la somma dei cfu di un regolamento
export async function checkSommaOre(idRegolamento, selezioni, somma, tipoRegola) {
    let query;
    if(tipoRegola === "area") query = `
        SELECT Aree.idArea AS "id", SUM(InsegnamentiSottoaree.Ore) AS "oretot"
        FROM Regolamenti, Insegnamenti, InsegnamentiSottoaree, Sottoaree, Aree
        WHERE idRegolamento = Regolamento AND idInsegnamento = Insegnamento AND idSottoarea = Sottoarea AND idArea = Area AND idRegolamento = ?
        GROUP BY Aree.idArea`;
    if(tipoRegola === "sottoarea") query = `
        SELECT Sottoaree.idSottoarea AS "id", SUM(InsegnamentiSottoaree.Ore) AS "oretot"
        FROM Regolamenti, Insegnamenti, InsegnamentiSottoaree, Sottoaree
        WHERE idRegolamento = Regolamento AND idInsegnamento = Insegnamento AND idSottoarea = Sottoarea AND idRegolamento = ?
        GROUP BY Sottoaree.idSottoarea`;
    if(tipoRegola === "settore") query = `
        SELECT Insegnamenti.Settore AS "id", SUM(Insegnamenti.Ore) AS "oretot"
        FROM Regolamenti, Insegnamenti
        WHERE idRegolamento = Regolamento AND idRegolamento = ?
        GROUP BY Insegnamenti.Settore`;
    try {
        // restituisce true se un regolamento ha tutte le selezioni centrali della regola
        // false altrimenti
        const [elenco] = await db.query(query, [idRegolamento]);
        const elencoSelezioniReg = elenco.map(item => item.id);
        let sum = 0;
        for(let elemento of elenco){
            if(selezioni.includes(elemento.id)) sum += parseInt(elemento.oretot);
        }
        return sum >= somma;
    } catch (error) {
        console.log(error);
        return false
    }
}



export async function checkRegole(regolamento){
    const objRegolamento = await getRegolamento(regolamento);    
    if(objRegolamento == null) throw {message: "Regolamento non trovata", code: 404};
    const regole = await getRegoleFull(); // insieme delle regole
    // controllo per ogni regola e divido in casi: regola centrale o regola supplementare
    let result = {anvur: objRegolamento.anvur ? true : false, regole: []};
    for(let regola of regole){
        let resRegola;
        const selezioni = regola.riferimenti.map(item => item.id);
        if(regola.centrale){
            // controlli:
            // 1. Copertura
            // 2. Somma
            try {
                const resCompertura = await checkCopertura(regolamento, selezioni, regola.tipologia);
                const resSomma = await checkSommaOre(regolamento, selezioni, regola.ore, regola.tipologia);
                resRegola = {...regola, check: (resCompertura && resSomma)};
                result.regole.push(resRegola);
            } catch (error) {
                console.log(error);
            }
        }
        else{
            // controlli:
            // 1. Somma
            try {
                let resSomma = await checkSommaOre(regolamento, selezioni, regola.ore, regola.tipologia);
                resRegola = {...regola, check: resSomma};
                result.regole.push(resRegola);
            } catch (error) {
                console.log(error);
            }
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