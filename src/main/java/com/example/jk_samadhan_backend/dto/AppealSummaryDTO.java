package com.example.jk_samadhan_backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppealSummaryDTO {
    private Long id;
    private String appealUniqId;
    private String grievanceUniqId;
    private String description;
    private String status;
    private String appealedTo;
    private String resolvedBy;
    private String submittedBy;
    private String createdAt;
}
