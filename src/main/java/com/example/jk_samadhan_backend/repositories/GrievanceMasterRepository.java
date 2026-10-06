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
           "WHERE UPPER(g.origin) = UPPER(:origin)")
    List<GrievanceProjection> findProjectionsByOriginIgnoreCase(@Param("origin") String origin, Pageable pageable);

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

    // --- STATUS WISE REPORT QUERIES ---

    // Department Wise Status Raw Query
    @Query(value = "SELECT COALESCE(d.name, 'Unassigned Department') AS dept_name, " +
           "COUNT(DISTINCT g.id) AS total_count, " +
           "COUNT(DISTINCT CASE WHEN LOWER(g.status) = 'resolved' THEN g.id END) AS resolved_count, " +
           "COUNT(DISTINCT CASE WHEN LOWER(g.status) = 'forwarded' THEN g.id END) AS forwarded_count, " +
           "COUNT(DISTINCT CASE WHEN LOWER(g.status) IN ('dnptoffice', 'does not pertain to this office', 'does not pertain') THEN g.id END) AS dnp_count, " +
           "COUNT(DISTINCT CASE WHEN LOWER(g.status) IN ('pending', 'under process', 'acknowledged', 'submitted') THEN g.id END) AS pending_count, " +
           "COUNT(DISTINCT CASE WHEN LOWER(g.status) = 'rejected' THEN g.id END) AS rejected_count, " +
           "COUNT(DISTINCT CASE WHEN LOWER(g.status) = 'appealed' THEN g.id END) AS appealed_count " +
           "FROM jks_3nf.grievance_master g " +
           "LEFT JOIN jks_3nf.categories cat ON cat.id = g.category_id " +
           "LEFT JOIN jks_3nf.departments d ON d.id = cat.department_id " +
           "WHERE (:search IS NULL OR :search = '' OR LOWER(COALESCE(d.name, '')) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "GROUP BY COALESCE(d.name, 'Unassigned Department') " +
           "ORDER BY total_count DESC",
           nativeQuery = true)
    List<Object[]> fetchDepartmentWiseStatusRaw(@Param("search") String search, Pageable pageable);

    @Query(value = "SELECT COUNT(DISTINCT COALESCE(d.name, 'Unassigned Department')) " +
           "FROM jks_3nf.grievance_master g " +
           "LEFT JOIN jks_3nf.categories cat ON cat.id = g.category_id " +
           "LEFT JOIN jks_3nf.departments d ON d.id = cat.department_id " +
           "WHERE (:search IS NULL OR :search = '' OR LOWER(COALESCE(d.name, '')) LIKE LOWER(CONCAT('%', :search, '%')))",
           nativeQuery = true)
    long countDepartmentWiseStatusRaw(@Param("search") String search);

    // User Wise Status Raw Query
    @Query(value = "SELECT u.id, " +
           "TRIM(CONCAT(COALESCE(u.first_name, ''), ' ', COALESCE(u.middle_name, ''), ' ', COALESCE(u.last_name, ''))), " +
           "CONCAT(COALESCE(u.office_name, 'Office'), ' (', COALESCE(desg.name, 'Officer'), ')'), " +
           "COALESCE(d.name, 'N/A'), " +
           "COALESCE(ut.type_name, ut.name, u.role, 'Officer'), " +
           "COALESCE(dist.name, 'District'), " +
           "u.username, " +
           "COUNT(DISTINCT g.id) AS total_count, " +
           "COUNT(DISTINCT CASE WHEN LOWER(g.status) = 'resolved' THEN g.id END) AS resolved_count, " +
           "COUNT(DISTINCT CASE WHEN LOWER(g.status) IN ('pending', 'under process', 'acknowledged', 'submitted') THEN g.id END) AS pending_count, " +
           "COUNT(DISTINCT CASE WHEN LOWER(g.status) = 'forwarded' THEN g.id END) AS forwarded_count, " +
           "COUNT(DISTINCT CASE WHEN LOWER(g.status) IN ('dnptoffice', 'does not pertain to this office', 'does not pertain') THEN g.id END) AS dnp_count, " +
           "COUNT(DISTINCT CASE WHEN LOWER(g.status) = 'remark added' THEN g.id END) AS remark_count, " +
           "COUNT(DISTINCT CASE WHEN LOWER(g.status) = 'rejected' THEN g.id END) AS rejected_count, " +
           "COUNT(DISTINCT CASE WHEN LOWER(g.status) = 'appealed' THEN g.id END) AS appealed_count " +
           "FROM jks_3nf.users u " +
           "LEFT JOIN jks_3nf.departments d ON d.id = u.department_id " +
           "LEFT JOIN jks_3nf.designations desg ON desg.id = u.designation_id " +
           "LEFT JOIN jks_3nf.districts dist ON dist.id = u.district_id " +
           "LEFT JOIN jks_3nf.user_types ut ON ut.id = u.user_type_id " +
           "LEFT JOIN jks_3nf.assigned_users au ON au.assigned_to_user_id = u.id AND au.enabled = true " +
           "LEFT JOIN jks_3nf.grievance_master g ON (g.id = au.grievance_id OR g.submitted_by_user_id = u.id) " +
           "WHERE UPPER(u.role) NOT IN ('CITIZEN', 'ROLE_CITIZEN') " +
           "AND (:search IS NULL OR :search = '' OR LOWER(u.first_name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(u.last_name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(u.username) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(u.office_name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(d.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(desg.name) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "GROUP BY u.id, u.first_name, u.middle_name, u.last_name, u.office_name, desg.name, d.name, ut.type_name, ut.name, u.role, dist.name, u.username " +
           "HAVING COUNT(DISTINCT g.id) > 0 " +
           "ORDER BY total_count DESC, u.id DESC",
           nativeQuery = true)
    List<Object[]> fetchUserWiseStatusRaw(@Param("search") String search, Pageable pageable);

    @Query(value = "SELECT COUNT(DISTINCT u.id) FROM jks_3nf.users u " +
           "LEFT JOIN jks_3nf.departments d ON d.id = u.department_id " +
           "LEFT JOIN jks_3nf.designations desg ON desg.id = u.designation_id " +
           "LEFT JOIN jks_3nf.assigned_users au ON au.assigned_to_user_id = u.id AND au.enabled = true " +
           "LEFT JOIN jks_3nf.grievance_master g ON (g.id = au.grievance_id OR g.submitted_by_user_id = u.id) " +
           "WHERE UPPER(u.role) NOT IN ('CITIZEN', 'ROLE_CITIZEN') " +
           "AND (:search IS NULL OR :search = '' OR LOWER(u.first_name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(u.last_name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(u.username) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(u.office_name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(d.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(desg.name) LIKE LOWER(CONCAT('%', :search, '%')))",
           nativeQuery = true)
    long countUserWiseStatusRaw(@Param("search") String search);

    // Status Wise Modal Grievances Query
    @Query(value = "SELECT DISTINCT g.id, g.uniq_id, COALESCE(d.name, 'N/A'), COALESCE(cat.name, 'N/A'), " +
           "TRIM(CONCAT(COALESCE(u.first_name, ''), ' ', COALESCE(u.last_name, ''))), " +
           "g.created_at, g.status " +
           "FROM jks_3nf.grievance_master g " +
           "LEFT JOIN jks_3nf.categories cat ON cat.id = g.category_id " +
           "LEFT JOIN jks_3nf.departments d ON d.id = cat.department_id " +
           "LEFT JOIN jks_3nf.users u ON u.id = g.submitted_by_user_id " +
           "LEFT JOIN jks_3nf.assigned_users au ON au.grievance_id = g.id AND au.enabled = true " +
           "LEFT JOIN jks_3nf.users assigned_usr ON assigned_usr.id = au.assigned_to_user_id " +
           "WHERE (:dept IS NULL OR :dept = '' OR LOWER(d.name) = LOWER(:dept)) " +
           "AND (:username IS NULL OR :username = '' OR LOWER(assigned_usr.username) = LOWER(:username) OR LOWER(u.username) = LOWER(:username)) " +
           "AND (:status IS NULL OR :status = '' OR :status = 'all' OR LOWER(g.status) LIKE LOWER(CONCAT('%', :status, '%')) OR LOWER(g.final_status) LIKE LOWER(CONCAT('%', :status, '%'))) " +
           "AND (:search IS NULL OR :search = '' OR LOWER(g.uniq_id) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(g.description) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "ORDER BY g.id DESC",
           nativeQuery = true)
    List<Object[]> fetchStatusWiseGrievanceDetailsRaw(
            @Param("dept") String dept,
            @Param("username") String username,
            @Param("status") String status,
            @Param("search") String search,
            Pageable pageable);

    @Query(value = "SELECT COUNT(DISTINCT g.id) FROM jks_3nf.grievance_master g " +
           "LEFT JOIN jks_3nf.categories cat ON cat.id = g.category_id " +
           "LEFT JOIN jks_3nf.departments d ON d.id = cat.department_id " +
           "LEFT JOIN jks_3nf.users u ON u.id = g.submitted_by_user_id " +
           "LEFT JOIN jks_3nf.assigned_users au ON au.grievance_id = g.id AND au.enabled = true " +
           "LEFT JOIN jks_3nf.users assigned_usr ON assigned_usr.id = au.assigned_to_user_id " +
           "WHERE (:dept IS NULL OR :dept = '' OR LOWER(d.name) = LOWER(:dept)) " +
           "AND (:username IS NULL OR :username = '' OR LOWER(assigned_usr.username) = LOWER(:username) OR LOWER(u.username) = LOWER(:username)) " +
           "AND (:status IS NULL OR :status = '' OR :status = 'all' OR LOWER(g.status) LIKE LOWER(CONCAT('%', :status, '%')) OR LOWER(g.final_status) LIKE LOWER(CONCAT('%', :status, '%'))) " +
           "AND (:search IS NULL OR :search = '' OR LOWER(g.uniq_id) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(g.description) LIKE LOWER(CONCAT('%', :search, '%')))",
           nativeQuery = true)
    long countStatusWiseGrievanceDetailsRaw(
            @Param("dept") String dept,
            @Param("username") String username,
            @Param("status") String status,
            @Param("search") String search);
}
