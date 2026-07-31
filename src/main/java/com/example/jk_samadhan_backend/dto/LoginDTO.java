package com.example.jk_samadhan_backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class LoginDTO {
    private String mobile;
    private String username;
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    private String otpCode;

    public String getIdentifier() {
        if (this.username != null && !this.username.trim().isEmpty()) {
            return this.username.trim();
        }
        if (this.email != null && !this.email.trim().isEmpty()) {
            return this.email.trim();
        }
        if (this.mobile != null && !this.mobile.trim().isEmpty()) {
            return this.mobile.trim();
        }
        return null;
    }
}
