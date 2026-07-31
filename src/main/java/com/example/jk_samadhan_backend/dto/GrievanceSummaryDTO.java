package com.example.jk_samadhan_backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GrievanceSummaryDTO {
    private Long id;
    private String uniqId;
    private String description;
    private String status;
    private String finalStatus;
    private String origin;
    private String category;
    private String department;
    private String district;
    private String submittedBy;
    private String createdAt;
    private String updatedAt;
    private String keyFlag;
}
