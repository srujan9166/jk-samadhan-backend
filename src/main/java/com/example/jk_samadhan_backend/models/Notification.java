package com.example.jk_samadhan_backend.models;

import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "notification", schema = "jks_3nf")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(columnDefinition = "TEXT")
    private String notification;

    private String notificationsentto;

    private OffsetDateTime createdat;

    private OffsetDateTime validtill;

    private String status;

    private String type;

    @Column(columnDefinition = "TEXT")
    private String filepath;

    private String createdby;

    private Integer isactive;

    @Column(name = "user_id")
    private Long userId;
}
