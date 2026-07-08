package com.example.jk_samadhan_backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RegisterDTO {
    @NotBlank
    private String firstName;

    private String middleName;
    @NotBlank
    private String lastName;
    private String username;
    private String password;

    private String confirmPassword;
    @Email
    private String email;
    @NotBlank
    private String gender;
    @NotBlank
    private String dateOfBirth;
    @NotBlank
    private String mobile;
    @NotBlank
    private String address;
    @NotBlank
    private String pincode;
    @NotBlank
    private String state;
    @NotBlank
    private String district;

    @NotBlank
    private String captchaId;
    @NotBlank
    private String captchaCode;

}
