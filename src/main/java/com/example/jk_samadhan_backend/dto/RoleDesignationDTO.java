package com.example.jk_samadhan_backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoleDesignationDTO {
    private Integer id;
    private Integer roleId;
    private String roleName;
    private Integer designationId;
    private String designationName;
    private String createdBy;
    private String createdAt;
}
