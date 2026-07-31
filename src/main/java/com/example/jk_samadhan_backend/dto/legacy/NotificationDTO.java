package com.example.jk_samadhan_backend.dto.legacy;

import lombok.*;
import java.time.OffsetDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationDTO {
    private Integer id;
    private String notification;
    private String notificationsentto;
    private OffsetDateTime createdat;
    private OffsetDateTime validtill;
    private String status;
    private String type;
    private String filepath;
    private String createdby;
    private int isactive;
}
