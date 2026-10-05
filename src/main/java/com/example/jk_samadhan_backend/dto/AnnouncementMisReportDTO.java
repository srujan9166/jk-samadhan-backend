package com.example.jk_samadhan_backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnnouncementMisReportDTO {
    private String department;
    private long count;
}
