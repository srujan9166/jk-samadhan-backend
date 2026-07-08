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
    @NotBlank
    private String mobile;
    @NotBlank
    private String password;
   
}
