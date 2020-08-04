package com.iota.demo.controllers;

import com.google.gson.JsonParser;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class RestControllers {

    private final JsonParser parser = new JsonParser();

//    @Autowired
//    DataService dataService;
//
//    @Autowired
//    DashboardView dashboardView;
//
//    @Autowired
//    GreenHouseView greenHouseView;
//
//    @CrossOrigin
//    @RequestMapping(value = "/",  method = RequestMethod.GET)
//    public ResponseEntity<String> home() {
//        return new ResponseEntity<>("Green House Data Service is online... :-)", HttpStatus.OK);
//    }
//
//    @CrossOrigin
//    @RequestMapping(value = "/event",  method = RequestMethod.POST, headers="Accept=application/json")
//    public ResponseEntity<Boolean> wlmData(@RequestBody  String data) throws Exception{
//        dataService.processDeviceData(parser.parse(data).getAsJsonObject());
//        return new ResponseEntity<>(HttpStatus.OK);
//    }
//
//    @CrossOrigin
//    @RequestMapping(value = "/dashboard",  method = RequestMethod.GET, headers="Accept=application/json")
//    public ResponseEntity<String> dashData() throws Exception{
//        return new ResponseEntity<>(dashboardView.getDashboardViewData().toString(), HttpStatus.OK);
//    }
//
//    @CrossOrigin
//    @RequestMapping(value = "/ghdata",  method = RequestMethod.GET, headers="Accept=application/json")
//    public ResponseEntity<String> greenhouseData() throws Exception{
//        return new ResponseEntity<>(greenHouseView.getGreenHouseViewData().toString(), HttpStatus.OK);
//    }

}
