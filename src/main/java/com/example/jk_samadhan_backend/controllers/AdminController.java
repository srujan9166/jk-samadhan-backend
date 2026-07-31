package com.example.jk_samadhan_backend.controllers;

import com.example.jk_samadhan_backend.dto.legacy.*;
import com.example.jk_samadhan_backend.services.AdminDashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminDashboardService adminDashboardService;

    @GetMapping("/home")
    public ResponseEntity<AdminDashboardDataDTO> userHome(Principal p, @RequestParam(required = false) Boolean showToast) {
        if (p == null) {
            return ResponseEntity.status(401).build();
        }
        AdminDashboardDataDTO dto = adminDashboardService.getDashboardData(p.getName(), showToast);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/deptMapping")
    public ResponseEntity<DeptMappingDataDTO> deptMapping(Principal p) {
        if (p == null) {
            return ResponseEntity.status(401).build();
        }
        DeptMappingDataDTO dto = adminDashboardService.getDeptMappingData(p.getName());
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/addDeptCategory")
    public ResponseEntity<Map<String, String>> addDeptCategory(@RequestBody ReqUIDTO payload, Principal p) {
        Map<String, String> response = new HashMap<>();
        if (p == null) {
            return ResponseEntity.status(401).build();
        }
        try {
            adminDashboardService.addDeptCategory(payload, p.getName());
            response.put("statusCode", "1");
            response.put("statusName", "Success");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("statusCode", "4");
            response.put("statusName", e.getMessage());
            return ResponseEntity.ok(response);
        }
    }
}
