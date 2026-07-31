package com.example.jk_samadhan_backend.repositories;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Pageable;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.jk_samadhan_backend.models.GrievanceMaster;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface GrievanceMasterRepository extends JpaRepository<GrievanceMaster, Long> {
    Optional<List<GrievanceMaster>> findBySubmittedByMobile(String mobile);

    Optional<GrievanceMaster> findById(Long id);

    @Query("SELECT DISTINCT g FROM GrievanceMaster g LEFT JOIN FETCH g.category c LEFT JOIN FETCH c.department d LEFT JOIN FETCH g.district dist LEFT JOIN FETCH g.submittedBy u WHERE u.mobile = :mobile")
    Optional<List<GrievanceMaster>> findBySubmittedByMobileWithAssociations(@Param("mobile") String mobile);

    @Query("SELECT DISTINCT g FROM GrievanceMaster g LEFT JOIN FETCH g.category c LEFT JOIN FETCH c.department d LEFT JOIN FETCH g.district dist LEFT JOIN FETCH g.submittedBy u")
    List<GrievanceMaster> findAllWithAssociations(Pageable pageable);

    @Query("SELECT DISTINCT g FROM GrievanceMaster g LEFT JOIN FETCH g.category c LEFT JOIN FETCH c.department d LEFT JOIN FETCH g.district dist LEFT JOIN FETCH g.submittedBy u WHERE d.id = :deptId")
    List<GrievanceMaster> findByDepartmentIdWithAssociations(@Param("deptId") Integer deptId, Pageable pageable);

    @Query("SELECT DISTINCT g FROM GrievanceMaster g LEFT JOIN FETCH g.category c LEFT JOIN FETCH c.department d LEFT JOIN FETCH g.district dist LEFT JOIN FETCH g.submittedBy u WHERE dist.id = :districtId")
    List<GrievanceMaster> findByDistrictIdWithAssociations(@Param("districtId") Integer districtId, Pageable pageable);

    @Query("SELECT DISTINCT g FROM AssignedUsers au JOIN au.grievance g LEFT JOIN FETCH g.category c LEFT JOIN FETCH c.department d LEFT JOIN FETCH g.district dist LEFT JOIN FETCH g.submittedBy u WHERE au.assignedTo.id = :userId AND au.enabled = true")
    List<GrievanceMaster> findAssignedGrievancesWithAssociations(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT DISTINCT g FROM GrievanceMaster g LEFT JOIN FETCH g.category c LEFT JOIN FETCH c.department d LEFT JOIN FETCH g.district dist LEFT JOIN FETCH g.submittedBy u WHERE u.id = :userId")
    List<GrievanceMaster> findBySubmittedByIdWithAssociations(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT DISTINCT g FROM GrievanceMaster g LEFT JOIN FETCH g.category c LEFT JOIN FETCH c.department d LEFT JOIN FETCH g.district dist LEFT JOIN FETCH g.submittedBy u WHERE LOWER(g.uniqId) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<GrievanceMaster> findBySearchWithAssociations(@Param("search") String search, Pageable pageable);

    // --- CITIZEN QUERIES ---
    List<GrievanceMaster> findBySubmittedById(Long id);

    @Query("SELECT COUNT(g) FROM GrievanceMaster g WHERE g.submittedBy.id = :userId")
    long countBySubmittedById(@Param("userId") Long userId);

    @Query("SELECT COUNT(g) FROM GrievanceMaster g WHERE g.submittedBy.id = :userId AND g.status = :status")
    long countBySubmittedByIdAndStatus(@Param("userId") Long userId, @Param("status") String status);

    @Query("SELECT COUNT(g) FROM GrievanceMaster g WHERE g.submittedBy.id = :userId AND g.keyFlag = :keyFlag")
    long countBySubmittedByIdAndKeyFlag(@Param("userId") Long userId, @Param("keyFlag") String keyFlag);

    // --- DISTRICT MAGISTRATE (DM) QUERIES ---
    List<GrievanceMaster> findByDistrictId(Integer districtId);

    @Query("SELECT COUNT(g) FROM GrievanceMaster g WHERE g.district.id = :districtId")
    long countByDistrictId(@Param("districtId") Integer districtId);

    @Query("SELECT COUNT(g) FROM GrievanceMaster g WHERE g.district.id = :districtId AND g.status = :status")
    long countByDistrictIdAndStatus(@Param("districtId") Integer districtId, @Param("status") String status);

    @Query("SELECT COUNT(g) FROM GrievanceMaster g WHERE g.district.id = :districtId AND g.keyFlag = :keyFlag")
    long countByDistrictIdAndKeyFlag(@Param("districtId") Integer districtId, @Param("keyFlag") String keyFlag);

    // --- DEPARTMENT / SECRETARY QUERIES ---
    @Query("SELECT g FROM GrievanceMaster g WHERE g.category.department.id = :deptId")
    List<GrievanceMaster> findByDepartmentId(@Param("deptId") Integer deptId);

    @Query("SELECT COUNT(g) FROM GrievanceMaster g WHERE g.category.department.id = :deptId")
    long countByDepartmentId(@Param("deptId") Integer deptId);

    @Query("SELECT COUNT(g) FROM GrievanceMaster g WHERE g.category.department.id = :deptId AND g.status = :status")
    long countByDepartmentIdAndStatus(@Param("deptId") Integer deptId, @Param("status") String status);

    @Query("SELECT COUNT(g) FROM GrievanceMaster g WHERE g.category.department.id = :deptId AND g.keyFlag = :keyFlag")
    long countByDepartmentIdAndKeyFlag(@Param("deptId") Integer deptId, @Param("keyFlag") String keyFlag);

    // --- DEALING HAND / ASSIGNED QUERIES ---
    @Query("SELECT g FROM AssignedUsers au JOIN au.grievance g WHERE au.assignedTo.id = :userId AND au.enabled = true")
    List<GrievanceMaster> findAssignedGrievances(@Param("userId") Long userId);

    @Query("SELECT COUNT(g) FROM AssignedUsers au JOIN au.grievance g WHERE au.assignedTo.id = :userId AND au.enabled = true")
    long countAssignedGrievances(@Param("userId") Long userId);

    @Query("SELECT COUNT(g) FROM AssignedUsers au JOIN au.grievance g WHERE au.assignedTo.id = :userId AND au.enabled = true AND g.status = :status")
    long countAssignedGrievancesByStatus(@Param("userId") Long userId, @Param("status") String status);

    @Query("SELECT COUNT(g) FROM AssignedUsers au JOIN au.grievance g WHERE au.assignedTo.id = :userId AND au.enabled = true AND g.keyFlag = :keyFlag")
    long countAssignedGrievancesByKeyFlag(@Param("userId") Long userId, @Param("keyFlag") String keyFlag);

    // --- ADMIN / GLOBAL QUERIES ---
    @Query("SELECT COUNT(g) FROM GrievanceMaster g WHERE g.status = :status")
    long countByStatus(@Param("status") String status);

    @Query("SELECT COUNT(g) FROM GrievanceMaster g WHERE g.keyFlag = :keyFlag")
    long countByKeyFlag(@Param("keyFlag") String keyFlag);
}
