package com.example.jk_samadhan_backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.jk_samadhan_backend.models.Block;
import java.util.List;

@Repository
public interface BlockRepository extends JpaRepository<Block, Integer> {
    List<Block> findByDistrictId(Integer districtId);
    java.util.Optional<Block> findByNameIgnoreCaseAndDistrictId(String name, Integer districtId);
    List<Block> findAllByNameIgnoreCaseAndDistrictId(String name, Integer districtId);
}
