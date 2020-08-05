package com.iota.demo.controllers;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.iota.demo.services.DevicesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class RestControllers {

    private final JsonParser parser = new JsonParser();

    @Autowired
    DevicesService devicesService;


    @CrossOrigin
    @RequestMapping(value = "/getWLMData",  method = RequestMethod.POST)
    public ResponseEntity<String> getPowerData(@RequestBody String data) throws Exception{
        JsonObject req = parser.parse(data.trim()).getAsJsonObject();
        return new ResponseEntity<>(devicesService.getDevData(req, "wlm").toString(), HttpStatus.OK);
    }

    @CrossOrigin
    @RequestMapping(value = "/getEMDData",  method = RequestMethod.POST)
    public ResponseEntity<String> getEMDData(@RequestBody String data) throws Exception{
        JsonObject req = parser.parse(data.trim()).getAsJsonObject();
        return new ResponseEntity<>(devicesService.getDevData(req, "emd").toString(), HttpStatus.OK);
    }

}
