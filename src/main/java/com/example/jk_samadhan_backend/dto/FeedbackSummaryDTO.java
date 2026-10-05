package com.example.jk_samadhan_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeedbackSummaryDTO {
    private long totalFeedbacks;
    private long satisfiedYesCount;
    private long satisfiedNoCount;
    private double satisfiedYesPercent;
    private double satisfiedNoPercent;

    private long callReceivedYesCount;
    private long callReceivedNoCount;
    private double callReceivedYesPercent;
    private double callReceivedNoPercent;

    private long experienceExcellentCount;
    private long experienceGoodCount;
    private long experienceAverageCount;
    private long experiencePoorCount;

    private double experienceExcellentPercent;
    private double experienceGoodPercent;
    private double experienceAveragePercent;
    private double experiencePoorPercent;

    private long timeVerySatisfiedCount;
    private long timeSatisfiedCount;
    private long timeDissatisfiedCount;

    private long reuseYesDefinitelyCount;
    private long reuseMaybeLessTimeCount;
    private long reuseNoNeverCount;
    private long reuseProcessChangeCount;

    private double avgRating;
}
