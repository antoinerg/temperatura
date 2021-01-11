const express = require('express');
const route = express.Router();
const { getList } = require("./../db/conexion.js");

route.get("/range", (req, res) => {
    res.render("pages/reporte/report_range");
});

route.get("/week", (req, res) => {
    res.render("pages/reporte/report_week");
});

module.exports = route;