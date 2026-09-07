package com.example.jk_samadhan_backend.repositories;

import com.example.jk_samadhan_backend.models.CpgramGrievanceMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import java.util.Optional;

@Repository
public interface CpgramGrievanceMasterRepository extends JpaRepository<CpgramGrievanceMaster, Integer>, JpaSpecificationExecutor<CpgramGrievanceMaster> {

    Optional<CpgramGrievanceMaster> findByRegistrationNo(String registrationNo);

    @Query("SELECT COUNT(c) FROM CpgramGrievanceMaster c")
    long countAll();

    @Query("SELECT COUNT(c) FROM CpgramGrievanceMaster c WHERE c.status = :status")
    long countByStatus(@Param("status") String status);

    @Query("SELECT COUNT(c) FROM CpgramGrievanceMaster c WHERE UPPER(TRIM(c.forwardedDepartment)) = UPPER(TRIM(:deptName))")
    long countByForwardedDepartment(@Param("deptName") String deptName);

    @Query("SELECT COUNT(c) FROM CpgramGrievanceMaster c WHERE UPPER(TRIM(c.forwardedDepartment)) = UPPER(TRIM(:deptName)) AND c.status = :status")
    long countByForwardedDepartmentAndStatus(@Param("deptName") String deptName, @Param("status") String status);

    @Query("SELECT COUNT(c) FROM CpgramGrievanceMaster c WHERE UPPER(TRIM(c.district)) = UPPER(TRIM(:districtName))")
    long countByDistrict(@Param("districtName") String districtName);

    @Query("SELECT COUNT(c) FROM CpgramGrievanceMaster c WHERE UPPER(TRIM(c.district)) = UPPER(TRIM(:districtName)) AND c.status = :status")
    long countByDistrictAndStatus(@Param("districtName") String districtName, @Param("status") String status);

    @Query("SELECT c FROM CpgramGrievanceMaster c WHERE UPPER(TRIM(c.forwardedDepartment)) = UPPER(TRIM(:deptName))")
    List<CpgramGrievanceMaster> findByForwardedDepartment(@Param("deptName") String deptName);

    @Query("SELECT c FROM CpgramGrievanceMaster c WHERE UPPER(TRIM(c.district)) = UPPER(TRIM(:districtName))")
    List<CpgramGrievanceMaster> findByDistrict(@Param("districtName") String districtName);
}
