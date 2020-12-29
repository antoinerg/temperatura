const express = require('express');
const route = express.Router();
const { getList } = require("./../db/conexion.js");

route.get("/", (req, res) => {
    res.render("pages/login", { msg: " " });
});

route.get("/dashboard", (req, res) => {
    if (req.session.loggedin) {
        res.render("pages/dashboard");
    } else {
        res.render("pages/login", { msg: "Debe iniciar sesion primero" });
    }
    res.end();
});

route.post("/auth", (req, res) => {
    const { username, password } = req.body;
    if (username && password) {
        getList("auth_user", [username, password]).then(function(rows) {
            if (rows.length > 0) {
                req.session.loggedin = true;
                req.session.username = username;
                res.redirect('/dashboard');
            } else {
                res.render("pages/login", { msg: "Usuario o contrasena invalida" });
            }
        }).catch((err) => setImmediate(() => { throw err; }));
    } else {
        res.render("pages/login", { msg: "Debe ingresar usuario y contrasena" });
        res.end();
    }
});

module.exports = route;