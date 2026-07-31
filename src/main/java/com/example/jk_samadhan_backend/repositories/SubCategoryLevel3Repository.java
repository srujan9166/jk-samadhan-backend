package com.example.jk_samadhan_backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.jk_samadhan_backend.models.SubCategoryLevel3;
import java.util.List;

import java.util.Optional;

@Repository
public interface SubCategoryLevel3Repository extends JpaRepository<SubCategoryLevel3, Integer> {
    List<SubCategoryLevel3> findByParentL2Id(Integer parentL2Id);
    Optional<SubCategoryLevel3> findByNameIgnoreCaseAndParentL2Id(String name, Integer parentL2Id);
}

