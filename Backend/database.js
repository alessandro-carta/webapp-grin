import mysql from 'mysql2'
import { database, host, password, ritardo, tentativi, user } from './Config.js';

export const db = mysql.createConnection({
    host: host,
    user: user,
    password: password,
    database: database
}).promise();

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
async function connectDB() {
    let count = 0;
    while(count < tentativi){
        try {
            await db.connect();
            console.log('Connesso al database MySQL con successo!');
            return;
        }
        catch (err) {
            count++;
            console.error(`Tentativo ${count} di connessione al database fallito:`, err.message);
            if (count >= tentativi) {
                console.error('Numero massimo di tentativi di connessione raggiunto.');
                process.exit(1);
            }
            console.log(`Riprovo tra ${ritardo/1000} secondi...`);
            await sleep(ritardo);
        }
    }
}
connectDB();