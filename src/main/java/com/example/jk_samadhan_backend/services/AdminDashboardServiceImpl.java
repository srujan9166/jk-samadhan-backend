package com.example.jk_samadhan_backend.services;

import com.example.jk_samadhan_backend.dto.legacy.*;
import com.example.jk_samadhan_backend.models.*;
import com.example.jk_samadhan_backend.repositories.*;
import com.example.jk_samadhan_backend.utils.EncryptionUtil;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.security.crypto.password.PasswordEncoder;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@Transactional
public class AdminDashboardServiceImpl implements AdminDashboardService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GrievanceMasterRepository grievanceMasterRepository;

    @Autowired
    private AssignedUsersRepository assignedUsersRepository;

    @Autowired
    private GrievanceHistoryRepository grievanceHistoryRepository;

    @Autowired
    private AppealMasterRepository appealMasterRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private SubCategoryLevel1Repository subCategoryLevel1Repository;

    @Autowired
    private SubCategoryLevel2Repository subCategoryLevel2Repository;

    @Autowired
    private SubCategoryLevel3Repository subCategoryLevel3Repository;

    @Autowired
    private SubCategoryLevel4Repository subCategoryLevel4Repository;

    @Autowired
    private UserTypeRepository userTypeRepository;

    @Autowired
    private DesignationRepository designationRepository;

    @Autowired
    private UserExtraDataRepository userExtraDataRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostConstruct
    public void initCompatibilityViews() {
        try {
            // 1. Create notification table if it does not exist
            jdbcTemplate.execute("""
                CREATE TABLE IF NOT EXISTS jks_3nf.notification (
                    id SERIAL PRIMARY KEY,
                    notification TEXT,
                    notificationsentto VARCHAR(255),
                    createdat TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    validtill TIMESTAMP WITH TIME ZONE,
                    status VARCHAR(50),
                    type VARCHAR(50),
                    filepath TEXT,
                    createdby VARCHAR(255),
                    isactive INTEGER DEFAULT 1,
                    user_id BIGINT
                )
            """);

            // Create database indexes for performance optimization on startup
            jdbcTemplate.execute("CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username ON jks_3nf.users(username)");
            jdbcTemplate.execute("CREATE INDEX IF NOT EXISTS idx_users_enabled ON jks_3nf.users(enabled)");
            jdbcTemplate.execute("CREATE INDEX IF NOT EXISTS idx_users_user_type_id ON jks_3nf.users(user_type_id)");
            jdbcTemplate.execute("CREATE INDEX IF NOT EXISTS idx_users_department_id ON jks_3nf.users(department_id)");
            jdbcTemplate.execute("CREATE INDEX IF NOT EXISTS idx_users_designation_id ON jks_3nf.users(designation_id)");
            jdbcTemplate.execute("CREATE INDEX IF NOT EXISTS idx_users_district_id ON jks_3nf.users(district_id)");
            jdbcTemplate.execute("CREATE INDEX IF NOT EXISTS idx_users_state_id ON jks_3nf.users(state_id)");

            jdbcTemplate.execute("CREATE INDEX IF NOT EXISTS idx_gm_submitted_by_user_id ON jks_3nf.grievance_master(submitted_by_user_id)");
            jdbcTemplate.execute("CREATE INDEX IF NOT EXISTS idx_gm_category_id ON jks_3nf.grievance_master(category_id)");
            jdbcTemplate.execute("CREATE INDEX IF NOT EXISTS idx_gm_sub_cat_l1_id ON jks_3nf.grievance_master(sub_cat_l1_id)");
            jdbcTemplate.execute("CREATE INDEX IF NOT EXISTS idx_gm_district_id ON jks_3nf.grievance_master(district_id)");

            jdbcTemplate.execute("CREATE INDEX IF NOT EXISTS idx_au_grievance_id ON jks_3nf.assigned_users(grievance_id)");
            jdbcTemplate.execute("CREATE INDEX IF NOT EXISTS idx_au_assigned_to_user_id ON jks_3nf.assigned_users(assigned_to_user_id)");
            jdbcTemplate.execute("CREATE INDEX IF NOT EXISTS idx_au_assigned_by_user_id ON jks_3nf.assigned_users(assigned_by_user_id)");


            // 2. Recreate public.users view
            jdbcTemplate.execute("""
                CREATE OR REPLACE VIEW public.users AS
                SELECT 
                    u.id,
                    u.uuid::varchar,
                    u.username,
                    u.password,
                    CASE WHEN u.enabled THEN 1 ELSE 0 END as enabled,
                    ut.type_name as user_type,
                    u.first_name,
                    u.middle_name,
                    u.last_name,
                    u.mobile,
                    u.email,
                    desig.name as designation,
                    u.office_name,
                    u.gender,
                    u.dob::varchar as date_of_birth,
                    u.address,
                    u.pincode,
                    dist.name as district,
                    blk.name as block,
                    panch.name as panchayat,
                    mun.name as municipality,
                    ward.name as ward,
                    u.created_by_id::varchar as createdbyid,
                    u.created_at as created_date,
                    u.updated_at as updated_date,
                    dept.name as department,
                    ut.user_level as user_level,
                    CASE WHEN ut.type_name IN ('ROLE_Admin', 'ADMIN', 'ROLE_SuperAdmin', 'SUPERADMIN') THEN 'depNodal' ELSE 'citizen' END as userflag
                FROM jks_3nf.users u
                LEFT JOIN jks_3nf.user_types ut ON ut.id = u.user_type_id
                LEFT JOIN jks_3nf.designations desig ON desig.id = u.designation_id
                LEFT JOIN jks_3nf.districts dist ON dist.id = u.district_id
                LEFT JOIN jks_3nf.blocks blk ON blk.id = u.block_id
                LEFT JOIN jks_3nf.panchayats panch ON panch.id = u.panchayat_id
                LEFT JOIN jks_3nf.municipalities mun ON mun.id = u.municipality_id
                LEFT JOIN jks_3nf.wards ward ON ward.id = u.ward_id
                LEFT JOIN jks_3nf.departments dept ON dept.id = u.department_id;
            """);

            // 3. Recreate public.grievance_master view
            jdbcTemplate.execute("""
                CREATE OR REPLACE VIEW public.grievance_master AS
                SELECT 
                    gm.id,
                    gm.uniq_id as uniqid,
                    gm.submitted_by_user_id as userid,
                    gm.description,
                    gm.latitude,
                    gm.longitude,
                    gm.origin,
                    cat.name as category,
                    sub1.name as sub_category,
                    sub2.name as sub_cat_next_level2,
                    sub3.name as sub_cat_next_level3,
                    sub4.name as sub_cat_next_level4,
                    dist.name as district,
                    gm.district_id as dist_id,
                    gm.block_id,
                    gm.panchayat_id,
                    gm.municipality_id,
                    gm.ward_id,
                    gm.status,
                    gm.final_status,
                    gm.key_flag,
                    gm.psga,
                    gm.file_name,
                    gm.file_path,
                    gm.file_type as first_file_type,
                    gm.second_file_name,
                    gm.second_file_path,
                    gm.second_file_type,
                    gm.ack_slip_name,
                    gm.ack_slip_path,
                    gm.cpgram_reg_no,
                    gm.created_at as createddate,
                    gm.updated_at as updated_on,
                    u_up.username as updated_by,
                    dept.name as department,
                    0 as forward_hlg,
                    CASE WHEN gm.origin = 'JKSAMADHAN' THEN 'webapp' ELSE 'mobileapp' END as application
                FROM jks_3nf.grievance_master gm
                LEFT JOIN jks_3nf.categories cat ON cat.id = gm.category_id
                LEFT JOIN jks_3nf.departments dept ON dept.id = cat.department_id
                LEFT JOIN jks_3nf.subcategory_level1 sub1 ON sub1.id = gm.sub_cat_l1_id
                LEFT JOIN jks_3nf.subcategory_level2 sub2 ON sub2.id = gm.sub_cat_l2_id
                LEFT JOIN jks_3nf.subcategory_level3 sub3 ON sub3.id = gm.sub_cat_l3_id
                LEFT JOIN jks_3nf.subcategory_level4 sub4 ON sub4.id = gm.sub_cat_l4_id
                LEFT JOIN jks_3nf.districts dist ON dist.id = gm.district_id
                LEFT JOIN jks_3nf.users u_up ON u_up.id = gm.updated_by_user_id;
            """);

            // 4. Recreate public.assigned_users view
            jdbcTemplate.execute("""
                CREATE OR REPLACE VIEW public.assigned_users AS
                SELECT 
                    au.id,
                    gm.uniq_id as grievance_id,
                    u_to.username as assigned_to,
                    u_by.username as created_by,
                    au.action,
                    au.remark as rmark,
                    au.remark,
                    au.reminder_in_days as reminderindays,
                    CASE WHEN au.enabled THEN 1 ELSE 0 END as enabled,
                    au.created_at as created_date,
                    au.updated_at as updated_date,
                    dept.name as department,
                    gm.origin as appflag
                FROM jks_3nf.assigned_users au
                JOIN jks_3nf.grievance_master gm ON gm.id = au.grievance_id
                LEFT JOIN jks_3nf.categories cat ON cat.id = gm.category_id
                LEFT JOIN jks_3nf.departments dept ON dept.id = cat.department_id
                LEFT JOIN jks_3nf.users u_to ON u_to.id = au.assigned_to_user_id
                LEFT JOIN jks_3nf.users u_by ON u_by.id = au.assigned_by_user_id;
            """);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public AdminDashboardDataDTO getDashboardData(String username, Boolean showLoginToast) {
        Users self = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        List<Object[]> nodalDetailsRaw = userRepository.findNodalDetailsRaw(username);
        if (nodalDetailsRaw.isEmpty()) {
            throw new RuntimeException("Nodal details raw not found for user: " + username);
        }
        Object[] uRow = nodalDetailsRaw.get(0);

        String userDeptName = uRow[25] != null ? uRow[25].toString() : "";
        String userTypeName = uRow[5] != null ? uRow[5].toString() : "";
        Integer userLevel = uRow[26] != null ? ((Number) uRow[26]).intValue() : 0;
        String userflag = uRow[27] != null ? uRow[27].toString() : "";
        String officeName = uRow[11] != null ? uRow[11].toString() : "";
        String firstName = uRow[6] != null ? uRow[6].toString() : "";
        String lastName = uRow[8] != null ? uRow[8].toString() : "";

        boolean isGlobalAdmin = "ROLE_SuperAdmin".equalsIgnoreCase(userTypeName) || userDeptName == null || userDeptName.trim().isEmpty();

        String totalGCount, webCount, appCount, normalFlagCount, priorityFlagCount, pendingCount, dnpCount, resolvedCount, totalClosedCount, forwardedCount, remarkCount, propDispCount, pendingWithAdminCount, cpgramClosedCount, fwdToCPGRAMCount, totalCPGRAMCount, rejectedCount;

        String sql;
        Object[] params;
        if (isGlobalAdmin) {
            sql = """
                SELECT 
                    COUNT(*) as totalG,
                    COUNT(CASE WHEN origin = 'JKSAMADHAN' THEN 1 END) as web,
                    COUNT(CASE WHEN origin != 'JKSAMADHAN' THEN 1 END) as App,
                    COUNT(CASE WHEN key_flag = 'Normal' THEN 1 END) as normalFlagCount,
                    COUNT(CASE WHEN key_flag = 'Priority' THEN 1 END) as priorityFlagCount,
                    COUNT(CASE WHEN status IN ('Pending','Acknowledged','Under Process') THEN 1 END) as pending,
                    COUNT(CASE WHEN (status='dnpToOffice' AND final_status='') OR (status='Forwarded' AND final_status='dnpToOffice') OR (status='dnpToOffice' AND final_status IS NULL) THEN 1 END) as DNP,
                    COUNT(CASE WHEN status = 'Resolved' THEN 1 END) as resolved,
                    COUNT(CASE WHEN status IN ('Resolved','Rejected') THEN 1 END) as totalClosed,
                    COUNT(CASE WHEN status = 'Forwarded' AND (final_status IS NULL OR final_status = '' OR final_status = 'NA') THEN 1 END) as forwarded,
                    COUNT(CASE WHEN status = 'Remark Added' THEN 1 END) as remark,
                    COUNT(CASE WHEN final_status IN ('Proposed Disposed','Recieved') THEN 1 END) as propDisp,
                    COUNT(CASE WHEN status = 'Appealed' THEN 1 END) as pendingWithAdmin,
                    COUNT(CASE WHEN status = 'Closed' THEN 1 END) as cpgramClosed,
                    COUNT(CASE WHEN status = 'Forwarded To CPGRAM' THEN 1 END) as fwdToCPGRAM,
                    COUNT(CASE WHEN status = 'Forwarded To CPGRAM' OR status = 'Closed' THEN 1 END) as totalCPGRAM,
                    COUNT(CASE WHEN status = 'Rejected' THEN 1 END) as rejected
                FROM jks_3nf.grievance_master
                """;
            params = new Object[0];
        } else {
            sql = """
                SELECT 
                    COUNT(*) as totalG,
                    COUNT(CASE WHEN gm.origin = 'JKSAMADHAN' THEN 1 END) as web,
                    COUNT(CASE WHEN gm.origin != 'JKSAMADHAN' THEN 1 END) as App,
                    COUNT(CASE WHEN gm.key_flag = 'Normal' THEN 1 END) as normalFlagCount,
                    COUNT(CASE WHEN gm.key_flag = 'Priority' THEN 1 END) as priorityFlagCount,
                    COUNT(CASE WHEN gm.status IN ('Pending','Acknowledged','Under Process') THEN 1 END) as pending,
                    COUNT(CASE WHEN (gm.status='dnpToOffice' AND gm.final_status='') OR (gm.status='Forwarded' AND gm.final_status='dnpToOffice') OR (gm.status='dnpToOffice' AND gm.final_status IS NULL) THEN 1 END) as DNP,
                    COUNT(CASE WHEN gm.status = 'Resolved' THEN 1 END) as resolved,
                    COUNT(CASE WHEN gm.status IN ('Resolved','Rejected') THEN 1 END) as totalClosed,
                    COUNT(CASE WHEN gm.status = 'Forwarded' AND (gm.final_status IS NULL OR gm.final_status = '' OR gm.final_status = 'NA') THEN 1 END) as forwarded,
                    COUNT(CASE WHEN gm.status = 'Remark Added' THEN 1 END) as remark,
                    COUNT(CASE WHEN gm.final_status IN ('Proposed Disposed','Recieved') THEN 1 END) as propDisp,
                    COUNT(CASE WHEN gm.status = 'Appealed' THEN 1 END) as pendingWithAdmin,
                    COUNT(CASE WHEN gm.status = 'Closed' THEN 1 END) as cpgramClosed,
                    COUNT(CASE WHEN gm.status = 'Forwarded To CPGRAM' THEN 1 END) as fwdToCPGRAM,
                    COUNT(CASE WHEN gm.status = 'Forwarded To CPGRAM' OR gm.status = 'Closed' THEN 1 END) as totalCPGRAM,
                    COUNT(CASE WHEN gm.status = 'Rejected' THEN 1 END) as rejected
                FROM jks_3nf.grievance_master gm
                JOIN jks_3nf.categories cat ON cat.id = gm.category_id
                JOIN jks_3nf.departments dept ON dept.id = cat.department_id
                WHERE dept.name = ?
                """;
            params = new Object[]{userDeptName};
        }

        Map<String, Object> gStats = jdbcTemplate.queryForMap(sql, params);
        totalGCount = getMapValue(gStats, "totalg");
        webCount = getMapValue(gStats, "web");
        appCount = getMapValue(gStats, "app");
        normalFlagCount = getMapValue(gStats, "normalflagcount");
        priorityFlagCount = getMapValue(gStats, "priorityflagcount");
        pendingCount = getMapValue(gStats, "pending");
        dnpCount = getMapValue(gStats, "dnp");
        resolvedCount = getMapValue(gStats, "resolved");
        totalClosedCount = getMapValue(gStats, "totalclosed");
        forwardedCount = getMapValue(gStats, "forwarded");
        remarkCount = getMapValue(gStats, "remark");
        propDispCount = getMapValue(gStats, "propdisp");
        pendingWithAdminCount = getMapValue(gStats, "pendingwithadmin");
        cpgramClosedCount = getMapValue(gStats, "cpgramclosed");
        fwdToCPGRAMCount = getMapValue(gStats, "fwdtocpgram");
        totalCPGRAMCount = getMapValue(gStats, "totalcpgram");
        rejectedCount = getMapValue(gStats, "rejected");

        // Nodal Name logic
        String nodalName = username;
        if (!"depNodal".equals(userflag)) {
            List<Map<String, Object>> secDep = jdbcTemplate.queryForList(
                    "SELECT username FROM public.users WHERE department = ? AND user_type = 'ROLE_Admin' AND userflag = 'depNodal'",
                    self.getDepartment() != null ? self.getDepartment().getName() : "");
            if (!secDep.isEmpty()) {
                nodalName = secDep.get(0).get("username").toString();
            }
        }

        // Sub queries
        String doesNotPertainCount;
        String appealReceviedCountStr;
        if (isGlobalAdmin) {
            doesNotPertainCount = fetchCount(
                    "SELECT COUNT(DISTINCT au.grievance_id) FROM jks_3nf.assigned_users au " +
                    "JOIN jks_3nf.grievance_master gm ON gm.id = au.grievance_id " +
                    "WHERE au.action = 'Does not pertain to this office' AND gm.origin IN ('JKSAMADHAN','RAABITA') AND au.enabled = true");
            appealReceviedCountStr = fetchCount(
                    "SELECT COUNT(*) FROM jks_3nf.appeal_master am " +
                    "JOIN jks_3nf.appeal_assign_user au ON am.id = au.appeal_id " +
                    "WHERE au.action = 'Pending' AND au.enabled = true");
        } else {
            doesNotPertainCount = fetchCount(
                    "SELECT COUNT(DISTINCT au.grievance_id) FROM jks_3nf.assigned_users au " +
                    "JOIN jks_3nf.grievance_master gm ON gm.id = au.grievance_id " +
                    "JOIN jks_3nf.users u_by ON u_by.id = au.assigned_by_user_id " +
                    "JOIN jks_3nf.categories cat ON cat.id = gm.category_id " +
                    "JOIN jks_3nf.departments dept ON dept.id = cat.department_id " +
                    "WHERE u_by.username = ? AND au.action = 'Does not pertain to this office' AND gm.origin IN ('JKSAMADHAN','RAABITA') AND dept.name = ? AND au.enabled = true",
                    nodalName, self.getDepartment() != null ? self.getDepartment().getName() : "");
            appealReceviedCountStr = fetchCount(
                    "SELECT COUNT(*) FROM jks_3nf.appeal_master am " +
                    "JOIN jks_3nf.appeal_assign_user au ON am.id = au.appeal_id " +
                    "JOIN jks_3nf.users u_to ON u_to.id = au.assigned_to_user_id " +
                    "JOIN jks_3nf.grievance_master gm ON gm.id = am.grievance_id " +
                    "JOIN jks_3nf.categories cat ON cat.id = gm.category_id " +
                    "JOIN jks_3nf.departments dept ON dept.id = cat.department_id " +
                    "WHERE dept.name = ? AND au.action = 'Pending' AND u_to.username = ? AND au.enabled = true",
                    self.getDepartment() != null ? self.getDepartment().getName() : "", username);
        }

        // Fetch divisions / departments
        List<Map<String, Object>> deptsRaw;
        if (isGlobalAdmin) {
            deptsRaw = jdbcTemplate.queryForList(
                    "SELECT DISTINCT name FROM jks_3nf.departments ORDER BY name DESC");
        } else {
            deptsRaw = jdbcTemplate.queryForList(
                    "SELECT DISTINCT name FROM jks_3nf.departments WHERE name = ? ORDER BY name DESC", userDeptName);
        }
        List<String> depts = deptsRaw.stream().map(r -> r.get("name").toString()).collect(Collectors.toList());

        // Other departments / Assigned queries
        // Other departments / Assigned queries
        String otherSql = """
            SELECT 
                COUNT(*) as total,
                COUNT(CASE WHEN au.action = 'Resolved' THEN 1 END) as resolved,
                COUNT(CASE WHEN au.action = 'Rejected' THEN 1 END) as rejected,
                COUNT(CASE WHEN au.action = 'Pending' THEN 1 END) as pending,
                COUNT(CASE WHEN au.action = 'Forwarded' AND au.remark = 'Recieved' THEN 1 END) as recd,
                COUNT(CASE WHEN au.action = 'Forwarded' AND (au.remark IS NULL OR au.remark = '') THEN 1 END) as fwd,
                COUNT(CASE WHEN (au.action = 'Forwarded' AND au.remark = 'dnpToOffice') OR (au.action = 'dnpToOffice' AND au.remark = '') THEN 1 END) as dnp,
                COUNT(CASE WHEN au.action = 'Remark Added' AND COALESCE(au.remark, '') IN ('', 'Proposed Disposed') THEN 1 END) as rmk
            FROM jks_3nf.assigned_users au
            JOIN jks_3nf.users u_to ON u_to.id = au.assigned_to_user_id
            WHERE u_to.username = ? AND au.enabled = true
            """;
        Map<String, Object> otherStats = jdbcTemplate.queryForMap(otherSql, username);
        String resolvedByOtherDep = getMapValue(otherStats, "resolved");
        String rejectedByOtherDep = getMapValue(otherStats, "rejected");
        String pendingAtOtherDep = getMapValue(otherStats, "pending");
        String proposeDispAtOtherDep = getMapValue(otherStats, "recd");
        String forwardedpAtOtherDep = getMapValue(otherStats, "fwd");
        String dnpAtOtherDep = getMapValue(otherStats, "dnp");
        String remarkAtOtherDep = getMapValue(otherStats, "rmk");
        String fwdByOtherDepCount = getMapValue(otherStats, "total");

        // Forwarded / Remark count inside user's department
        String fwdCount = fetchCount(
                "SELECT COUNT(DISTINCT au.grievance_id) FROM jks_3nf.assigned_users au " +
                "JOIN jks_3nf.grievance_master gm ON gm.id = au.grievance_id " +
                "JOIN jks_3nf.users u_by ON u_by.id = au.assigned_by_user_id " +
                "JOIN jks_3nf.categories cat ON cat.id = gm.category_id " +
                "JOIN jks_3nf.departments dept ON dept.id = cat.department_id " +
                "WHERE u_by.username = ? AND dept.name = ? AND gm.origin IN ('JKSAMADHAN','RAABITA') AND au.enabled = true",
                username, self.getDepartment() != null ? self.getDepartment().getName() : "");

        String fwdOtherDepCount = fetchCount(
                "SELECT COUNT(DISTINCT au.grievance_id) FROM jks_3nf.assigned_users au " +
                "JOIN jks_3nf.grievance_master gm ON gm.id = au.grievance_id " +
                "JOIN jks_3nf.users u_by ON u_by.id = au.assigned_by_user_id " +
                "JOIN jks_3nf.categories cat ON cat.id = gm.category_id " +
                "JOIN jks_3nf.departments dept ON dept.id = cat.department_id " +
                "WHERE u_by.username = ? AND dept.name != ? AND gm.origin IN ('JKSAMADHAN','RAABITA') AND au.enabled = true",
                username, self.getDepartment() != null ? self.getDepartment().getName() : "");

        String rmkDataCount = fetchCount(
                "SELECT COUNT(DISTINCT au.grievance_id) FROM jks_3nf.assigned_users au " +
                "JOIN jks_3nf.users u_by ON u_by.id = au.assigned_by_user_id " +
                "WHERE u_by.username = ? AND au.action = 'Remark Added' AND au.enabled = true", username);

        // JKIGRAMS statistics
        String jkiTotal, jkiPending, jkiForwarded, jkiRemarksAdded, jkiResolved, jkiRejected, jkiDNP;
        String jkiSql;
        Object[] jkiParams;
        if (isGlobalAdmin) {
            jkiSql = """
                SELECT 
                    COUNT(*) as total,
                    COUNT(CASE WHEN au.action IN ('Pending','Acknowledged','Under Process') THEN 1 END) as pending,
                    COUNT(CASE WHEN au.action = 'Forwarded' THEN 1 END) as forwarded,
                    COUNT(CASE WHEN au.action = 'Remark Added' THEN 1 END) as remarks,
                    COUNT(CASE WHEN au.action = 'Resolved' THEN 1 END) as resolved,
                    COUNT(CASE WHEN au.action = 'Rejected' THEN 1 END) as rejected,
                    COUNT(CASE WHEN au.action = 'Does Not Pertain' THEN 1 END) as dnp
                FROM jks_3nf.assigned_users au
                JOIN jks_3nf.grievance_master gm ON gm.id = au.grievance_id
                WHERE gm.origin = 'JKIGRAMS' AND au.enabled = true
                """;
            jkiParams = new Object[0];
        } else {
            jkiSql = """
                SELECT 
                    COUNT(*) as total,
                    COUNT(CASE WHEN au.action IN ('Pending','Acknowledged','Under Process') THEN 1 END) as pending,
                    COUNT(CASE WHEN au.action = 'Forwarded' THEN 1 END) as forwarded,
                    COUNT(CASE WHEN au.action = 'Remark Added' THEN 1 END) as remarks,
                    COUNT(CASE WHEN au.action = 'Resolved' THEN 1 END) as resolved,
                    COUNT(CASE WHEN au.action = 'Rejected' THEN 1 END) as rejected,
                    COUNT(CASE WHEN au.action = 'Does Not Pertain' THEN 1 END) as dnp
                FROM jks_3nf.assigned_users au
                JOIN jks_3nf.grievance_master gm ON gm.id = au.grievance_id
                JOIN jks_3nf.categories cat ON cat.id = gm.category_id
                JOIN jks_3nf.departments dept ON dept.id = cat.department_id
                WHERE gm.origin = 'JKIGRAMS' AND dept.name = ? AND au.enabled = true
                """;
            jkiParams = new Object[]{self.getDepartment() != null ? self.getDepartment().getName() : ""};
        }

        Map<String, Object> jkiStats = jdbcTemplate.queryForMap(jkiSql, jkiParams);
        jkiTotal = getMapValue(jkiStats, "total");
        jkiPending = getMapValue(jkiStats, "pending");
        jkiForwarded = getMapValue(jkiStats, "forwarded");
        jkiRemarksAdded = getMapValue(jkiStats, "remarks");
        jkiResolved = getMapValue(jkiStats, "resolved");
        jkiRejected = getMapValue(jkiStats, "rejected");
        jkiDNP = getMapValue(jkiStats, "dnp");

        // Fetch notifications
        List<com.example.jk_samadhan_backend.models.Notification> activeNotifs;
        if (isGlobalAdmin) {
            activeNotifs = notificationRepository.findActiveNotifications("ALL", "ALL DEPARTMENTS", "ALL");
        } else {
            activeNotifs = notificationRepository.findActiveNotifications(
                    "ALL", "ALL DEPARTMENTS", self.getDepartment() != null ? self.getDepartment().getName() : "");
        }

        String key = EncryptionUtil.SECRET_KEY;
        String base64Key = EncryptionUtil.encodeKey(key);

        List<NotificationDTO> mappedNotifs = activeNotifs.stream().map(n -> {
            String encPath = null;
            if (n.getFilepath() != null) {
                try {
                    encPath = EncryptionUtil.encrypt(n.getFilepath().replaceAll("/", "!"), base64Key);
                } catch (Exception e) {
                    // ignore
                }
            }
            return NotificationDTO.builder()
                    .id(n.getId())
                    .notification(n.getNotification())
                    .notificationsentto(n.getNotificationsentto())
                    .createdat(n.getCreatedat())
                    .validtill(n.getValidtill())
                    .status(n.getStatus())
                    .type(n.getType())
                    .filepath(encPath)
                    .createdby(n.getCreatedby())
                    .isactive(n.getIsactive() != null ? n.getIsactive() : 1)
                    .build();
        }).collect(Collectors.toList());

        // Fetch Totall Grievances list (Optimized to return empty as it is dead payload for frontend)
        List<Map<String, Object>> totallGrievancesRaw;
        if (isGlobalAdmin) {
            totallGrievancesRaw = jdbcTemplate.queryForList(
                    "SELECT * FROM public.grievance_master WHERE forward_hlg = 0 ORDER BY id DESC LIMIT 0");
        } else {
            totallGrievancesRaw = jdbcTemplate.queryForList(
                    "SELECT * FROM public.grievance_master WHERE department = ? AND forward_hlg = 0 ORDER BY id DESC LIMIT 0", userDeptName);
        }
        List<GrievanceSummaryDTO> totallGrievances = totallGrievancesRaw.stream().map(row -> GrievanceSummaryDTO.builder()
                .id(row.get("id") != null ? ((Number) row.get("id")).longValue() : null)
                .uniqId(row.get("uniqid") != null ? row.get("uniqid").toString() : "")
                .category(row.get("category") != null ? row.get("category").toString() : "")
                .subCategory(row.get("sub_category") != null ? row.get("sub_category").toString() : "")
                .department(row.get("department") != null ? row.get("department").toString() : "")
                .status(row.get("status") != null ? row.get("status").toString() : "")
                .createdDate(row.get("createddate") != null ? row.get("createddate").toString() : "")
                .finalStatus(row.get("final_status") != null ? row.get("final_status").toString() : "")
                .application(row.get("application") != null ? row.get("application").toString() : "")
                .keyFlag(row.get("key_flag") != null ? row.get("key_flag").toString() : "")
                .build()).collect(Collectors.toList());

        String nameAdnDesig = officeName + " (" + firstName + " " + lastName + ")";

        return AdminDashboardDataDTO.builder()
                .keyOne(base64Key.substring(0, 4))
                .keyTwo(base64Key.substring(4, 8))
                .keyThree(base64Key.substring(8))
                .showLoginToast(Boolean.TRUE.equals(showLoginToast))
                .loggedInUserFullName(nameAdnDesig)
                .userType(userTypeName)
                .userLevel(userLevel)
                .userDepartment(userDeptName)
                .userflag(userflag)
                .totall(totallGrievances)
                .depts(depts)
                .notifications(mappedNotifs)
                .totalG(totalGCount)
                .propDisp(propDispCount)
                .pending(pendingCount)
                .resolved(resolvedCount)
                .pendingWithAdmin(pendingWithAdminCount)
                .fwd(fwdCount)
                .rmk(rmkDataCount)
                .fwdByOtherDep(fwdByOtherDepCount)
                .resolvedByOtherDep(resolvedByOtherDep)
                .rejectedByOtherDep(rejectedByOtherDep)
                .pendingAtOtherDep(pendingAtOtherDep)
                .proposeDispAtOtherDep(proposeDispAtOtherDep)
                .forwardedpAtOtherDep(forwardedpAtOtherDep)
                .dnpAtOtherDep(dnpAtOtherDep)
                .remarkAtOtherDep(remarkAtOtherDep)
                .fwdOtherDep(fwdOtherDepCount)
                .cpgramClosed(cpgramClosedCount)
                .fwdToCPGRAM(fwdToCPGRAMCount)
                .normalFlagCount(normalFlagCount)
                .priorityFlagCount(priorityFlagCount)
                .web(webCount)
                .App(appCount)
                .forwarded(forwardedCount)
                .totalClosed(totalClosedCount)
                .totalCPGRAM(totalCPGRAMCount)
                .dNpCount(Integer.parseInt(doesNotPertainCount))
                .rejected(rejectedCount)
                .DNP(dnpCount)
                .remark(remarkCount)
                .appealReceviedCount(Integer.parseInt(appealReceviedCountStr))
                .jkiTotal(Integer.parseInt(jkiTotal))
                .jkiPending(Integer.parseInt(jkiPending))
                .jkiForwarded(Integer.parseInt(jkiForwarded))
                .jkiRemarksAdded(Integer.parseInt(jkiRemarksAdded))
                .jkiResolved(Integer.parseInt(jkiResolved))
                .jkiRejected(Integer.parseInt(jkiRejected))
                .jkiDNP(Integer.parseInt(jkiDNP))
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public DeptMappingDataDTO getDeptMappingData(String username) {
        String key = EncryptionUtil.SECRET_KEY;
        String base64Key = EncryptionUtil.encodeKey(key);

        List<Object[]> nodalDetailsRaw = userRepository.findNodalDetailsRaw(username);
        if (nodalDetailsRaw.isEmpty()) {
            throw new RuntimeException("Nodal details raw not found for user: " + username);
        }
        Object[] uRow = nodalDetailsRaw.get(0);
        String firstName = uRow[6] != null ? uRow[6].toString() : "";
        String lastName = uRow[8] != null ? uRow[8].toString() : "";
        String officeName = uRow[11] != null ? uRow[11].toString() : "";
        String nameAdnDesig = officeName + " (" + firstName + " " + lastName + ")";

        List<UserDTO> nodalD = nodalDetailsRaw.stream().map(row -> UserDTO.builder()
                .id(row[0] != null ? ((Number) row[0]).longValue() : null)
                .username(row[2] != null ? row[2].toString() : "")
                .firstName(firstName)
                .lastName(lastName)
                .middleName(row[7] != null ? row[7].toString() : "")
                .email(row[10] != null ? row[10].toString() : "")
                .mobile(row[9] != null ? row[9].toString() : "")
                .officeName(officeName)
                .department(row[25] != null ? row[25].toString() : "")
                .userType(row[5] != null ? row[5].toString() : "")
                .userLevel(row[26] != null ? ((Number) row[26]).intValue() : null)
                .userflag(row[27] != null ? row[27].toString() : "")
                .enabled(row[4] != null ? ((Number) row[4]).intValue() : 0)
                .build()).collect(Collectors.toList());

        // Fetch distinct departments and categories
        List<Map<String, Object>> deptsRaw = jdbcTemplate.queryForList(
                "SELECT DISTINCT name FROM jks_3nf.departments ORDER BY name ASC");
        List<String> depts = deptsRaw.stream().map(r -> r.get("name").toString()).collect(Collectors.toList());

        List<Map<String, Object>> catRaw = jdbcTemplate.queryForList(
                "SELECT DISTINCT name FROM jks_3nf.categories");
        List<String> cat = catRaw.stream().map(r -> r.get("name").toString()).collect(Collectors.toList());

        // Fetch level 4 mapping data created by user
        List<Map<String, Object>> allDataRaw = jdbcTemplate.queryForList(
                "SELECT l4.id as id, l4.name as sub_category_level4_name, " +
                "l3.name as sub_category_level3_name, l2.name as sub_category_level2_name, " +
                "l1.name as sub_category_name, c.name as category_name, d.name as department_name, " +
                "u.username as created_by, l4.created_at as created_date " +
                "FROM jks_3nf.subcategory_level4 l4 " +
                "JOIN jks_3nf.subcategory_level3 l3 ON l3.id = l4.parent_l3_id " +
                "JOIN jks_3nf.subcategory_level2 l2 ON l2.id = l3.parent_l2_id " +
                "JOIN jks_3nf.subcategory_level1 l1 ON l1.id = l2.parent_l1_id " +
                "JOIN jks_3nf.categories c ON c.id = l1.category_id " +
                "JOIN jks_3nf.departments d ON d.id = c.department_id " +
                "LEFT JOIN jks_3nf.users u ON u.id = 1 " + // default created by mapping
                "WHERE c.name != '' ORDER BY l4.id DESC");

        List<SubCategoryMasterLevel4DTO> allData = allDataRaw.stream().map(row -> SubCategoryMasterLevel4DTO.builder()
                .id(row.get("id") != null ? ((Number) row.get("id")).longValue() : null)
                .subCategoryLevel4Name(row.get("sub_category_level4_name") != null ? row.get("sub_category_level4_name").toString() : "")
                .subCategoryLevel3Name(row.get("sub_category_level3_name") != null ? row.get("sub_category_level3_name").toString() : "")
                .subCategoryLevel2Name(row.get("sub_category_level2_name") != null ? row.get("sub_category_level2_name").toString() : "")
                .subCategoryName(row.get("sub_category_name") != null ? row.get("sub_category_name").toString() : "")
                .categoryName(row.get("category_name") != null ? row.get("category_name").toString() : "")
                .departmentName(row.get("department_name") != null ? row.get("department_name").toString() : "")
                .createdBy(row.get("created_by") != null ? row.get("created_by").toString() : "")
                .createdDate((Date) row.get("created_date"))
                .build()).collect(Collectors.toList());

        String uniqueDate = new SimpleDateFormat("ddMMyyyyHHmmss").format(new Date());

        return DeptMappingDataDTO.builder()
                .keyOne(base64Key.substring(0, 4))
                .keyTwo(base64Key.substring(4, 8))
                .keyThree(base64Key.substring(8))
                .loggedInUserFullName(nameAdnDesig)
                .nodalD(nodalD)
                .allData(allData)
                .depts(depts)
                .cat(cat)
                .sessionname("deptMapping" + uniqueDate)
                .build();
    }

    @Override
    @Transactional
    public void addDeptCategory(ReqUIDTO data, String username) {
        // Validate inputs for special characters
        String regex = "^[^!@$%*#<>^]*$";
        Pattern pattern = Pattern.compile(regex);
        validateField(data.getDepartment_name(), "Department name", pattern);
        validateField(data.getCategory(), "Category", pattern);
        validateField(data.getSub_category(), "Subcategory", pattern);
        validateField(data.getSub_Cat_Next_Level2(), "Next level 2 subcategory", pattern);
        validateField(data.getSub_Cat_Next_Level3(), "Next level 3 subcategory", pattern);
        validateField(data.getSub_Cat_Next_Level4(), "Next level 4 subcategory", pattern);

        // 1. Resolve Department
        String deptName = data.getDepartment_name().trim();
        Department department = departmentRepository.findByNameIgnoreCase(deptName)
                .orElseGet(() -> {
                    Department d = Department.builder()
                            .name(deptName.toUpperCase())
                            .type("GOVERNMENT")
                            .build();
                    return departmentRepository.save(d);
                });

        // 2. Resolve Category
        String catName = data.getCategory().trim();
        Category category = categoryRepository.findByNameIgnoreCaseAndDepartmentId(catName, department.getId())
                .orElseGet(() -> {
                    Category c = Category.builder()
                            .department(department)
                            .name(catName.toUpperCase())
                            .reminderDays(data.getReminderInDays() != null ? data.getReminderInDays().intValue() : 7)
                            .build();
                    return categoryRepository.save(c);
                });

        // 3. Resolve Level 1 Subcategory
        if (data.getSub_category() == null || data.getSub_category().trim().isEmpty() || "0".equals(data.getSub_category())) {
            return;
        }
        String l1Name = data.getSub_category().trim();
        SubCategoryLevel1 l1 = subCategoryLevel1Repository.findByNameIgnoreCaseAndCategoryId(l1Name, category.getId())
                .orElseGet(() -> {
                    SubCategoryLevel1 sub = SubCategoryLevel1.builder()
                            .category(category)
                            .name(l1Name.toUpperCase())
                            .build();
                    return subCategoryLevel1Repository.save(sub);
                });

        // 4. Resolve Level 2 Subcategory
        if (data.getSub_Cat_Next_Level2() == null || data.getSub_Cat_Next_Level2().trim().isEmpty() || "0".equals(data.getSub_Cat_Next_Level2())) {
            return;
        }
        String l2Name = data.getSub_Cat_Next_Level2().trim();
        SubCategoryLevel2 l2 = subCategoryLevel2Repository.findByNameIgnoreCaseAndParentL1Id(l2Name, l1.getId())
                .orElseGet(() -> {
                    SubCategoryLevel2 sub = SubCategoryLevel2.builder()
                            .parentL1(l1)
                            .name(l2Name.toUpperCase())
                            .build();
                    return subCategoryLevel2Repository.save(sub);
                });

        // 5. Resolve Level 3 Subcategory
        if (data.getSub_Cat_Next_Level3() == null || data.getSub_Cat_Next_Level3().trim().isEmpty() || "0".equals(data.getSub_Cat_Next_Level3())) {
            return;
        }
        String l3Name = data.getSub_Cat_Next_Level3().trim();
        SubCategoryLevel3 l3 = subCategoryLevel3Repository.findByNameIgnoreCaseAndParentL2Id(l3Name, l2.getId())
                .orElseGet(() -> {
                    SubCategoryLevel3 sub = SubCategoryLevel3.builder()
                            .parentL2(l2)
                            .name(l3Name.toUpperCase())
                            .build();
                    return subCategoryLevel3Repository.save(sub);
                });

        // 6. Resolve Level 4 Subcategory
        if (data.getSub_Cat_Next_Level4() == null || data.getSub_Cat_Next_Level4().trim().isEmpty() || "0".equals(data.getSub_Cat_Next_Level4())) {
            return;
        }
        String l4Name = data.getSub_Cat_Next_Level4().trim();
        subCategoryLevel4Repository.findByNameIgnoreCaseAndParentL3Id(l4Name, l3.getId())
                .orElseGet(() -> {
                    SubCategoryLevel4 sub = SubCategoryLevel4.builder()
                            .parentL3(l3)
                            .name(l4Name.toUpperCase())
                            .build();
                    return subCategoryLevel4Repository.save(sub);
                });
    }

    private void validateField(String fieldVal, String fieldName, Pattern pattern) {
        if (fieldVal != null && !fieldVal.isEmpty() && !"0".equals(fieldVal)) {
            if (!pattern.matcher(fieldVal).matches()) {
                throw new RuntimeException(fieldName + " field must not include special characters.");
            }
        }
    }

    private String fetchCount(String sql, Object... args) {
        try {
            Long count = jdbcTemplate.queryForObject(sql, Long.class, args);
            return count != null ? count.toString() : "0";
        } catch (Exception e) {
            return "0";
        }
    }
    private String getMapValue(Map<String, Object> map, String key) {
        if (map == null) return "0";
        Object val = map.get(key);
        if (val == null) {
            val = map.get(key.toLowerCase());
        }
        if (val == null) {
            val = map.get(key.toUpperCase());
        }
        return val != null ? val.toString() : "0";
    }

    @Override
    public void assignGrievance(AssignGrievanceReqDTO req, String username) {
        Users nodal = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Nodal user not found: " + username));

        GrievanceMaster grievance = grievanceMasterRepository.findByUniqId(req.getGrievanceUniqId())
                .orElseThrow(() -> new RuntimeException("Grievance not found: " + req.getGrievanceUniqId()));

        // Verify Nodal has access to the grievance
        if (nodal.getDepartment() != null && grievance.getCategory() != null && grievance.getCategory().getDepartment() != null) {
            String nodalDept = nodal.getDepartment().getName();
            String grievanceDept = grievance.getCategory().getDepartment().getName();
            if (!nodalDept.equalsIgnoreCase(grievanceDept)) {
                throw new RuntimeException("Unauthorized: This grievance belongs to department " + grievanceDept);
            }
        }

        Users subUser = userRepository.findByUsername(req.getTargetUsername())
                .orElseThrow(() -> new RuntimeException("Target official not found: " + req.getTargetUsername()));

        if (req.isSendBack()) {
            // Send Back Proposed Disposal Action
            List<AssignedUsers> assignments = assignedUsersRepository.findByGrievanceId(grievance.getId()).stream()
                    .filter(au -> au.getAssignedTo().getId().equals(subUser.getId()) && au.isEnabled())
                    .collect(Collectors.toList());
            if (assignments.isEmpty()) {
                throw new RuntimeException("No active assignment found for sub-user: " + subUser.getUsername());
            }

            for (AssignedUsers assignment : assignments) {
                assignment.setAction("Pending");
                assignedUsersRepository.save(assignment);
            }

            // Clear final status of grievance
            grievance.setFinalStatus("");
            grievanceMasterRepository.save(grievance);

            // Write to GrievanceHistory
            GrievanceHistory history = GrievanceHistory.builder()
                    .grievance(grievance)
                    .actionTaken("Application Sent Back to :- " + subUser.getName())
                    .preStatus(grievance.getStatus())
                    .status(grievance.getStatus())
                    .remarks(req.getRemark())
                    .actionTakenBy(nodal)
                    .build();
            grievanceHistoryRepository.save(history);

        } else {
            // Forward / Assign Grievance Action
            List<AssignedUsers> activeAssignments = assignedUsersRepository.findByGrievanceId(grievance.getId()).stream()
                    .filter(AssignedUsers::isEnabled)
                    .collect(Collectors.toList());
            for (AssignedUsers active : activeAssignments) {
                active.setEnabled(false);
                assignedUsersRepository.save(active);
            }

            AssignedUsers assignment = AssignedUsers.builder()
                    .grievance(grievance)
                    .assignedTo(subUser)
                    .assignedBy(nodal)
                    .action("Pending")
                    .remark(req.getRemark())
                    .authority(req.getAuthority() != null ? req.getAuthority() : "Process")
                    .forwardType(req.getForwardType() != null ? req.getForwardType() : "Intra")
                    .userLevel(req.getUserLevel() != null ? req.getUserLevel() : (subUser.getUserType() != null ? subUser.getUserType().getUserLevel() : 1))
                    .department(subUser.getDepartment() != null ? subUser.getDepartment().getName() : "")
                    .enabled(true)
                    .build();
            assignedUsersRepository.save(assignment);

            // Update grievance status to Under Process
            grievance.setStatus("Under Process");
            grievanceMasterRepository.save(grievance);

            // Save GrievanceHistory
            GrievanceHistory history = GrievanceHistory.builder()
                    .grievance(grievance)
                    .actionTaken("Application forwarded to :- " + subUser.getName() + " (" + (subUser.getDesignation() != null ? subUser.getDesignation().getName() : "Officer") + ")")
                    .preStatus(grievance.getStatus())
                    .status("Under Process")
                    .remarks(req.getRemark())
                    .actionTakenBy(nodal)
                    .build();
            grievanceHistoryRepository.save(history);
        }
    }

    @Override
    public void pullBackGrievance(PullBackReqDTO req, String username) {
        Users nodal = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Nodal user not found: " + username));

        GrievanceMaster grievance = grievanceMasterRepository.findByUniqId(req.getGrievanceUniqId())
                .orElseThrow(() -> new RuntimeException("Grievance not found: " + req.getGrievanceUniqId()));

        Users subUser = userRepository.findByUsername(req.getSubUsername())
                .orElseThrow(() -> new RuntimeException("Sub-user not found: " + req.getSubUsername()));

        List<AssignedUsers> assignments = assignedUsersRepository.findByGrievanceId(grievance.getId()).stream()
                    .filter(au -> au.getAssignedTo().getId().equals(subUser.getId()) && au.isEnabled())
                    .collect(Collectors.toList());

        if (assignments.isEmpty()) {
            throw new RuntimeException("No active assignment found for sub-user: " + subUser.getUsername());
        }

        // Log pullback action in GrievanceHistory
        GrievanceHistory history = GrievanceHistory.builder()
                .grievance(grievance)
                .actionTaken("Application Pulled From :- " + subUser.getName())
                .preStatus(grievance.getStatus())
                .status("Pending")
                .remarks("Application pulled back by Nodal Officer")
                .actionTakenBy(nodal)
                .build();
        grievanceHistoryRepository.save(history);

        // Update grievance status back to Pending
        grievance.setStatus("Pending");
        grievanceMasterRepository.save(grievance);

        // Delete sub-user row from assigned_users
        for (AssignedUsers assignment : assignments) {
            assignedUsersRepository.delete(assignment);
        }
    }

    @Override
    public void updateGrievanceResolution(UpdateGrievanceReqDTO req, String username) {
        Users nodal = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Nodal user not found: " + username));

        GrievanceMaster grievance = grievanceMasterRepository.findByUniqId(req.getGrievanceUniqId())
                .orElseThrow(() -> new RuntimeException("Grievance not found: " + req.getGrievanceUniqId()));

        String preStatus = grievance.getStatus();

        // Update status and files
        grievance.setStatus(req.getStatus());
        if (req.getFileName() != null) {
            grievance.setFileName(req.getFileName());
        }
        if (req.getFilePath() != null) {
            grievance.setFilePath(req.getFilePath());
        }
        grievance.setUpdatedBy(nodal);
        grievanceMasterRepository.save(grievance);

        // Save history
        GrievanceHistory history = GrievanceHistory.builder()
                .grievance(grievance)
                .actionTaken("Grievance Status Updated to " + req.getStatus())
                .preStatus(preStatus)
                .status(req.getStatus())
                .remarks(req.getRemarks())
                .actionTakenBy(nodal)
                .fileName(req.getFileName())
                .filePath(req.getFilePath())
                .build();
        grievanceHistoryRepository.save(history);

        // Disable active assignments
        List<AssignedUsers> activeAssignments = assignedUsersRepository.findByGrievanceId(grievance.getId()).stream()
                .filter(AssignedUsers::isEnabled)
                .collect(Collectors.toList());
        for (AssignedUsers active : activeAssignments) {
            active.setEnabled(false);
            assignedUsersRepository.save(active);
        }

        // Mock notification print
        System.out.println("Notification sent to citizen " + (grievance.getSubmittedBy() != null ? grievance.getSubmittedBy().getEmail() : "citizen") 
            + ": Your grievance " + grievance.getUniqId() + " has been " + req.getStatus());
    }

    @Override
    @Transactional
    public void createNodal(CreateNodalReqDTO req) {
        if (userRepository.existsByUsername(req.getEmail())) {
            throw new RuntimeException("Username already exists: " + req.getEmail());
        }
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email already exists: " + req.getEmail());
        }
        if (userRepository.existsByMobile(req.getMobile())) {
            throw new RuntimeException("Mobile number already exists: " + req.getMobile());
        }

        Users user = new Users();
        user.setUuid(java.util.UUID.randomUUID());
        user.setUsername(req.getEmail());
        user.setEmail(req.getEmail());
        user.setFirstName(req.getFirstName());
        user.setMiddleName(req.getMiddleName());
        user.setLastName(req.getLastName());
        user.setMobile(req.getMobile());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setEnabled(true);
        user.setRole("ADMIN");

        // Set UserType
        String typeName = req.getUserType() != null ? req.getUserType() : "ROLE_Admin";
        UserType ut = userTypeRepository.findByTypeName(typeName)
                .or(() -> userTypeRepository.findByTypeName("ROLE_Admin"))
                .or(() -> userTypeRepository.findAll().stream().filter(t -> t.getTypeName().toUpperCase().contains("ADMIN")).findFirst())
                .orElseThrow(() -> new RuntimeException("User type not found: " + typeName));
        user.setUserType(ut);

        // Set Department
        if (req.getDepartmentName() != null && !req.getDepartmentName().trim().isEmpty()) {
            Department dept = departmentRepository.findByNameIgnoreCase(req.getDepartmentName().trim())
                    .orElseGet(() -> {
                        Department d = Department.builder()
                                .name(req.getDepartmentName().trim().toUpperCase())
                                .type("GOVERNMENT")
                                .build();
                        return departmentRepository.save(d);
                    });
            user.setDepartment(dept);
        }

        // Set Office Name
        if (req.getOfficeName() != null && !req.getOfficeName().trim().isEmpty()) {
            user.setOfficeName(req.getOfficeName().trim());
        }

        // Set Designation
        if (req.getDesignationName() != null && !req.getDesignationName().trim().isEmpty()) {
            Designation desig = designationRepository.findByNameIgnoreCase(req.getDesignationName().trim())
                    .orElseGet(() -> {
                        Designation d = Designation.builder()
                                .name(req.getDesignationName().trim().toUpperCase())
                                .build();
                        return designationRepository.save(d);
                    });
            user.setDesignation(desig);
        }

        Users savedUser = userRepository.save(user);

        // Store user_classification in UserExtraData
        UserExtraData classification = UserExtraData.builder()
                .user(savedUser)
                .dataKey("user_classification")
                .dataValue("MASTER NODAL - L 0")
                .build();
        userExtraDataRepository.save(classification);
    }

    @Override
    public java.util.Map<String, Object> getNodalByDepartment(String departmentName) {
        java.util.Map<String, Object> result = new java.util.HashMap<>();
        List<Users> users = userRepository.findNodalByDepartmentName(departmentName);
        if (users == null || users.isEmpty()) {
            result.put("assigned", false);
            return result;
        }

        Users nodal = users.get(0);
        result.put("assigned", true);
        result.put("firstName", nodal.getFirstName() != null ? nodal.getFirstName() : "");
        result.put("middleName", nodal.getMiddleName() != null ? nodal.getMiddleName() : "");
        result.put("lastName", nodal.getLastName() != null ? nodal.getLastName() : "");
        result.put("mobile", nodal.getMobile() != null ? nodal.getMobile() : "");
        result.put("email", nodal.getEmail() != null ? nodal.getEmail() : "");
        result.put("designationName", nodal.getDesignation() != null ? nodal.getDesignation().getName() : "");
        return result;
    }

    @Override
    public java.util.List<java.util.Map<String, Object>> getDeptUsersList(String departmentName) {
        List<Users> users = userRepository.findNodalByDepartmentName(departmentName);
        java.util.List<java.util.Map<String, Object>> list = new java.util.ArrayList<>();
        if (users == null) return list;
        for (Users u : users) {
            java.util.Map<String, Object> map = new java.util.HashMap<>();
            String fullName = (u.getFirstName() != null ? u.getFirstName() : "")
                    + (u.getMiddleName() != null && !u.getMiddleName().isEmpty() ? " " + u.getMiddleName() : "")
                    + (u.getLastName() != null && !u.getLastName().isEmpty() ? " " + u.getLastName() : "");
            map.put("name", fullName.trim());
            map.put("department", u.getDepartment() != null ? u.getDepartment().getName() : "");
            map.put("designation", u.getDesignation() != null ? u.getDesignation().getName() : "");
            map.put("email", u.getEmail() != null ? u.getEmail() : "");
            map.put("mobile", u.getMobile() != null ? u.getMobile() : "");
            
            // Format Created At
            String createdAtStr = "";
            if (u.getCreatedAt() != null) {
                try {
                    java.time.format.DateTimeFormatter formatter = java.time.format.DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");
                    createdAtStr = u.getCreatedAt().format(formatter);
                } catch (Exception e) {
                    createdAtStr = u.getCreatedAt().toString();
                }
            }
            map.put("createdAt", createdAtStr);
            map.put("createdBy", u.getCreatedBy() != null ? u.getCreatedBy().getName() : "System");
            list.add(map);
        }
        return list;
    }
}
