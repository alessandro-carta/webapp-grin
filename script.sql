CREATE DATABASE IF NOT EXISTS GRIN;
USE GRIN;
SET NAMES 'utf8mb4';
/* Vengono create tutte le tabelle */
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
    idSettore VARCHAR(45) PRIMARY KEY NOT NULL
);

CREATE TABLE Aree (
    idArea VARCHAR(36) PRIMARY KEY NOT NULL,
    Nome VARCHAR(100) NOT NULL
);

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
/* Vengono inseriti un pool di dati utili per il test */
INSERT INTO Settori (idSettore) VALUES
('ETC'),
('INF-ING/05'),
('INF/01'),
('MAT/01'),
('MAT/02'),
('MAT/03'),
('MAT/05'),
('MAT/06'),
('MAT/08'),
('MAT/09');

INSERT INTO Aree (idArea, Nome) VALUES
('637c4b57-52b9-4e2c-beba-fa304bbedf13', 'Algoritmi'),
('ee957a25-9bbd-40d1-adf9-21338cf04177', 'Architetture'),
('3fc5557c-4f75-48fe-a63e-ee4e910d00e5', 'Basi di dati'),
('037df16c-0446-42ff-9b8f-9066fb7c436d', 'Computazione su rete'),
('bb40e101-9190-4c45-b86a-4c245d1fd7d3', 'Fondamenti'),
('f2b733ea-b45a-4ed1-b649-b8a17aa18380', 'Ingegneria del software'),
('74f4da25-295c-4ab5-a126-4205a65dd386', 'Interazione, grafica e multimedialità'),
('65ea3f1a-8281-4ecd-84b5-05609d0b51d6', 'Linguaggi'),
('8d161a97-9fda-47be-b742-c0b84c4717b4', 'Programmazione'),
('1ba2365d-52bf-42bd-ac4d-0f4402ae5076', 'Rappresentazione della conoscenza'),
('c7e9bd18-fb7e-484c-b8a6-4c1c2d6c4798', 'Sistemi operativi');

INSERT INTO Sottoaree (idSottoarea, Nome, Area) VALUES
('55610557-b06c-4f6b-a3b2-27885e4154b5', 'Algoritmi su Strutture Combinatorie', '637c4b57-52b9-4e2c-beba-fa304bbedf13'),
('5dbf466a-156d-423b-9329-742621120c64', 'Algoritmi fondamentali', '637c4b57-52b9-4e2c-beba-fa304bbedf13'),
('5e309674-63c2-40b3-9b6a-c406c8c90898', 'Strutture di Dati Avanzate', '637c4b57-52b9-4e2c-beba-fa304bbedf13'),
('8cfb176c-3e49-47e9-9937-2ade6f4fe497', 'Algoritmi Paralleli', '637c4b57-52b9-4e2c-beba-fa304bbedf13'),
('90010320-5297-40f5-8ab0-b67d14fc5721', 'Tecniche fondamentali di Analisi e Progetto di Algoritmi', '637c4b57-52b9-4e2c-beba-fa304bbedf13'),
('9d6fb926-362a-4830-a7be-85a6163960a0', 'Algoritmi Distribuiti', '637c4b57-52b9-4e2c-beba-fa304bbedf13'),
('eaa35e6f-6907-43b7-88ea-02531fc07261', 'Tecniche Algoritmiche Avanzate', '637c4b57-52b9-4e2c-beba-fa304bbedf13'),
('ebb80b8d-8f0e-4281-880c-918e7c7f3154', 'Strutture di Dati Fondamentali', '637c4b57-52b9-4e2c-beba-fa304bbedf13'),
('ee0116cc-7bfa-4dcb-af25-23fe2e0f411a', 'Varie', '637c4b57-52b9-4e2c-beba-fa304bbedf13'),
('fb3358f6-6e81-462b-bf66-7953a3947e36', 'Algoritmi Numerici', '637c4b57-52b9-4e2c-beba-fa304bbedf13');

INSERT INTO Sottoaree (idSottoarea, Nome, Area) VALUES
('1108aef7-1811-48f4-9176-5a395b5ee2cd', 'Valutazione e Miglioramento delle Prestazioni', 'ee957a25-9bbd-40d1-adf9-21338cf04177'),
('1854b989-3d4a-4504-be4e-7bfe9b419adb', 'Varie', 'ee957a25-9bbd-40d1-adf9-21338cf04177'),
('1c083d02-6e5d-4934-8be5-8692ffd669a6', 'Architetture Avanzate', 'ee957a25-9bbd-40d1-adf9-21338cf04177'),
('291ff12e-3791-4390-a5d9-26c787c90910', 'Circuiti Combinatori e Sequenziali', 'ee957a25-9bbd-40d1-adf9-21338cf04177'),
('29a4bab2-d72f-48ee-8731-7e1a7b09a70b', 'Aritmetica dei Calcolatori', 'ee957a25-9bbd-40d1-adf9-21338cf04177'),
('6da468b6-f9df-41a0-a058-96898edf8146', 'Gestione dell’Input/Output', 'ee957a25-9bbd-40d1-adf9-21338cf04177'),
('6e79351c-8345-4fd2-b28d-b0453f4dfb18', 'Linguaggio Assembler', 'ee957a25-9bbd-40d1-adf9-21338cf04177'),
('7cd6af12-c44b-4d4a-8e30-258f15b8388e', 'Livello Instruction Set', 'ee957a25-9bbd-40d1-adf9-21338cf04177'),
('994d3668-5283-4131-8f8e-d2897161a219', 'Livello di Microprogrammazione', 'ee957a25-9bbd-40d1-adf9-21338cf04177'),
('de0324c5-6650-4801-8d19-d54f6db1b949', 'Gestione della Memoria', 'ee957a25-9bbd-40d1-adf9-21338cf04177');

INSERT INTO Sottoaree (idSottoarea, Nome, Area) VALUES
('3157734f-bc99-4811-bf3a-75717cddba06', 'Modelli Logici', '3fc5557c-4f75-48fe-a63e-ee4e910d00e5'),
('603a5299-10de-4547-b540-ea89572c0592', 'Transazioni, Concorrenza e Recovery', '3fc5557c-4f75-48fe-a63e-ee4e910d00e5'),
('7e39d76c-be70-46b9-ac25-346d10dc07a6', 'Linguaggi di Interrogazione di Basi di Dati', '3fc5557c-4f75-48fe-a63e-ee4e910d00e5'),
('82ddb3e2-3e95-4ec7-b457-90b330783a56', 'Varie', '3fc5557c-4f75-48fe-a63e-ee4e910d00e5'),
('8518f656-4a3c-4b1d-9998-f9cb76223b60', 'Sistemi di Gestione di Basi di Dati', '3fc5557c-4f75-48fe-a63e-ee4e910d00e5'),
('8a3e9f76-2a89-40ef-92a3-1bcae24f67d2', 'Linguaggi di Programmazione di Basi di Dati', '3fc5557c-4f75-48fe-a63e-ee4e910d00e5'),
('919ef04d-34ab-42bc-9972-db8f2cfe00ba', 'Organizzazione Fisica e Gestione delle Interrogazioni', '3fc5557c-4f75-48fe-a63e-ee4e910d00e5'),
('a15a5618-ea08-4043-aa90-ac693faa69ec', 'Normalizzazione di Basi di Dati', '3fc5557c-4f75-48fe-a63e-ee4e910d00e5'),
('af085a0b-9dac-444d-b3ca-a8f41800a0ac', 'Progettazione Logica', '3fc5557c-4f75-48fe-a63e-ee4e910d00e5'),
('b1ca6f34-7ad3-4d33-93dd-29b223105c6d', 'Basi di Dati Avanzate', '3fc5557c-4f75-48fe-a63e-ee4e910d00e5'),
('d8e0552a-c434-41df-a7d6-74dca93a718b', 'Progettazione Concettuale', '3fc5557c-4f75-48fe-a63e-ee4e910d00e5');

INSERT INTO Sottoaree (idSottoarea, Nome, Area) VALUES
('2478895f-58fb-4214-bfd9-fa86529d3f51', 'Modelli di Interazione in Rete', '037df16c-0446-42ff-9b8f-9066fb7c436d'),
('432595dc-5fa0-4113-8be4-32f482b3b0ce', 'Protocolli', '037df16c-0446-42ff-9b8f-9066fb7c436d'),
('4326be8f-1039-4df6-adcd-898b9bff4f0e', 'Varie', '037df16c-0446-42ff-9b8f-9066fb7c436d'),
('55766715-0f07-492e-9187-74648e87675c', 'Sicurezza delle Reti', '037df16c-0446-42ff-9b8f-9066fb7c436d'),
('6d108aba-6ac0-4fd8-b7a7-79c341b5edc2', 'Programmazione di Applicazioni e Servizi di Rete', '037df16c-0446-42ff-9b8f-9066fb7c436d'),
('9a8d1009-d0a6-4e26-a358-6b89dd45909b', 'Architettura delle Reti di Calcolatori', '037df16c-0446-42ff-9b8f-9066fb7c436d'),
('9d8b7fdc-51e5-4a5f-b382-3b37d5dae127', 'Sistemi operativi di Rete e Middleware per la programmazione di rete', '037df16c-0446-42ff-9b8f-9066fb7c436d'),
('9f52c671-92c3-41ef-8689-b551b4856491', 'Fondamenti del Calcolo Distribuito', '037df16c-0446-42ff-9b8f-9066fb7c436d'),
('9fc0fc6f-db62-415d-bb06-44d0a1730eb5', 'Gestione di Reti di Calcolatori', '037df16c-0446-42ff-9b8f-9066fb7c436d'),
('f49be366-fe0f-483a-96a2-ddedecc74bee', 'Dispositivi di Rete', '037df16c-0446-42ff-9b8f-9066fb7c436d');

INSERT INTO Sottoaree (idSottoarea, Nome, Area) VALUES
('0671dc2e-3b03-42ab-8782-a05b4f0fed2c', 'Testing, Verifica e Validazione', 'f2b733ea-b45a-4ed1-b649-b8a17aa18380'),
('2779c1d2-bdaa-4310-94a5-662971a06d07', 'Architetture Software', 'f2b733ea-b45a-4ed1-b649-b8a17aa18380'),
('4ec2315a-3433-441b-acfe-9482de5add1e', 'Linguaggi di Modellazione del Software', 'f2b733ea-b45a-4ed1-b649-b8a17aa18380'),
('680c552c-072b-4ca3-a8c0-ccec06313851', 'Manutenzione ed Evoluzione del Software', 'f2b733ea-b45a-4ed1-b649-b8a17aa18380'),
('6e8c89a1-2232-4a87-bf5e-dde6d526a7c9', 'Economia della Produzione e Gestione di progetti Software', 'f2b733ea-b45a-4ed1-b649-b8a17aa18380'),
('77c7aafa-2d7d-46f4-9862-622e059c91ba', 'Ambienti di Sviluppo', 'f2b733ea-b45a-4ed1-b649-b8a17aa18380'),
('7a035278-fefb-40a7-af45-a3735e12660a', 'Progettazione del Software e Codifica', 'f2b733ea-b45a-4ed1-b649-b8a17aa18380'),
('832547aa-abe7-459c-9555-18f5eee15406', 'Processi di Sviluppo del Software', 'f2b733ea-b45a-4ed1-b649-b8a17aa18380'),
('c5d51163-7a34-4019-b777-2e68087f0440', 'Analisi dei Requisiti', 'f2b733ea-b45a-4ed1-b649-b8a17aa18380'),
('cb2ea326-f12e-4eb8-835f-e45c5c46a727', 'Varie', 'f2b733ea-b45a-4ed1-b649-b8a17aa18380'),
('e22deece-1e6b-4de2-8664-800830eb2fe0', 'Misure del Software e Qualità', 'f2b733ea-b45a-4ed1-b649-b8a17aa18380'),
('f1f9e1ea-c46d-4707-ae43-35969c261a73', 'Aspetti Etici, Professionali e Giuridici', 'f2b733ea-b45a-4ed1-b649-b8a17aa18380');

INSERT INTO Sottoaree (idSottoarea, Nome, Area) VALUES
('056dd975-ad72-44f1-bd9c-44e61fd07166', 'Modelli e Metodi per la Progettazione dell Interazione', '74f4da25-295c-4ab5-a126-4205a65dd386'),
('09cfd1a5-f7d7-4f4a-b9d7-918aa67ac7ce', 'Ipertesti, Multimedialità e WWW', '74f4da25-295c-4ab5-a126-4205a65dd386'),
('0b7a13c9-c4af-4c9d-9a0a-e7a005c1e851', 'Elaborazione di Segnali Multimediali', '74f4da25-295c-4ab5-a126-4205a65dd386'),
('3c468db8-ec6d-4b94-a404-1f08363f73e9', 'Rendering e Visualizzazione', '74f4da25-295c-4ab5-a126-4205a65dd386'),
('4645c7de-ab1a-423b-9cfe-aac9b6e9a0b1', 'Sistemi di Supporto all interazione e Ambienti di Sviluppo', '74f4da25-295c-4ab5-a126-4205a65dd386'),
('58b7c703-a45d-4cb2-aec9-851b7ce3dc64', 'Teorie e Modelli per l Interazione', '74f4da25-295c-4ab5-a126-4205a65dd386'),
('9f0d4fe9-ec8d-428b-add8-77dde650b512', 'Paradigmi di Interazione e Realtà Virtuale', '74f4da25-295c-4ab5-a126-4205a65dd386'),
('afd71063-a5a2-44cf-bab1-792d90565b29', 'Principi, Metodologie e Tecniche di Valutazione di interfacce', '74f4da25-295c-4ab5-a126-4205a65dd386'),
('c3cfa567-94e5-4e7a-9bfa-e734d6e21916', 'Modellazione Geometrica', '74f4da25-295c-4ab5-a126-4205a65dd386'),
('ea3cab94-43f1-49f4-b90b-72627c561213', 'Varie', '74f4da25-295c-4ab5-a126-4205a65dd386');

INSERT INTO Sottoaree (idSottoarea, Nome, Area) VALUES
('1e33c815-c0e5-483f-a61c-f5417ef36491', 'Varie', '65ea3f1a-8281-4ecd-84b5-05609d0b51d6'),
('2d7d9544-bfad-4c2b-b983-4aa7fb82ea05', 'Linguaggi Formali', '65ea3f1a-8281-4ecd-84b5-05609d0b51d6'),
('3091da63-5ca9-46c1-a298-085073129018', 'Astrazioni Linguistiche e Composizionalità', '65ea3f1a-8281-4ecd-84b5-05609d0b51d6'),
('5aabd013-dad0-474a-98fe-ee3c10b285df', 'Tecniche di Analisi e Verifica', '65ea3f1a-8281-4ecd-84b5-05609d0b51d6'),
('637be205-0934-4200-969a-03f138250be3', 'Semantica', '65ea3f1a-8281-4ecd-84b5-05609d0b51d6'),
('6c71db66-fa14-4fec-a12a-38599d04dbec', 'Tecniche di Traduzione: Compilatori e Interpreti', '65ea3f1a-8281-4ecd-84b5-05609d0b51d6'),
('758daa15-99ee-4935-b66d-4322544f9fdf', 'Metodologie di Programmazione', '65ea3f1a-8281-4ecd-84b5-05609d0b51d6'),
('a6a1e861-c71e-416a-81e9-80898dee60b1', 'Paradigmi Linguistici', '65ea3f1a-8281-4ecd-84b5-05609d0b51d6'),
('bb1170a9-2ca1-4632-9de5-a447baa00d9c', 'Macchine Astratte e Tecniche per la Realizzazione dei linguaggi di programmazione', '65ea3f1a-8281-4ecd-84b5-05609d0b51d6');

INSERT INTO Sottoaree (idSottoarea, Nome, Area) VALUES
('053aaa25-67ca-4e25-9f1f-94f570caa8b3', 'Ricorsione', '8d161a97-9fda-47be-b742-c0b84c4717b4'),
('2bb5b8ca-5d7e-4ce3-9d7e-3ec357612676', 'Programmazione Concorrente', '8d161a97-9fda-47be-b742-c0b84c4717b4'),
('461f29a4-828e-491d-830f-796ada204b25', 'Problem Solving e Algoritmi', '8d161a97-9fda-47be-b742-c0b84c4717b4'),
('56314512-ffbe-4479-9854-67d6fdbf1568', 'Sviluppo e Correttezza dei Programmi', '8d161a97-9fda-47be-b742-c0b84c4717b4'),
('73287994-599d-407e-9a21-f9cf2bd777f4', 'Strutture Dati e Tipi di Dati astratti', '8d161a97-9fda-47be-b742-c0b84c4717b4'),
('73c07852-184a-4cf9-a38e-6d23b95121c0', 'Procedure', '8d161a97-9fda-47be-b742-c0b84c4717b4'),
('9b9e5593-d524-4fe4-99a7-80eb42de5a94', 'Varie', '8d161a97-9fda-47be-b742-c0b84c4717b4'),
('9d9ecd73-cf58-42e9-b814-512a6d27d67e', 'Programmazione Orientata agli Oggetti', '8d161a97-9fda-47be-b742-c0b84c4717b4'),
('b8980f38-74b4-46df-8bce-c9edd4187da6', 'Sintassi e Semantica', '8d161a97-9fda-47be-b742-c0b84c4717b4'),
('e4271903-aa08-485f-b0d6-086413e33c09', 'Paradigmi di Programmazione', '8d161a97-9fda-47be-b742-c0b84c4717b4'),
('ffbe669a-2fc9-405e-9506-10858cfe162b', 'Costrutti di Base', '8d161a97-9fda-47be-b742-c0b84c4717b4');

INSERT INTO Sottoaree (idSottoarea, Nome, Area) VALUES
('11aef5b2-1209-4822-9c49-41e0ff1128d8', 'Agenti Intelligenti', '1ba2365d-52bf-42bd-ac4d-0f4402ae5076'),
('19f91bf3-9f3d-4d79-96ff-af8319ddb25f', 'Apprendimento Automatico e Scoperta di Conoscenza', '1ba2365d-52bf-42bd-ac4d-0f4402ae5076'),
('3b54dd27-9d59-4824-9be0-b33b982c9a9c', 'Varie', '1ba2365d-52bf-42bd-ac4d-0f4402ae5076'),
('3e67fa25-3902-45b7-9008-e2a619c5bae8', 'Basi di Conoscenza', '1ba2365d-52bf-42bd-ac4d-0f4402ae5076'),
('48d6bd21-830c-4e4b-98d8-c01139682977', 'Logica e Programmazione Dichiarativa', '1ba2365d-52bf-42bd-ac4d-0f4402ae5076'),
('61b47aeb-6e4e-4880-a70d-3bac6dcd3401', 'Risoluzione di Problemi', '1ba2365d-52bf-42bd-ac4d-0f4402ae5076'),
('6d6ef3dc-7c6a-4840-8672-040902bd10d6', 'Applicazioni della Intelligenza Artificiale', '1ba2365d-52bf-42bd-ac4d-0f4402ae5076'),
('d9c5391d-e597-479e-a875-2fb544b0289e', 'Sistemi Basati su Conoscenza', '1ba2365d-52bf-42bd-ac4d-0f4402ae5076'),
('e2ce8d15-3cdc-4ebd-aba2-1213f3ca5546', 'Acquisizione e Rappresentazione della Conoscenza', '1ba2365d-52bf-42bd-ac4d-0f4402ae5076'),
('e4d36544-4580-4ae3-a51a-d551790fe160', 'Ragionamento Automatico', '1ba2365d-52bf-42bd-ac4d-0f4402ae5076');

INSERT INTO Sottoaree (idSottoarea, Nome, Area) VALUES
('17d2ca2d-f1f3-4e55-8b46-5014e11b4681', 'Programmazione di Sistema', 'c7e9bd18-fb7e-484c-b8a6-4c1c2d6c4798'),
('347885b9-9d8b-46f7-bc89-df56b345f132', 'Modelli e Architetture di sistemi operativi', 'c7e9bd18-fb7e-484c-b8a6-4c1c2d6c4798'),
('41c5cd30-79c1-4d63-9b29-ae19f0c0052a', 'Gestione e Sincronizzazione dei Processi', 'c7e9bd18-fb7e-484c-b8a6-4c1c2d6c4798'),
('4d02d756-69b7-4176-b63a-4095c5135ac4', 'Sistemi operativi per Architetture Avanzate', 'c7e9bd18-fb7e-484c-b8a6-4c1c2d6c4798'),
('4f946961-f5e8-4a61-8c5c-9b51cd31c6c7', 'Gestione e Controllo degli Accessi', 'c7e9bd18-fb7e-484c-b8a6-4c1c2d6c4798'),
('5485b341-916f-458e-8cd0-676973b44664', 'File System', 'c7e9bd18-fb7e-484c-b8a6-4c1c2d6c4798'),
('5fdc6f26-835d-4501-b9ee-dd41485724ff', 'Gestione della Memoria', 'c7e9bd18-fb7e-484c-b8a6-4c1c2d6c4798'),
('7bb8bb7c-6a16-4141-9020-a554bee58b85', 'Varie', 'c7e9bd18-fb7e-484c-b8a6-4c1c2d6c4798'),
('889f7330-3ece-4529-8435-09eb41d3ef78', 'Struttura e Componenti di un sistema operativo', 'c7e9bd18-fb7e-484c-b8a6-4c1c2d6c4798'),
('e23fdfc5-b1e2-485f-8a94-3a070da7b339', 'Gestione delle Periferiche', 'c7e9bd18-fb7e-484c-b8a6-4c1c2d6c4798'),
('f7a21cae-c5f7-4992-af8c-c98a749d62e5', 'Amministrazione di sistema', 'c7e9bd18-fb7e-484c-b8a6-4c1c2d6c4798');

INSERT INTO Presidenti (idPresidente, Nome, Cognome, Email, Universita) VALUES
('d6d82413-dc52-46e9-915b-49cc661479ea', 'Mario', 'Rossi', 'mario.rossi@unipisa.it', 'Università di Pisa');

INSERT INTO CorsiDiStudio (idCDS, Nome, Presidente, AnnoDurata) VALUES
('6d7d3360-1819-43b3-bcea-34fa9c1e0e13', 'Toypisa L-31 ', 'd6d82413-dc52-46e9-915b-49cc661479ea', 3);

INSERT INTO Regolamenti (idRegolamento, AnnoAccademico, CDS, Anvur) VALUES
('8d40850a-33bc-4110-a794-1237fb97a1f3', '2024/2025', '6d7d3360-1819-43b3-bcea-34fa9c1e0e13', 1);

INSERT INTO Insegnamenti (idInsegnamento, Nome, AnnoErogazione, Settore, Regolamento, Ore) VALUES
('31ae9710-edd8-4af2-87c2-60c1de49a6aa', 'Matematica', 1, 'MAT/05', '8d40850a-33bc-4110-a794-1237fb97a1f3', 10),
('63169964-71ca-4169-a0b3-a0d25c37f483', 'Ingegneria', 2, 'INF-ING/05', '8d40850a-33bc-4110-a794-1237fb97a1f3', 6),
('6d820338-1bea-4497-a849-ad976d11e388', 'Architetture', 2, 'INF-ING/05', '8d40850a-33bc-4110-a794-1237fb97a1f3', 8),
('cbe291ba-adf8-48f8-90c7-a06c193560a8', 'Intelligenza Artificiale', 3, 'INF/01', '8d40850a-33bc-4110-a794-1237fb97a1f3', 8),
('da9f4991-3d75-48bf-9b7a-20369f03679f', 'Basi di dati', 3, 'INF/01', '8d40850a-33bc-4110-a794-1237fb97a1f3', 2),
('ea6b8062-6011-46cd-86d5-9a48aab39593', 'Programmazione', 1, 'INF/01', '8d40850a-33bc-4110-a794-1237fb97a1f3', 10);

INSERT INTO Richieste (idRichiesta, Data, Regolamento, Stato) VALUES
('28fba182-3e24-4043-a396-762385a86cf3', '2024-07-06', '8d40850a-33bc-4110-a794-1237fb97a1f3', 'Approvata');

INSERT INTO InsegnamentiSottoaree (Insegnamento, Sottoarea, Ore) VALUES
('6d820338-1bea-4497-a849-ad976d11e388', '1854b989-3d4a-4504-be4e-7bfe9b419adb', 8),
('cbe291ba-adf8-48f8-90c7-a06c193560a8', '11aef5b2-1209-4822-9c49-41e0ff1128d8', 4),
('cbe291ba-adf8-48f8-90c7-a06c193560a8', '19f91bf3-9f3d-4d79-96ff-af8319ddb25f', 4),
('da9f4991-3d75-48bf-9b7a-20369f03679f', '3157734f-bc99-4811-bf3a-75717cddba06', 2),
('ea6b8062-6011-46cd-86d5-9a48aab39593', '053aaa25-67ca-4e25-9f1f-94f570caa8b3', 2),
('ea6b8062-6011-46cd-86d5-9a48aab39593', '2bb5b8ca-5d7e-4ce3-9d7e-3ec357612676', 4),
('ea6b8062-6011-46cd-86d5-9a48aab39593', '461f29a4-828e-491d-830f-796ada204b25', 2),
('ea6b8062-6011-46cd-86d5-9a48aab39593', '5dbf466a-156d-423b-9329-742621120c64', 2);

INSERT INTO Regole (idRegola, Descrizione, Tipologia, Ore, Centrale) VALUES
('01428488-92f8-4c01-894a-8222216850ce', 'Almeno 6 ore nelle sottoaree Ricorsione e Agenti Intelligenti e devono essere coperte entrambe le sottoaree', 'sottoarea', 6, 1),
('9ecc8424-616a-4fbd-a6fa-44caed56168b', 'Almeno 10 ore nei settori INF/01 e INF-ING/05 e devono essere coperti entrambi i settori', 'settore', 10, 1),
('a5f2e8c4-14f1-48dc-a207-683f77f98384', 'Almeno 4 ore nelle aree Algoritmi, Architetture e Basi di dati e devono essere coperte queste tre aree', 'area', 4, 1),
('c41840e0-6938-4f6f-bfd6-b3a6aa656b65', 'Almeno 10 ore tra i settori MAT/01 e MAT/05', 'settore', 10, 0);

INSERT INTO RegoleAree (Area, Regola) VALUES
('3fc5557c-4f75-48fe-a63e-ee4e910d00e5', 'a5f2e8c4-14f1-48dc-a207-683f77f98384'),
('637c4b57-52b9-4e2c-beba-fa304bbedf13', 'a5f2e8c4-14f1-48dc-a207-683f77f98384'),
('ee957a25-9bbd-40d1-adf9-21338cf04177', 'a5f2e8c4-14f1-48dc-a207-683f77f98384');

INSERT INTO RegoleSottoaree (Sottoarea, Regola) VALUES
('053aaa25-67ca-4e25-9f1f-94f570caa8b3', '01428488-92f8-4c01-894a-8222216850ce'),
('11aef5b2-1209-4822-9c49-41e0ff1128d8', '01428488-92f8-4c01-894a-8222216850ce');

INSERT INTO RegoleSettori (Settore, Regola) VALUES 
('INF-ING/05', '9ecc8424-616a-4fbd-a6fa-44caed56168b'),
('INF/01', '9ecc8424-616a-4fbd-a6fa-44caed56168b'),
('MAT/01', 'c41840e0-6938-4f6f-bfd6-b3a6aa656b65'),
('MAT/05', 'c41840e0-6938-4f6f-bfd6-b3a6aa656b65');

INSERT INTO Bollini (idBollino, Erogato, Richiesta) VALUES
('e77eac64-1cab-4dd1-8618-74f9ecc335c1', 1, '28fba182-3e24-4043-a396-762385a86cf3');