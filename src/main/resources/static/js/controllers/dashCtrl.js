let tempHistoryChart, humHistoryChart;
const dashboardUrl = "/api/dashboard";

$(document).ready(function () {

    notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, "Welcome : ", "Collecting Data...");
    loadLatestData();
});


function loadLatestData(){
    reqFN("", dashboardUrl, 'get').done(processDashData);
}

function processDashData(data){
    console.log(data);

    let labelsArray = [], tempArray = [], humArray = [];

    notify(nFrom, nAlign, nIcons, "success", nAnimIn, nAnimOut, "Data Collected Successfully...  : ", "Refreshing in 30 secs... ");

    if (data["wMet"].length > 0) {
        $('#hy').text(data["wMet"][0]["reading"] + " " + "");
        $('#my').text(data["wMet"][0]["reading2"] + " " + "");
        $('#ly').text(data["wMet"][0]["reading3"] + " " + "");
        $('#zy').text(data["wMet"][0]["reading4"] + " " + "");
    } else {
        notify(nFrom, nAlign, nIcons, "warning", nAnimIn, nAnimOut, "Warning  : ", "No Met Data.. Refreshing in 30 secs... ");
    }

    if (data["wEnv"].length > 0) {
        for (let i = 0; i < data["wEnv"].length; i++) {
            labelsArray.push(data["wEnv"][i]["timestamp"]);
            tempArray.push(data["wEnv"][i]["reading"]/100);
            humArray.push(data["wEnv"][i]["reading2"]/100);
        }
    } else {
        notify(nFrom, nAlign, nIcons, "warning", nAnimIn, nAnimOut, "Warning  : ", "No Env Data.. Refreshing in 30 secs... ");
    }

    loadTemperatureHistory(labelsArray, tempArray);
    loadHumHistory(labelsArray, humArray);
}

function loadTemperatureHistory(labelsArray, heightArray){

    console.log(labelsArray);

    var wlctx = document.getElementById('temperature').getContext('2d');

    if (tempHistoryChart) {
        tempHistoryChart.destroy();
    }

    tempHistoryChart = new Chart(wlctx, {
        type: 'line',
        data: {
            labels: labelsArray,
            datasets: [{
                label: 'Temperature',
                data: heightArray,
                backgroundColor: "rgba(65, 93, 104, 1)"
            }]
        },
        options: chartOptions
    });
}

function loadHumHistory(labelsArray, batteryArray){
    var btctx = document.getElementById('humidity').getContext('2d');

    if (humHistoryChart) {
        humHistoryChart.destroy();
    }

    humHistoryChart = new Chart(btctx, {
        type: 'line',
        data: {
            labels: labelsArray,
            datasets: [{
                label: 'Humidity',
                data: batteryArray,
                backgroundColor: "rgba(20, 134, 201, 1)"
            }]
        },
        options: chartOptions
    });
}

function reqFN(dataToSubmit, url, type){
    return $.ajax({
        url : url,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        data : JSON.stringify(dataToSubmit),
        type : type,
        contentType: "application/json",
        dataType : "json",
        cache : false,
        success : function(data){
            //console.log(data);
        },
        error : function(xhr, status, error){
            var err = eval("(" + xhr.responseText + ")");
            console.log(err.Message);
        }
    });
}

