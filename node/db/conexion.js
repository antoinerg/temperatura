var mysql = require('mysql');

var connection = mysql.createConnection({
    host: '10.50.1.13',
    user: 'root',
    password: 'rolo',
    database: 'CtrlTemp',
    port: 3306
});

var queries = {
    auth_user: 'SELECT * FROM CtrlTemp_usuarios WHERE usuario = ? AND contrasena = ?',
    get_users: 'SELECT * FROM CtrlTemp_usuarios',
    insert_user: 'INSERT INTO CtrlTemp_usuarios(nombre, apellido, usuario, contrasena, correo, tipoNotificacion) VALUES(?,?,?,?,?,?)',
    get_configs: 'SELECT * FROM CtrlTemp_config',
    get_camaras: 'SELECT * FROM CtrlTemp_camara',
    get_config_id: 'SELECT cg.id, max_temperatura, min_temperatura, camara, captura FROM CtrlTemp_config cg JOIN CtrlTemp_camara cc ON cg.camara = cc.id WHERE cg.id = ? ',
    get_config_camara: 'SELECT * FROM CtrlTemp_config WHERE camara = ?',
    update_config: 'UPDATE CtrlTemp_config SET max_temperatura = ?, min_temperatura = ? WHERE id = ?',
    update_camara: 'UPDATE CtrlTemp_camara SET nombre = ?, logo_ip = ?, captura = ? WHERE id = ?',
    get_last_temp: 'SELECT temperatura FROM CtrlTemp_mediciones WHERE id_conf = ? ORDER BY id DESC limit 1'
};

connection.connect(function(err) {
    if (err) throw err;
    console.log('Connected to mysql database');
});

const getList = (queryName, queryParams) => {
    return new Promise(function(resolve, reject) {
        connection.query(queries[queryName], queryParams, function(err, result, fields) {
            if (!err) resolve(JSON.parse(JSON.stringify(result)));
            else reject(err);
        });
    });
};

module.exports = { getList }