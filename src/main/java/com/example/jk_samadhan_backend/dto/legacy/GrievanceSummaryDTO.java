package com.example.jk_samadhan_backend.dto.legacy;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GrievanceSummaryDTO {
    private Long id;
    private String uniqId;
    private String category;
    private String subCategory;
    private String department;
    private String status;
    private String createdDate;
    private String finalStatus;
    private String application;
    private String keyFlag;
}
