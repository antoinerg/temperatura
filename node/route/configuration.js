const express = require('express');
const route = express.Router();
const { getList, connection } = require("./../db/conexion.js");

route.get("/", (req, res) => {
    if (req.session.loggedin) {
        getList("get_configs").then(function(rows) {
            let camaras = [];
            rows.forEach(element => {
                if (camaras.indexOf(element["camara"]) < 0) {
                    camaras.push(element["camara"]);
                }
            });
            res.render("pages/configuracion/menuConfiguration", {
                data: rows,
                typ: camaras
            });
        }).catch((err) => setImmediate(() => { throw err; }));
    } else {
        res.render("pages/login", { msg: "Debe iniciar sesion primero" });
    }
});

route.get("/:id", (req, res) => {
    var id = req.params.id;
    getList("get_config_id", [id]).then(function(rows) {
        res.render("pages/configuracion/editConfiguration", { data: rows })
    }).catch((err) => setImmediate(() => { throw err; }));
});

route.post("/editRegister", (req, res) => {
    const { id, max_temp, min_temp, captura } = req.body;
    getList("update_config", [max_temp, min_temp, captura, id]).then(function(rows) {
        res.redirect("/configuration")
    });
});

module.exports = route;