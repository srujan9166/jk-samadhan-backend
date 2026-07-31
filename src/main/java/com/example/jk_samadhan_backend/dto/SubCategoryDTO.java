package com.example.jk_samadhan_backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubCategoryDTO {
    private Integer id;
    private Integer categoryId;
    private String categoryName;
    private String name;
}
