package com.example.jk_samadhan_backend.dto.legacy;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateNodalReqDTO {
    private String firstName;
    private String middleName;
    private String lastName;
    private String mobile;
    private String email;
    private String departmentName;
    private String officeName;
    private String designationName;
    private String password;
    private String userType;
}
