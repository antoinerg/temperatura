const express = require('express');
const route = express.Router();
const Usuario = require("./../controller/user.js");

route.get("/", (req, res) => {
    if (req.session.loggedin) {
        Usuario.doQuery("get_users").then(function(rows) {
            let tipos = [];
            rows.forEach(element => {
                if (tipos.indexOf(element["tipoNotificacion"]) < 0) {
                    tipos.push(element["tipoNotificacion"]);
                }
            });
            let roles = [];
            rows.forEach(element => {
                if (roles.indexOf(element["rol"]) < 0) {
                    roles.push(element["rol"]);
                }
            });
            res.render("pages/usuario/users", { data: rows, typ: tipos, rols: roles, rol: req.session.rol });
        }).catch((err) => setImmediate(() => {
            res.render("pages/error", { msg: err.code });
        }));
    } else {
        res.render("pages/login", { msg: "Debe iniciar sesion primero" });
    }
});

route.post("/addUser", (req, res) => {
    const { nombre, apellido, usuario, contrasena, correo, tipoNotificacion, rol, envioCorreo } = req.body;
    Usuario.doQuery("auth_user", [usuario, contrasena]).then(function(rows) {
        if (rows.length > 0) {
            console.log("Usuario ya existe");
        } else {
            if (envioCorreo == null) {
                Usuario.doQuery("insert_user", [nombre, apellido, usuario, contrasena, correo, tipoNotificacion, rol, 0]);
                res.redirect("/user");
            } else {
                Usuario.doQuery("insert_user", [nombre, apellido, usuario, contrasena, correo, tipoNotificacion, rol, 1]);
                res.redirect("/user");
            }
        }
    }).catch((err) => setImmediate(() => { throw err; }));
});

route.post("/editUser", (req, res) => {
    const { id, nombre, apellido, usuario, contrasena, correo, tipoNotificacion, rol, envioCorreo } = req.body;
    if (envioCorreo == null) {
        Usuario.doQuery("update_user", [nombre, apellido, usuario, contrasena, correo, tipoNotificacion, rol, 0, id]).then(function(rows) {
            res.redirect("/user");
        }).catch((err) => setImmediate(() => { throw err; }));
    } else {
        Usuario.doQuery("update_user", [nombre, apellido, usuario, contrasena, correo, tipoNotificacion, rol, 1, id]).then(function(rows) {
            res.redirect("/user");
        }).catch((err) => setImmediate(() => { throw err; }));
    }
});

route.post("/deleteUser", (req, res) => {
    Usuario.doQuery("delete_user", [req.body.id]).then(function(rows) {
        res.redirect("/user");
    }).catch((err) => setImmediate(() => { throw err; }));
});

route.post("/getInfoUser", (req, res) => {
    Usuario.doQuery("get_info_user", [req.body.cod]).then(function(rows) {
        res.send({ data: rows });
    }).catch((err) => setImmediate(() => { throw err; }));
});

module.exports = route;