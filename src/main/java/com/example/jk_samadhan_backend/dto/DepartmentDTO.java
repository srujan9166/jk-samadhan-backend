package com.example.jk_samadhan_backend.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DepartmentDTO {
    private Integer id;
    private String name;
    private String type;
    private LocalDateTime createdAt;
    private String createdBy;
}
