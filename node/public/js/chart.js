var time = new Date();
var data = [{
    x: [time],
    y: [parseInt($("#Temperatura")[0].innerText)],
    name: "Termocupla 1",
    mode: 'lines+markers',
    marker: { size: 8 },
    line: { color: '#0BDB1D' }
}, {
    x: [time],
    y: [parseInt($("#Temperatura-2")[0].innerText)],
    name: "Termocupla 2",
    mode: 'lines+markers',
    marker: { size: 8 },
    line: { color: '#0BDB1D' }
}]

var layout = {
    title: 'Variacion de Temperatura',
    height: 550,
    plot_bgcolor: 'rgba(200,255,0,0.1)',
    margin: {
        pad: 10
    },
    yaxis: {
        type: 'int',
        range: [15, 36]
    }
};

Plotly.plot('line-chart', data, layout);

var cnt = 0;

var interval = setInterval(function() {
        var t = parseInt($("#Temperatura")[0].innerText);
        var min = parseInt($("#Min")[0].innerText);
        var max = parseInt($("#Max")[0].innerText);

        var t2 = parseInt($("#Temperatura-2")[0].innerText);
        var min2 = parseInt($("#Min-2")[0].innerText);
        var max2 = parseInt($("#Max-2")[0].innerText);

        if (t > max || t < min) {
            data[0]["line"]["color"] = "#DB251C";
            Plotly.redraw('line-chart');
            $(".temp-1").css("background", "linear-gradient(0deg, rgba(213,0,0,1) 0%, rgba(172,0,0,1) 40%, rgba(111,0,0,1) 100%)");
        } else if (t == max || t == min) {
            data[0]["line"]["color"] = "#f59e1c";
            Plotly.redraw('line-chart');
            $(".temp-1").css("background", "linear-gradient(0deg, rgba(255,188,2,1) 0%, rgba(213,164,1,1) 40%, rgba(166,117,1,1) 100%)");
        } else {
            data[0]["line"]["color"] = "#0BDB1D";
            Plotly.redraw('line-chart');
            $(".temp-1").css("background", "linear-gradient(0deg, rgba(0, 213, 14, 1) 0%, rgba(0, 172, 60, 1) 32%, rgba(0, 111, 24, 1) 100%)");
        }

        if (t2 > max2 || t2 < min2) {
            data[1]["line"]["color"] = "#DB251C";
            Plotly.redraw('line-chart');
            $(".temp-2").css("background", "linear-gradient(0deg, rgba(213,0,0,1) 0%, rgba(172,0,0,1) 40%, rgba(111,0,0,1) 100%)");
        } else if (t2 == max2 || t2 == min2) {
            data[1]["line"]["color"] = "#f59e1c";
            Plotly.redraw('line-chart');
            $(".temp-2").css("background", "linear-gradient(0deg, rgba(255,188,2,1) 0%, rgba(213,164,1,1) 40%, rgba(166,117,1,1) 100%)");
        } else {
            data[1]["line"]["color"] = "#0BDB1D";
            Plotly.redraw('line-chart');
            $(".temp-2").css("background", "linear-gradient(0deg, rgba(0, 213, 14, 1) 0%, rgba(0, 172, 60, 1) 32%, rgba(0, 111, 24, 1) 100%)");
        }

        var time = new Date();
        var update = {
            x: [
                [time],
                [time]
            ],
            y: [
                [t],
                [t2]
            ]
        }
        var olderTime = time.setMinutes(time.getMinutes() - 2);
        var futureTime = time.setMinutes(time.getMinutes() + 2);

        var minuteView = {
            xaxis: {
                type: 'date',
                range: [olderTime, futureTime]
            }
        };

        Plotly.relayout('line-chart', minuteView);
        Plotly.extendTraces('line-chart', update, [0, 1])

        if (++cnt == 20) {
            data[0]["y"].shift();
            data[0]["x"].shift();
            data[1]["y"].shift();
            data[1]["x"].shift();
            Plotly.redraw('line-chart');
            cnt--;
        }
    },
    6000);