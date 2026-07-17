package com.example.jk_samadhan_backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.jk_samadhan_backend.models.GrievanceHistory;
import java.util.List;

@Repository
public interface GrievanceHistoryRepository extends JpaRepository<GrievanceHistory, Long> {
    List<GrievanceHistory> findByGrievanceIdOrderByCreatedAtDesc(Long grievanceId);
}
