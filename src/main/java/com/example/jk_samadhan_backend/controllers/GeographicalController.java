package com.example.jk_samadhan_backend.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.jk_samadhan_backend.dto.GeoLookupDTO;
import com.example.jk_samadhan_backend.dto.DistrictDTO;
import com.example.jk_samadhan_backend.services.GeographicalService;

import java.util.List;

@RestController
@RequestMapping("/api/geo")
public class GeographicalController {

    private final GeographicalService geographicalService;

    public GeographicalController(GeographicalService geographicalService) {
        this.geographicalService = geographicalService;
    }

    @GetMapping("/divisions")
    public ResponseEntity<List<GeoLookupDTO>> getAllDivisions() {
        return ResponseEntity.ok(geographicalService.getAllDivisions());
    }

    @GetMapping("/divisions/{id}/districts")
    public ResponseEntity<List<DistrictDTO>> getDistrictsByDivision(@PathVariable("id") Integer divisionId) {
        return ResponseEntity.ok(geographicalService.getDistrictsByDivision(divisionId));
    }

    @GetMapping("/districts/{id}/blocks")
    public ResponseEntity<List<GeoLookupDTO>> getBlocksByDistrict(@PathVariable("id") Integer districtId) {
        return ResponseEntity.ok(geographicalService.getBlocksByDistrict(districtId));
    }

    @GetMapping("/districts/{id}/municipalities")
    public ResponseEntity<List<GeoLookupDTO>> getMunicipalitiesByDistrict(@PathVariable("id") Integer districtId) {
        return ResponseEntity.ok(geographicalService.getMunicipalitiesByDistrict(districtId));
    }

    @GetMapping("/blocks/{id}/panchayats")
    public ResponseEntity<List<GeoLookupDTO>> getPanchayatsByBlock(@PathVariable("id") Integer blockId) {
        return ResponseEntity.ok(geographicalService.getPanchayatsByBlock(blockId));
    }

    @GetMapping("/municipalities/{id}/wards")
    public ResponseEntity<List<GeoLookupDTO>> getWardsByMunicipality(@PathVariable("id") Integer municipalityId) {
        return ResponseEntity.ok(geographicalService.getWardsByMunicipality(municipalityId));
    }
}
