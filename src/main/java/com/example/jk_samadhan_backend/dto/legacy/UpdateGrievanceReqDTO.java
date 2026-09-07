package com.example.jk_samadhan_backend.dto.legacy;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateGrievanceReqDTO {
    private String grievanceUniqId;
    private String status;
    private String remarks;
    private String fileName;
    private String filePath;
}
