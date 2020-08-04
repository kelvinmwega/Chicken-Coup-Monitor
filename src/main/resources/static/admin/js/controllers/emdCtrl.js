const getELMDataURL = "/getEMDData";

let lightlevelchart, templevelchart, batterylevelchart, humiditylevelchart;

$(document).ready(function () {

    notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, "Device : ", "Collecting Data...");

    $( "#historyChecker").submit(function( event ) {

        event.preventDefault();

        let dataObj = {};

        dataObj.stopTime = new Date(document.getElementById("startDate").value).toISOString();
        dataObj.startTime = new Date(document.getElementById("stopDate").value).toISOString();

        dataReqProc(dataObj);

    });

    loadLatestData();
});

function loadLatestData(){

    const startTime = new Date();
    const stopTime = new Date();
    let dataObj = {};

    stopTime.setHours(stopTime.getHours() - 12);

    console.log(startTime.toISOString() + " -- " + stopTime.toISOString());

    dataObj.startTime = startTime.toISOString();
    dataObj.stopTime = stopTime.toISOString();

    dataReqProc(dataObj);

}

function dataReqProc(dataObj) {

    const url = new URL(window.location.href);
    const searchParams = new URLSearchParams(url.search);
    // console.log(searchParams.get('id'));

    dataObj.deviceId = searchParams.get('id');

    const zone = getZone(dataObj.deviceId);

    $('#devid').text("Zone :  " + zone);

    reqFN(dataObj, getELMDataURL,'post').done(processWLMData);
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
    console.log(data);

    if(data.length === 0){
        $('#devstatus').text("!! No Data Available !!");
        $('#lastseen').text(" ");
        $('#devbat').text(" ");
        $('#lastsig').text(" ");
        $('#devtemp').text(" ");
        $('#devhum').text(" ");
        $('#heightstat').text(" ");
        $('#count').text(" ");

        if (lightlevelchart) {
            lightlevelchart.destroy();
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

    var doorstatus, powerstatus;

    if (data[0].door === 0){
        doorstatus = "Closed";
    } else {
        doorstatus = "Open"
    }

    if (data[0].power === 1){
        powerstatus = "ON";
    } else {
        powerstatus = "OFF";
    }

    const calcLight = Math.round((data[0].light/1024)*100);

    $('#lastseen').text("Last Seen : " + lastseen.toLocaleString().toString().substring(0,25));
    // $('#devbat').text("Battery : " + data[0].battery + " mV");
    $('#lastsig').text("Signal   : " + data[0].signal + " dBm");
    // $('#devtemp').text("Temperature   : " + data[0].temperature + " C");
    // $('#devhum').text("Humidity   : " + data[0].humidity + " %");
    // $('#heightstat').text("Light Intensity   : " + calcLight + " %");
    $('#count').text("Message Number : " + data[0].count);
    $('#doorstat').text("Door Status : " + doorstatus);
    $('#powerstat').text("Power Status   : " + powerstatus);
    $('#doorcnt').text("Door Opened : " + (data[0].doorcount ? data[0].doorcount : 0)  + " Times");
    $('#powercnt').text("Power Switched On   : " + (data[0].powercount ? data[0].powercount : 0) + " Times");
    // $('#errors').text("Tx Errors   : " + data[0].errors);
    // $('#memory').text("Free Memory   : " + data[0].memory + " bytes");
    // $('#msgtype').text("Message Type   : " + data[0].datatype);

    if ((curTime.getTime() - lastseen.getTime()) > 1800000){
        $('#devstatus').text("Device is Offline");
    } else {
        $('#devstatus').text("Device is Online");
    }

    for (var i = 0; i < data.length; i++) {

        if (data[i].battery > 3000) {
            labelsArray.push(data[i].timestamp);
            tempArray.push(data[i].temperature);
            humArray.push(data[i].humidity);
            heightArray.push(Math.round((data[i].light/1024)*100));
            batteryArray.push(data[i].battery);
        } else {
            // batteryArray.push(3000);
        }
    }

    loadTempLevel(labelsArray, tempArray);
    loadLightLevel(labelsArray, heightArray);
    loadBatteryLevel(labelsArray, batteryArray);
    loadHumidityLevel(labelsArray, humArray);

    loadLightReading(calcLight);
    loadBatteryValue(data[0].battery);
    loadTempValue(data[0].temperature);
    loadHumidityValue(data[0].humidity);

    notify(nFrom, nAlign, nIcons, "success", nAnimIn, nAnimOut, "Notification : ", "Data Collected Successfully...");
}

function loadLightLevel(labelsArray, heightArray){
    var wlctx = document.getElementById('lightlevelchart').getContext('2d');

    if (lightlevelchart) {
        lightlevelchart.destroy();
    }

    lightlevelchart = new Chart(wlctx, {
        type: 'line',
        data: {
            labels: labelsArray,
            datasets: [{
                label: 'Light Intensity (%)',
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

function loadLightReading(reading) {

    var lighttarget = document.getElementById('meterGauge'); // your canvas element
    var lightgauge = new Gauge(lighttarget).setOptions(wateropts); // create sexy gauge!
    lightgauge.animationSpeed = 32;
    lightgauge.setTextField(document.getElementById("meter-textfield"));

    lightgauge.maxValue = 100; // set max gauge value
    lightgauge.setMinValue(0);  // set min value
    lightgauge.set(reading);
}

function loadBatteryValue(battery) {

    var battarget = document.getElementById('batGauge'); // your canvas element
    var batgauge = new Gauge(battarget).setOptions(batopts); // create sexy gauge!
    batgauge.animationSpeed = 32;
    batgauge.setTextField(document.getElementById("bat-textfield"));

    batgauge.maxValue = 4400; // set max gauge value
    batgauge.setMinValue(3400);  // set min value
    batgauge.set(battery);

}

function loadTempValue(temp) {
    var target = document.getElementById('tempGauge'); // your canvas element
    var gauge = new Gauge(target).setOptions(opts); // create sexy gauge!
    gauge.animationSpeed = 32;
    gauge.setTextField(document.getElementById("temp-textfield"));

    gauge.maxValue = 60; // set max gauge value
    gauge.setMinValue(10);  // set min value
    gauge.set(temp); // set actual value
}

function loadHumidityValue(humidity) {

    var humtarget = document.getElementById('humGauge'); // your canvas element
    var humgauge = new Gauge(humtarget).setOptions(humopts); // create sexy gauge!
    humgauge.animationSpeed = 32;
    humgauge.setTextField(document.getElementById("hum-textfield"));

    humgauge.maxValue = 100; // set max gauge value
    humgauge.setMinValue(0);  // set min value
    humgauge.set(humidity);
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

var batopts = {
    angle: 0, /// The span of the gauge arc
    lineWidth: 0.44, // The line thickness
    radiusScale: 1,
    pointer: {
        length: 0.6, // Relative to gauge radius
        strokeWidth: 0.035 // The thickness
    },
    colorStart: '#6FADCF',   // Colors
    colorStop: '#8FC0DA',    // just experiment with them
    strokeColor: '#E0E0E0',  // to see which ones work best for you
    generateGradient: true,
    highDpiSupport: true,
    staticLabels: {
        font: "12px sans-serif",  // Specifies font
        labels: [3400, 3600, 3800, 4000, 4200, 4400],  // Print labels at these values
        color: "#000000",  // Optional: Label text color
        fractionDigits: 0  // Optional: Numerical precision. 0=round off.
    },
    staticZones: [
        {strokeStyle: "#30B32D", min: 3900, max: 4400}, // Green
        {strokeStyle: "#FFDD00", min: 3650, max: 3900}, // Yellow
        {strokeStyle: "#F03E3E", min: 3400, max: 3650}  // Red
    ],
    renderTicks: {
        divisions: 5,
        divWidth: 1.1,
        divLength: 0.7,
        divColor: '#333333',
        subDivisions: 3,
        subLength: 0.5,
        subWidth: 0.6,
        subColor: '#666666'
    }
};

var opts = {
    angle: 0, /// The span of the gauge arc
    lineWidth: 0.44, // The line thickness
    radiusScale: 1,
    pointer: {
        length: 0.6, // Relative to gauge radius
        strokeWidth: 0.035 // The thickness
    },
    colorStart: '#6FADCF',   // Colors
    colorStop: '#8FC0DA',    // just experiment with them
    strokeColor: '#E0E0E0',  // to see which ones work best for you
    generateGradient: true,
    highDpiSupport: true,
    staticLabels: {
        font: "12px sans-serif",  // Specifies font
        labels: [10, 20, 30, 40, 50, 60],  // Print labels at these values
        color: "#000000",  // Optional: Label text color
        fractionDigits: 0  // Optional: Numerical precision. 0=round off.
    },
    staticZones: [
        {strokeStyle: "#30B32D", min: 10, max: 25}, // Green
        {strokeStyle: "#FFDD00", min: 25, max: 40}, // Yellow
        {strokeStyle: "#F03E3E", min: 40, max: 60}  // Red
    ],
    renderTicks: {
        divisions: 5,
        divWidth: 1.1,
        divLength: 0.7,
        divColor: '#333333',
        subDivisions: 3,
        subLength: 0.5,
        subWidth: 0.6,
        subColor: '#666666'
    }
};

var humopts = {
    angle: 0, /// The span of the gauge arc
    lineWidth: 0.44, // The line thickness
    radiusScale: 1,
    pointer: {
        length: 0.6, // Relative to gauge radius
        strokeWidth: 0.035 // The thickness
    },
    colorStart: '#6FADCF',   // Colors
    colorStop: '#8FC0DA',    // just experiment with them
    strokeColor: '#E0E0E0',  // to see which ones work best for you
    generateGradient: true,
    highDpiSupport: true,
    staticLabels: {
        font: "12px sans-serif",  // Specifies font
        labels: [0, 20, 40, 60, 80, 100],  // Print labels at these values
        color: "#000000",  // Optional: Label text color
        fractionDigits: 0  // Optional: Numerical precision. 0=round off.
    },
    staticZones: [
        {strokeStyle: "#30B32D", min: 0, max: 60}, // Green
        {strokeStyle: "#FFDD00", min: 60, max: 80}, // Yellow
        {strokeStyle: "#F03E3E", min: 80, max: 100}  // Red
    ],
    renderTicks: {
        divisions: 5,
        divWidth: 1.1,
        divLength: 0.7,
        divColor: '#333333',
        subDivisions: 3,
        subLength: 0.5,
        subWidth: 0.6,
        subColor: '#666666'
    }
};

var wateropts = {
    angle: 0, /// The span of the gauge arc
    lineWidth: 0.44, // The line thickness
    radiusScale: 1,
    pointer: {
        length: 0.6, // Relative to gauge radius
        strokeWidth: 0.035 // The thickness
    },
    colorStart: '#6FADCF',   // Colors
    colorStop: '#8FC0DA',    // just experiment with them
    strokeColor: '#E0E0E0',  // to see which ones work best for you
    generateGradient: true,
    highDpiSupport: true,
    staticLabels: {
        font: "12px sans-serif",  // Specifies font
        labels: [0, 20, 40, 60, 80, 100],  // Print labels at these values
        color: "#000000",  // Optional: Label text color
        fractionDigits: 0  // Optional: Numerical precision. 0=round off.
    },
    staticZones: [
        {strokeStyle: "#30B32D", min: 0, max: 40}, // Green
        {strokeStyle: "#FFDD00", min: 40, max: 80}, // Yellow
        {strokeStyle: "#F03E3E", min: 80, max: 100}  // Red
    ],
    renderTicks: {
        divisions: 5,
        divWidth: 1.1,
        divLength: 0.7,
        divColor: '#333333',
        subDivisions: 3,
        subLength: 0.5,
        subWidth: 0.6,
        subColor: '#666666'
    }
};

function goToSettingsPage() {
    var url = new URL(window.location.href);
    var searchParams = new URLSearchParams(url.search);
    // console.log(searchParams.get('id'));

    window.location = '/emd-thresholds?id=' + searchParams.get('id');
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