const ghDataUrl = "/api/ghdata";

$(document).ready(function () {

    notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, "Welcome : ", "Collecting Data...");
    loadLatestData();
});

function loadLatestData(){
    reqFN("", ghDataUrl, 'get').done(processGHData);
}

function processGHData(data) {
    console.log(data);
    notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, "Success : ", "Data collected successfully...");

    let tr;
    $("#devicesTableBody").empty();
    for (let i = 0; i < data["devices"].length; i++){
        const modifyClick = "onclick = 'info(this.id, this.name)'";
        const modifyButton = "<button type='button'" + modifyClick + " id='" + data["devices"][i].id + "' name='" + data["devices"][i].deviceType +
            "'class='btn btn-sm btn-block btn-info'>View Data</button>";

        tr = $("<tr class=''" + " id=" + data["sensors"][i].id + "/>");
        tr.append("<td class='text-center'>" + data["devices"][i].id + "</td>");
        tr.append("<td class='text-center'>" + data["devices"][i].deviceId + "</td>");
        tr.append("<td class='text-center'>" + data["devices"][i].deviceStatus + "</td>");
        tr.append("<td class='text-center'>" + data["devices"][i].deviceType + "</td>");
        tr.append("<td class='text-center'>" + data["devices"][i].shelter + "</td>");
        tr.append("<td class='text-center'>" + data["devices"][i].sector + "</td>");
        tr.append("<td class='text-center'>" + data["devices"][i].country + "</td>");
        // tr.append("<td class='text-center'>" + new Date(data[i].timestamp).toString().substring(0, 25) + "</td>");
        tr.append("<td class='text-center'>" + new Date(data["devices"][i].created).toString().substring(0, 25) + "</td>");
        tr.append("<td class='text-center'>" + modifyButton + "</td>");
        $('table#devicesTable').append(tr);
    }

    $("#sensorsTableBody").empty();
    for (let i = 0; i < data["sensors"].length; i++){

        tr = $("<tr class=''" + " id=" + data["sensors"][i].id + "/>");
        tr.append("<td class='text-center'>" + (i + 1) + "</td>");
        tr.append("<td class='text-center'>" + data["sensors"][i].code + "</td>");
        tr.append("<td class='text-center'>" + data["sensors"][i].description + "</td>");
        tr.append("<td class='text-center'>" + data["sensors"][i].type + "</td>");
        tr.append("<td class='text-center'>" + data["sensors"][i].value + "</td>");
        tr.append("<td class='text-center'>" + data["sensors"][i].readTech + "</td>");
        $('table#sensorsTable').append(tr);
    }
}

function info(id, type) {
    console.log(id + "--" + type);

    window.location = '/admin/mygreenhouse?id=' + id;
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