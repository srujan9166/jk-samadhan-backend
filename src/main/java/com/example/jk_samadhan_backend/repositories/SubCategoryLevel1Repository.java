package com.example.jk_samadhan_backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.jk_samadhan_backend.models.SubCategoryLevel1;
import java.util.List;

import java.util.Optional;

@Repository
public interface SubCategoryLevel1Repository extends JpaRepository<SubCategoryLevel1, Integer> {
    List<SubCategoryLevel1> findByCategoryId(Integer categoryId);
    Optional<SubCategoryLevel1> findByNameIgnoreCaseAndCategoryId(String name, Integer categoryId);
    List<SubCategoryLevel1> findAllByNameIgnoreCaseAndCategoryId(String name, Integer categoryId);
}

