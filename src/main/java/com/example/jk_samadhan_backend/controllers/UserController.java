package com.example.jk_samadhan_backend.controllers;

import java.security.Principal;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
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
    public ResponseEntity<Map<String, String>> getProfile(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }

        Users user = null;
        if (principal instanceof Authentication auth && auth.getPrincipal() instanceof Users authUser) {
            user = authUser;
        } else {
            String identifier = principal.getName();
            user = userRepository.findByIdentifier(identifier).orElse(null);
        }

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(user.toProfileMap());
    }
}
