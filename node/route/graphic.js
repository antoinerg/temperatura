const express = require('express');
const route = express.Router();
const { getList } = require("./../db/conexion.js");

route.get("/", (req, res) => {
    if (req.session.loggedin) {
        getList("get_camaras").then(function(rows) {
            res.render("pages/grafica/menuGraphic", { data: rows });
        }).catch((err) => setImmediate(() => { throw err; }));
    } else {
        res.render("pages/login", { msg: "Debe iniciar sesion primero" });
    }
});

route.get("/:id", (req, res) => {
    getList("get_config_camara", [req.params.id]).then(function(rows) {
        res.render("pages/grafica/graphic", { data: rows });
    }).catch((err) => setImmediate(() => { throw err; }));
});

module.exports = route;