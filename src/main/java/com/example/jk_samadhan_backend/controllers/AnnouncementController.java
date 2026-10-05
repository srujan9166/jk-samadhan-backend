package com.example.jk_samadhan_backend.controllers;

import com.example.jk_samadhan_backend.dto.AnnouncementResponseDTO;
import com.example.jk_samadhan_backend.dto.PaginatedAnnouncementListDTO;
import com.example.jk_samadhan_backend.dto.PaginatedAnnouncementMisReportDTO;
import com.example.jk_samadhan_backend.services.AnnouncementService;

import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
public class AnnouncementController {

    private final AnnouncementService announcementService;

    public AnnouncementController(AnnouncementService announcementService) {
        this.announcementService = announcementService;
    }

    @PostMapping(value = {"/api/super-admin/announcements", "/api/announcements/create"}, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createAnnouncement(
            @RequestParam("to") String to,
            @RequestParam(value = "validTill", required = false) String validTill,
            @RequestParam("announcement") String announcement,
            @RequestParam(value = "file", required = false) MultipartFile file,
            Principal principal) {
        try {
            AnnouncementResponseDTO created = announcementService.createAnnouncement(to, validTill, announcement, file, principal);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", e.getMessage()));
        }
    }

    @GetMapping("/api/announcements")
    public ResponseEntity<List<AnnouncementResponseDTO>> getActiveAnnouncements() {
        return ResponseEntity.ok(announcementService.getActiveAnnouncements());
    }

    @GetMapping("/api/announcements/{id}/file")
    public ResponseEntity<Resource> downloadAnnouncementFile(@PathVariable Integer id) {
        try {
            Resource fileResource = announcementService.getAnnouncementFile(id);
            String filename = fileResource.getFilename() != null ? fileResource.getFilename() : "announcement_attachment";
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(fileResource);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping({"/api/super-admin/announcements/list", "/api/announcements/list"})
    public ResponseEntity<PaginatedAnnouncementListDTO> getAnnouncementList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            Principal principal) {
        PaginatedAnnouncementListDTO response = announcementService.getAnnouncementList(page, size, search, principal);
        return ResponseEntity.ok(response);
    }

    @PostMapping({"/api/super-admin/announcements/toggle-status", "/updateAnnouncementStatus"})
    public ResponseEntity<Map<String, String>> toggleAnnouncementStatus(@RequestBody Map<String, Object> payload) {
        try {
            Integer id = null;
            if (payload.get("id") instanceof Number num) {
                id = num.intValue();
            } else if (payload.get("id") != null) {
                id = Integer.parseInt(payload.get("id").toString());
            }

            Integer isactive = 0;
            if (payload.get("isactive") instanceof Number num) {
                isactive = num.intValue();
            } else if (payload.get("isactive") != null) {
                isactive = Integer.parseInt(payload.get("isactive").toString());
            }

            if (id != null) {
                announcementService.toggleAnnouncementStatus(id, isactive);
            }
            return ResponseEntity.ok(Map.of("status", "success", "message", "Status updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("status", "error", "message", e.getMessage()));
        }
    }

    @GetMapping("/api/super-admin/announcements/mis-report")
    public ResponseEntity<PaginatedAnnouncementMisReportDTO> getAnnouncementMisReport(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search) {
        PaginatedAnnouncementMisReportDTO response = announcementService.getAnnouncementMisReport(page, size, search);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/super-admin/announcements/department-details")
    public ResponseEntity<List<AnnouncementResponseDTO>> getDepartmentAnnouncements(
            @RequestParam(required = false) String department) {
        List<AnnouncementResponseDTO> list = announcementService.getDepartmentAnnouncements(department);
        return ResponseEntity.ok(list);
    }
}
