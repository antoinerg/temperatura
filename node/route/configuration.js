const express = require('express');
const route = express.Router();
const Configuration = require("./../controller/configuration.js");
const Camara = require("./../controller/camara.js");

route.get("/", (req, res) => {
    if (req.session.loggedin) {
        Configuration.doQuery("get_configs").then(function(rows) {
            let camaras = {
                id: [],
                captura: []
            };
            rows.forEach(element => {
                if (camaras["id"].indexOf(element["camara"]) < 0) {
                    camaras["id"].push(element["camara"]);
                    camaras["captura"].push(element["captura"]);
                }
            });
            res.render("pages/configuracion/menuConfiguration", { data: rows, typ: camaras });
        }).catch((err) => setImmediate(() => {
            res.render("pages/error", { msg: err.code });
        }));
    } else {
        res.render("pages/login", { msg: "Debe iniciar sesion primero" });
    }
});

route.post("/addConfig", (req, res) => {
    const { max_temp, min_temp, camara } = req.body;
    Configuration.doQuery("insert_config", [max_temp, min_temp, camara]).then(function(rows) {
        res.redirect("/configuration")
    }).catch((err) => setImmediate(() => { throw err; }));
});

route.post("/editConfig", (req, res) => {
    const { id, max_temp, min_temp } = req.body;
    Configuration.doQuery("update_config", [max_temp, min_temp, id]).then(function(rows) {
        res.redirect("/configuration")
    }).catch((err) => setImmediate(() => { throw err; }));
});

route.post("/editCamara", (req, res) => {
    const { id, captura } = req.body;
    Camara.doQuery("update_camara", [captura, id]).then(function(rows) {
        res.redirect("/configuration")
    }).catch((err) => setImmediate(() => { throw err; }));
});

route.post("/getInfoConfig", (req, res) => {
    Configuration.doQuery("get_info_config", [req.body.cod]).then(function(rows) {
        res.send({ data: rows });
    })
});

module.exports = route;