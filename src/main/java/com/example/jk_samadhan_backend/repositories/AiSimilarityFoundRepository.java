package com.example.jk_samadhan_backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.jk_samadhan_backend.models.AiSimilarityFound;
import java.util.List;

@Repository
public interface AiSimilarityFoundRepository extends JpaRepository<AiSimilarityFound, Long> {
    List<AiSimilarityFound> findByGrievanceId(Long grievanceId);
}
