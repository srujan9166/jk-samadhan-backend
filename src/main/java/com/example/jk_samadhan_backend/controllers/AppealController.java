package com.example.jk_samadhan_backend.controllers;

import java.security.Principal;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.jk_samadhan_backend.dto.AppealDTO;
import com.example.jk_samadhan_backend.dto.AppealSummaryDTO;
import com.example.jk_samadhan_backend.dto.AppealDashboardSummaryDTO;
import com.example.jk_samadhan_backend.dto.PaginatedAppealsResponseDTO;
import com.example.jk_samadhan_backend.services.AppealService;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

@RestController
@RequestMapping("/api/appeals")
public class AppealController {

    private final AppealService appealService;
    private final com.example.jk_samadhan_backend.repositories.UserRepository userRepository;

    public AppealController(AppealService appealService, com.example.jk_samadhan_backend.repositories.UserRepository userRepository) {
        this.appealService = appealService;
        this.userRepository = userRepository;
    }

    @GetMapping("/dashboard/summary")
    public ResponseEntity<AppealDashboardSummaryDTO> getDashboardSummary(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(appealService.getAppealDashboardSummary(principal));
    }

    @GetMapping("/dashboard/list")
    public ResponseEntity<PaginatedAppealsResponseDTO> getDashboardList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDirection,
            Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }

        Sort.Direction direction = Sort.Direction.DESC;
        try {
            direction = Sort.Direction.fromString(sortDirection);
        } catch (Exception e) {
            // fallback to DESC
        }

        Sort sort = Sort.by(direction, sortBy);
        PageRequest pageRequest = PageRequest.of(page, size, sort);

        return ResponseEntity.ok(appealService.getAppealDashboardList(search, principal, pageRequest));
    }

    @PostMapping("/appealSubmit")
    public ResponseEntity<?> lodgeAppeal(@RequestBody AppealDTO appealDTO, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        try {
            AppealSummaryDTO appeal = appealService.lodgeAppeal(appealDTO, principal);
            return ResponseEntity.status(HttpStatus.ACCEPTED).body(appeal);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/mis-report")
    public ResponseEntity<com.example.jk_samadhan_backend.dto.PaginatedAppealMisReportResponseDTO> getAppealMisReport(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Integer deptId,
            Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        com.example.jk_samadhan_backend.models.Users user = userRepository.findByIdentifier(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        String role = user.getUserType() != null ? user.getUserType().getTypeName() : user.getRole();
        if (role == null || !role.toUpperCase().contains("SUPERADMIN")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Sort sort = Sort.by(Sort.Direction.ASC, "department");
        org.springframework.data.domain.PageRequest pageRequest = org.springframework.data.domain.PageRequest.of(page, size, sort);
        return ResponseEntity.ok(appealService.getAppealMisReport(search, deptId, pageRequest));
    }
}
