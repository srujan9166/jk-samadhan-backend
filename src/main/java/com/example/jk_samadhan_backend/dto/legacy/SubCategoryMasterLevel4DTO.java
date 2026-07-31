package com.example.jk_samadhan_backend.dto.legacy;

import lombok.*;
import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubCategoryMasterLevel4DTO {
    private Long id;
    private String subCategoryLevel4Name;
    private String subCategoryLevel3Name;
    private String subCategoryLevel2Name;
    private String subCategoryName;
    private String categoryName;
    private String departmentName;
    private String createdBy;
    private Date createdDate;
}
