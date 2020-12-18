const express = require("express");
const tmp = require("./db/conexion.js");
const app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.get("/", (req, res) => {
    res.render("pages/dashboard");
});

http.listen(port, function() {
    console.log("listen at port " + port);
});

io.on('connection', function(socket) {
    tmp.connection.connect(function() {
        tmp.connection.query('SELECT * FROM CtrlTemp_mediciones cm JOIN CtrlTemp_config cc ON cm.id_conf = cc.id WHERE cm.id_conf=1 ORDER BY cm.id DESC limit 1', function(err, result) {
            if (err) throw err;
            socket.emit('data', Object.values(JSON.parse(JSON.stringify(result)))[0]["temperatura"]);
            socket.emit('max', Object.values(JSON.parse(JSON.stringify(result)))[0]["max_temperatura"]);
            socket.emit('min', Object.values(JSON.parse(JSON.stringify(result)))[0]["min_temperatura"]);
        })
    });
});

io.on('connection', function(socket) {
    tmp.connection.connect(function() {
        tmp.connection.query('SELECT * FROM CtrlTemp_mediciones cm JOIN CtrlTemp_config cc ON cm.id_conf = cc.id WHERE cm.id_conf=2 ORDER BY cm.id DESC limit 1', function(err, result) {
            if (err) throw err;
            socket.emit('data-2', Object.values(JSON.parse(JSON.stringify(result)))[0]["temperatura"]);
            socket.emit('max-2', Object.values(JSON.parse(JSON.stringify(result)))[0]["max_temperatura"]);
            socket.emit('min-2', Object.values(JSON.parse(JSON.stringify(result)))[0]["min_temperatura"]);
        })
    });
});

setInterval(function() {
    tmp.connection.connect(function() {
        tmp.connection.query('SELECT temperatura FROM CtrlTemp_mediciones WHERE id_conf=1 ORDER BY id DESC limit 1', function(err, result) {
            if (err) throw err;
            console.log(Object.values(JSON.parse(JSON.stringify(result))))
            io.emit('data', Object.values(JSON.parse(JSON.stringify(result)))[0]["temperatura"]);
        });
        tmp.connection.query('SELECT temperatura FROM CtrlTemp_mediciones WHERE id_conf=2 ORDER BY id DESC limit 1', function(err, result) {
            if (err) throw err;
            console.log(Object.values(JSON.parse(JSON.stringify(result))))
            io.emit('data-2', Object.values(JSON.parse(JSON.stringify(result)))[0]["temperatura"]);
        });
    });
}, 8000);