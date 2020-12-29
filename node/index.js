const express = require('express');
const bodyParser = require('body-parser');
var socket = require('socket.io');
const { getList } = require("./db/conexion.js");
var session = require('express-session');

const port = 3000;
const app = express();

app.set('view engine', 'ejs');

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));

app.use("/", require("./route/routes"));
app.use("/configuration", require("./route/configuration"));
app.use("/graphic", require("./route/graphic"))
app.use("/user", require("./route/user"))

const server = app.listen(port, function() {
    console.log("listen at port " + port);
});

const io = socket(server);

io.on('connection', function(socket) {
    socket.on("camara", function(data) {
        getData(socket, data);
        setInterval(function() {
            getData(socket, data);
        }, 8000);
    });
});

async function getData(socket, camara) {
    getList("get_config_camara", [camara]).then(function(rows) {
        var num = 1;
        rows.forEach(config => {
            getList("get_last_temp", [config["id"]]).then(function(rows) {
                socket.emit("data-" + num, rows[0]["temperatura"]);
                num++;
            });
        });
    });
}