package com.example.jk_samadhan_backend.controllers;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Test {
    @GetMapping("/auth/test")
    public String test(){
        return new BCryptPasswordEncoder().encode("Admin@123");
    }
}
