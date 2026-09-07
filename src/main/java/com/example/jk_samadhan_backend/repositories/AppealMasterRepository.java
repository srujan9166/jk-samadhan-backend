package com.example.jk_samadhan_backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.jk_samadhan_backend.models.AppealMaster;
import java.util.Optional;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

@Repository
public interface AppealMasterRepository extends JpaRepository<AppealMaster, Long>, JpaSpecificationExecutor<AppealMaster> {
    Optional<AppealMaster> findByAppealUniqId(String appealUniqId);
    List<AppealMaster> findBySubmittedById(Long submittedById);
    List<AppealMaster> findByAppealedToId(Long appealedToId);
    Optional<AppealMaster> findFirstByGrievanceIdOrderByIdDesc(Long grievanceId);

    @Query("SELECT a FROM AppealMaster a WHERE a.grievance.category.department.id = :deptId")
    List<AppealMaster> findByDepartmentId(@Param("deptId") Integer deptId);

    @Query("SELECT a FROM AppealMaster a WHERE a.grievance.district.id = :districtId")
    List<AppealMaster> findByDistrictId(@Param("districtId") Integer districtId);

    @Query(value = "SELECT d.name AS department, " +
            "COUNT(am.id) AS totalAppeals, " +
            "SUM(CASE WHEN am.status = 'Resolved' THEN 1 ELSE 0 END) AS appealsDisposed, " +
            "SUM(CASE WHEN am.status = 'Rejected' THEN 1 ELSE 0 END) AS appealsRejected, " +
            "SUM(CASE WHEN am.status IN ('Appealed', 'Pending') THEN 1 ELSE 0 END) AS appealsPending, " +
            "SUM(CASE WHEN am.status IN ('Appeal Forwarded', 'Remark Recieved', 'Remark Received') THEN 1 ELSE 0 END) AS appealsUnderProcess, " +
            "SUM(CASE WHEN am.status IN ('Appealed', 'Pending', 'Appeal Forwarded', 'Remark Recieved', 'Remark Received') THEN 1 ELSE 0 END) AS appealsOpen, " +
            "SUM(CASE WHEN am.status IN ('Resolved', 'Rejected') THEN 1 ELSE 0 END) AS appealsClosed, " +
            "ROUND((SUM(CASE WHEN am.status IN ('Resolved', 'Rejected') THEN 1 ELSE 0 END) * 100.0) / NULLIF(COUNT(am.id), 0), 2) AS disposalPercentage " +
            "FROM jks_3nf.appeal_master am " +
            "JOIN jks_3nf.grievance_master gm ON am.grievance_id = gm.id " +
            "JOIN jks_3nf.categories c ON gm.category_id = c.id " +
            "JOIN jks_3nf.departments d ON c.department_id = d.id " +
            "WHERE (:deptId = 0 OR d.id = :deptId) " +
            "AND (:searchText IS NULL OR :searchText = '' OR LOWER(d.name) LIKE LOWER(CONCAT('%', :searchText, '%'))) " +
            "GROUP BY d.name " +
            "ORDER BY d.name",
            countQuery = "SELECT COUNT(DISTINCT d.name) " +
            "FROM jks_3nf.appeal_master am " +
            "JOIN jks_3nf.grievance_master gm ON am.grievance_id = gm.id " +
            "JOIN jks_3nf.categories c ON gm.category_id = c.id " +
            "JOIN jks_3nf.departments d ON c.department_id = d.id " +
            "WHERE (:deptId = 0 OR d.id = :deptId) " +
            "AND (:searchText IS NULL OR :searchText = '' OR LOWER(d.name) LIKE LOWER(CONCAT('%', :searchText, '%')))",
            nativeQuery = true)
    org.springframework.data.domain.Page<com.example.jk_samadhan_backend.dto.AppealMisReportProjection> findAppealCountsByDepartment(
            @Param("searchText") String searchText, 
            @Param("deptId") Integer deptId, 
            org.springframework.data.domain.Pageable pageable);
}
