const { pool } = require("./../db/conexion.js");

const queries = {
    auth_user: 'SELECT * FROM CtrlTemp_usuarios WHERE usuario = ? AND contrasena = ?',
    get_users: 'SELECT * FROM CtrlTemp_usuarios',
    get_info_user: 'SELECT * FROM CtrlTemp_usuarios WHERE id = ?',
    insert_user: 'INSERT INTO CtrlTemp_usuarios(nombre, apellido, usuario, contrasena, correo, tipoNotificacion,rol,envioCorreo) VALUES(?,?,?,?,?,?,?,?)',
    update_user: 'UPDATE CtrlTemp_usuarios SET nombre = ?, apellido = ?, usuario = ?, contrasena = ?, correo = ?, tipoNotificacion = ?, rol= ?, envioCorreo = ? WHERE id = ?',
    delete_user: 'DELETE FROM CtrlTemp_usuarios WHERE id = ?',
};

const doQuery = (queryName, queryParams) => {
    return new Promise(function(resolve, reject) {
        pool.query(queries[queryName], queryParams, function(err, result, fields) {
            if (!err) resolve(JSON.parse(JSON.stringify(result)));
            else reject(err);
        });
    });
};

module.exports = { doQuery };