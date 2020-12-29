const express = require('express');
const route = express.Router();
const { getList } = require("./../db/conexion.js");

route.get("/", (req, res) => {
    if (req.session.loggedin) {
        getList("get_users").then(function(rows) {
            let tipos = [];
            rows.forEach(element => {
                if (tipos.indexOf(element["tipoNotificacion"]) < 0) {
                    tipos.push(element["tipoNotificacion"]);
                }
            });
            res.render("pages/usuario/users", { data: rows, typ: tipos });
        }).catch((err) => setImmediate(() => { throw err; }));
    } else {
        res.render("pages/login", { msg: "Debe iniciar sesion primero" });
    }
});

route.get("/addUser", (req, res) => {
    res.render("pages/usuario/AddUsers");
});

route.post("/addUser", (req, res) => {
    const { nombre, apellido, usuario, contrasena, correo, tipoNotificacion } = req.body;
    getList("auth_user", [usuario, contrasena]).then(function(rows) {
        if (rows.length > 0) {
            console.log("Usuario ya existe");
        } else {
            getList("insert_user", [nombre, apellido, usuario, contrasena, correo, tipoNotificacion]);
        }
        res.redirect("/user")
    });
});

module.exports = route;