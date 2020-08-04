const getEventsUrl = "/getEvents";

$(document).ready(function () {
    notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, "Events : ", "Collecting Data...");
    loadLatestData();
});

function loadLatestData(){

    var startTime = new Date();
    var stopTime = new Date();
    var dataObj = {};

    stopTime.setHours(stopTime.getHours() - 48);

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
    reqFN(dataObj, getEventsUrl,'post').done(processDoorData);
    dataObj.datatype = "10";
    reqFN(dataObj, getEventsUrl,'post').done(processPowerData);
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

    $("#poweventsTableBody").empty();

    var powerstat;

    if (data[0].power === 1){
        powerstat = "ON";
    } else {
        powerstat = "OFF";
    }

    //$('#powerstat').text(powerstat);
    //$('#powercnt').text("Power Switched On   : " + data.docs[0].payload.data.powercnt + " Times");

    for (var i = 0; i < data.length; i++) {

        let powerstatus;
        const zone = getZone(data[i].deviceid);

        if (data[i].power === 1){
            powerstatus = "ON";
            tr = $("<tr class='active'" + " id=" + data[i]._id + "/>");
        } else {
            powerstatus = "OFF";
            tr = $("<tr class='info'" + " id=" + data[i]._id + "/>");
        }

        tr.append("<td class='text-center'>" + zone + "</span></td>");
        tr.append("<td class='text-center'>" + data[i].deviceid + "</td>");
        tr.append("<td class='text-center'>" + powerstatus + "</span></td>");
        tr.append("<td class='text-center'>" + data[i].count + "</span></td>");
        tr.append("<td class='text-center'>" + new Date(data[i].timestamp).toLocaleString() + "</td>");
        //tr.append("<td class='text-center'>" + new Date(data.docs[i].timestamp).toLocaleString() + "</td>");

        $('table#poweventsTable').append(tr);
    }
}

function processDoorData(data){
    var tr;
    var doorstat;

    $("#eventsTableBody").empty();

    if (data[0].door === 0){
        doorstat = "Closed";
    } else {
        doorstat = "Opened";
    }

    //$('#doorstat').text(doorstat);
    //$('#doorcnt').text("Door Opened : " + data.docs[0].payload.data.doorcnt + " Times");

    for (var i = 0; i < data.length; i++) {

        var doorstatus;
        const zone = getZone(data[i].deviceid);

        if (data[i].door === 0){
            doorstatus = "Close";
            tr = $("<tr class='active'" + " id=" + data[i]._id + "/>");
        } else {
            doorstatus = "Open";
            tr = $("<tr class='info'" + " id=" + data[i]._id + "/>");
        }

        tr.append("<td class='text-center'>" + zone + "</span></td>");
        tr.append("<td class='text-center'>" + data[i].deviceid + "</td>");
        tr.append("<td class='text-center'>" + doorstatus + "</span></td>");
        tr.append("<td class='text-center'>" + data[i].count + "</span></td>");
        tr.append("<td class='text-center'>" + new Date(data[i].timestamp).toLocaleString() + "</td>");
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