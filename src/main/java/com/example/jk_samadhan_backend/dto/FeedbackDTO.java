package com.example.jk_samadhan_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeedbackDTO {
    private Long id;
    private Long grievanceId;
    private String uniqId;
    private String complainantName;
    private String complainantMobile;
    private String department;
    private String category;
    private String district;
    private String gender;
    private String satisfied;
    private String callReceived;
    private String overallExperience;
    private String timeSatisfaction;
    private String reusePortal;
    private Integer rating1;
    private Integer rating2;
    private Integer feedbackScore;
    private String description;
    private String poorReason;
    private String createdAt;
}
