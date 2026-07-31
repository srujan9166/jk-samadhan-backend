package com.example.jk_samadhan_backend.dto.legacy;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {
    private Long id;
    private String username;
    private String firstName;
    private String lastName;
    private String middleName;
    private String email;
    private String mobile;
    private String officeName;
    private String department;
    private String userType;
    private Integer userLevel;
    private String userflag;
    private int enabled;
}
