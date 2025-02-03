import jwt from 'jsonwebtoken';
import { keyJwt, passAdmin } from './Config.js';

export async function handleAdminLogin(req, res) {
    const password = req.body.password; // password inserita

    if(passAdmin === password){
        const token = jwt.sign({ userId: 'grinadmin', role: 'admin' }, keyJwt, { expiresIn: '1h' });
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