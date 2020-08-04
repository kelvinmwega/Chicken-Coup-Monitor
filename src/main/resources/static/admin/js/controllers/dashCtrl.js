let tempHistoryChart, humHistoryChart;
const dashboardUrl = "/api/dashboard";

$(document).ready(function () {

    notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, "Welcome : ", "Collecting Data...");

});


function loadLatestData(){
    reqFN("", dashboardUrl, 'get').done(processDashData);
}

function processDashData(data){
    console.log(data);
    notify(nFrom, nAlign, nIcons, "success", nAnimIn, nAnimOut, "Notification : ", "Data Collected Successfully...");
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

function loadTemperatureHistory(labelsArray, heightArray){

    console.log(labelsArray);

    var wlctx = document.getElementById('temperature').getContext('2d');

    if (tempHistoryChart) {
        tempHistoryChart.destroy();
    }

    tempHistoryChart = new Chart(wlctx, {
        type: 'bar',
        data: {
            labels: labelsArray,
            datasets: [{
                label: 'Temperature Forecast',
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
        type: 'bar',
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

