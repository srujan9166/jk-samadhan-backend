package com.example.jk_samadhan_backend.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.jk_samadhan_backend.dto.ForgotPasswordDTO;
import com.example.jk_samadhan_backend.dto.LoginDTO;
import com.example.jk_samadhan_backend.dto.RegisterDTO;
import com.example.jk_samadhan_backend.services.AuthService;
import com.example.jk_samadhan_backend.services.CaptchaService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final CaptchaService captchaService;

    public AuthController(AuthService authService, CaptchaService captchaService) {
        this.authService = authService;
        this.captchaService = captchaService;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody RegisterDTO registerDTO) throws Exception {
        return ResponseEntity.ok().body(authService.signup(registerDTO));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginDTO loginDTO) {
        return ResponseEntity.ok().body(authService.login(loginDTO));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordDTO forgotPasswordDTO) {
        return ResponseEntity.ok().body(authService.forgotPassword(forgotPasswordDTO));
    }

    @PostMapping("/captcha")
    public ResponseEntity<?> getCaptcha() {
        try {
            return ResponseEntity.ok().body(captchaService.generateCaptcha());
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(java.util.Collections.singletonMap("error", e.getMessage()));
        }
    }

}
