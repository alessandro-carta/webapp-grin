import mysql from 'mysql2'
import { database, host, password, user } from './Config.js';

export const db = mysql.createConnection({
    host: host,
    user: user,
    password: password,
    database: database
}).promise();