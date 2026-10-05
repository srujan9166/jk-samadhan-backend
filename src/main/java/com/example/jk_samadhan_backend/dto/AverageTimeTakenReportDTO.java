package com.example.jk_samadhan_backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AverageTimeTakenReportDTO {
    private String name; // Department Name or District Name
    private long totalGrievances;
    private double cumulativeDays;
    private double averageDays;
}
