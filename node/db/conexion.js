var mysql = require('mysql');

var connection = mysql.createConnection({
    host: '10.50.1.13',
    user: 'root',
    password: 'rolo',
    database: 'CtrlTemp',
    port: 3306
});

module.exports = { connection }