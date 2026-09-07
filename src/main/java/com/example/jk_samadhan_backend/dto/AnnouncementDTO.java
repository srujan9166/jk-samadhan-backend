package com.example.jk_samadhan_backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnnouncementDTO {

    @NotBlank(message = "Recipient (To) is required")
    private String to;

    private String validTill;

    @NotBlank(message = "Announcement text is required")
    private String announcement;
}
