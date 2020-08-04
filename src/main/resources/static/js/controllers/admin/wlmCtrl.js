var getWLMDataURL = "/getWLMData";

var waterlevelchart, templevelchart, batterylevelchart, humiditylevelchart;

$(document).ready(function () {

    $( "#historyChecker").submit(function( event ) {

        event.preventDefault();

        var dataObj = {};

        dataObj.stopTime = new Date(document.getElementById("startDate").value).toISOString();
        dataObj.startTime = new Date(document.getElementById("stopDate").value).toISOString();

        dataReqProc(dataObj);

    });

    loadLatestData();
});

function loadLatestData(){

    var startTime = new Date();
    var stopTime = new Date();
    var dataObj = {};

    stopTime.setHours(stopTime.getHours() - 12);

    console.log(startTime.toISOString() + " -- " + stopTime.toISOString());

    dataObj.startTime = startTime.toISOString();
    dataObj.stopTime = stopTime.toISOString();

    dataReqProc(dataObj);

}

function dataReqProc(dataObj) {

    var selectBox = document.getElementById("deviceid");
    // var selectedValue = selectBox.options[selectBox.selectedIndex].value;

    dataObj.deviceId = selectBox.options[selectBox.selectedIndex].value;

    $('#devid').text("ID  : " + dataObj.deviceId);

    reqFN(dataObj, getWLMDataURL,'post').done(processWLMData);
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

function processWLMData(data) {
    // console.log(data);

    if(data.length === 0){
        $('#devstatus').text("!! No Data Available !!");
        $('#lastseen').text(" ");
        $('#devbat').text(" ");
        $('#lastsig').text(" ");
        $('#devtemp').text(" ");
        $('#devhum').text(" ");
        $('#heightstat').text(" ");

        if (waterlevelchart) {
            waterlevelchart.destroy();
            batterylevelchart.destroy();
            humiditylevelchart.destroy();
            templevelchart.destroy();
        }

    } else {
        dataLoader(data);
    }

}

function dataLoader(data){
    var labelsArray = [], tempArray = [], humArray = [], heightArray = [], batteryArray = [];

    var lastseen = new Date(data[0].timestamp);
    var curTime = new Date();

    $('#lastseen').text("Last Seen : " + lastseen.toLocaleString().toString().substring(0,25));
    $('#devbat').text("Battery : " + data[0].battery + " mV");
    $('#lastsig').text("Signal   : " + data[0].signal + " dBm");
    $('#devtemp').text("Temperature   : " + data[0].temperature + " C");
    $('#devhum').text("Humidity   : " + data[0].humidity + " %");
    $('#heightstat').text("Sensor Reading   : " + data[0].height + " cm");
    // $('#errors').text("Tx Errors   : " + data[0].err);

    if ((curTime.getTime() - lastseen.getTime()) > 1800000){
        $('#devstatus').text("Device is Offline");
    } else {
        $('#devstatus').text("Device is Online");
    }

    for (var i = 0; i < data.length; i++) {

        labelsArray.push(data[i].timestamp);
        tempArray.push(data[i].temperature);
        humArray.push(data[i].humidity);
        heightArray.push(data[i].height);

        if (data[i].battery > 2000) {
            batteryArray.push(data[i].battery);
        } else {
            batteryArray.push(data[i-1].battery);
        }
    }

    loadTempLevel(labelsArray, tempArray);
    loadWaterLevel(labelsArray, heightArray);
    loadBatteryLevel(labelsArray, batteryArray);
    loadHumidityLevel(labelsArray, humArray);
}

function loadWaterLevel(labelsArray, heightArray){
    var wlctx = document.getElementById('waterlevelchart').getContext('2d');

    if (waterlevelchart) {
        waterlevelchart.destroy();
    }

    waterlevelchart = new Chart(wlctx, {
        type: 'line',
        data: {
            labels: labelsArray,
            datasets: [{
                label: 'Height (cm)',
                data: heightArray,
                backgroundColor: "rgba(65, 93, 104, 1)"
            }]
        },
        options: chartOptions
    });
}

function loadBatteryLevel(labelsArray, batteryArray){
    var btctx = document.getElementById('batterylevelchart').getContext('2d');

    if (batterylevelchart) {
        batterylevelchart.destroy();
    }

    batterylevelchart = new Chart(btctx, {
        type: 'line',
        data: {
            labels: labelsArray,
            datasets: [{
                label: 'Voltage (mv)',
                data: batteryArray,
                backgroundColor: "rgba(20, 134, 201, 1)"
            }]
        },
        options: chartOptions
    });
}

function loadTempLevel(labelsArray, tempArray){
    var sgctx = document.getElementById('templevelchart').getContext('2d');

    if (templevelchart) {
        templevelchart.destroy();
    }

    templevelchart = new Chart(sgctx, {
        type: 'line',
        data: {
            labels: labelsArray,
            datasets: [{
                label: 'Temperature (Celsius)',
                data: tempArray,
                backgroundColor: "rgba(168, 0, 3, 1)"
            }]
        },
        options: chartOptions
    });
}

function loadHumidityLevel(labelsArray, humArray){
    var btctx = document.getElementById('humiditylevelchart').getContext('2d');

    if (humiditylevelchart) {
        humiditylevelchart.destroy();
    }

    humiditylevelchart = new Chart(btctx, {
        type: 'line',
        data: {
            labels: labelsArray,
            datasets: [{
                label: 'Humidity (%)',
                data: humArray,
                backgroundColor: "rgba(120, 134, 201, 1)"
            }]
        },
        options: chartOptions
    });
}

var chartOptions = {
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