package com.example.jk_samadhan_backend.controllers;

import java.security.Principal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.jk_samadhan_backend.dto.GrievanceDTO;
import com.example.jk_samadhan_backend.models.GrievanceMaster;
import com.example.jk_samadhan_backend.repositories.GrievanceMasterRepository;
import com.example.jk_samadhan_backend.services.GrievanceService;


@RestController
@RequestMapping("/api/grievances")
public class GrievanceController {

    private final GrievanceMasterRepository grievanceRepository;
    private final GrievanceService grievanceService;
   

    public GrievanceController(GrievanceMasterRepository grievanceRepository , GrievanceService grievanceService) {
        this.grievanceRepository = grievanceRepository;
        this.grievanceService = grievanceService;
  
    }

    @GetMapping
    public ResponseEntity<List<GrievanceMaster>> getUserGrievances(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        String mobile = principal.getName();
        List<GrievanceMaster> grievances = grievanceRepository.findBySubmittedByMobile(mobile)
                                            .orElseThrow(() -> new RuntimeException("Grievances not found for mobile " + mobile));
        return ResponseEntity.ok(grievances);
    }


    @PostMapping("/grievanceSubmit")
    public ResponseEntity<?> lodgeGrievance(@RequestBody GrievanceDTO grievanceDTO, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(grievanceService.lodgeGrievance(grievanceDTO, principal));
    }
        


    

    

   
}
