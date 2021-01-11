const express = require('express');
const bodyParser = require('body-parser');
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
app.use("/report", require("./route/report"))

const server = app.listen(port, function() {
    console.log("listen at port " + port);
});