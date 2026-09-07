package com.example.jk_samadhan_backend.repositories;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Pageable;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import com.example.jk_samadhan_backend.models.GrievanceMaster;
import com.example.jk_samadhan_backend.dto.GrievanceProjection;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface GrievanceMasterRepository extends JpaRepository<GrievanceMaster, Long>, JpaSpecificationExecutor<GrievanceMaster> {
    Optional<List<GrievanceMaster>> findBySubmittedByMobile(String mobile);

    Optional<GrievanceMaster> findById(Long id);

    Optional<GrievanceMaster> findByUniqId(String uniqId);

    @Query("SELECT DISTINCT g FROM GrievanceMaster g LEFT JOIN FETCH g.category c LEFT JOIN FETCH c.department d LEFT JOIN FETCH g.district dist LEFT JOIN FETCH g.submittedBy u LEFT JOIN FETCH g.subCatL1 s1 WHERE u.mobile = :mobile")
    Optional<List<GrievanceMaster>> findBySubmittedByMobileWithAssociations(@Param("mobile") String mobile);

    @Query("SELECT DISTINCT g FROM GrievanceMaster g LEFT JOIN FETCH g.category c LEFT JOIN FETCH c.department d LEFT JOIN FETCH g.district dist LEFT JOIN FETCH g.submittedBy u LEFT JOIN FETCH g.subCatL1 s1")
    List<GrievanceMaster> findAllWithAssociations(Pageable pageable);

    @Query("SELECT DISTINCT g FROM GrievanceMaster g LEFT JOIN FETCH g.category c LEFT JOIN FETCH c.department d LEFT JOIN FETCH g.district dist LEFT JOIN FETCH g.submittedBy u LEFT JOIN FETCH g.subCatL1 s1 WHERE d.id = :deptId")
    List<GrievanceMaster> findByDepartmentIdWithAssociations(@Param("deptId") Integer deptId, Pageable pageable);

    @Query("SELECT DISTINCT g FROM GrievanceMaster g LEFT JOIN FETCH g.category c LEFT JOIN FETCH c.department d LEFT JOIN FETCH g.district dist LEFT JOIN FETCH g.submittedBy u LEFT JOIN FETCH g.subCatL1 s1 WHERE dist.id = :districtId")
    List<GrievanceMaster> findByDistrictIdWithAssociations(@Param("districtId") Integer districtId, Pageable pageable);

    @Query("SELECT DISTINCT g FROM AssignedUsers au JOIN au.grievance g LEFT JOIN FETCH g.category c LEFT JOIN FETCH c.department d LEFT JOIN FETCH g.district dist LEFT JOIN FETCH g.submittedBy u LEFT JOIN FETCH g.subCatL1 s1 WHERE au.assignedTo.id = :userId AND au.enabled = true")
    List<GrievanceMaster> findAssignedGrievancesWithAssociations(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT DISTINCT g FROM GrievanceMaster g LEFT JOIN FETCH g.category c LEFT JOIN FETCH c.department d LEFT JOIN FETCH g.district dist LEFT JOIN FETCH g.submittedBy u LEFT JOIN FETCH g.subCatL1 s1 WHERE u.id = :userId")
    List<GrievanceMaster> findBySubmittedByIdWithAssociations(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT DISTINCT g FROM GrievanceMaster g LEFT JOIN FETCH g.category c LEFT JOIN FETCH c.department d LEFT JOIN FETCH g.district dist LEFT JOIN FETCH g.submittedBy u LEFT JOIN FETCH g.subCatL1 s1 WHERE LOWER(g.uniqId) LIKE LOWER(CONCAT('%', :search, '%'))")
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

    // --- PROJECTION QUERIES FOR PERFORMANCE OPTIMIZATION ---
    @Query("SELECT g.id as id, g.uniqId as uniqId, g.description as description, g.status as status, g.finalStatus as finalStatus, " +
           "g.origin as origin, c.name as categoryName, d.name as deptName, dist.name as districtName, " +
           "u.id as submitterId, u.firstName as submitterFirstName, u.middleName as submitterMiddleName, u.lastName as submitterLastName, u.mobile as submitterMobile, u.email as submitterEmail, u.gender as submitterGender, " +
           "g.latitude as latitude, g.longitude as longitude, g.keyFlag as keyFlag, g.psga as psga, " +
           "g.fileName as fileName, g.filePath as filePath, g.fileType as fileType, " +
           "g.secondFileName as secondFileName, g.secondFilePath as secondFilePath, g.secondFileType as secondFileType, " +
           "g.ackSlipName as ackSlipName, g.ackSlipPath as ackSlipPath, g.cpgramRegNo as cpgramRegNo, " +
           "g.createdAt as createdAt, g.updatedAt as updatedAt, s1.name as subCategoryName " +
           "FROM GrievanceMaster g " +
           "LEFT JOIN g.category c " +
           "LEFT JOIN c.department d " +
           "LEFT JOIN g.district dist " +
           "LEFT JOIN g.submittedBy u " +
           "LEFT JOIN g.subCatL1 s1")
    List<GrievanceProjection> findAllProjections(Pageable pageable);

    @Query("SELECT g.id as id, g.uniqId as uniqId, g.description as description, g.status as status, g.finalStatus as finalStatus, " +
           "g.origin as origin, c.name as categoryName, d.name as deptName, dist.name as districtName, " +
           "u.id as submitterId, u.firstName as submitterFirstName, u.middleName as submitterMiddleName, u.lastName as submitterLastName, u.mobile as submitterMobile, u.email as submitterEmail, u.gender as submitterGender, " +
           "g.latitude as latitude, g.longitude as longitude, g.keyFlag as keyFlag, g.psga as psga, " +
           "g.fileName as fileName, g.filePath as filePath, g.fileType as fileType, " +
           "g.secondFileName as secondFileName, g.secondFilePath as secondFilePath, g.secondFileType as secondFileType, " +
           "g.ackSlipName as ackSlipName, g.ackSlipPath as ackSlipPath, g.cpgramRegNo as cpgramRegNo, " +
           "g.createdAt as createdAt, g.updatedAt as updatedAt, s1.name as subCategoryName " +
           "FROM GrievanceMaster g " +
           "LEFT JOIN g.category c " +
           "LEFT JOIN c.department d " +
           "LEFT JOIN g.district dist " +
           "LEFT JOIN g.submittedBy u " +
           "LEFT JOIN g.subCatL1 s1 " +
           "WHERE d.id = :deptId")
    List<GrievanceProjection> findProjectionsByDepartmentId(@Param("deptId") Integer deptId, Pageable pageable);

    @Query("SELECT g.id as id, g.uniqId as uniqId, g.description as description, g.status as status, g.finalStatus as finalStatus, " +
           "g.origin as origin, c.name as categoryName, d.name as deptName, dist.name as districtName, " +
           "u.id as submitterId, u.firstName as submitterFirstName, u.middleName as submitterMiddleName, u.lastName as submitterLastName, u.mobile as submitterMobile, u.email as submitterEmail, u.gender as submitterGender, " +
           "g.latitude as latitude, g.longitude as longitude, g.keyFlag as keyFlag, g.psga as psga, " +
           "g.fileName as fileName, g.filePath as filePath, g.fileType as fileType, " +
           "g.secondFileName as secondFileName, g.secondFilePath as secondFilePath, g.secondFileType as secondFileType, " +
           "g.ackSlipName as ackSlipName, g.ackSlipPath as ackSlipPath, g.cpgramRegNo as cpgramRegNo, " +
           "g.createdAt as createdAt, g.updatedAt as updatedAt, s1.name as subCategoryName " +
           "FROM GrievanceMaster g " +
           "LEFT JOIN g.category c " +
           "LEFT JOIN c.department d " +
           "LEFT JOIN g.district dist " +
           "LEFT JOIN g.submittedBy u " +
           "LEFT JOIN g.subCatL1 s1 " +
           "WHERE dist.id = :districtId")
    List<GrievanceProjection> findProjectionsByDistrictId(@Param("districtId") Integer districtId, Pageable pageable);

    @Query("SELECT g.id as id, g.uniqId as uniqId, g.description as description, g.status as status, g.finalStatus as finalStatus, " +
           "g.origin as origin, c.name as categoryName, d.name as deptName, dist.name as districtName, " +
           "u.id as submitterId, u.firstName as submitterFirstName, u.middleName as submitterMiddleName, u.lastName as submitterLastName, u.mobile as submitterMobile, u.email as submitterEmail, u.gender as submitterGender, " +
           "g.latitude as latitude, g.longitude as longitude, g.keyFlag as keyFlag, g.psga as psga, " +
           "g.fileName as fileName, g.filePath as filePath, g.fileType as fileType, " +
           "g.secondFileName as secondFileName, g.secondFilePath as secondFilePath, g.secondFileType as secondFileType, " +
           "g.ackSlipName as ackSlipName, g.ackSlipPath as ackSlipPath, g.cpgramRegNo as cpgramRegNo, " +
           "g.createdAt as createdAt, g.updatedAt as updatedAt, s1.name as subCategoryName " +
           "FROM AssignedUsers au JOIN au.grievance g " +
           "LEFT JOIN g.category c " +
           "LEFT JOIN c.department d " +
           "LEFT JOIN g.district dist " +
           "LEFT JOIN g.submittedBy u " +
           "LEFT JOIN g.subCatL1 s1 " +
           "WHERE au.assignedTo.id = :userId AND au.enabled = true")
    List<GrievanceProjection> findAssignedProjectionsByUserId(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT g.id as id, g.uniqId as uniqId, g.description as description, g.status as status, g.finalStatus as finalStatus, " +
           "g.origin as origin, c.name as categoryName, d.name as deptName, dist.name as districtName, " +
           "u.id as submitterId, u.firstName as submitterFirstName, u.middleName as submitterMiddleName, u.lastName as submitterLastName, u.mobile as submitterMobile, u.email as submitterEmail, u.gender as submitterGender, " +
           "g.latitude as latitude, g.longitude as longitude, g.keyFlag as keyFlag, g.psga as psga, " +
           "g.fileName as fileName, g.filePath as filePath, g.fileType as fileType, " +
           "g.secondFileName as secondFileName, g.secondFilePath as secondFilePath, g.secondFileType as secondFileType, " +
           "g.ackSlipName as ackSlipName, g.ackSlipPath as ackSlipPath, g.cpgramRegNo as cpgramRegNo, " +
           "g.createdAt as createdAt, g.updatedAt as updatedAt, s1.name as subCategoryName " +
           "FROM GrievanceMaster g " +
           "LEFT JOIN g.category c " +
           "LEFT JOIN c.department d " +
           "LEFT JOIN g.district dist " +
           "LEFT JOIN g.submittedBy u " +
           "LEFT JOIN g.subCatL1 s1 " +
           "WHERE u.id = :userId")
    List<GrievanceProjection> findProjectionsBySubmittedById(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT g.id as id, g.uniqId as uniqId, g.description as description, g.status as status, g.finalStatus as finalStatus, " +
           "g.origin as origin, c.name as categoryName, d.name as deptName, dist.name as districtName, " +
           "u.id as submitterId, u.firstName as submitterFirstName, u.middleName as submitterMiddleName, u.lastName as submitterLastName, u.mobile as submitterMobile, u.email as submitterEmail, u.gender as submitterGender, " +
           "g.latitude as latitude, g.longitude as longitude, g.keyFlag as keyFlag, g.psga as psga, " +
           "g.fileName as fileName, g.filePath as filePath, g.fileType as fileType, " +
           "g.secondFileName as secondFileName, g.secondFilePath as secondFilePath, g.secondFileType as secondFileType, " +
           "g.ackSlipName as ackSlipName, g.ackSlipPath as ackSlipPath, g.cpgramRegNo as cpgramRegNo, " +
           "g.createdAt as createdAt, g.updatedAt as updatedAt, s1.name as subCategoryName " +
           "FROM GrievanceMaster g " +
           "LEFT JOIN g.category c " +
           "LEFT JOIN c.department d " +
           "LEFT JOIN g.district dist " +
           "LEFT JOIN g.submittedBy u " +
           "LEFT JOIN g.subCatL1 s1 " +
           "WHERE LOWER(g.uniqId) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<GrievanceProjection> findProjectionsBySearch(@Param("search") String search, Pageable pageable);
}
