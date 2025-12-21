package com.project.dashboard.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {

    // This ensures that accessing http://localhost:8080/ serves the index.html
    @GetMapping("/")
    public String home() {
        return "index.html"; 
    }
    
    // Optional: A test endpoint to prove Backend API connectivity
    // You can call this from your frontend later if you want to add backend features
    @GetMapping("/api/status")
    public String apiStatus() {
        return "Backend is active and running!";
    }
}