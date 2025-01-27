import { db } from "./database.js";

export async function getPresidenti(){
    const [result] = await db.query("SELECT * FROM Presidenti");
    return result;
}

export async function getPresidente(id){
    const [result] = await db.query(`SELECT * FROM Presidenti WHERE idPresidente = ?`, [id]);
    return result[0];
}

export async function addPresidente(idPresidente, Nome, Cognome, Email, Università){
    const [result] = await db.query(`INSERT INTO Presidenti (idPresidente, Nome, Cognome, Email, Università) VALUES (?, ?, ?, ?, ?)`, [idPresidente, Nome, Cognome, Email, Università]);
    return result;
}

export async function updatePresidente(idPresidente, Nome, Cognome, Email, Università, Attivo){
    const [result] = await db.query(`UPDATE Presidenti SET Nome = ?, Cognome = ?, Email = ?, Università = ?, Attivo = ? WHERE idPresidente = ?`, [Nome, Cognome, Email, Università, Attivo, idPresidente]);
    return result;
}

