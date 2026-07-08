package com.example.jk_samadhan_backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ForgotPasswordDTO {
    @NotBlank
    private String mobile;
    @NotBlank
    private String password;
    @NotBlank
    private String confirmPassword;

}
