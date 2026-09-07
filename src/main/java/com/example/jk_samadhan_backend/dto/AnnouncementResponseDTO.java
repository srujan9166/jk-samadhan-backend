package com.example.jk_samadhan_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnnouncementResponseDTO {
    private Integer id;
    private String notification;
    private String notificationsentto;
    private OffsetDateTime validtill;
    private OffsetDateTime createdat;
    private String filepath;
    private String createdby;
    private String status;
    private String type;
    private Integer isactive;
}
