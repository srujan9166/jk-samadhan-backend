package com.example.jk_samadhan_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RegisterDTO {
    private String firstName;
    private String middleName;
    private String lastName;
    private String username;
    private String password;
    private String confirmPassword;
    private String email;
    private String gender;
    private String dateOfBirth;
    private String mobile;
    private String address;
    private String pincode;
    private String state;
    private String district;
    private String captchaId;
    private String captchaCode;
}
