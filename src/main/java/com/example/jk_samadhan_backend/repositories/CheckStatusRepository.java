package com.example.jk_samadhan_backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.jk_samadhan_backend.models.CheckStatus;
import java.util.List;

@Repository
public interface CheckStatusRepository extends JpaRepository<CheckStatus, Long> {
    List<CheckStatus> findByGrievanceId(Long grievanceId);
}
