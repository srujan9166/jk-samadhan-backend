package com.example.jk_samadhan_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class GrievanceDTO {
    private String windowType;
    private String department;
    private String grievanceCategory;
    private String pertainDivision;
    private String pertainDistrict;
    private String description;
    

}
