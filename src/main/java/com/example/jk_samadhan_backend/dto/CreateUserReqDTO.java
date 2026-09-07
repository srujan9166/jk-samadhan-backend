package com.example.jk_samadhan_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateUserReqDTO {
    private String userType;
    private String firstName;
    private String middleName;
    private String lastName;
    private String mobile;
    private String email;
    private String officeName;
    private String designationName;
    private String password;
}
