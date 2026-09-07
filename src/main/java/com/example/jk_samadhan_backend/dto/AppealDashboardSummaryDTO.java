package com.example.jk_samadhan_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppealDashboardSummaryDTO {
    private long totalAppeals;
    private long appealDisposed;
    private long appealsRejected;
    private long appealsPending;
    private long appealsUnderProcess;
    private long appealsOpen;
    private long appealsClosed;
    private double disposalPercentage;
    private long remarksReceived;
}
