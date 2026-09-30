package com.example.jk_samadhan_backend.repositories;

import java.util.Optional;
import java.util.UUID;
import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.jk_samadhan_backend.models.Users;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface UserRepository extends JpaRepository<Users, Long> {

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByMobile(String mobile);

    @EntityGraph(attributePaths = { "userType", "districtEntity", "stateEntity" })
    Optional<Users> findByUsername(String username);

    Optional<Users> findByMobile(String mobile);

    Optional<Users> findByEmail(String email);

    @EntityGraph(attributePaths = { "userType", "districtEntity", "stateEntity" })
    Optional<Users> findByUuid(UUID uuid);

    @EntityGraph(attributePaths = { "userType", "districtEntity", "stateEntity" })
    @Query("SELECT u FROM Users u WHERE u.username = :identifier OR u.mobile = :identifier OR u.email = :identifier")
    Optional<Users> findByIdentifier(@Param("identifier") String identifier);

    @Query(value = "SELECT * FROM public.users WHERE username = :username AND enabled = 1", nativeQuery = true)
    java.util.List<Object[]> findNodalDetailsRaw(@Param("username") String username);

    @Query("SELECT u FROM Users u WHERE u.userType.id = 7 AND u.department.id = :deptId")
    List<Users> findAppellateByDepartment(@Param("deptId") Integer deptId);

    @Query("SELECT u FROM Users u WHERE u.userType.id = 7")
    List<Users> findAllAppellates();

    @Query("SELECT u FROM Users u WHERE u.department.name = :deptName AND (u.role = 'ADMIN' OR u.userType.typeName = 'ROLE_Admin')")
    List<Users> findNodalByDepartmentName(@Param("deptName") String deptName);

    boolean existsByDesignationId(Integer designationId);

    @Query(value = "SELECT u.id, TRIM(CONCAT(COALESCE(u.first_name, ''), ' ', COALESCE(u.middle_name, ''), ' ', COALESCE(u.last_name, ''))), COALESCE(u.username, ''), COALESCE(u.email, u.username, ''), COALESCE(d.name, 'Dealing Hand User'), COALESCE(u.mobile, 'N/A'), COUNT(DISTINCT g.id) AS total_count " +
           "FROM jks_3nf.users u " +
           "LEFT JOIN jks_3nf.designations d ON d.id = u.designation_id " +
           "LEFT JOIN jks_3nf.user_types ut ON ut.id = u.user_type_id " +
           "LEFT JOIN jks_3nf.grievance_master g ON (g.submitted_by_user_id = u.id) " +
           "WHERE (UPPER(u.role) LIKE '%DEALING%' OR UPPER(ut.type_name) LIKE '%DEALING%' OR UPPER(u.role) LIKE '%DH%') " +
           "AND (:search IS NULL OR :search = '' OR LOWER(u.first_name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(u.last_name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(u.username) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(u.mobile) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "GROUP BY u.id, u.first_name, u.middle_name, u.last_name, u.username, u.email, d.name, u.mobile " +
           "ORDER BY total_count DESC, u.id DESC",
           nativeQuery = true)
    List<Object[]> fetchDealingHandReportRaw(@Param("search") String search, org.springframework.data.domain.Pageable pageable);

    @Query(value = "SELECT COUNT(DISTINCT u.id) FROM jks_3nf.users u " +
           "LEFT JOIN jks_3nf.user_types ut ON ut.id = u.user_type_id " +
           "WHERE (UPPER(u.role) LIKE '%DEALING%' OR UPPER(ut.type_name) LIKE '%DEALING%' OR UPPER(u.role) LIKE '%DH%') " +
           "AND (:search IS NULL OR :search = '' OR LOWER(u.first_name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(u.last_name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(u.username) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(u.mobile) LIKE LOWER(CONCAT('%', :search, '%')))",
           nativeQuery = true)
    long countDealingHandReportRaw(@Param("search") String search);

    @Query(value = "SELECT u.id, COALESCE(u.username, ''), COALESCE(u.email, u.username, ''), " +
           "TRIM(CONCAT(COALESCE(u.first_name, ''), ' ', COALESCE(u.middle_name, ''), ' ', COALESCE(u.last_name, ''))), " +
           "COALESCE(dept.name, ''), COALESCE(dept.department_type, 'ADMIN'), COALESCE(dist.name, ''), " +
           "COALESCE(u.office_name, ''), COALESCE(desg.name, ''), COALESCE(ut.type_name, ut.name, u.role, ''), " +
           "COALESCE(TRIM(CONCAT(COALESCE(cb.first_name, ''), ' ', COALESCE(cb.last_name, ''))), cb.username, 'System'), " +
           "u.created_at, COALESCE(u.mobile, 'N/A'), u.enabled " +
           "FROM jks_3nf.users u " +
           "LEFT JOIN jks_3nf.departments dept ON dept.id = u.department_id " +
           "LEFT JOIN jks_3nf.designations desg ON desg.id = u.designation_id " +
           "LEFT JOIN jks_3nf.districts dist ON dist.id = u.district_id " +
           "LEFT JOIN jks_3nf.user_types ut ON ut.id = u.user_type_id " +
           "LEFT JOIN jks_3nf.users cb ON cb.id = u.created_by_id " +
           "WHERE UPPER(u.role) NOT IN ('CITIZEN', 'ROLE_CITIZEN') " +
           "AND (:dept IS NULL OR :dept = '' OR :dept = '0' OR LOWER(dept.name) = LOWER(:dept)) " +
           "AND (:deptType IS NULL OR :deptType = '' OR :deptType = '0' OR LOWER(dept.department_type) = LOWER(:deptType)) " +
           "AND (:usrType IS NULL OR :usrType = '' OR :usrType = '0' OR LOWER(ut.name) = LOWER(:usrType) OR LOWER(ut.type_name) = LOWER(:usrType) OR LOWER(u.role) = LOWER(:usrType)) " +
           "AND (:dist IS NULL OR :dist = '' OR :dist = '0' OR LOWER(dist.name) = LOWER(:dist)) " +
           "AND (:search IS NULL OR :search = '' OR LOWER(u.first_name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(u.last_name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(u.username) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(u.mobile) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(u.office_name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(dept.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(desg.name) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "ORDER BY u.id DESC",
           nativeQuery = true)
    List<Object[]> fetchDepartmentUserReportRaw(
            @Param("search") String search,
            @Param("dept") String dept,
            @Param("deptType") String deptType,
            @Param("usrType") String usrType,
            @Param("dist") String dist,
            org.springframework.data.domain.Pageable pageable);

    @Query(value = "SELECT COUNT(u.id) FROM jks_3nf.users u " +
           "LEFT JOIN jks_3nf.departments dept ON dept.id = u.department_id " +
           "LEFT JOIN jks_3nf.designations desg ON desg.id = u.designation_id " +
           "LEFT JOIN jks_3nf.districts dist ON dist.id = u.district_id " +
           "LEFT JOIN jks_3nf.user_types ut ON ut.id = u.user_type_id " +
           "WHERE UPPER(u.role) NOT IN ('CITIZEN', 'ROLE_CITIZEN') " +
           "AND (:dept IS NULL OR :dept = '' OR :dept = '0' OR LOWER(dept.name) = LOWER(:dept)) " +
           "AND (:deptType IS NULL OR :deptType = '' OR :deptType = '0' OR LOWER(dept.department_type) = LOWER(:deptType)) " +
           "AND (:usrType IS NULL OR :usrType = '' OR :usrType = '0' OR LOWER(ut.name) = LOWER(:usrType) OR LOWER(ut.type_name) = LOWER(:usrType) OR LOWER(u.role) = LOWER(:usrType)) " +
           "AND (:dist IS NULL OR :dist = '' OR :dist = '0' OR LOWER(dist.name) = LOWER(:dist)) " +
           "AND (:search IS NULL OR :search = '' OR LOWER(u.first_name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(u.last_name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(u.username) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(u.mobile) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(u.office_name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(dept.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(desg.name) LIKE LOWER(CONCAT('%', :search, '%')))",
           nativeQuery = true)
    long countDepartmentUserReportRaw(
            @Param("search") String search,
            @Param("dept") String dept,
            @Param("deptType") String deptType,
            @Param("usrType") String usrType,
            @Param("dist") String dist);
}
