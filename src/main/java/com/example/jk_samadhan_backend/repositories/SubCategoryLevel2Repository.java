package com.example.jk_samadhan_backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.jk_samadhan_backend.models.SubCategoryLevel2;
import java.util.List;

@Repository
public interface SubCategoryLevel2Repository extends JpaRepository<SubCategoryLevel2, Integer> {
    List<SubCategoryLevel2> findByParentL1Id(Integer parentL1Id);
}
