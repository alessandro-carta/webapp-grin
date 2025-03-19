CREATE DATABASE IF NOT EXISTS GRIN;
USE GRIN;

CREATE TABLE Presidenti (
    idPresidente VARCHAR(36) PRIMARY KEY NOT NULL,
    Nome VARCHAR(100) NOT NULL,
    Cognome VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Universita VARCHAR(200) NOT NULL,
    Password VARCHAR(200),
    Attivo BOOLEAN NOT NULL DEFAULT 1,
    FirstPassword VARCHAR(50) DEFAULT 'test'
);

CREATE TABLE Settori (
    idSettore VARCHAR(45) NOT NULL,
    PRIMARY KEY (idSettore)
);

CREATE TABLE Aree (
    idArea VARCHAR(36) PRIMARY KEY,
    Nome VARCHAR(100)
);

INSERT INTO Aree (idArea, Nome) VALUES
('637c4b57-52b9-4e2c-beba-fa304bbedf13', 'Algoritmi'),
('ee957a25-9bbd-40d1-adf9-21338cf04177', 'Architetture'),
('3fc5557c-4f75-48fe-a63e-ee4e910d00e5', 'Basi di dati'),
('037df16c-0446-42ff-9b8f-9066fb7c436d', 'Computazione su rete'),
('bb40e101-9190-4c45-b86a-4c245d1fd7d3', 'Fondamenti'),
('f2b733ea-b45a-4ed1-b649-b8a17aa18380', 'Ingegneria del software'),
('74f4da25-295c-4ab5-a126-4205a65dd386', 'Interazione, grafica e multimedialità'),
('65ea3f1a-8281-4ecd-84b5-05609d0b51d6', 'Linguaggi'),
('9b698264-0f65-4904-a101-4c33e717fd94', 'Operating System'),
('8d161a97-9fda-47be-b742-c0b84c4717b4', 'Programmazione'),
('1ba2365d-52bf-42bd-ac4d-0f4402ae5076', 'Rappresentazione della conoscenza'),
('c7e9bd18-fb7e-484c-b8a6-4c1c2d6c4798', 'Sistemi operativi');

CREATE TABLE CorsiDiStudio (
    idCDS VARCHAR(45) NOT NULL,
    Nome VARCHAR(45) NOT NULL,
    Presidente VARCHAR(45) NOT NULL,
    AnnoDurata INT NOT NULL,
    PRIMARY KEY (idCDS),
    FOREIGN KEY (Presidente) 
        REFERENCES Presidenti(idPresidente)
        ON DELETE RESTRICT
        ON UPDATE RESTRICT
);

CREATE TABLE Regolamenti (
    idRegolamento VARCHAR(45) NOT NULL,
    AnnoAccademico VARCHAR(9) NOT NULL,
    CDS VARCHAR(45) NOT NULL,
    Anvur TINYINT NOT NULL,
    PRIMARY KEY (idRegolamento),
    FOREIGN KEY (CDS) 
        REFERENCES CorsiDiStudio(idCDS)
        ON DELETE RESTRICT
        ON UPDATE RESTRICT
);

CREATE TABLE Richieste (
    idRichiesta VARCHAR(45) NOT NULL,
    Data DATE NOT NULL,
    Regolamento VARCHAR(45) NOT NULL,
    Stato VARCHAR(45) NOT NULL,
    PRIMARY KEY (idRichiesta),
    FOREIGN KEY (Regolamento)
        REFERENCES Regolamenti(idRegolamento)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE Bollini (
    idBollino VARCHAR(45) NOT NULL,
    Erogato TINYINT UNSIGNED NOT NULL,
    Richiesta VARCHAR(45) NOT NULL,
    PRIMARY KEY (idBollino),
    FOREIGN KEY (Richiesta)
        REFERENCES Richieste(idRichiesta)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE Insegnamenti (
    idInsegnamento VARCHAR(45) NOT NULL,
    Nome VARCHAR(45) NOT NULL,
    AnnoErogazione INT NOT NULL,
    Settore VARCHAR(45) NOT NULL,
    Regolamento VARCHAR(45) NOT NULL,
    Ore INT NOT NULL,
    PRIMARY KEY (idInsegnamento),
    FOREIGN KEY (Settore)
        REFERENCES Settori(idSettore)
        ON DELETE RESTRICT
        ON UPDATE RESTRICT,
    FOREIGN KEY (Regolamento)
        REFERENCES Regolamenti(idRegolamento)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE Sottoaree (
    idSottoarea VARCHAR(45) NOT NULL,
    Nome VARCHAR(200) NOT NULL,
    Area VARCHAR(45) NOT NULL,
    PRIMARY KEY (idSottoarea),
    FOREIGN KEY (Area)
        REFERENCES Aree(idArea)
        ON DELETE RESTRICT
        ON UPDATE RESTRICT
);


CREATE TABLE InsegnamentiSottoaree (
    Insegnamento VARCHAR(45) NOT NULL,
    Sottoarea VARCHAR(45) NOT NULL,
    Ore INT NOT NULL,
    PRIMARY KEY (Insegnamento, Sottoarea),
    FOREIGN KEY (Insegnamento) 
        REFERENCES Insegnamenti(idInsegnamento) 
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (Sottoarea) 
        REFERENCES Sottoaree(idSottoarea) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);

CREATE TABLE Regole (
    idRegola VARCHAR(45) NOT NULL,
    Descrizione VARCHAR(3000) NOT NULL,
    Tipologia VARCHAR(45) NOT NULL,
    Ore INT NOT NULL,
    Centrale TINYINT NOT NULL,
    PRIMARY KEY (idRegola)
);

CREATE TABLE RegoleAree (
    Area VARCHAR(45) NOT NULL,
    Regola VARCHAR(45) NOT NULL,
    PRIMARY KEY (Area, Regola),
    FOREIGN KEY (Area)
        REFERENCES Aree(idArea)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (Regola)
        REFERENCES Regole(idRegola)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE RegoleSottoaree (
    Sottoarea VARCHAR(45) NOT NULL,
    Regola VARCHAR(45) NOT NULL,
    PRIMARY KEY (Sottoarea, Regola),
    FOREIGN KEY (Sottoarea)
        REFERENCES Sottoaree(idSottoarea)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (Regola)
        REFERENCES Regole(idRegola)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE RegoleSettori (
    Settore VARCHAR(45) NOT NULL,
    Regola VARCHAR(45) NOT NULL,
    PRIMARY KEY (Settore, Regola),
    FOREIGN KEY (Settore)
        REFERENCES Settori(idSettore)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (Regola)
        REFERENCES Regole(idRegola)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
