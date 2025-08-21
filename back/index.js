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
            WHERE usuario_mail = '${req.body.usuario_mail}' AND contraseña = '${req.body.contraseña}'
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
                    INSERT INTO Usuarios (usuario_mail, lista_contactos, contraseña) VALUES
                        ('${req.body.nombre}','', '${req.body.password}');
                    `)
            res.send({ res: "ok", agregado: true })
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