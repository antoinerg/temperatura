const { pool } = require("./../db/conexion.js");

const queries = {
    get_info_config: 'SELECT * FROM CtrlTemp_config WHERE id = ?',
    insert_config: 'INSERT INTO CtrlTemp_config(max_temperatura, min_temperatura, camara) VALUES(?,?,?)',
    get_configs: 'SELECT ccam.id as camara, cconf.id as id, max_temperatura, min_temperatura, captura  FROM CtrlTemp_camara ccam JOIN CtrlTemp_config cconf ON ccam.id = cconf.camara;',
    update_config: 'UPDATE CtrlTemp_config SET max_temperatura = ?, min_temperatura = ? WHERE id = ?',
    get_last_temp: 'SELECT temperatura FROM CtrlTemp_mediciones WHERE id_conf = ? ORDER BY id DESC limit 1',
    get_mediciones: 'SELECT DATE_FORMAT(fecha_registro,"%Y-%m-%d") as fecha, MAX(temperatura) as max, MIN(temperatura) as min FROM CtrlTemp_mediciones GROUP BY DATE_FORMAT(fecha_registro,"%Y-%m-%d")',
    get_mediciones_config: 'SELECT DATE_FORMAT(fecha_registro,"%Y-%m-%d") as fecha, MAX(temperatura) as max, MIN(temperatura) as min FROM CtrlTemp_mediciones WHERE id_conf = ? GROUP BY DATE_FORMAT(fecha_registro,"%Y-%m-%d")',
    get_mediciones_config_date: 'SELECT DATE_FORMAT(fecha_registro,"%Y-%m-%d") as fecha, MAX(temperatura) as max, MIN(temperatura) as min FROM CtrlTemp_mediciones WHERE id_conf = ? AND fecha_registro >= ? AND fecha_registro <= ? GROUP BY DATE_FORMAT(fecha_registro,"%Y-%m-%d")'
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