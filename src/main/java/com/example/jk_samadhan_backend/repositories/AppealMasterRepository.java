package com.example.jk_samadhan_backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.jk_samadhan_backend.models.AppealMaster;
import java.util.Optional;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface AppealMasterRepository extends JpaRepository<AppealMaster, Long> {
    Optional<AppealMaster> findByAppealUniqId(String appealUniqId);
    List<AppealMaster> findBySubmittedById(Long submittedById);
    List<AppealMaster> findByAppealedToId(Long appealedToId);

    @Query("SELECT a FROM AppealMaster a WHERE a.grievance.category.department.id = :deptId")
    List<AppealMaster> findByDepartmentId(@Param("deptId") Integer deptId);

    @Query("SELECT a FROM AppealMaster a WHERE a.grievance.district.id = :districtId")
    List<AppealMaster> findByDistrictId(@Param("districtId") Integer districtId);
}
