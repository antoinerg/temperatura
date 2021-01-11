var time = new Date();

var num_tem = parseInt($("#n_temp")[0].innerText);
var data = [];
for (let index = 1; index <= num_tem; index++) {
    data.push({
        x: [time],
        y: [parseInt($("#Temperatura-" + index)[0].innerText)],
        name: "Termocupla " + index,
        mode: 'lines+markers',
        marker: { size: 8 },
        line: { color: '#0BDB1D' }
    })
}

var layout = {
    title: 'Variación de Temperatura',
    height: 550,
    plot_bgcolor: 'rgba(200,255,0,0.1)',
    margin: {
        pad: 10
    },
    yaxis: {
        type: 'int',
        range: [0, 30]
    }
};

Plotly.plot('line-chart', data, layout);

var cnt = 0;

function getLocal(len) {
    var local = [];
    for (let index = 1; index <= num_tem; index++) {
        local.push({
            t: parseInt($("#Temperatura-" + index)[0].innerText),
            min: parseInt($("#Min-" + index)[0].innerText),
            max: parseInt($("#Max-" + index)[0].innerText)
        })
    }
    return local;
}

function getDataUpdate(time, conf) {
    var update = { x: [], y: [] }
    conf.forEach(item => {
        update["x"].push([time]);
        update["y"].push([item["t"]])
    });
    return update;
}

function getLayoutData(conf) {
    var len = [];
    for (let index = 0; index < conf.length; index++) {
        len.push(index);
    }
    return len;
}

var interval = setInterval(function() {
        var conf = getLocal(num_tem);

        for (let index = 0; index < conf.length; index++) {
            if (conf[index]["t"] > conf[index]["max"] || conf[index]["t"] < conf[index]["min"]) {
                data[index]["line"]["color"] = "#DB251C";
                Plotly.redraw('line-chart');
                $(".temp-" + (index + 1)).css("background", "linear-gradient(0deg, rgba(213,0,0,1) 0%, rgba(172,0,0,1) 40%, rgba(111,0,0,1) 100%)");
            } else if (conf[index]["t"] == conf[index]["max"] || conf[index]["t"] == conf[index]["min"]) {
                data[index]["line"]["color"] = "#f59e1c";
                Plotly.redraw('line-chart');
                $(".temp-" + (index + 1)).css("background", "linear-gradient(0deg, rgba(255,188,2,1) 0%, rgba(213,164,1,1) 40%, rgba(166,117,1,1) 100%)");
            } else {
                data[index]["line"]["color"] = "#0BDB1D";
                Plotly.redraw('line-chart');
                $(".temp-" + (index + 1)).css("background", "linear-gradient(0deg, rgba(0, 213, 14, 1) 0%, rgba(0, 172, 60, 1) 32%, rgba(0, 111, 24, 1) 100%)");
            }
        }

        var time = new Date();
        var update = getDataUpdate(time, conf);

        var olderTime = time.setMinutes(time.getMinutes() - 2);
        var futureTime = time.setMinutes(time.getMinutes() + 2);

        var minuteView = {
            xaxis: {
                type: 'date',
                range: [olderTime, futureTime]
            }
        };

        Plotly.relayout('line-chart', minuteView);
        Plotly.extendTraces('line-chart', update, getLayoutData(conf))

        if (++cnt == 20) {
            data.forEach(row => {
                row["y"].shift();
                row["x"].shift();
            });
            Plotly.redraw('line-chart');
            cnt--;
        }
    },
    6000);