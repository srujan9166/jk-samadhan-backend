package com.example.jk_samadhan_backend.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.jk_samadhan_backend.dto.*;
import com.example.jk_samadhan_backend.models.UserType;
import com.example.jk_samadhan_backend.services.MasterDataService;

import java.util.List;
import java.util.Map;
import java.security.Principal;

@RestController
@RequestMapping({"/api/v1/masters", "/api/masters"})
public class MasterDataController {

    private final MasterDataService masterDataService;

    public MasterDataController(MasterDataService masterDataService) {
        this.masterDataService = masterDataService;
    }

    // ==========================================
    // Administrative Master Data: Department
    // ==========================================

    @GetMapping("/departments")
    public ResponseEntity<List<DepartmentDTO>> getAllDepartments() {
        return ResponseEntity.ok(masterDataService.getAllDepartments());
    }

    @GetMapping("/departments/{id}")
    public ResponseEntity<DepartmentDTO> getDepartmentById(@PathVariable("id") Integer id) {
        return ResponseEntity.ok(masterDataService.getDepartmentById(id));
    }

    @PostMapping("/departments")
    @PreAuthorize("hasAnyAuthority('ROLE_SuperAdmin', 'ROLE_Admin')")
    public ResponseEntity<DepartmentDTO> createDepartment(@RequestBody CreateDepartmentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(masterDataService.createDepartment(request));
    }

    @PutMapping("/departments/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_SuperAdmin', 'ROLE_Admin')")
    public ResponseEntity<DepartmentDTO> updateDepartment(@PathVariable("id") Integer id,
                                                           @RequestBody CreateDepartmentRequest request) {
        return ResponseEntity.ok(masterDataService.updateDepartment(id, request));
    }

    @DeleteMapping("/departments/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_SuperAdmin', 'ROLE_Admin')")
    public ResponseEntity<Map<String, String>> deleteDepartment(@PathVariable("id") Integer id) {
        masterDataService.deleteDepartment(id);
        return ResponseEntity.ok(Map.of("message", "Department deleted successfully"));
    }

    // ==========================================
    // Administrative Master Data: Category
    // ==========================================

    @GetMapping("/categories")
    public ResponseEntity<List<CategoryDTO>> getCategories(@RequestParam(value = "deptId", required = false) Integer deptId) {
        return ResponseEntity.ok(masterDataService.getCategories(deptId));
    }

    @PostMapping("/categories")
    @PreAuthorize("hasAnyAuthority('ROLE_SuperAdmin', 'ROLE_Admin')")
    public ResponseEntity<CategoryDTO> createCategory(@RequestBody Map<String, Object> payload) {
        Integer deptId = (Integer) payload.get("departmentId");
        String name = (String) payload.get("name");
        Integer reminderDays = payload.containsKey("reminderDays") ? (Integer) payload.get("reminderDays") : 7;
        return ResponseEntity.status(HttpStatus.CREATED).body(masterDataService.createCategory(deptId, name, reminderDays));
    }

    // ==========================================
    // Administrative Master Data: SubCategory
    // ==========================================

    @GetMapping("/subcategories")
    public ResponseEntity<List<SubCategoryDTO>> getSubCategories(@RequestParam(value = "categoryId", required = false) Integer categoryId) {
        return ResponseEntity.ok(masterDataService.getSubCategories(categoryId));
    }

    @PostMapping("/subcategories")
    @PreAuthorize("hasAnyAuthority('ROLE_SuperAdmin', 'ROLE_Admin')")
    public ResponseEntity<SubCategoryDTO> createSubCategory(@RequestBody Map<String, Object> payload) {
        Integer categoryId = (Integer) payload.get("categoryId");
        String name = (String) payload.get("name");
        return ResponseEntity.status(HttpStatus.CREATED).body(masterDataService.createSubCategory(categoryId, name));
    }

    // ==========================================
    // Spatial / Territorial Master Data
    // ==========================================

    @GetMapping("/divisions")
    public ResponseEntity<List<GeoLookupDTO>> getAllDivisions() {
        return ResponseEntity.ok(masterDataService.getAllDivisions());
    }

    @GetMapping("/districts")
    public ResponseEntity<List<DistrictDTO>> getDistricts(@RequestParam(value = "divisionId", required = false) Integer divisionId) {
        return ResponseEntity.ok(masterDataService.getDistricts(divisionId));
    }

    @GetMapping("/blocks")
    public ResponseEntity<List<GeoLookupDTO>> getBlocks(@RequestParam(value = "districtId", required = false) Integer districtId) {
        return ResponseEntity.ok(masterDataService.getBlocks(districtId));
    }

    @GetMapping("/municipalities")
    public ResponseEntity<List<GeoLookupDTO>> getMunicipalities(@RequestParam(value = "districtId", required = false) Integer districtId) {
        return ResponseEntity.ok(masterDataService.getMunicipalities(districtId));
    }

    @GetMapping("/panchayats")
    public ResponseEntity<List<GeoLookupDTO>> getPanchayats(@RequestParam(value = "blockId", required = false) Integer blockId) {
        return ResponseEntity.ok(masterDataService.getPanchayats(blockId));
    }

    @GetMapping("/wards")
    public ResponseEntity<List<GeoLookupDTO>> getWards(@RequestParam(value = "municipalityId", required = false) Integer municipalityId) {
        return ResponseEntity.ok(masterDataService.getWards(municipalityId));
    }

    // ==========================================
    // Organizational Master Data
    // ==========================================

    @GetMapping("/designations")
    public ResponseEntity<List<DesignationDTO>> getAllDesignations() {
        return ResponseEntity.ok(masterDataService.getAllDesignations());
    }

    @PostMapping("/designations")
    @PreAuthorize("hasAnyAuthority('ROLE_SuperAdmin', 'ROLE_Admin')")
    public ResponseEntity<DesignationDTO> createDesignation(@RequestBody Map<String, String> payload) {
        String name = payload.get("name");
        return ResponseEntity.status(HttpStatus.CREATED).body(masterDataService.createDesignation(name));
    }

    @PutMapping("/designations/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_SuperAdmin', 'ROLE_Admin')")
    public ResponseEntity<DesignationDTO> updateDesignation(@PathVariable("id") Integer id, @RequestBody Map<String, String> payload) {
        String name = payload.get("name");
        return ResponseEntity.ok(masterDataService.updateDesignation(id, name));
    }

    @DeleteMapping("/designations/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_SuperAdmin', 'ROLE_Admin')")
    public ResponseEntity<Map<String, String>> deleteDesignation(@PathVariable("id") Integer id) {
        masterDataService.deleteDesignation(id);
        return ResponseEntity.ok(Map.of("message", "Designation deleted successfully"));
    }

    @GetMapping("/user-types")
    public ResponseEntity<List<UserType>> getAllUserTypes() {
        return ResponseEntity.ok(masterDataService.getAllUserTypes());
    }

    @GetMapping("/role-designations")
    public ResponseEntity<List<RoleDesignationDTO>> getAllRoleDesignations() {
        return ResponseEntity.ok(masterDataService.getAllRoleDesignations());
    }

    @PostMapping("/role-designations")
    @PreAuthorize("hasAnyAuthority('ROLE_SuperAdmin', 'ROLE_Admin')")
    public ResponseEntity<RoleDesignationDTO> createRoleDesignation(@RequestBody Map<String, Object> payload, Principal principal) {
        Integer roleId = Integer.parseInt(payload.get("roleId").toString());
        Integer designationId = Integer.parseInt(payload.get("designationId").toString());
        String username = principal != null ? principal.getName() : "system";
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(masterDataService.createRoleDesignation(roleId, designationId, username));
    }

    @PutMapping("/role-designations/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_SuperAdmin', 'ROLE_Admin')")
    public ResponseEntity<RoleDesignationDTO> updateRoleDesignation(@PathVariable Integer id, @RequestBody Map<String, Object> payload) {
        Integer roleId = Integer.parseInt(payload.get("roleId").toString());
        Integer designationId = Integer.parseInt(payload.get("designationId").toString());
        return ResponseEntity.ok(masterDataService.updateRoleDesignation(id, roleId, designationId));
    }

    @DeleteMapping("/role-designations/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_SuperAdmin', 'ROLE_Admin')")
    public ResponseEntity<Void> deleteRoleDesignation(@PathVariable Integer id) {
        masterDataService.deleteRoleDesignation(id);
        return ResponseEntity.noContent().build();
    }
}
