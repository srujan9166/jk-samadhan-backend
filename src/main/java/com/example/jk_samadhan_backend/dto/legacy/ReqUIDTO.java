package com.example.jk_samadhan_backend.dto.legacy;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReqUIDTO {
    private String department_name;
    private String category;
    private String sub_category;
    private String sub_Cat_Next_Level2;
    private String sub_Cat_Next_Level3;
    private String sub_Cat_Next_Level4;
    private Long reminderInDays;
    private String sessionname;
    private String sessionvalue;
}
