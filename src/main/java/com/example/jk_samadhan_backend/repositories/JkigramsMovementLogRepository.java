package com.example.jk_samadhan_backend.repositories;

import com.example.jk_samadhan_backend.models.JkigramsMovementLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JkigramsMovementLogRepository extends JpaRepository<JkigramsMovementLog, Long> {
    List<JkigramsMovementLog> findByReferenceIdOrderByDateDesc(String referenceId);
    List<JkigramsMovementLog> findByReferenceIdOrderBySnoAsc(String referenceId);
}
