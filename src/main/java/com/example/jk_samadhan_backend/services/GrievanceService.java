package com.example.jk_samadhan_backend.services;

import java.security.Principal;

import org.springframework.stereotype.Service;

import com.example.jk_samadhan_backend.dto.GrievanceDTO;
import com.example.jk_samadhan_backend.models.GrievanceMaster;
import com.example.jk_samadhan_backend.models.Users;
import com.example.jk_samadhan_backend.repositories.GrievanceMasterRepository;
import com.example.jk_samadhan_backend.repositories.UserRepository;

@Service
public class GrievanceService {

    private final UserRepository userRepository;
    private final GrievanceMasterRepository grievanceMasterRepository;
   

    public GrievanceService(UserRepository userRepository, GrievanceMasterRepository grievanceMasterRepository ){
        this.userRepository = userRepository;
        this.grievanceMasterRepository = grievanceMasterRepository;
    }

    public GrievanceMaster lodgeGrievance(GrievanceDTO grievanceDTO, Principal principal) {

        Users user = userRepository.findByMobile(principal.getName())
                                            .orElseThrow(() -> new RuntimeException("User not found"));

                 

        GrievanceMaster grievanceMaster = new GrievanceMaster();
        String fullName = user.getFirstName();
        if (user.getMiddleName() != null && !user.getMiddleName().isEmpty()) {
            fullName += " " + user.getMiddleName();
        }
        if (user.getLastName() != null && !user.getLastName().isEmpty()) {
            fullName += " " + user.getLastName();
        }
        grievanceMaster.setName(fullName);
        grievanceMaster.setMobile(user.getMobile());
        grievanceMaster.setEmail(user.getEmail());
        grievanceMaster.setGender(user.getGender());
        grievanceMaster.setDateOfBirth(user.getDateOfBirth());
        grievanceMaster.setAddress(user.getAddress());
        grievanceMaster.setPincode(user.getPincode());
        grievanceMaster.setState(user.getState());
        grievanceMaster.setDistrict(user.getDistrict());
        grievanceMaster.setWindowType(grievanceDTO.getWindowType());
        grievanceMaster.setDepartment(grievanceDTO.getDepartment());
        grievanceMaster.setGrievanceCategory(grievanceDTO.getGrievanceCategory());
        grievanceMaster.setPertainDivision(grievanceDTO.getPertainDivision());
        grievanceMaster.setPertainDistrict(grievanceDTO.getPertainDistrict());
        grievanceMaster.setDescription(grievanceDTO.getDescription());
        grievanceMaster.setFileName(null);
        grievanceMaster.setFilePath(null);
        grievanceMaster.setSecondfileName(null);
        grievanceMaster.setSecondfilePath(null);
        
        return grievanceMasterRepository.save(grievanceMaster);
    }

}
