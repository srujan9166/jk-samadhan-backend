package com.example.jk_samadhan_backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.jk_samadhan_backend.models.SubCategoryLevel4;
import java.util.List;

@Repository
public interface SubCategoryLevel4Repository extends JpaRepository<SubCategoryLevel4, Integer> {
    List<SubCategoryLevel4> findByParentL3Id(Integer parentL3Id);
}
