package com.example.jk_samadhan_backend.repositories;

import com.example.jk_samadhan_backend.models.Feedback;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    List<Feedback> findByGrievanceId(Long grievanceId);

    @Query(value = """
            SELECT f.id, g.id AS grievance_id, g.uniq_id,
                   TRIM(CONCAT(COALESCE(u.first_name, ''), ' ', COALESCE(u.last_name, ''))) AS complainant_name,
                   COALESCE(u.mobile, '') AS complainant_mobile,
                   COALESCE(d.name, 'Unassigned Department') AS department_name,
                   COALESCE(cat.name, 'N/A') AS category_name,
                   COALESCE(dist.name, 'N/A') AS district_name,
                   COALESCE(u.gender, 'N/A') AS gender,
                   f.satisfied, f.call_received, f.overall_experience, f.time_satisfaction, f.reuse_portal,
                   f.rating1, f.rating2, f.feedback_score, f.description, f.poor_reason, f.created_at
            FROM jks_3nf.feedback f
            JOIN jks_3nf.grievance_master g ON g.id = f.grievance_id
            LEFT JOIN jks_3nf.departments d ON d.id = g.department_id
            LEFT JOIN jks_3nf.categories cat ON cat.id = g.category_id
            LEFT JOIN jks_3nf.districts dist ON dist.id = g.district_id
            LEFT JOIN jks_3nf.users u ON u.id = g.submitted_by_user_id
            WHERE (:department IS NULL OR :department = '' OR :department = '0' OR LOWER(d.name) = LOWER(:department))
              AND (:district IS NULL OR :district = '' OR :district = '0' OR LOWER(dist.name) = LOWER(:district))
              AND (:category IS NULL OR :category = '' OR :category = '0' OR LOWER(cat.name) = LOWER(:category))
              AND (:gender IS NULL OR :gender = '' OR :gender = '0' OR LOWER(u.gender) = LOWER(:gender))
              AND (:satisfaction IS NULL OR :satisfaction = '' OR :satisfaction = '0' OR LOWER(f.overall_experience) = LOWER(:satisfaction))
              AND (:dateFrom IS NULL OR :dateFrom = '' OR f.created_at >= CAST(:dateFrom AS timestamp))
              AND (:dateTo IS NULL OR :dateTo = '' OR f.created_at <= CAST(:dateTo AS timestamp))
              AND (:search IS NULL OR :search = '' OR LOWER(g.uniq_id) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(u.first_name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(u.last_name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(f.description) LIKE LOWER(CONCAT('%', :search, '%')))
            ORDER BY f.id DESC
            """, nativeQuery = true)
    List<Object[]> fetchFeedbackListRaw(
            @Param("department") String department,
            @Param("district") String district,
            @Param("category") String category,
            @Param("gender") String gender,
            @Param("satisfaction") String satisfaction,
            @Param("dateFrom") String dateFrom,
            @Param("dateTo") String dateTo,
            @Param("search") String search,
            Pageable pageable);

    @Query(value = """
            SELECT COUNT(f.id)
            FROM jks_3nf.feedback f
            JOIN jks_3nf.grievance_master g ON g.id = f.grievance_id
            LEFT JOIN jks_3nf.departments d ON d.id = g.department_id
            LEFT JOIN jks_3nf.categories cat ON cat.id = g.category_id
            LEFT JOIN jks_3nf.districts dist ON dist.id = g.district_id
            LEFT JOIN jks_3nf.users u ON u.id = g.submitted_by_user_id
            WHERE (:department IS NULL OR :department = '' OR :department = '0' OR LOWER(d.name) = LOWER(:department))
              AND (:district IS NULL OR :district = '' OR :district = '0' OR LOWER(dist.name) = LOWER(:district))
              AND (:category IS NULL OR :category = '' OR :category = '0' OR LOWER(cat.name) = LOWER(:category))
              AND (:gender IS NULL OR :gender = '' OR :gender = '0' OR LOWER(u.gender) = LOWER(:gender))
              AND (:satisfaction IS NULL OR :satisfaction = '' OR :satisfaction = '0' OR LOWER(f.overall_experience) = LOWER(:satisfaction))
              AND (:dateFrom IS NULL OR :dateFrom = '' OR f.created_at >= CAST(:dateFrom AS timestamp))
              AND (:dateTo IS NULL OR :dateTo = '' OR f.created_at <= CAST(:dateTo AS timestamp))
              AND (:search IS NULL OR :search = '' OR LOWER(g.uniq_id) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(u.first_name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(u.last_name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(f.description) LIKE LOWER(CONCAT('%', :search, '%')))
            """, nativeQuery = true)
    long countFeedbackListRaw(
            @Param("department") String department,
            @Param("district") String district,
            @Param("category") String category,
            @Param("gender") String gender,
            @Param("satisfaction") String satisfaction,
            @Param("dateFrom") String dateFrom,
            @Param("dateTo") String dateTo,
            @Param("search") String search);

    @Query(value = """
            SELECT 
                COUNT(f.id) AS total_count,
                COUNT(CASE WHEN LOWER(f.satisfied) = 'yes' THEN 1 END) AS satisfied_yes,
                COUNT(CASE WHEN LOWER(f.satisfied) = 'no' THEN 1 END) AS satisfied_no,
                COUNT(CASE WHEN LOWER(f.call_received) = 'yes' THEN 1 END) AS call_yes,
                COUNT(CASE WHEN LOWER(f.call_received) = 'no' THEN 1 END) AS call_no,
                COUNT(CASE WHEN LOWER(f.overall_experience) = 'excellent' THEN 1 END) AS exp_excellent,
                COUNT(CASE WHEN LOWER(f.overall_experience) = 'good' THEN 1 END) AS exp_good,
                COUNT(CASE WHEN LOWER(f.overall_experience) = 'average' THEN 1 END) AS exp_average,
                COUNT(CASE WHEN LOWER(f.overall_experience) = 'poor' THEN 1 END) AS exp_poor,
                COUNT(CASE WHEN LOWER(f.time_satisfaction) LIKE '%very satisfied%' THEN 1 END) AS time_very_satisfied,
                COUNT(CASE WHEN LOWER(f.time_satisfaction) = 'satisfied' THEN 1 END) AS time_satisfied,
                COUNT(CASE WHEN LOWER(f.time_satisfaction) LIKE '%dissatisfied%' THEN 1 END) AS time_dissatisfied,
                COUNT(CASE WHEN LOWER(f.reuse_portal) LIKE '%yes%' THEN 1 END) AS reuse_yes,
                COUNT(CASE WHEN LOWER(f.reuse_portal) LIKE '%maybe%' THEN 1 END) AS reuse_maybe,
                COUNT(CASE WHEN LOWER(f.reuse_portal) LIKE '%no%' THEN 1 END) AS reuse_no,
                COALESCE(AVG(COALESCE(f.feedback_score, f.rating1)), 0.0) AS avg_score
            FROM jks_3nf.feedback f
            JOIN jks_3nf.grievance_master g ON g.id = f.grievance_id
            LEFT JOIN jks_3nf.departments d ON d.id = g.department_id
            LEFT JOIN jks_3nf.categories cat ON cat.id = g.category_id
            LEFT JOIN jks_3nf.districts dist ON dist.id = g.district_id
            LEFT JOIN jks_3nf.users u ON u.id = g.submitted_by_user_id
            WHERE (:department IS NULL OR :department = '' OR :department = '0' OR LOWER(d.name) = LOWER(:department))
              AND (:district IS NULL OR :district = '' OR :district = '0' OR LOWER(dist.name) = LOWER(:district))
              AND (:category IS NULL OR :category = '' OR :category = '0' OR LOWER(cat.name) = LOWER(:category))
              AND (:gender IS NULL OR :gender = '' OR :gender = '0' OR LOWER(u.gender) = LOWER(:gender))
              AND (:satisfaction IS NULL OR :satisfaction = '' OR :satisfaction = '0' OR LOWER(f.overall_experience) = LOWER(:satisfaction))
              AND (:dateFrom IS NULL OR :dateFrom = '' OR f.created_at >= CAST(:dateFrom AS timestamp))
              AND (:dateTo IS NULL OR :dateTo = '' OR f.created_at <= CAST(:dateTo AS timestamp))
            """, nativeQuery = true)
    Object[] fetchFeedbackSummaryRaw(
            @Param("department") String department,
            @Param("district") String district,
            @Param("category") String category,
            @Param("gender") String gender,
            @Param("satisfaction") String satisfaction,
            @Param("dateFrom") String dateFrom,
            @Param("dateTo") String dateTo);

    @Query(value = """
            SELECT 
                COALESCE(d.name, 'Unassigned Department') AS department,
                COUNT(f.id) AS total_grievances,
                ROUND(CAST(100.0 * COUNT(CASE WHEN LOWER(f.satisfied) = 'yes' THEN 1 END) / NULLIF(COUNT(f.id), 0) AS numeric), 2) AS satisfied_yes_percent,
                ROUND(CAST(100.0 * COUNT(CASE WHEN LOWER(f.satisfied) = 'no' THEN 1 END) / NULLIF(COUNT(f.id), 0) AS numeric), 2) AS satisfied_no_percent,
                ROUND(CAST(100.0 * COUNT(CASE WHEN LOWER(f.call_received) = 'yes' THEN 1 END) / NULLIF(COUNT(f.id), 0) AS numeric), 2) AS call_yes_percent,
                ROUND(CAST(100.0 * COUNT(CASE WHEN LOWER(f.call_received) = 'no' THEN 1 END) / NULLIF(COUNT(f.id), 0) AS numeric), 2) AS call_no_percent,
                ROUND(CAST(100.0 * COUNT(CASE WHEN LOWER(f.overall_experience) = 'excellent' THEN 1 END) / NULLIF(COUNT(f.id), 0) AS numeric), 2) AS exp_excellent_percent,
                ROUND(CAST(100.0 * COUNT(CASE WHEN LOWER(f.overall_experience) = 'good' THEN 1 END) / NULLIF(COUNT(f.id), 0) AS numeric), 2) AS exp_good_percent,
                ROUND(CAST(100.0 * COUNT(CASE WHEN LOWER(f.overall_experience) = 'average' THEN 1 END) / NULLIF(COUNT(f.id), 0) AS numeric), 2) AS exp_average_percent,
                ROUND(CAST(100.0 * COUNT(CASE WHEN LOWER(f.overall_experience) = 'poor' THEN 1 END) / NULLIF(COUNT(f.id), 0) AS numeric), 2) AS exp_poor_percent
            FROM jks_3nf.feedback f
            JOIN jks_3nf.grievance_master g ON g.id = f.grievance_id
            LEFT JOIN jks_3nf.departments d ON d.id = g.department_id
            LEFT JOIN jks_3nf.categories cat ON cat.id = g.category_id
            LEFT JOIN jks_3nf.districts dist ON dist.id = g.district_id
            LEFT JOIN jks_3nf.users u ON u.id = g.submitted_by_user_id
            WHERE (:department IS NULL OR :department = '' OR :department = '0' OR LOWER(d.name) = LOWER(:department))
              AND (:district IS NULL OR :district = '' OR :district = '0' OR LOWER(dist.name) = LOWER(:district))
              AND (:dateFrom IS NULL OR :dateFrom = '' OR f.created_at >= CAST(:dateFrom AS timestamp))
              AND (:dateTo IS NULL OR :dateTo = '' OR f.created_at <= CAST(:dateTo AS timestamp))
            GROUP BY COALESCE(d.name, 'Unassigned Department')
            ORDER BY total_grievances DESC
            """, nativeQuery = true)
    List<Object[]> fetchFeedbackMisReportRaw(
            @Param("department") String department,
            @Param("district") String district,
            @Param("dateFrom") String dateFrom,
            @Param("dateTo") String dateTo);
}
