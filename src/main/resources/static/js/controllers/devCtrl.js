
var getDevicesUrl = "/getMyDevices";
var registrationUrl = "/newDevice";

$(document).ready(function () {
    notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, "My Devices : ", "Collecting Data...");
});

function loadDevices(){
    $.getJSON( getDevicesUrl, function(data){
        $("#devicesTableBody").empty();
        var tr;

        console.log(data);

        for (var i = 0; i < data.length; i++){
            var devType;
            var modifyClick = "onclick = 'info(this.id, this.name)'";
            var modifyButton = "<button type='button'" + modifyClick + " id='" + data[i].id  + "' name='" + data[i].devicetype + "-" + data[i].height +
                "'class='btn btn-sm btn-block btn-info'>View Data</button>";


            if (data[i].devicetype == "semd"){
                devType = "Solar Environment Monitor";
            } else if (data[i].devicetype == "emdgps"){
                devType = "Environment Monitor GPS";
            } else if (data[i].devicetype == "emdwifi"){
                devType = "Environment Monitor WiFi";
            } else if (data[i].devicetype == "swlm"){
                devType = "Solar Water Level Monitor";
            } else if (data[i].devicetype == "mwlm"){
                devType = "Main Water Level Monitor";
            } else if (data[i].devicetype == "memd"){
                devType = "Mains Environment Monitor";
            } else if (data[i].devicetype == "tracker"){
                devType = "Tracker GPS";
            }

            const zone = getZone(data[i].id);

            tr = $("<tr class=''" + " id=" + data[i].id + "/>");
            tr.append("<td class='text-center'>" + (i + 1) + "</td>");
            tr.append("<td class='text-center'>" + data[i].name + "</td>");
            tr.append("<td class='text-center'>" + data[i].id + "</td>");
            tr.append("<td class='text-center'>" + data[i].imsi + "</td>");
            tr.append("<td class='text-center'>" + devType + "</td>");
            // tr.append("<td class='text-center'>" + data[i].deviceowner + "</td>");
            // tr.append("<td class='text-center'>" + data[i].email + "</td>");
            // tr.append("<td class='text-center'>" + data[i].phone + "</td>");
            tr.append("<td class='text-center'>" + data[i].location + "</td>");
            tr.append("<td class='text-center'>" + new Date(data[i].latestupdate).toString().substring(0, 25) + "</td>");
            tr.append("<td class='text-center'>" + modifyButton + "</td>");
            $('table#devicesTable').append(tr);
        }
    });

    notify(nFrom, nAlign, nIcons, "success", nAnimIn, nAnimOut, "Notification : ", "Data Collected Successfully...");
}

function info(id, type) {
    console.log(id + "--" + type);

    var passedInfo = type.split("-");

    if (passedInfo[0] === "swlm" || passedInfo[0] === "mwlm"){
        window.location = '/wlm?id=' + id + '&height=' + passedInfo[1];
    } else if (passedInfo[0] === "semd" || passedInfo[0] === "memd") {
        window.location = '/emd?id=' + id;
    } else if (passedInfo[0] === "tracker") {
        window.location = '/cartracking?id=' + id;
    }
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