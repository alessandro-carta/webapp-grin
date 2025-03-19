import mysql from 'mysql2'
import { database, host, password, ritardo, tentativi, user } from './Config.js';

export let db;

async function connectToDatabase() {  
    while (true) {
      try {
        db = mysql.createConnection({
          host: process.env.MYSQL_HOST || "db",
          user: process.env.MYSQL_USER || "root",
          password: process.env.MYSQL_PASSWORD || "admin",
          database: process.env.MYSQL_DB || "GRIN"
        }).promise();
  
        // Prova di connessione per vedere se il database risponde
        await db.connect();
        console.log("Connessione al database riuscita!");
        break;  // Se la connessione ha successo, esci dal ciclo
  
      } catch (error) {
        console.error(`Tentativo di connessione al DB fallito. Errore:`, error.message);
        console.log(`Riprovo tra ${ritardo / 1000} secondi...`);
        await new Promise(resolve => setTimeout(resolve, ritardo));  // Attendere prima del prossimo tentativo
      }
    }
  }
  
  connectToDatabase();