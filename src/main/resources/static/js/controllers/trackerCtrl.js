const getTackerDataUrl = "/getTrackerData";

let speedlevelchart, templevelchart, humiditylevelchart;
let markers = [];
let map;

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

function initMap() {

    map = new google.maps.Map(document.getElementById('googleMap'), {
        zoom: 12,
        center: new google.maps.LatLng(-1.30931, 36.76971),
        mapTypeId: google.maps.MapTypeId.HYBRID
    });

    // getSensors();
    notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, "Welcome : ", "Collecting Data...");
}

function loadLatestData(){
    const startTime = new Date();
    const stopTime = new Date();
    let dataObj = {};

    stopTime.setHours(stopTime.getHours() - 12);
    dataObj.startTime = startTime.toISOString();
    dataObj.stopTime = stopTime.toISOString();

    dataReqProc(dataObj);
}

function dataReqProc(dataObj) {

    const url = new URL(window.location.href);
    const searchParams = new URLSearchParams(url.search);
    dataObj.deviceId = searchParams.get('id');
    // dataObj.deviceId = "865905027521255";

    reqFN(dataObj, getTackerDataUrl,'post').done(processTrackerData);
}

function processTrackerData(data) {
    console.log(data);

    let labelsArray = [], tempArray = [], humArray = [], speedArray = [];

    for (let i = 0; i < data.length; i++) {
        if (parseFloat(data[i].speed) >= 0.0) {
            labelsArray.push(data[i].timestamp);
            speedArray.push(data[i].speed);
            tempArray.push(data[i].temperature);
            humArray.push(data[i].humidity);
        }
    }

    loadSpeedLevel(labelsArray, speedArray);
    loadTempLevel(labelsArray, tempArray);
    loadHumidityLevel(labelsArray, humArray);
    loadInfoData(data[0]);
    loadAllLocations(data)
}

function loadSpeedLevel(labelsArray, speedArray) {
    let btctx = document.getElementById('speedlevelchart').getContext('2d');

    if (speedlevelchart) {
        speedlevelchart.destroy();
    }

    speedlevelchart = new Chart(btctx, {
        type: 'line',
        data: {
            labels: labelsArray,
            datasets: [{
                label: 'Speed (K/Hr)',
                data: speedArray,
                backgroundColor: "rgba(120, 134, 201, 1)"
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

function loadInfoData(data) {
    $('#lastseen').text("Last Seen : " + new Date(data.timestamp).toLocaleString());
    $('#devid').text("Device ID : " + data.deviceid);
    $('#speed').text("Speed : " + data.speed);
    $('#status').text("Status : " + data.gpsStatus);
    $('#devtemp').text("Temperature : " + data.temperature);
    $('#devhum').text("Humidity : " + data.humidity);
    $('#heading').text("Heading : " + data.course);
    $('#devlight').text("Light : " + data.light);
    $('#door').text("Door : " + data.door);
    $('#power').text("Power : " + data.power);
    $('#altitude').text("Altitude : " + data.altitude);
    $('#count').text("Count : " + data.count);
}

function loadLatestLocation(data){
    console.log(data);
    let infowindow = new google.maps.InfoWindow();
    let contentString = sprintf('<div style = "line-height: 10px;" id="content">'+
        '<div id="siteNotice">'+
        '</div>'+
        // '<h3 id="firstHeading" class="firstHeading">User Details</h3>'+
        '<div id="bodyContent">'+
        '<p><b>%s</b></p>'+
        '<p><b>Speed</b> : %s </p>'+
        '<p><b>Altitude</b> : %s</p>'+
        '<p><b>Course </b> : %s </p>'+
        '</div>'+
        '</div>', [data.deviceid, data.speed, data.altitude,
        data.course]);

    let marker = new google.maps.Marker({
        position: new google.maps.LatLng(data.latitude, data.longitude),
        map: map,
        icon: pinSymbol('#42f5d1')
    });

    google.maps.event.addListener(marker, 'click', (function(marker, i) {
        return function() {
            infowindow.setContent(contentString);
            infowindow.open(map, marker);
            getData();
        }
    })(marker, 0));
}

function getData() {
}

function loadAllLocations(data) {
    // console.log(data);
    var respObject = data;
    var locations = [];
    var tempLocation = [];
    var i = 0;

    // console.log(respObject);
    for (var key in respObject) {
        if (respObject.hasOwnProperty(key)) {

            // try {
                var contentString = sprintf('<div style = "line-height: 8px;" id="content">'+
                    '<div id="siteNotice">'+
                    '</div>'+
                    // '<h3 id="firstHeading" class="firstHeading">User Details</h3>'+
                    '<div id="bodyContent">'+
                    '<p><b>%s</b></p>'+
                    '<p><b>Speed</b> : %s </p>'+
                    '<p><b>Altitude</b> : %s</p>'+
                    '<p><b>Course </b> : %s </p>'+
                    '<p><b>Time </b> : %s </p>'+
                    '</div>'+
                    '</div>', [respObject[i].deviceid, respObject[i].speed, respObject[i].altitude,
                    respObject[i].course, new Date(respObject[i].timestamp)]);

                tempLocation.push(contentString);
                tempLocation.push(respObject[i].latitude);
                tempLocation.push(respObject[i].longitude);
                tempLocation.push(i++);
                tempLocation.push("0");
                locations.push(tempLocation);
                tempLocation = [];
            // } catch (e) {
            //
            // }
        }
    }

    // DeleteMarkers();

    var infowindow = new google.maps.InfoWindow();
    var marker, i;

    // clickroute(respObject[0]["site_lat"], respObject[0]["site_lon"], respObject[0]["mwater_id"]);

    for (i = 0; i < locations.length; i++) {

        marker = new google.maps.Marker({
            position: new google.maps.LatLng(respObject[i].latitude, respObject[i].longitude),
            map: map,
            icon: pinSymbol('#f54242')
        });


        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                infowindow.setContent(locations[i][0]);
                infowindow.open(map, marker);
                getData();
            }
        })(marker, i));

        markers.push(marker);
    }

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
            let err = eval("(" + xhr.responseText + ")");
            console.log(err.Message);
        }
    });
}

const chartOptions = {
    scales: {
        xAxes: [{
            type: 'time',
            distribution: 'linear',
            time: {
                tooltipFormat: "YYYY-MMM-DD h:mm a",
                displayFormats: {
                    'millisecond': 'h:mm a',
                    'second': 'h:mm a',
                    'minute': 'h:mm a',
                    'hour': 'D MMM hA',
                    'day': 	'MMM DD',
                    'week': 'YYYY MMM',
                    'month': 'YYYY MMM',
                    'quarter': 'YYYY MMM',
                    'year': 'YYYY MMM'
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

function clickroute(latt, longt, id) { //just omit the 'lati' and 'long'
    let latLng = new google.maps.LatLng(latt, longt);
    // map.panTo(latLng);
    getSD(id);
}

function DeleteMarkers() {
    //Loop through all the markers and remove
    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];
}

function goToDevicePage() {
    let url = new URL(window.location.href);
    let searchParams = new URLSearchParams(url.search);
    window.location = '/cartracking';
}

function replaceAll(find, replace, str)
{
    while( str.indexOf(find) > -1)
    {
        str = str.replace(find, replace);
    }
    return str;
}

function sprintf(template, values) {
    return template.replace(/%s/g, function() {
        return values.shift();
    });
}

function pinSymbol(color) {
    return {
        path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z',
        fillColor: color,
        fillOpacity: 1,
        strokeColor: '#000',
        strokeWeight: 2,
        scale: 1
    };
}