package com.example.jk_samadhan_backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardCountsDTO {
    private long total;
    private long pending;
    private long resolved;
    private long rejected;
    private long forwarded;
    private long closed;
    private long priority;
    private long normal;
    private long urgent;
    private long inProgress;
    private long doesNotPertain;
}
