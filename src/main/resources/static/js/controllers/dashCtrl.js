let powerHistoryChart, waterHistoryChart;
const getEventsUrl = "/getEvents";

$(document).ready(function () {

    notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, "Welcome : ", "Collecting Data...");
    const powerConsVals = [1.2, 3.2, 3, 1, 0.6, 0.9, 1.9, 1.5, 2.6, 3.7];
    const waterConsVals = [38, 43, 24, 18, 14, 16, 28, 26, 32, 41];
    const ttArray = ttGenerator();

    loadPowerHistory(ttArray, powerConsVals);
    loadWaterHistory(ttArray, waterConsVals);
    loadLatestData();
});

function ttGenerator() {

    let ttArray = [];
    const startTime = new Date();

    ttArray.push(startTime.toISOString());

    for (let i = 0; i <= 7; i++) {
        startTime.setHours(startTime.getHours() - 24);
        ttArray.push(startTime.toISOString());
    }

    return ttArray;
}

function loadPowerHistory(labelsArray, heightArray){

    console.log(labelsArray);

    var wlctx = document.getElementById('power_cons').getContext('2d');

    if (powerHistoryChart) {
        powerHistoryChart.destroy();
    }

    powerHistoryChart = new Chart(wlctx, {
        type: 'bar',
        data: {
            labels: labelsArray,
            datasets: [{
                label: 'Recent Power Consumption (KWh)',
                data: heightArray,
                backgroundColor: "rgba(65, 93, 104, 1)"
            }]
        },
        options: chartOptions
    });
}

function loadWaterHistory(labelsArray, batteryArray){
    var btctx = document.getElementById('water_cons').getContext('2d');

    if (waterHistoryChart) {
        waterHistoryChart.destroy();
    }

    waterHistoryChart = new Chart(btctx, {
        type: 'bar',
        data: {
            labels: labelsArray,
            datasets: [{
                label: 'Recent Power Consumption (KWh)',
                data: batteryArray,
                backgroundColor: "rgba(20, 134, 201, 1)"
            }]
        },
        options: chartOptions
    });
}

const chartOptions = {
    scales: {
        xAxes: [{
            type: 'time',
            distribution: 'linear',
            time: {
                tooltipFormat: "MMM-DD h:mm a",
                displayFormats: {
                    'millisecond': 'h:mm a',
                    'second': 'h:mm a',
                    'minute': 'h:mm a',
                    'hour': 'D MMM hA',
                    'day': 	'MMM DD',
                    'week': 'MMM DD',
                    'month': 'MMM DD',
                    'quarter': 'MMM DD',
                    'year': 'MMM DD'
                }
            }
        }],
        yAxes: [{
            ticks: {
                beginAtZero:false
            }
        }]
    },
    legend: {
        display: true
    },
    elements: {
        point: {
            pointStyle: 'circle',
        }
    },
    responsive: true
};

function loadLatestData(){

    var startTime = new Date();
    var stopTime = new Date();
    var dataObj = {};

    stopTime.setHours(stopTime.getHours() - 12);

    // console.log(startTime.toISOString() + " -- " + stopTime.toISOString());

    dataObj.startTime = startTime.toISOString();
    dataObj.stopTime = stopTime.toISOString();

    dataReqProc(dataObj);

}

function dataReqProc(dataObj) {

    // var url = new URL(window.location.href);
    // var searchParams = new URLSearchParams(url.search);
    // console.log(searchParams.get('id'));
    //
    // dataObj.deviceId = searchParams.get('id');
    //
    // $('#devid').text("ID  : " + dataObj.deviceId);

    dataObj.datatype = "01";
    reqFN(dataObj, getEventsUrl,'post').done(processPowerData);
    // dataObj.datatype = "10";
    // reqFN(dataObj, getEventsUrl,'post').done(processPowerData);
}

function  processEventsData(data) {
    console.log(data)
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

function processPowerData(data){
    var tr;

    $("#eventsTableBody").empty();

    for (var i = 0; i < data.length; i++) {

        let status;
        const zone = getZone(data[i].deviceid);

        if (data[i].datatype === "01") {
            if (data[i].door === 0){
                status = "Close";
                tr = $("<tr class='active'" + " id=" + data[i]._id + "/>");
            } else {
                status = "Open";
                tr = $("<tr class='info'" + " id=" + data[i]._id + "/>");
            }
        } else {
            if (data[i].power === 1){
                status = "ON";
                tr = $("<tr class='active'" + " id=" + data[i]._id + "/>");
            } else {
                status = "OFF";
                tr = $("<tr class='info'" + " id=" + data[i]._id + "/>");
            }
        }

        tr.append("<td>" + zone + "</span></td>");
        // tr.append("<td class='text-center'>" + data[i].deviceid + "</td>");
        tr.append("<td>" + status + "</span></td>");
        // tr.append("<td class='text-center'>" + data[i].count + "</span></td>");
        tr.append("<td>" + new Date(data[i].timestamp).toLocaleTimeString() + "</td>");
        //tr.append("<td class='text-center'>" + new Date(data.docs[i].timestamp).toLocaleString() + "</td>");

        $('table#eventsTable').append(tr);
    }
    notify(nFrom, nAlign, nIcons, "success", nAnimIn, nAnimOut, "Notification : ", "Data Collected Successfully...");
}

function getZone(dd) {
    let zone;

    switch (dd) {
        case "865905021073824":
            zone = "Living Room";
            break;

        case "865905027521255":
            zone = "Bed Room";
            break;

        case "868259027597320":
            zone = "Kitchen";
            break;

        case "865905021074731":
            zone = "Water Tank";
            break;

        default:
            zone = "Unknown";
            break;
    }

    return zone;
}