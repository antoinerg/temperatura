const { pool } = require("./../db/conexion.js");

const queries = {
    get_camaras: 'SELECT * FROM CtrlTemp_camara',
    update_camara: 'UPDATE CtrlTemp_camara SET captura = ? WHERE id = ?'
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