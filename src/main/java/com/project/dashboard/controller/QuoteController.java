package com.project.dashboard.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
public class QuoteController {

    @GetMapping(value = "/api/quote", produces = "application/json")
    public String getQuote() {
        // The Java Server fetches the data from the external API
        String externalUrl = "https://dummyjson.com/quotes/random";
        RestTemplate restTemplate = new RestTemplate();

        // It returns the raw JSON directly to your frontend
        return restTemplate.getForObject(externalUrl, String.class);
    }
}