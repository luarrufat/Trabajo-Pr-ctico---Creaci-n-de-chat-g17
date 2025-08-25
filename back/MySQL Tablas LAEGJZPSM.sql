DROP TABLE IF EXISTS Mensajes;
DROP TABLE IF EXISTS Usuarios;
DROP TABLE IF EXISTS Chats;
DROP TABLE IF EXISTS UsuariosPorChat;


CREATE TABLE Mensajes (
    ID INT NOT NULL AUTO_INCREMENT,
    contenido VARCHAR(255),
    fecha_hora DATETIME,
    id_usuario INT,
    id_chat INT,
    PRIMARY KEY (ID)
    FOREIGN KEY (id) REFERENCES Usuarios(ID),
    FOREIGN KEY (id) REFERENCES Chats(ID)
);


CREATE TABLE Chats (
    ID INT NOT NULL AUTO_INCREMENT,
    historial INT,
    es_grupo BOOLEAN,
    PRIMARY KEY (ID),
);



CREATE TABLE Usuarios(
    ID int NOT NULL auto_increment,
    nombre VARCHAR(255),
    apellido VARCHAR(255),
    usuario_mail VARCHAR(255),
    password VARCHAR(255),
    foto_perfil VARCHAR(255),
    descripción VARCHAR(255),
    PRIMARY KEY (ID)
);

CREATE TABLE UsuariosPorChat (
    ID INT NOT NULL AUTO_INCREMENT,
    id_chat INT,
    id_usuario INT,
    PRIMARY KEY (ID)
    FOREIGN KEY (id) REFERENCES Usuarios(ID),
    FOREIGN KEY (id) REFERENCES Chats(ID)
);


INSERT INTO Usuarios (nombre, apellido, usuario_mail, password, foto_perfil, descripción)
VALUES
('Taylor', 'Swift', 'Cantante')
('William', 'Shakespeare', 'Dramaturgo y poeta');

INSERT INTO Chats (historial, es_grupo)
VALUES
("Nunca quiero ser un producto de mi entorno. Quiero que mi entorno sea un producto de mí.","Billboard Women in Music Awards", 1),
("Mi amor es tuyo para enseñar. Enséñame a amarte y te mostraré cómo ser amado", "La fierecilla domada", 2);

INSERT INTO Mensajes (contenido, fecha_hora, id_usuario, id_chat)
VALUES
('Emilia', 'sarmiento01', 90),
('Julieta', 'juju89', 120);

INSERT INTO UsuariosPorChat (id_chat, id_usuario)
VALUES
('Emilia', 'sarmiento01', 90),
('Julieta', 'juju89', 120);


UPDATE Usuarios
SET es_admin = true
WHERE ID = 2;

UPDATE Autores SET imagen = 'images/sheakspare.png' WHERE id = 2;
UPDATE Autores SET imagen = 'images/taylor.png.png' WHERE id = 1;