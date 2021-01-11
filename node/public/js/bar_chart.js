function getFormatDate(date) {
    var mes = date.getMonth() + 1;
    if (mes < 10 && date.getDate() < 10) {
        return date.getFullYear() + "-0" + mes + "-0" + date.getDate();
    } else if (mes < 10) {
        return date.getFullYear() + "-0" + mes + "-" + date.getDate();
    } else if (date.getDate() < 10) {
        return date.getFullYear() + "-" + mes + "-0" + date.getDate();
    } else {
        return date.getFullYear() + "-" + mes + "-" + date.getDate();
    }
}

function refreshid() {
    $.ajax({
        method: "POST",
        url: "/getMedicionesIdDate",
        data: {
            id: $("#termo").val(),
            end: $("#end").val(),
            start: $("#start").val()
        },
        dataType: "json",
        success: function(response) {
            var fech = response.data_f;
            var mediciones = response.data_m;
            var start = new Date($("#start").val());
            var end = new Date($("#end").val());
            var dif = (end.getTime() - start.getTime()) / (1000 * 3600 * 24);
            var date_rat = [];
            for (let i = 0; i <= dif; i++) {
                var tmp = new Date($("#start").val());
                tmp.setDate(tmp.getDate() + i + 1);
                date_rat.push(getFormatDate(tmp));
            }
            var y_min = [];
            var y_max = [];
            date_rat.forEach(item => {
                var index = fech.indexOf(item);
                if (index >= 0) {
                    y_min.push(mediciones[index][1]);
                    y_max.push(mediciones[index][0]);
                } else {
                    y_min.push(0);
                    y_max.push(0);
                }
            });
            $("#bar-chart")[0].data[0]["y"] = y_max;
            $("#bar-chart")[0].data[1]["y"] = y_min;
            var layout = {
                title: 'Gráfica Semanal: Desde ' + $("#start").val() + ' - Hasta ' + $("#end").val()
            }

            Plotly.relayout('bar-chart', layout);
            Plotly.redraw('bar-chart');
        }
    });
}

var trace1 = {
    x: ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"],
    y: [0, 0, 0, 0, 0, 0, 0],
    name: "Max",
    type: "bar",
    marker: {
        color: "#213e3b"
    }
};

var trace2 = {
    x: ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"],
    y: [0, 0, 0, 0, 0, 0, 0],
    name: "Min",
    type: "bar",
    marker: {
        color: "#a6f6f1"
    }
};

var data = [trace1, trace2];
var layout = {
    barmode: "group"
};
var graphOptions = {
    layout: layout,
    title: 'Gráfica Semanal: Desde ' + $("#start").val() + '- Hasta ' + $("#end").val(),
    filename: "grouped-bar",
    fileopt: "overwrite"
};
Plotly.plot('bar-chart', data, graphOptions);