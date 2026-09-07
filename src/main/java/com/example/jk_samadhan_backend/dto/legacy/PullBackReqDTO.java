package com.example.jk_samadhan_backend.dto.legacy;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PullBackReqDTO {
    private String grievanceUniqId;
    private String subUsername;
}
