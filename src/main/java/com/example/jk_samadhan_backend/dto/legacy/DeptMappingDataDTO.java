package com.example.jk_samadhan_backend.dto.legacy;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeptMappingDataDTO {
    private String keyOne;
    private String keyTwo;
    private String keyThree;
    private String loggedInUserFullName;
    private List<UserDTO> nodalD;
    private List<SubCategoryMasterLevel4DTO> allData;
    private List<String> depts;
    private List<String> cat;
    private String sessionname;
}
