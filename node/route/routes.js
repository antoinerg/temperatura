const express = require('express');
const route = express.Router();
const Usuario = require("./../controller/user.js");
const Configuration = require("./../controller/configuration.js");
const Camara = require("./../controller/camara.js");
const { getPDF, getContent, createRow, createTable } = require("./../controller/PDFcontroller.js");

route.get("/", (req, res) => {
    res.render("pages/login", { msg: " " });
});

route.get("/dashboard", (req, res) => {
    if (req.session.loggedin) {
        res.render("pages/dashboard");
    } else {
        res.render("pages/login", { msg: "Debe iniciar sesion primero" });
    }
});

route.post("/getMedicionesId", (req, res) => {
    Configuration.doQuery("get_mediciones_config", [req.body.id]).then(function(rows) {
        let fechas = [];
        let mediciones = [];
        rows.forEach(items => {
            fechas.push(items["fecha"]);
            mediciones.push([items["max"], items["min"]]);
        });
        res.send({ data_f: fechas, data_m: mediciones });
    }).catch((err) => setImmediate(() => { throw err; }));
});

route.post("/getMedicionesIdDate", (req, res) => {
    Configuration.doQuery("get_mediciones_config_date", [req.body.id, req.body.start, req.body.end]).then(function(rows) {
        let fechas = [];
        let mediciones = [];
        rows.forEach(items => {
            fechas.push(items["fecha"]);
            mediciones.push([items["max"], items["min"]]);
        });
        res.send({ data_f: fechas, data_m: mediciones });
    }).catch((err) => setImmediate(() => { throw err; }));
});

route.post("/getCamaras", (req, res) => {
    Camara.doQuery("get_camaras").then(function(rows) {
        let cams = [];
        rows.forEach(items => {
            cams.push(items["id"]);
        });
        res.send({ data: cams });
    }).catch((err) => setImmediate(() => { throw err; }));
});

route.post("/getConfigsByCam", (req, res) => {
    Configuration.doQuery("get_configs").then(function(rows) {
        let configs = [];
        rows.forEach(items => {
            if (items["camara"] == req.body.id) {
                configs.push(items["id"]);
            }
        });
        res.send({ data: configs });
    }).catch((err) => setImmediate(() => {
        console.log(err.code);
    }));
});

route.post("/getLastTemp", (req, res) => {
    Configuration.doQuery("get_last_temp", [req.body.id]).then(function(rows) {
        res.send({ data: rows[0]["temperatura"] });
    }).catch((err) => setImmediate(() => {
        console.log(err.code);
    }));
});

route.post("/getPDF", (req, res) => {
    Configuration.doQuery("get_mediciones_config_date", [req.body.conf, req.body.start, req.body.end]).then(function(rows) {
        const filas = rows.map(createRow).join('');
        const table = createTable(filas);
        const content = getContent("Variación de temperatura", table, req.body.cam, req.body.conf, req.body.img);
        getPDF(content);
    });
    res.sendStatus(400);
});

route.post("/auth", (req, res) => {
    const { username, password } = req.body;
    if (username && password) {
        Usuario.doQuery("auth_user", [username, password]).then(function(rows) {
            if (rows.length > 0) {
                req.session.loggedin = true;
                req.session.username = username;
                req.session.rol = rows[0]["rol"];
                res.redirect('/dashboard');
            } else {
                res.render("pages/login", { msg: "Usuario o contrasena invalida" });
            }
        }).catch((err) => setImmediate(() => {
            res.render("pages/login", { msg: "Error de conexion: " + err.code });
        }));
    } else {
        res.render("pages/login", { msg: "Debe ingresar usuario y contrasena" });
        res.end();
    }
});

route.get('/logout', function(req, res) {
    req.session.destroy();
    res.render("pages/login", { msg: "Sesion terminada" });
});

module.exports = route;