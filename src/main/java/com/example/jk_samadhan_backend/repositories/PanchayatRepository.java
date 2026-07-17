package com.example.jk_samadhan_backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.jk_samadhan_backend.models.Panchayat;
import java.util.List;

@Repository
public interface PanchayatRepository extends JpaRepository<Panchayat, Integer> {
    List<Panchayat> findByBlockId(Integer blockId);
}
