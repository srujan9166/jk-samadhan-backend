package com.example.jk_samadhan_backend.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SuperAdminExportJob {
    private String jobId;
    private String initiatedBy;
    @Builder.Default
    private String status = "PROCESSING";
    @Builder.Default
    private int progress = 0;
    @Builder.Default
    private long totalRecords = 0;
    @Builder.Default
    private long processedRecords = 0;
    private String filePath;
    private String fileName;
    private String errorMessage;
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime completedAt;
}
