import jwt from 'jsonwebtoken';
import { keyJwt, passAdmin } from './Config.js';
import { db } from "./database.js";
import { getPresidente } from './Presidenti.js';
import bcrypt from 'bcrypt'
import { saltRounds } from './Config.js';

export async function getAuthPresidente(email){
    const [result] = await db.query(`
        SELECT idPresidente AS "id", Attivo AS "attivo", FirstPassword AS "firstpassword", Password AS "passPres"
        FROM Presidenti
        WHERE Email = ?`, [email]);
    return result[0];
}
export async function updatePassword(id, password){
    const [result] = await db.query(`UPDATE Presidenti SET Password = ? WHERE idPresidente = ?`, [password, id]);
    return result;
}
export async function getEmail(id){
    const [result] = await db.query(`
        SELECT Email AS "email"
        FROM Presidenti
        WHERE idPresidente = ?`, [id]);
    return result[0];
}






export async function handleAdminLogin(req, res) {
    const password = req.body.password; // password inserita

    if(passAdmin === password){
        const token = jwt.sign({ userId: 'grinadmin', role: 'admin' }, keyJwt, { expiresIn: '4h' });
        return res.status(200).json({
            success: true,
            data: token
        });
    }
    else{
        return res.status(401).json({ 
            success: false,
            error: 'Password errata' 
        });
    }

}
export async function handlePresidenteLogin(req, res) {
    const {email, password} = req.body;

    try {
        const result = await getAuthPresidente(email);
        if(result == undefined) return res.status(404).json({ 
            success: false,
            error: 'Account non esistente' 
        });
        if(result.attivo == 0) return res.status(403).json({ 
            success: false,
            error: 'Account disabilitato' 
        });
        if(result.passPres == null){
            // controllo first passowrd
            if(password === result.firstpassword){
                const token = jwt.sign({ userId: result.id, role: 'presidente' }, keyJwt, { expiresIn: '4h' });
                return res.status(200).json({
                    success: true,
                    data: {token: token, changePassword: true}
                });
            } else {
                return res.status(401).json({ 
                    success: false,
                    error: 'Password errata' 
                });
            }
        } else {
            // controllo con password
            const verifyPassword = await bcrypt.compare(password, result.passPres);
            if(verifyPassword){
                const token = jwt.sign({ userId: result.id, role: 'presidente' }, keyJwt, { expiresIn: '4h' });
                return res.status(200).json({
                    success: true,
                    data: {token: token, changePassword: false}
                });
            } else {
                return res.status(401).json({ 
                    success: false,
                    error: 'Password errata' 
                });
            }
        }
    } catch (error) {
        return res.status(500).json({ 
            success: false,
            error: 'Si prega di riprovare' 
        });
    }
}
export async function handleChangePassword(req, res){
    const { password, token } = req.body;
    // estrapolo id dal token se valido
    let id;
    jwt.verify(token, keyJwt, (err, user) => {
        if (err) return res.status(403).json({ 
            success: false,
            error: 'Token non valido' 
        });
        id = user.userId;
    });
    try {
        const presidente = await getPresidente(id);
        if(presidente.passPres != null || presidente.attivo == 0) {
            return res.status(401).json({ 
                success: false,
                error: "Operazione non consentita"
            });
        }
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const result = await updatePassword(id, hashedPassword);
        return res.status(204).json({ 
            success: true,
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false,
            error: "Si prega di riprovare"
        });
    }
}
export async function handleGetEmail(req, res) {
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
        const email = await getEmail(presidente);
        return res.status(200).json({
            success: true,
            data: email
        });
    } catch (error) {
        // errore generale interno al server
        return res.status(500).json({
            success: false,
            message: "Si è verificato un errore durante il recupero delle richieste .",
            error: error.message || error
        });
    }
}