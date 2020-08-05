
var getDevicesUrl = "/getDevices";
var registrationUrl = "/newDevice";

$(document).ready(function () {

    //call function when page is loaded
    getContent();

    //set on change listener
    $('#selection').change(getContent);

    function getContent() {

        //create url to request fragment
        var url = /devices/;
        var contentSelect = $('#selection').val();

        if (contentSelect === "Content 1") {
            url = url + "content1";
        } else if (contentSelect === "Content 2") {
            url = url + "content2";
        } else if (contentSelect === "home") {
            location.reload();
        }

        console.log(url);

        $('#replace_div').load(url);
    }

    $( "#regDeviceForm").submit(function( event ) {

        event.preventDefault();

        console.log("submit clicked");

        // var deviceObj = {};
        //
        // var selectBox = document.getElementById("devtype");
        // var selectedValue = selectBox.options[selectBox.selectedIndex].value;
        //
        // var ownerselectBox = document.getElementById("owner");
        // var ownerselectedValue = ownerselectBox.options[ownerselectBox.selectedIndex].value;
        //
        //
        // deviceObj.timestamp = new Date().toISOString();
        // deviceObj.id = document.getElementById("devid").value;
        // deviceObj.imsi = document.getElementById("imsi").value;
        // deviceObj.devicetype = selectedValue;
        // deviceObj.deviceowner = ownerselectedValue;
        // deviceObj.location = document.getElementById("location").value;
        // deviceObj.selector = "device";
        //
        // if (selectedValue == "wlms" || selectedValue == "wlmn"){
        //     deviceObj.height = document.getElementById("tank").value;
        // }
        //
        // console.log(deviceObj);
        //
        // reqFN(deviceObj, registrationUrl, 'post').done(processDevRegistration);
    });
});

function loadDevices(){
    $.getJSON( getDevicesUrl, function(data){
        $("#devicesTableBody").empty();
        var tr;

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

            tr = $("<tr class=''" + " id=" + data[i].id + "/>");
            tr.append("<td class='text-center'>" + (i + 1) + "</td>");
            tr.append("<td class='text-center'>" + data[i].id + "</td>");
            // tr.append("<td class='text-center'>" + data[i].imsi + "</td>");
            tr.append("<td class='text-center'>" + devType + "</td>");
            tr.append("<td class='text-center'>" + data[i].deviceowner + "</td>");
            // tr.append("<td class='text-center'>" + data[i].email + "</td>");
            // tr.append("<td class='text-center'>" + data[i].phone + "</td>");
            // tr.append("<td class='text-center'>" + data[i].location + "</td>");
            // tr.append("<td class='text-center'>" + new Date(data[i].timestamp).toString().substring(0, 25) + "</td>");
            tr.append("<td class='text-center'>" + new Date(data[i].latestupdate).toString().substring(0, 25) + "</td>");
            tr.append("<td class='text-center'>" + modifyButton + "</td>");
            $('table#devicesTable').append(tr);
        }
    });
}

function info(id, type) {
    console.log(id + "--" + type);

    var passedInfo = type.split("-");

    if (passedInfo[0] === "swlm" || passedInfo[0] === "mwlm"){
        window.location = '/wlm?id=' + id + '&height=' + passedInfo[1];
    } else if (passedInfo[0] === "semd" || passedInfo[0] === "memd") {
        window.location = '/emd?id=' + id;
    } else if (passedInfo[0] === "gctrl") {
        window.location = '/controller?id=' + id;
    } else if (passedInfo[0] === "tracker") {
        window.location = '/cartracking?id=' + id;
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

function btnClick() {
    console.log("submit clicked");
}