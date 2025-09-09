var express = require('express'); //Tipo de servidor: Express
var bodyParser = require('body-parser'); //Convierte los JSON
var cors = require('cors');
const { realizarQuery } = require('./modulos/mysql');

var app = express(); //Inicializo express
var port = process.env.PORT || 4000; //Ejecuto el servidor en el puerto 3000

//const express = require('express');
const path = require('path');
//const app = express();

// Asegurate de exponer la carpeta front para acceder a las imágenes
app.use(express.static(path.join(__dirname, './front'))); // o './front' si estás adentro del mismo nivel


// Convierte una petición recibida (POST-GET...) a objeto JSON
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.get('/', function (req, res) {
    res.status(200).send({
        message: 'GET Home route working fine!'
    });
});

/**
 * req = request. en este objeto voy a tener todo lo que reciba del cliente
 * res = response. Voy a responderle al cliente
 */

//Pongo el servidor a escuchar
app.listen(port, function () {
    console.log(`Server running in http://localhost:${port}
        `);
});

//login
app.post('/login', async function (req, res) {
    console.log(req.body);
    try {
        const resultado = await realizarQuery(`
            SELECT * FROM Usuarios 
            WHERE usuario_mail = '${req.body.usuario_mail}' AND password = '${req.body.contraseña}'
        `);

        if (resultado.length > 0) {
            const usuario = resultado[0];
            res.send({
                ok: true,
                mensaje: "Login correcto",
                id: usuario.id,
            });
        } else {
            res.send({
                ok: false,
                mensaje: "Credenciales incorrectas"
            });
        }

    } catch (error) {
        res.send({
            ok: false,
            mensaje: "Error en el servidor",
            error: error.message
        });
    }
});

//registro
app.post('/registro', async function (req, res) {
    try {
        console.log(req.body)
        vector = await realizarQuery(`SELECT * FROM Usuarios WHERE usuario_mail='${req.body.usuario_mail}'`)

        if (vector.length == 0) {
            realizarQuery(`
                INSERT INTO Usuarios (usuario_mail, password, nombre, foto_perfil) VALUES
                    ('${req.body.usuario_mail}','${req.body.password}','${req.body.nombre}','');
            `)
            
        } else {
            res.send({ res: "Ya existe ese dato", agregado: false })
        }


    } catch (e) {
        res.status(500).send({
            agregado: false,
            mensaje: "Error en el servidor",
            error: e.message
        });
    }
})

app.post("/chats", async function (req, res) {
    try {
        const resultado = await realizarQuery(`
            SELECT Chats.ID, Chats.nombre 
            FROM Chats
            INNER JOIN UsuariosPorChat ON UsuariosPorChat.id_chat = Chats.ID
            WHERE UsuariosPorChat.id_usuario = ${req.body.id_usuario}

        `);

        res.send(resultado);
    } catch (error) {
        res.send({
            ok: false,
            mensaje: "Error en el servidor",
            error: error.message
        });
    }
});

//agregar chats

app.post("/agregarChat", async function (req, res) {
  try {
    let chatId;

    if (req.body.es_grupo == 1) {
      // Insertar grupo
      const resultado = await realizarQuery(`
        INSERT INTO Chats (historial, es_grupo, foto, nombre, descripcion_grupo)
        VALUES ('', 1, '${req.body.foto}', '${req.body.nombre}', '${req.body.descripcion_grupo}')
      `);
      chatId = resultado.insertId;
    } else {
      // Insertar chat individual (campos vacíos salvo es_grupo = 0)
      const resultado = await realizarQuery(`
        INSERT INTO Chats (historial, es_grupo, foto, nombre, descripcion_grupo)
        VALUES ('', 0, NULL, NULL, NULL)
      `);
      chatId = resultado.insertId;

      // obtener id del otro usuario por mail
      const usuarios = await realizarQuery(`
        SELECT ID FROM Usuarios WHERE usuario_mail = '${req.body.mail}'
      `);
      const otroUsuarioId = usuarios[0].ID;

      // vincular usuarios al chat
      await realizarQuery(`
        INSERT INTO UsuariosPorChat (id_chat, id_usuario)
        VALUES (${chatId}, ${req.body.id_usuario}), (${chatId}, ${otroUsuarioId})
      `);
    }

    res.send({ ok: true, id_chat: chatId });
  } catch (error) {
    res.status(500).send({
      ok: false,
      mensaje: "Error en el servidor",
      error: error.message,
    });
  }
});

