package com.example.jk_samadhan_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeedbackMisReportDTO {
    private String department;
    private long totalGrievances;
    private double satisfiedYesPercent;
    private double satisfiedNoPercent;
    private double callReceivedYesPercent;
    private double callReceivedNoPercent;
    private double experienceExcellentPercent;
    private double experienceGoodPercent;
    private double experienceAveragePercent;
    private double experiencePoorPercent;
}
