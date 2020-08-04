package com.iota.demo.controllers.admin;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AdminController {

    @GetMapping("/admin")
    public String dashboard() {
        return "admin/dashboard";
    }

    @GetMapping("/admin/devices")
    public String myDevices() {
        return "admin/devices";
    }

    @GetMapping("/admin/monitor")
    public String myMonitor() {
        return "admin/monitor";
    }

    @GetMapping("/admin/events")
    public String events() {
        return "admin/events";
    }

    @GetMapping("/admin/settings")
    public String settings() {
        return "admin/settings";
    }
}
