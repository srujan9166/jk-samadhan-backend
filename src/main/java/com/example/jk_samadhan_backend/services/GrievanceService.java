package com.example.jk_samadhan_backend.services;

import java.security.Principal;
import java.util.Optional;
import java.util.List;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import org.springframework.stereotype.Service;

import com.example.jk_samadhan_backend.dto.GrievanceDTO;
import com.example.jk_samadhan_backend.models.GrievanceMaster;
import com.example.jk_samadhan_backend.models.Users;
import com.example.jk_samadhan_backend.models.District;
import com.example.jk_samadhan_backend.models.Category;
import com.example.jk_samadhan_backend.repositories.GrievanceMasterRepository;
import com.example.jk_samadhan_backend.repositories.UserRepository;
import com.example.jk_samadhan_backend.repositories.DistrictRepository;
import com.example.jk_samadhan_backend.repositories.CategoryRepository;

@Service
public class GrievanceService {

    private final UserRepository userRepository;
    private final GrievanceMasterRepository grievanceMasterRepository;
    private final DistrictRepository districtRepository;
    private final CategoryRepository categoryRepository;

    public GrievanceService(UserRepository userRepository, 
                            GrievanceMasterRepository grievanceMasterRepository, 
                            DistrictRepository districtRepository,
                            CategoryRepository categoryRepository){
        this.userRepository = userRepository;
        this.grievanceMasterRepository = grievanceMasterRepository;
        this.districtRepository = districtRepository;
        this.categoryRepository = categoryRepository;
    }

    public GrievanceMaster lodgeGrievance(GrievanceDTO grievanceDTO, Principal principal) {

        Users user = userRepository.findByMobile(principal.getName())
                                            .orElseThrow(() -> new RuntimeException("User not found"));

        GrievanceMaster grievanceMaster = new GrievanceMaster();
        grievanceMaster.setDescription(grievanceDTO.getDescription());
        grievanceMaster.setSubmittedBy(user);
        
        String generatedUniqId = "GRV" + java.time.Year.now().getValue() + "/" + (100000 + new java.util.Random().nextInt(900000));
        grievanceMaster.setUniqId(generatedUniqId);
        
        District district = null;
        if (grievanceDTO.getPertainDistrict() != null) {
            district = districtRepository.findByNameIgnoreCase(grievanceDTO.getPertainDistrict().trim())
                            .orElse(null);
        }
        if (district == null) {
            district = districtRepository.findById(1).orElse(null); // default fallback to district 1
        }
        grievanceMaster.setDistrict(district);

        Category category = null;
        if (grievanceDTO.getGrievanceCategory() != null) {
            category = categoryRepository.findByNameIgnoreCase(grievanceDTO.getGrievanceCategory().trim())
                            .orElse(null);
        }
        grievanceMaster.setCategory(category);

        grievanceMaster.setOrigin("JKSAMADHAN");
        grievanceMaster.setStatus("Registered");
        grievanceMaster.setFinalStatus("Submitted");
        grievanceMaster.setKeyFlag("Normal");
        grievanceMaster.setPsga("NA");
        
        return grievanceMasterRepository.save(grievanceMaster);
    }

    public List<GrievanceMaster> getGrievancesForUser(Principal principal, String search) {
        String identifier = principal.getName();
        Users user = userRepository.findByIdentifier(identifier)
                .orElseThrow(() -> new RuntimeException("User not found: " + identifier));

        String role = "ROLE_Individual";
        if (user.getUserType() != null) {
            role = user.getUserType().getTypeName();
        } else if (user.getRole() != null) {
            role = user.getRole();
        }

        PageRequest pageRequest = PageRequest.of(0, 100, Sort.by("id").descending());

        if (search != null && !search.trim().isEmpty()) {
            return grievanceMasterRepository.findBySearchWithAssociations(search.trim(), pageRequest);
        }

        if (role.equalsIgnoreCase("ROLE_SuperAdmin") || role.equalsIgnoreCase("ROLE_Admin") 
                || role.toUpperCase().contains("SUPERADMIN") || role.toUpperCase().contains("ADMIN")) {
            return grievanceMasterRepository.findAllWithAssociations(pageRequest);
        } else if (role.equalsIgnoreCase("ROLE_Secretary") || role.equalsIgnoreCase("ROLE_Department") 
                || role.toUpperCase().contains("DEPARTMENT") || role.toUpperCase().contains("SECRETARY")) {
            return user.getDepartment() != null 
                    ? grievanceMasterRepository.findByDepartmentIdWithAssociations(user.getDepartment().getId(), pageRequest) 
                    : List.of();
        } else if (role.equalsIgnoreCase("ROLE_DM") || role.toUpperCase().contains("DM")) {
            return user.getDistrictEntity() != null 
                    ? grievanceMasterRepository.findByDistrictIdWithAssociations(user.getDistrictEntity().getId(), pageRequest) 
                    : List.of();
        } else if (role.equalsIgnoreCase("ROLE_DealingHand") || role.toUpperCase().contains("DEALINGHAND")) {
            return grievanceMasterRepository.findAssignedGrievancesWithAssociations(user.getId(), pageRequest);
        }

        return grievanceMasterRepository.findBySubmittedByIdWithAssociations(user.getId(), pageRequest);
    }
}
