package com.iota.demo.services;

import com.cloudant.client.api.ClientBuilder;
import com.cloudant.client.api.CloudantClient;
import com.cloudant.client.api.Database;
import com.cloudant.client.api.query.QueryBuilder;
import com.cloudant.client.api.query.QueryResult;
import com.cloudant.client.api.query.Selector;
import com.cloudant.client.api.query.Sort;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.iota.demo.beans.Device;
import com.iota.demo.beans.DeviceType;
import com.iota.demo.utils.Commons;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

import static com.cloudant.client.api.query.Expression.*;
import static com.cloudant.client.api.query.Operation.and;
import static com.cloudant.client.api.query.Operation.or;

@Service
public class DevicesService {

    Logger logger = LoggerFactory.getLogger(this.getClass());

    @Value("${cloudant.client.user}")
    String user;

    @Value("${cloudant.client.password}")
    String password;

    public boolean registerDevice(Device device, Authentication auth){
        System.out.println(device);

        JsonObject devToUpdate = database("devicesdb").find(JsonObject.class,device.getId());
        JsonObject user = database("users").find(JsonObject.class, auth.getName());

        System.out.println(devToUpdate);

        if (device.getHeight() == null){
            device.setHeight("0");
        }

        if (devToUpdate.get("email").getAsString().equals("info@voltarent.co.ke")){

            devToUpdate.addProperty("email", auth.getName());
            devToUpdate.addProperty("phone", user.get("phone").getAsString());
            devToUpdate.addProperty("location", device.getLocation());
            devToUpdate.addProperty("deviceowner", user.get("name").getAsString());
            devToUpdate.addProperty("height", device.getHeight());
            devToUpdate.addProperty("name", device.getName());

            database("devicesdb").update(devToUpdate);

            return true;

        } else {
            return false;
        }
    }

    public JsonArray getMyDevices(Authentication authentication){

        Selector selector = eq("email", authentication.getPrincipal());
        JsonArray devArray = new JsonArray();

        try {
            List<JsonObject> devicesList = database("devicesdb").
                    query(new QueryBuilder(selector).
                            build(), JsonObject.class).getDocs();

            devArray = new JsonParser().parse(devicesList.toString()).getAsJsonArray();

            return devArray;

        } catch (Exception e){
            e.printStackTrace();
            return devArray;
        }
    }

    public JsonArray getDevData(JsonObject dataQuery, String dbToUse){

        Selector selector = and(gt("timestamp", dataQuery.get("stopTime")), lt("timestamp", dataQuery.get("startTime")),
                eq("deviceid",dataQuery.get("deviceId")));
        QueryResult<JsonObject> devData = database(dbToUse).
                query(new QueryBuilder(selector).sort(Sort.desc("timestamp")).
                        build(), JsonObject.class);

        JsonArray dataArray = new JsonParser().parse(devData.getDocs().toString()).getAsJsonArray();

        return dataArray;
    }

    public JsonObject getDeviceData(JsonObject reqData){
        return database("devicesdb").find(JsonObject.class, reqData.get("deviceId").getAsString());
    }

    public JsonArray getEvents(JsonObject dataQuery, String dbToUse){
        Selector selector = and(gt("timestamp", dataQuery.get("stopTime")), lt("timestamp", dataQuery.get("startTime")),
                eq("datatype", dataQuery.get("datatype")));
        QueryResult<JsonObject> devData = database(dbToUse).
                query(new QueryBuilder(selector).sort(Sort.desc("timestamp")).
                        build(), JsonObject.class);

        JsonArray dataArray = new JsonParser().parse(devData.getDocs().toString()).getAsJsonArray();

        return dataArray;
    }

    public JsonObject updateDeviceSettings(JsonObject deviceSettings){

        JsonObject resp = new JsonObject();
        JsonObject devToUpdate = database("devicesdb").find(JsonObject.class,deviceSettings.get("deviceId").getAsString());

        devToUpdate.addProperty("email", deviceSettings.get("email").getAsString());
        devToUpdate.addProperty("location", deviceSettings.get("location").getAsString());
        devToUpdate.addProperty("phone", deviceSettings.get("phone").getAsString());
        devToUpdate.addProperty("waterMinValue", deviceSettings.get("waterMinValue").getAsString());
        devToUpdate.addProperty("waterMaxValue", deviceSettings.get("waterMaxValue").getAsString());
        devToUpdate.addProperty("sendEmail", deviceSettings.get("sendEmail").getAsString());
        devToUpdate.addProperty("sendSMS", deviceSettings.get("sendSMS").getAsString());
        devToUpdate.addProperty("height", deviceSettings.get("height").getAsString());

        try {
            database("devicesdb").update(devToUpdate);
            resp.addProperty("status", true);
        } catch (Exception e){
            resp.addProperty("status", false);
        }

        return resp;
    }

    public List<DeviceType> getDeviceTypes(){

        List<DeviceType> devicetypes = new ArrayList<>();

        try {

            List<JsonObject> devTypes = database("devicetypes").getAllDocsRequestBuilder()
                    .includeDocs(true).build().getResponse().getDocsAs(JsonObject.class);


            for (int i = 0; i<devTypes.size(); i++){
                DeviceType devtype = new DeviceType();
                devtype.setId(devTypes.get(i).getAsJsonObject().get("_id").getAsString());
                devtype.setName(devTypes.get(i).getAsJsonObject().get("name").getAsString());
                devicetypes.add(devtype);
            }

        } catch (Exception e){
            e.printStackTrace();
        }

        return devicetypes;
    }

    public boolean registerNewDevice(Device device){
        System.out.println(device);

        Commons commons = new Commons();

        JsonObject newDevice = new JsonParser().parse(device.toString()).getAsJsonObject();
        newDevice.addProperty("_id", device.getId());
        newDevice.addProperty("deviceowner", "Voltarent");
        newDevice.addProperty("email", "info@voltarent.co.ke");
        newDevice.addProperty("location", "Voltarent Lab/Storage");
        newDevice.addProperty("timestamp", commons.Timestamp());
        newDevice.addProperty("phone", "0715794913");
        newDevice.addProperty("name", "#######");

        try {
            database("devicesdb").save(newDevice);
            return true;
        } catch (Exception e){
            return false;
        }
    }

    public JsonArray getDevices(){

        JsonParser parser = new JsonParser();
        JsonArray devList = new JsonArray();

        try {
            List<JsonObject> devices = database("devicesdb").getAllDocsRequestBuilder()
                    .includeDocs(true).build().getResponse().getDocsAs(JsonObject.class);

            devList = parser.parse(devices.toString()).getAsJsonArray();

        } catch (Exception e){
            e.printStackTrace();
        }

        return devList;

    }

    public List<Device> getDeviceList(String type){

        List<Device> devices = new ArrayList<>();
        Selector selector = new Selector() {
        };

        switch (type) {
            case "wlm":
                selector =  or(eq("devicetype","swlm"), eq("devicetype","mwlm"));
                break;

            case "emd":
                selector =  or(eq("devicetype","memd"), eq("devicetype","semd"));
                break;
        }

        try {
            List<JsonObject> devicesList = database("devicesdb").
                    query(new QueryBuilder(selector).
                            build(), JsonObject.class).getDocs();

            for (int i = 0; i < devicesList.size(); i++){
                Device device = new Device();
                device.setId(devicesList.get(i).getAsJsonObject().get("id").getAsString());
                device.setImsi(devicesList.get(i).getAsJsonObject().get("imsi").getAsString());
                devices.add(device);
            }

        } catch (Exception e){
            e.printStackTrace();
        }

        System.out.println(devices);

        return devices;
    }

    public boolean regDeviceTypes(){
        JsonObject devType = new JsonObject();

        devType.addProperty("_id", "gctrl");
        devType.addProperty("name", "Greenhouse Controller");

        try {
            database("devicetypes").save(devType);
            return true;
        } catch (Exception e){
            return false;
        }
    }

    private Database database(String dbName){
        CloudantClient client = ClientBuilder.account(user)
                .username(user)
                .password(password)
                .build();

        return client.database(dbName, false);
    }
}
