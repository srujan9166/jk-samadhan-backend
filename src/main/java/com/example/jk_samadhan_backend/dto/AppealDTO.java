package com.example.jk_samadhan_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class AppealDTO {
    private Long grievanceId;
    private String description;
    private String fileName;
    private String filePath;
}
