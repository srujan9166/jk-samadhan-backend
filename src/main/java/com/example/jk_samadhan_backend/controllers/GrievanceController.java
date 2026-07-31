package com.example.jk_samadhan_backend.controllers;

import java.security.Principal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.jk_samadhan_backend.dto.GrievanceDTO;
import com.example.jk_samadhan_backend.dto.GrievanceResponseDTO;
import com.example.jk_samadhan_backend.models.GrievanceMaster;
import com.example.jk_samadhan_backend.repositories.GrievanceMasterRepository;
import com.example.jk_samadhan_backend.services.GrievanceService;


import com.example.jk_samadhan_backend.repositories.UserRepository;

@RestController
@RequestMapping("/api/grievances")
public class GrievanceController {

    private final GrievanceMasterRepository grievanceRepository;
    private final GrievanceService grievanceService;
    private final UserRepository userRepository;

    public GrievanceController(GrievanceMasterRepository grievanceRepository, GrievanceService grievanceService, UserRepository userRepository) {
        this.grievanceRepository = grievanceRepository;
        this.grievanceService = grievanceService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<GrievanceResponseDTO>> getUserGrievances(
            Principal principal,
            @RequestParam(value = "search", required = false) String search) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        List<GrievanceMaster> grievances = grievanceService.getGrievancesForUser(principal, search);
        
        List<GrievanceResponseDTO> response = grievances.stream()
                .map(g -> GrievanceResponseDTO.builder()
                        .id(g.getId())
                        .uniqId(g.getUniqId())
                        .description(g.getDescription())
                        .latitude(g.getLatitude())
                        .longitude(g.getLongitude())
                        .origin(g.getOrigin())
                        .status(g.getStatus())
                        .finalStatus(g.getFinalStatus())
                        .keyFlag(g.getKeyFlag())
                        .psga(g.getPsga())
                        .fileName(g.getFileName())
                        .filePath(g.getFilePath())
                        .fileType(g.getFileType())
                        .secondFileName(g.getSecondFileName())
                        .secondFilePath(g.getSecondFilePath())
                        .secondFileType(g.getSecondFileType())
                        .ackSlipName(g.getAckSlipName())
                        .ackSlipPath(g.getAckSlipPath())
                        .cpgramRegNo(g.getCpgramRegNo())
                        .createdAt(g.getCreatedAt() != null ? g.getCreatedAt().toString() : "")
                        .updatedAt(g.getUpdatedAt() != null ? g.getUpdatedAt().toString() : "")
                        .department(g.getCategory() != null && g.getCategory().getDepartment() != null 
                                ? g.getCategory().getDepartment().getName() : "General Administration")
                        .grievanceCategory(g.getCategory() != null ? g.getCategory().getName() : "General Complaints & Petitions")
                        .windowType(g.getOrigin())
                        .citizenName(g.getSubmittedBy() != null ? g.getSubmittedBy().getName() : "CITIZEN USER")
                        .citizenPhone(g.getSubmittedBy() != null ? g.getSubmittedBy().getMobile() : "8377961497")
                        .submittedBy(g.getSubmittedBy() != null ? GrievanceResponseDTO.ComplainantInfo.builder()
                                .id(g.getSubmittedBy().getId())
                                .name(g.getSubmittedBy().getName())
                                .mobile(g.getSubmittedBy().getMobile())
                                .email(g.getSubmittedBy().getEmail())
                                .gender(g.getSubmittedBy().getGender())
                                .build() : null)
                        .build())
                .collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(response);
    }


    @PostMapping("/grievanceSubmit")
    public ResponseEntity<?> lodgeGrievance(@RequestBody GrievanceDTO grievanceDTO, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        GrievanceMaster g = grievanceService.lodgeGrievance(grievanceDTO, principal);
        
        GrievanceResponseDTO response = GrievanceResponseDTO.builder()
                .id(g.getId())
                .uniqId(g.getUniqId())
                .description(g.getDescription())
                .latitude(g.getLatitude())
                .longitude(g.getLongitude())
                .origin(g.getOrigin())
                .status(g.getStatus())
                .finalStatus(g.getFinalStatus())
                .keyFlag(g.getKeyFlag())
                .psga(g.getPsga())
                .fileName(g.getFileName())
                .filePath(g.getFilePath())
                .fileType(g.getFileType())
                .secondFileName(g.getSecondFileName())
                .secondFilePath(g.getSecondFilePath())
                .secondFileType(g.getSecondFileType())
                .ackSlipName(g.getAckSlipName())
                .ackSlipPath(g.getAckSlipPath())
                .cpgramRegNo(g.getCpgramRegNo())
                .createdAt(g.getCreatedAt() != null ? g.getCreatedAt().toString() : "")
                .updatedAt(g.getUpdatedAt() != null ? g.getUpdatedAt().toString() : "")
                .department(g.getCategory() != null && g.getCategory().getDepartment() != null 
                        ? g.getCategory().getDepartment().getName() : "General Administration")
                .grievanceCategory(g.getCategory() != null ? g.getCategory().getName() : "General Complaints & Petitions")
                .windowType(g.getOrigin())
                .citizenName(g.getSubmittedBy() != null ? g.getSubmittedBy().getName() : "CITIZEN USER")
                .citizenPhone(g.getSubmittedBy() != null ? g.getSubmittedBy().getMobile() : "8377961497")
                .submittedBy(g.getSubmittedBy() != null ? GrievanceResponseDTO.ComplainantInfo.builder()
                        .id(g.getSubmittedBy().getId())
                        .name(g.getSubmittedBy().getName())
                        .mobile(g.getSubmittedBy().getMobile())
                        .email(g.getSubmittedBy().getEmail())
                        .gender(g.getSubmittedBy().getGender())
                        .build() : null)
                .build();
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(response);
    }
        


    

    

   
}
