package com.example.jk_samadhan_backend.dto;

public interface AppealMisReportProjection {
    String getDepartment();
    Long getTotalAppeals();
    Long getAppealsDisposed();
    Long getAppealsRejected();
    Long getAppealsPending();
    Long getAppealsUnderProcess();
    Long getAppealsOpen();
    Long getAppealsClosed();
    Double getDisposalPercentage();
}
