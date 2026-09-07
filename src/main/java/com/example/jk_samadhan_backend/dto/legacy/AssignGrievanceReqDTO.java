package com.example.jk_samadhan_backend.dto.legacy;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssignGrievanceReqDTO {
    private String grievanceUniqId;
    private String targetUsername;
    private boolean sendBack;
    private String authority;
    private String forwardType;
    private Integer userLevel;
    private String remark;
}
