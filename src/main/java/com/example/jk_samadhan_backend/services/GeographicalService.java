package com.example.jk_samadhan_backend.services;

import org.springframework.stereotype.Service;
import com.example.jk_samadhan_backend.dto.GeoLookupDTO;
import com.example.jk_samadhan_backend.dto.DistrictDTO;
import com.example.jk_samadhan_backend.repositories.DivisionRepository;
import com.example.jk_samadhan_backend.repositories.DistrictRepository;
import com.example.jk_samadhan_backend.repositories.BlockRepository;
import com.example.jk_samadhan_backend.repositories.PanchayatRepository;
import com.example.jk_samadhan_backend.repositories.MunicipalityRepository;
import com.example.jk_samadhan_backend.repositories.WardRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class GeographicalService {

    private final DivisionRepository divisionRepository;
    private final DistrictRepository districtRepository;
    private final BlockRepository blockRepository;
    private final PanchayatRepository panchayatRepository;
    private final MunicipalityRepository municipalityRepository;
    private final WardRepository wardRepository;

    public GeographicalService(DivisionRepository divisionRepository,
                               DistrictRepository districtRepository,
                               BlockRepository blockRepository,
                               PanchayatRepository panchayatRepository,
                               MunicipalityRepository municipalityRepository,
                               WardRepository wardRepository) {
        this.divisionRepository = divisionRepository;
        this.districtRepository = districtRepository;
        this.blockRepository = blockRepository;
        this.panchayatRepository = panchayatRepository;
        this.municipalityRepository = municipalityRepository;
        this.wardRepository = wardRepository;
    }

    public List<GeoLookupDTO> getAllDivisions() {
        return divisionRepository.findAll().stream()
                .map(d -> new GeoLookupDTO(d.getId(), d.getName()))
                .collect(Collectors.toList());
    }

    public List<DistrictDTO> getDistrictsByDivision(Integer divisionId) {
        return districtRepository.findByDivisionId(divisionId).stream()
                .map(d -> new DistrictDTO(d.getId(), d.getName(), d.getLgdCode()))
                .collect(Collectors.toList());
    }

    public List<GeoLookupDTO> getBlocksByDistrict(Integer districtId) {
        return blockRepository.findByDistrictId(districtId).stream()
                .map(b -> new GeoLookupDTO(b.getId(), b.getName()))
                .collect(Collectors.toList());
    }

    public List<GeoLookupDTO> getPanchayatsByBlock(Integer blockId) {
        return panchayatRepository.findByBlockId(blockId).stream()
                .map(p -> new GeoLookupDTO(p.getId(), p.getName()))
                .collect(Collectors.toList());
    }

    public List<GeoLookupDTO> getMunicipalitiesByDistrict(Integer districtId) {
        return municipalityRepository.findByDistrictId(districtId).stream()
                .map(m -> new GeoLookupDTO(m.getId(), m.getName()))
                .collect(Collectors.toList());
    }

    public List<GeoLookupDTO> getWardsByMunicipality(Integer municipalityId) {
        return wardRepository.findByMunicipalityId(municipalityId).stream()
                .map(w -> new GeoLookupDTO(w.getId(), w.getName()))
                .collect(Collectors.toList());
    }
}
