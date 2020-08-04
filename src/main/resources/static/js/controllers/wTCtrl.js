
var devDataURL = "getDevUserData";
var updateSettingsUrl = "updateDeviceSettings";

var url = new URL(window.location.href);
var searchParams = new URLSearchParams(url.search);
var devId = searchParams.get('id');


$(document).ready(function () {

    $("#deviceid").text("Configure Device : " + devId);

    fetchDevData(devId);

});

function fetchDevData(devId) {
    var reqData = {};

    reqData.deviceId = devId;

    reqFN(reqData, devDataURL,'post').done(processDeVData);
}

function processDeVData(data) {
    // console.log(data);

    var max = 80;
    var min = 20;

    $("#location").val(data.location);
    $("#email").val(data.email);
    $("#phone").val(data.phone);
    $("#height").val(data.height);


    if ("sendEmail" in data === false){
        // console.log("here");
        $("#ts4").prop('checked', false);
        $("#ts5").prop('checked', false);
    } else {
        $("#ts4").prop('checked', stringToBoolean(data.sendEmail));
        $("#ts5").prop('checked', stringToBoolean(data.sendSMS));
        max = data.waterMaxValue;
        min = data.waterMinValue;
    }

    $('#waterslider').slider({
        range: true,
        values: [min, max],
        min: 10,
        max: 90,
        step: 10,
        slide: function(event, ui) {
            $("#waterbudget").val( ui.values[0] + " % - " + ui.values[1] + " %");
        }
    });
    $("#waterbudget").val( $("#waterslider").slider("values", 0) + " % - " + $("#waterslider").slider("values", 1) + " %");

}

function submitSettings() {

    var settingsObj = {};
    var waterLevelAlert = $("#waterbudget").val();

    settingsObj.deviceId = devId;
    settingsObj.location = $("#location").val();
    settingsObj.email = $("#email").val();
    settingsObj.phone = $("#phone").val();
    settingsObj.waterMinValue = waterLevelAlert.substring(0,2);
    settingsObj.waterMaxValue = waterLevelAlert.substring(7,9);
    settingsObj.sendEmail = $("#ts4").prop('checked');
    settingsObj.sendSMS = $("#ts5").prop('checked');
    settingsObj.height = $("#height").val();

    // console.log(settingsObj);

    reqFN(settingsObj, updateSettingsUrl,'post').done(processSettingsUpdate);
}

function processSettingsUpdate(data) {
    console.log(data);

    if (data.status === true){
        window.location = '/mydevices';
    }
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

function stringToBoolean(string){
    switch(string.toLowerCase().trim()){
        case "true": case "yes": case "1": return true;
        case "false": case "no": case "0": case null: return false;
        default: return Boolean(string);
    }
}