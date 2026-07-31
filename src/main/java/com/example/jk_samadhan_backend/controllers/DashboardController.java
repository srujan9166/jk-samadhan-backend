package com.example.jk_samadhan_backend.controllers;

import com.example.jk_samadhan_backend.dto.DashboardResponseDTO;
import com.example.jk_samadhan_backend.services.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/home")
    public ResponseEntity<DashboardResponseDTO> getDashboardHome(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        DashboardResponseDTO response = dashboardService.getDashboardData(principal);
        return ResponseEntity.ok(response);
    }
}
