package com.example.jk_samadhan_backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.jk_samadhan_backend.models.SubCategoryLevel1;
import java.util.List;

@Repository
public interface SubCategoryLevel1Repository extends JpaRepository<SubCategoryLevel1, Integer> {
    List<SubCategoryLevel1> findByCategoryId(Integer categoryId);
}
