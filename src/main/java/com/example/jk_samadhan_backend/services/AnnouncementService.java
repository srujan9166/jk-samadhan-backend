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
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.security.Principal;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AnnouncementService {

    private static final Logger logger = LoggerFactory.getLogger(AnnouncementService.class);
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public AnnouncementService(NotificationRepository notificationRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
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
