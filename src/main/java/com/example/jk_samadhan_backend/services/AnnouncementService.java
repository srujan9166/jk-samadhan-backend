package com.example.jk_samadhan_backend.services;

import com.example.jk_samadhan_backend.dto.AnnouncementDTO;
import com.example.jk_samadhan_backend.dto.AnnouncementResponseDTO;
import com.example.jk_samadhan_backend.models.Notification;
import com.example.jk_samadhan_backend.models.Users;
import com.example.jk_samadhan_backend.repositories.NotificationRepository;
import com.example.jk_samadhan_backend.repositories.UserRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.security.Principal;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AnnouncementService {

    private static final Logger logger = LoggerFactory.getLogger(AnnouncementService.class);
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final JdbcTemplate jdbcTemplate;

    public AnnouncementService(NotificationRepository notificationRepository, UserRepository userRepository, JdbcTemplate jdbcTemplate) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.jdbcTemplate = jdbcTemplate;
    }

    public AnnouncementResponseDTO createAnnouncement(String to, String validTillStr, String announcementText, MultipartFile file, Principal principal) {
        if (principal == null) {
            throw new RuntimeException("Unauthenticated request. Please log in first.");
        }

        Users user = null;
        if (principal instanceof Authentication auth && auth.getPrincipal() instanceof Users authUser) {
            user = authUser;
        } else {
            String identifier = principal.getName();
            user = userRepository.findByIdentifier(identifier)
                    .orElseThrow(() -> new RuntimeException("User not found: " + identifier));
        }

        if (to == null || to.trim().isEmpty()) {
            throw new RuntimeException("Recipient (To) is required.");
        }

        if (announcementText == null || announcementText.trim().isEmpty()) {
            throw new RuntimeException("Announcement text is required.");
        }

        OffsetDateTime validTill = null;
        if (validTillStr != null && !validTillStr.trim().isEmpty()) {
            try {
                LocalDateTime ldt;
                if (validTillStr.contains("T")) {
                    ldt = LocalDateTime.parse(validTillStr.trim());
                } else if (validTillStr.contains("-")) {
                    ldt = LocalDateTime.parse(validTillStr.trim(), DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
                } else {
                    ldt = LocalDateTime.parse(validTillStr.trim(), DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss"));
                }
                validTill = ldt.atZone(ZoneId.systemDefault()).toOffsetDateTime();
                if (validTill.isBefore(OffsetDateTime.now())) {
                    throw new RuntimeException("Announcement Valid Till date cannot be in the past.");
                }
            } catch (Exception e) {
                if (e.getMessage() != null && e.getMessage().contains("cannot be in the past")) {
                    throw e;
                }
                logger.warn("Could not parse validTill date: {}. Using default null.", validTillStr);
            }
        }

        String filePath = null;
        if (file != null && !file.isEmpty()) {
            if (file.getSize() > MAX_FILE_SIZE) {
                throw new RuntimeException("File size exceeds maximum allowed limit of 10 MB.");
            }

            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf(".")).toLowerCase();
            }

            if (!List.of(".pdf", ".jpg", ".jpeg", ".png").contains(extension)) {
                throw new RuntimeException("Invalid file format. Only PDF, JPG, JPEG, and PNG files are allowed.");
            }

            try {
                File uploadDir = new File(System.getProperty("java.io.tmpdir"), "jk_announcements");
                if (!uploadDir.exists() && !uploadDir.mkdirs()) {
                    logger.warn("Could not create upload directory: {}", uploadDir.getAbsolutePath());
                }

                String savedFileName = "ANNOUNCEMENT_" + System.currentTimeMillis() + "_" + UUID.randomUUID().toString().substring(0, 6) + extension;
                File targetFile = new File(uploadDir, savedFileName);
                file.transferTo(targetFile);

                filePath = targetFile.getAbsolutePath();
                logger.info("Saved announcement attachment to {}", filePath);
            } catch (Exception e) {
                logger.error("Failed to save attachment file: {}", e.getMessage(), e);
                throw new RuntimeException("Failed to save attachment file: " + e.getMessage());
            }
        }

        Notification notification = Notification.builder()
                .notification(announcementText.trim())
                .notificationsentto(to.trim())
                .createdat(OffsetDateTime.now())
                .validtill(validTill)
                .status("ACTIVE")
                .type("NOTIFICATION")
                .filepath(filePath)
                .createdby(user.getUsername() != null ? user.getUsername() : user.getMobile())
                .isactive(1)
                .userId(user.getId())
                .build();

        Notification saved = notificationRepository.save(notification);
        logger.info("Announcement ID {} created successfully by user {}", saved.getId(), saved.getCreatedby());

        return mapToDTO(saved);
    }

    public List<AnnouncementResponseDTO> getActiveAnnouncements() {
        return notificationRepository.findAllActiveAnnouncements()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public Resource getAnnouncementFile(Integer id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Announcement not found with ID: " + id));

        if (notification.getFilepath() == null || notification.getFilepath().isBlank()) {
            throw new IllegalStateException("Announcement does not have an attached file.");
        }

        File file = new File(notification.getFilepath());
        if (!file.exists()) {
            throw new IllegalStateException("Attached file no longer exists on server.");
        }

        return new FileSystemResource(file);
    }

    public com.example.jk_samadhan_backend.dto.PaginatedAnnouncementListDTO getAnnouncementList(
            int page, int size, String search, Principal principal) {

        List<Object> params = new ArrayList<>();
        StringBuilder countSql = new StringBuilder("""
            SELECT COUNT(n.id)
            FROM jks_3nf.notification n
            LEFT JOIN jks_3nf.users u ON (u.id = n.user_id OR LOWER(u.username) = LOWER(n.createdby))
            LEFT JOIN jks_3nf.departments dept ON dept.id = u.department_id
            WHERE 1=1
        """);

        StringBuilder selectSql = new StringBuilder("""
            SELECT 
                n.id,
                COALESCE(n.notification, '') AS notification,
                COALESCE(n.notificationsentto, '') AS notificationsentto,
                n.validtill,
                n.createdat,
                COALESCE(n.filepath, '') AS filepath,
                COALESCE(n.createdby, '') AS createdby,
                COALESCE(n.status, 'ACTIVE') AS status,
                COALESCE(n.type, 'General') AS type,
                COALESCE(n.isactive, 1) AS isactive,
                COALESCE(dept.name, 'All Departments') AS department,
                COALESCE(u.office_name, 'N/A') AS office_name,
                TRIM(CONCAT(COALESCE(u.first_name, ''), ' ', COALESCE(u.last_name, ''), 
                    CASE WHEN desg.name IS NOT NULL AND desg.name != '' THEN CONCAT(' (', desg.name, ')') ELSE '' END)) AS name_with_designation
            FROM jks_3nf.notification n
            LEFT JOIN jks_3nf.users u ON (u.id = n.user_id OR LOWER(u.username) = LOWER(n.createdby))
            LEFT JOIN jks_3nf.departments dept ON dept.id = u.department_id
            LEFT JOIN jks_3nf.designations desg ON desg.id = u.designation_id
            WHERE 1=1
        """);

        if (search != null && !search.trim().isEmpty()) {
            String where = " AND (LOWER(n.notification) LIKE LOWER(?) OR LOWER(n.createdby) LIKE LOWER(?) OR LOWER(dept.name) LIKE LOWER(?) OR LOWER(u.office_name) LIKE LOWER(?)) ";
            countSql.append(where);
            selectSql.append(where);
            String q = "%" + search.trim() + "%";
            params.add(q);
            params.add(q);
            params.add(q);
            params.add(q);
        }

        selectSql.append(" ORDER BY n.id DESC LIMIT ? OFFSET ? ");

        long totalElements = jdbcTemplate.queryForObject(countSql.toString(), Long.class, params.toArray());

        List<Object> queryParams = new ArrayList<>(params);
        queryParams.add(size);
        queryParams.add(page * size);

        List<Map<String, Object>> rows = jdbcTemplate.queryForList(selectSql.toString(), queryParams.toArray());

        List<AnnouncementResponseDTO> content = new ArrayList<>();
        OffsetDateTime now = OffsetDateTime.now();

        for (Map<String, Object> r : rows) {
            OffsetDateTime validTill = null;
            if (r.get("validtill") != null) {
                if (r.get("validtill") instanceof java.sql.Timestamp ts) {
                    validTill = ts.toInstant().atZone(ZoneId.systemDefault()).toOffsetDateTime();
                } else if (r.get("validtill") instanceof OffsetDateTime odt) {
                    validTill = odt;
                }
            }

            OffsetDateTime createdAt = null;
            if (r.get("createdat") != null) {
                if (r.get("createdat") instanceof java.sql.Timestamp ts) {
                    createdAt = ts.toInstant().atZone(ZoneId.systemDefault()).toOffsetDateTime();
                } else if (r.get("createdat") instanceof OffsetDateTime odt) {
                    createdAt = odt;
                }
            }

            boolean isExpired = validTill != null && now.isAfter(validTill);
            String creatorName = getMapString(r, "name_with_designation");
            if (creatorName == null || creatorName.isBlank()) {
                creatorName = getMapString(r, "createdby");
            }

            content.add(AnnouncementResponseDTO.builder()
                    .id(getMapInt(r, "id"))
                    .notification(getMapString(r, "notification"))
                    .notificationsentto(getMapString(r, "notificationsentto"))
                    .validtill(validTill)
                    .createdat(createdAt)
                    .filepath(getMapString(r, "filepath"))
                    .createdby(getMapString(r, "createdby"))
                    .status(getMapString(r, "status"))
                    .type(getMapString(r, "type"))
                    .isactive(getMapInt(r, "isactive"))
                    .department(getMapString(r, "department"))
                    .officeName(getMapString(r, "office_name"))
                    .nameWithDesignation(creatorName)
                    .isExpired(isExpired)
                    .build());
        }

        int totalPages = (int) Math.ceil((double) totalElements / size);

        return com.example.jk_samadhan_backend.dto.PaginatedAnnouncementListDTO.builder()
                .content(content)
                .totalElements(totalElements)
                .totalPages(totalPages)
                .currentPage(page)
                .pageSize(size)
                .build();
    }

    public void toggleAnnouncementStatus(Integer id, Integer isactive) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Announcement not found with ID: " + id));
        notification.setIsactive(isactive != null && isactive == 1 ? 1 : 0);
        notificationRepository.save(notification);
    }

    public com.example.jk_samadhan_backend.dto.PaginatedAnnouncementMisReportDTO getAnnouncementMisReport(
            int page, int size, String search) {

        List<Object> params = new ArrayList<>();
        StringBuilder countSql = new StringBuilder("""
            SELECT COUNT(DISTINCT COALESCE(dept.name, 'General / All Departments'))
            FROM jks_3nf.notification n
            LEFT JOIN jks_3nf.users u ON (u.id = n.user_id OR LOWER(u.username) = LOWER(n.createdby))
            LEFT JOIN jks_3nf.departments dept ON dept.id = u.department_id
            WHERE 1=1
        """);

        StringBuilder selectSql = new StringBuilder("""
            SELECT 
                COALESCE(dept.name, 'General / All Departments') AS department,
                COUNT(n.id) AS announcement_count
            FROM jks_3nf.notification n
            LEFT JOIN jks_3nf.users u ON (u.id = n.user_id OR LOWER(u.username) = LOWER(n.createdby))
            LEFT JOIN jks_3nf.departments dept ON dept.id = u.department_id
            WHERE 1=1
        """);

        if (search != null && !search.trim().isEmpty()) {
            String where = " AND LOWER(COALESCE(dept.name, 'General / All Departments')) LIKE LOWER(?) ";
            countSql.append(where);
            selectSql.append(where);
            params.add("%" + search.trim() + "%");
        }

        selectSql.append(" GROUP BY COALESCE(dept.name, 'General / All Departments') ");
        selectSql.append(" ORDER BY announcement_count DESC, department ASC LIMIT ? OFFSET ? ");

        long totalElements = jdbcTemplate.queryForObject(countSql.toString(), Long.class, params.toArray());

        List<Object> queryParams = new ArrayList<>(params);
        queryParams.add(size);
        queryParams.add(page * size);

        List<Map<String, Object>> rows = jdbcTemplate.queryForList(selectSql.toString(), queryParams.toArray());

        List<com.example.jk_samadhan_backend.dto.AnnouncementMisReportDTO> content = new ArrayList<>();
        for (Map<String, Object> r : rows) {
            content.add(com.example.jk_samadhan_backend.dto.AnnouncementMisReportDTO.builder()
                    .department(getMapString(r, "department"))
                    .count(getMapLong(r, "announcement_count"))
                    .build());
        }

        int totalPages = (int) Math.ceil((double) totalElements / size);

        return com.example.jk_samadhan_backend.dto.PaginatedAnnouncementMisReportDTO.builder()
                .content(content)
                .totalElements(totalElements)
                .totalPages(totalPages)
                .currentPage(page)
                .pageSize(size)
                .build();
    }

    public List<AnnouncementResponseDTO> getDepartmentAnnouncements(String department) {
        List<Object> params = new ArrayList<>();
        StringBuilder sql = new StringBuilder("""
            SELECT 
                n.id,
                COALESCE(n.notification, '') AS notification,
                COALESCE(n.notificationsentto, '') AS notificationsentto,
                n.validtill,
                n.createdat,
                COALESCE(n.filepath, '') AS filepath,
                COALESCE(n.createdby, '') AS createdby,
                COALESCE(n.status, 'ACTIVE') AS status,
                COALESCE(n.type, 'General') AS type,
                COALESCE(n.isactive, 1) AS isactive,
                COALESCE(dept.name, 'All Departments') AS department,
                COALESCE(u.office_name, 'N/A') AS office_name,
                TRIM(CONCAT(COALESCE(u.first_name, ''), ' ', COALESCE(u.last_name, ''), 
                    CASE WHEN desg.name IS NOT NULL AND desg.name != '' THEN CONCAT(' (', desg.name, ')') ELSE '' END)) AS name_with_designation
            FROM jks_3nf.notification n
            LEFT JOIN jks_3nf.users u ON (u.id = n.user_id OR LOWER(u.username) = LOWER(n.createdby))
            LEFT JOIN jks_3nf.departments dept ON dept.id = u.department_id
            LEFT JOIN jks_3nf.designations desg ON desg.id = u.designation_id
            WHERE 1=1
        """);

        if (department != null && !department.trim().isEmpty() && !"all".equalsIgnoreCase(department.trim())) {
            if ("General / All Departments".equalsIgnoreCase(department.trim()) || "All Departments".equalsIgnoreCase(department.trim())) {
                sql.append(" AND dept.name IS NULL ");
            } else {
                sql.append(" AND LOWER(dept.name) = LOWER(?) ");
                params.add(department.trim());
            }
        }

        sql.append(" ORDER BY n.id DESC ");

        List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql.toString(), params.toArray());

        List<AnnouncementResponseDTO> list = new ArrayList<>();
        OffsetDateTime now = OffsetDateTime.now();

        for (Map<String, Object> r : rows) {
            OffsetDateTime validTill = null;
            if (r.get("validtill") != null) {
                if (r.get("validtill") instanceof java.sql.Timestamp ts) {
                    validTill = ts.toInstant().atZone(ZoneId.systemDefault()).toOffsetDateTime();
                } else if (r.get("validtill") instanceof OffsetDateTime odt) {
                    validTill = odt;
                }
            }

            OffsetDateTime createdAt = null;
            if (r.get("createdat") != null) {
                if (r.get("createdat") instanceof java.sql.Timestamp ts) {
                    createdAt = ts.toInstant().atZone(ZoneId.systemDefault()).toOffsetDateTime();
                } else if (r.get("createdat") instanceof OffsetDateTime odt) {
                    createdAt = odt;
                }
            }

            boolean isExpired = validTill != null && now.isAfter(validTill);
            String creatorName = getMapString(r, "name_with_designation");
            if (creatorName == null || creatorName.isBlank()) {
                creatorName = getMapString(r, "createdby");
            }

            list.add(AnnouncementResponseDTO.builder()
                    .id(getMapInt(r, "id"))
                    .notification(getMapString(r, "notification"))
                    .notificationsentto(getMapString(r, "notificationsentto"))
                    .validtill(validTill)
                    .createdat(createdAt)
                    .filepath(getMapString(r, "filepath"))
                    .createdby(getMapString(r, "createdby"))
                    .status(getMapString(r, "status"))
                    .type(getMapString(r, "type"))
                    .isactive(getMapInt(r, "isactive"))
                    .department(getMapString(r, "department"))
                    .officeName(getMapString(r, "office_name"))
                    .nameWithDesignation(creatorName)
                    .isExpired(isExpired)
                    .build());
        }

        return list;
    }

    private String getMapString(Map<String, Object> map, String key) {
        if (map == null || key == null) return "";
        for (Map.Entry<String, Object> entry : map.entrySet()) {
            if (key.equalsIgnoreCase(entry.getKey())) {
                return entry.getValue() != null ? entry.getValue().toString() : "";
            }
        }
        return "";
    }

    private int getMapInt(Map<String, Object> map, String key) {
        if (map == null || key == null) return 0;
        for (Map.Entry<String, Object> entry : map.entrySet()) {
            if (key.equalsIgnoreCase(entry.getKey()) && entry.getValue() instanceof Number num) {
                return num.intValue();
            }
        }
        return 0;
    }

    private long getMapLong(Map<String, Object> map, String key) {
        if (map == null || key == null) return 0L;
        for (Map.Entry<String, Object> entry : map.entrySet()) {
            if (key.equalsIgnoreCase(entry.getKey()) && entry.getValue() instanceof Number num) {
                return num.longValue();
            }
        }
        return 0L;
    }

    private AnnouncementResponseDTO mapToDTO(Notification n) {
        return AnnouncementResponseDTO.builder()
                .id(n.getId())
                .notification(n.getNotification())
                .notificationsentto(n.getNotificationsentto())
                .validtill(n.getValidtill())
                .createdat(n.getCreatedat())
                .filepath(n.getFilepath())
                .createdby(n.getCreatedby())
                .status(n.getStatus())
                .type(n.getType())
                .isactive(n.getIsactive())
                .build();
    }
}
