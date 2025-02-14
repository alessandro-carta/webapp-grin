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






export async function handleAdminLogin(req, res) {
    const password = req.body.password; // password inserita

    if(passAdmin === password){
        const token = jwt.sign({ userId: 'grinadmin', role: 'admin' }, keyJwt, { expiresIn: '4h' });
        return res.status(200).json({
            message: "Accesso come Admin effettuato con successo",
            data: token
        });
    }
    else{
        return res.status(400).json({ 
            message: 'Password errata' 
        });
    }

}
export async function handlePresidenteLogin(req, res) {
    const {email, password} = req.body;

    try {
        const result = await getAuthPresidente(email);
        if(result == null) return res.status(404).json({ message: 'Account non esistente' });
        if(result.attivo == 0) return res.status(400).json({ message: 'Account disabilitato' });
        if(result.passPres == null){
            // controllo first passowrd
            if(password === result.firstpassword){
                const token = jwt.sign({ userId: result.id, role: 'presidente' }, keyJwt, { expiresIn: '4h' });
                return res.status(200).json({
                    message: "Primo accesso effettuato con successo",
                    data: {token: token, changePassword: true}
                });
            } else {
                return res.status(400).json({ message: 'Password errata' });
            }
        } else {
            // controllo con password
            const verifyPassword = await bcrypt.compare(password, result.passPres);
            if(verifyPassword){
                const token = jwt.sign({ userId: result.id, role: 'presidente' }, keyJwt, { expiresIn: '4h' });
                return res.status(200).json({
                    message: "Accesso presidente effettuato con successo",
                    data: {token: token, changePassword: false}
                });
            } else {
                return res.status(400).json({ message: 'Password errata' });
            }
        }
    } catch (error) {
        return res.status(500).json({ 
            message: "Si è verificato un errore durante l'elaborazione della richiesta",
            error: error.message || error
        });
    }
}

export async function handleChangePassword(req, res){
    const { password } = req.body;
    // estrapolo id dal token se valido
    const id = req.user.userId;
    try {
        const presidente = await getPresidente(id);
        if(presidente == null) return res.status(404).json({ message: "Account non trovato" });
        if(presidente.passPres != null || presidente.attivo == 0) {
            return res.status(400).json({ message: "Operazione non consentita" });
        }
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const result = await updatePassword(id, hashedPassword);
        return res.status(204).json({ 
            message: "Password modificata con successo",
        });
    } catch (error) {
        return res.status(500).json({ 
            message: "Si è verificato un errore durante l'elaborazione della richiesta",
            error: error.message || error
        });
    }
}