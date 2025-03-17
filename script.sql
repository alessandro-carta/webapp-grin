CREATE DATABASE IF NOT EXISTS GRIN;
USE GRIN;

CREATE TABLE Presidenti (
    idPresidente VARCHAR(36) PRIMARY KEY,
    Nome VARCHAR(100),
    Cognome VARCHAR(100),
    Email VARCHAR(100) UNIQUE,
    Universita VARCHAR(200),
    Password VARCHAR(255),
    Attivo BOOLEAN,
    FirstPassword VARCHAR(50)
);

CREATE TABLE Aree (
    idArea VARCHAR(36) PRIMARY KEY,
    Nome VARCHAR(100)
);


INSERT INTO Aree (idArea, Nome)
VALUES ('AREA1', 'Area test');

INSERT INTO Presidenti (idPresidente, Nome, Cognome, Email, Universita, Password, Attivo, FirstPassword)
VALUES ('d6d82413-dc52-46e9-915b-49cc661479ea', 'Mario', 'Rossi', 'mario.rossi@unipisa.it', 'Università di Pisa', '$2b$10$ZKX1IOx2RdoC4K3zC4rVROoAU5vWgwZ4HSCoLBM2uaXjrruBMJO2i', 1, 'admin');