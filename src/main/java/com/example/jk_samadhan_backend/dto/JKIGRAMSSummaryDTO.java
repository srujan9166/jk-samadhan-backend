package com.example.jk_samadhan_backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JKIGRAMSSummaryDTO {
    private long total;
    private long pending;
    private long resolved;
    private long rejected;
}
