package com.cse435.resumescreening.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "Welcome to Resume Screening System API!\n\n" +
               "Available endpoints:\n" +
               "- POST /api/auth/register - Register new user\n" +
               "- POST /api/auth/login - User login\n" +
               "- GET /h2-console - Database console\n\n" +
               "Protected endpoints require JWT authentication.";
    }

    @GetMapping("/home")
    public String homePage() {
        return home();
    }
}
