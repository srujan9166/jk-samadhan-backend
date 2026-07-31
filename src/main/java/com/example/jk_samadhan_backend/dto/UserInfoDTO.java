package com.example.jk_samadhan_backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserInfoDTO {
    private String username;
    private String fullName;
    private String email;
    private String mobile;
    private String officeName;
    private String department;
    private String userType;
    private Integer userLevel;
}
