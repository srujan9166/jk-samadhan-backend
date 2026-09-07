package com.example.jk_samadhan_backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExportJobStatusDTO {
    private String jobId;
    private String status;
    private int progress;
    private long totalRecords;
    private long processedRecords;
    private String message;
    private String downloadUrl;
}
