import { db } from "./database.js";


export async function getAree(){
    const [result] = await db.query("SELECT * FROM Aree");
    return result;
}
export async function getArea(id){
    const [result] = await db.query(`SELECT * FROM Aree WHERE idArea = ?`, [id]);
    return result[0];
}

export async function addArea(idArea, Nome){
    const [result] = await db.query(`INSERT INTO Aree (idArea, Nome) VALUES (?, ?)`, [idArea, Nome]);
    return result;
}
export async function deleteArea(id) {
    const [result] = await db.query('DELETE FROM Aree WHERE idArea = ?',[id]);
    return result
}
export async function updateArea(idArea, Nome){
    const [result] = await db.query(`UPDATE Aree SET Nome = ? WHERE idArea = ?`, [Nome, idArea]);
    return result;
}







export async function addSottoarea(idSottoarea, Nome, Area){
    const [result] = await db.query(`INSERT INTO Sottoaree (idSottoarea, Nome, Area) VALUES (?, ?, ?)`, [idSottoarea, Nome, Area]);
    return result;
}

export async function getSottoaree(area){
    const [result] = await db.query(`SELECT * FROM Sottoaree WHERE Area = ?`,[area]);
    return result;
}

export async function getSottoareeAll(){
    const [result] = await db.query(`SELECT * FROM Sottoaree`,[]);
    return result;
}

export async function getSottoarea(id){
    const [result] = await db.query(`SELECT * FROM Sottoaree WHERE idSottoarea = ?`, [id]);
    return result[0];
}

export async function deleteSottoarea(id) {
    const [result] = await db.query(`DELETE FROM Sottoaree WHERE idSottoarea = ?`,[id]);
    return result;
}

export async function updateSottoarea(idSottoarea, Nome, Area){
    const [result] = await db.query(`UPDATE Sottoaree SET Nome = ?, Area = ? WHERE idSottoarea = ?`, [Nome, Area, idSottoarea]);
    return result;
}



export async function getSettori(){
    const [result] = await db.query(`SELECT * FROM Settori`,[]);
    return result;
}