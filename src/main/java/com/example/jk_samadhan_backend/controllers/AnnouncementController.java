package com.example.jk_samadhan_backend.controllers;

import com.example.jk_samadhan_backend.dto.AnnouncementResponseDTO;
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
}
