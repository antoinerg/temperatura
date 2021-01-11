const pdf = require("html-pdf");

function createRow(item) {
    return `
    <tr>
        <td>${item.fecha}</td>
        <td>${item.min}</td>
        <td>${item.max}</td>
    </tr>
  `;
}

function createTable(rows) {
    return `
    <table>
        <tr class="tab-title">
            <th>Fecha</th>
            <th>Mínima Temperatura Registrada</th>
            <th>Máxima Temperatura Registrada</th>
        </tr>
        ${rows}                
    </table>
    `
}

function getContent(title, table, cam, conf, img) {
    return `
    <!doctype html>
        <html>
           <head>
                <meta charset="utf-8">
                <title>PDF Temperatura</title>
                <style>
                    h1, p, tr, th, td {
                        font-family: Arial, Helvetica, sans-serif;
                    }
                    p{
                        font-weight: bolder;
                    }
                    img {
                        width: 100%;
                        height: 100%;
                    }
                    .tit {
                        text-align: center;
                    }
                    .center{
                        margin: 0 10%;
                    }
                    table{
                        text-align: center; 
                        width: 100%;
                    }
                </style>
            </head>
            <body>
                <div class=tit>
                    <h1>${title}</h1>
                </div>
                <div class=center>
                    <p>Cámara Frigorífica: ${cam}</p>
                    <p>Termocupla: ${conf}</p>
                    ${table}
                </div>
                <img src=${img}></img>
            </body>
        </html>
    `;
}

function checkLegnth(data) {
    if (data < 10) {
        return "0" + data;
    } else {
        return data;
    }
}

const getPDF = (text) => {
    var datetime = new Date();
    var name_pdf = './public/reportes/reporte-' + checkLegnth(datetime.getDate()) + checkLegnth(datetime.getMonth() + 1) + datetime.getFullYear() + checkLegnth(datetime.getHours()) + checkLegnth(datetime.getMinutes()) + checkLegnth(datetime.getSeconds()) + '.pdf';
    pdf.create(text).toFile(name_pdf, function(err, res) {
        if (err) {
            console.log(err);
        } else {
            console.log(res);
        }
    });
}

module.exports = { getPDF, getContent, createRow, createTable };