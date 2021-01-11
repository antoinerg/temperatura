const express = require('express');
const route = express.Router();
const Configuration = require("./../controller/configuration.js");
const Camara = require("./../controller/camara.js");

route.get("/", (req, res) => {
    if (req.session.loggedin) {
        Camara.doQuery("get_camaras").then(function(rows) {
            res.render("pages/grafica/menuGraphic", { data: rows });
        }).catch((err) => setImmediate(() => {
            res.render("pages/error", { msg: err.code });
        }));
    } else {
        res.render("pages/login", { msg: "Debe iniciar sesion primero" });
    }
});

route.get("/:id", (req, res) => {
    Configuration.doQuery("get_configs").then(function(rows) {
        let tmp = [];
        rows.forEach(element => {
            if (element["camara"] == req.params.id) {
                tmp.push(element);
            }
        });
        res.render("pages/grafica/graphic", { data: tmp });
    }).catch((err) => setImmediate(() => {
        res.render("pages/error", { msg: err.code });
    }));
});

module.exports = route;