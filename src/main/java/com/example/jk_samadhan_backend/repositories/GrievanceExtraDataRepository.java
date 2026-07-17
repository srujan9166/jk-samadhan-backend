package com.example.jk_samadhan_backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.jk_samadhan_backend.models.GrievanceExtraData;
import java.util.List;
import java.util.Optional;

@Repository
public interface GrievanceExtraDataRepository extends JpaRepository<GrievanceExtraData, Long> {
    List<GrievanceExtraData> findByGrievanceId(Long grievanceId);
    Optional<GrievanceExtraData> findByGrievanceIdAndDataKey(Long grievanceId, String dataKey);
}
