package com.example.jk_samadhan_backend.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.jk_samadhan_backend.models.GrievanceMaster;

@Repository
public interface GrievanceMasterRepository extends JpaRepository<GrievanceMaster, Long> {
    Optional<List<GrievanceMaster>> findBySubmittedByMobile(String mobile);

    Optional<GrievanceMaster> findById(Long id);
}
