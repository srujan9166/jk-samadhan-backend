package com.example.jk_samadhan_backend.controllers;

import java.security.Principal;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.jk_samadhan_backend.models.Users;
import com.example.jk_samadhan_backend.repositories.UserRepository;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/me")
    public ResponseEntity<Users> getProfile(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        String mobile = principal.getName();
        return userRepository.findByMobile(mobile)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
