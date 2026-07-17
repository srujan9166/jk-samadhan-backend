package com.example.jk_samadhan_backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.jk_samadhan_backend.models.AppealMaster;
import java.util.Optional;
import java.util.List;

@Repository
public interface AppealMasterRepository extends JpaRepository<AppealMaster, Long> {
    Optional<AppealMaster> findByAppealUniqId(String appealUniqId);
    List<AppealMaster> findBySubmittedById(Long submittedById);
    List<AppealMaster> findByAppealedToId(Long appealedToId);
}
