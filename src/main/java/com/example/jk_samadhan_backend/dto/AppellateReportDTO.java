package com.example.jk_samadhan_backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppellateReportDTO {
    private Long id;
    private String name;
    private String office;
    private String department;
    private long totalAppeals;
    private long resolved;
    private long pending;
}
