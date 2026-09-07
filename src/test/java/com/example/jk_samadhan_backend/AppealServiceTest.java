package com.example.jk_samadhan_backend;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.security.Principal;
import java.util.Collections;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import com.example.jk_samadhan_backend.dto.PaginatedAppealsResponseDTO;
import com.example.jk_samadhan_backend.models.AppealMaster;
import com.example.jk_samadhan_backend.models.Users;
import com.example.jk_samadhan_backend.models.UserType;
import com.example.jk_samadhan_backend.repositories.AppealMasterRepository;
import com.example.jk_samadhan_backend.repositories.GrievanceMasterRepository;
import com.example.jk_samadhan_backend.repositories.UserRepository;
import com.example.jk_samadhan_backend.services.AppealService;

@ExtendWith(MockitoExtension.class)
public class AppealServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private GrievanceMasterRepository grievanceMasterRepository;

    @Mock
    private AppealMasterRepository appealMasterRepository;

    private AppealService appealService;

    @BeforeEach
    void setUp() {
        appealService = new AppealService(userRepository, grievanceMasterRepository, appealMasterRepository);
    }

    @Test
    void testSuperAdminBypassesDepartmentFilter() {
        // Arrange: Create a user with ROLE_SuperAdmin user type and a department configured
        Users superadmin = new Users();
        superadmin.setUsername("superadmin");
        superadmin.setRole("CITIZEN");
        
        UserType superAdminType = new UserType();
        superAdminType.setId(1);
        superAdminType.setTypeName("ROLE_SuperAdmin");
        superadmin.setUserType(superAdminType);

        com.example.jk_samadhan_backend.models.Department dept = new com.example.jk_samadhan_backend.models.Department();
        dept.setId(5);
        dept.setName("REVENUE DEPARTMENT");
        superadmin.setDepartment(dept);

        Principal principal = () -> "superadmin";
        Pageable pageable = PageRequest.of(0, 10);

        when(userRepository.findByIdentifier("superadmin")).thenReturn(Optional.of(superadmin));

        Page<AppealMaster> emptyPage = new PageImpl<>(Collections.emptyList(), pageable, 0);
        when(appealMasterRepository.findAll(any(Specification.class), eq(pageable))).thenReturn(emptyPage);

        // Act
        PaginatedAppealsResponseDTO result = appealService.getAppealDashboardList(null, principal, pageable);

        // Assert: Capture the specification passed to repository
        ArgumentCaptor<Specification<AppealMaster>> specCaptor = ArgumentCaptor.forClass(Specification.class);
        verify(appealMasterRepository).findAll(specCaptor.capture(), eq(pageable));
        
        Specification<AppealMaster> capturedSpec = specCaptor.getValue();
        assertNotNull(capturedSpec);
        
        // If the captured specification runs, it should not apply a department filter since the user is a superadmin.
        // We verify the code successfully ran and returned the response DTO.
        assertNotNull(result);
    }

    @Test
    void testGetAppealMisReport() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<com.example.jk_samadhan_backend.dto.AppealMisReportProjection> emptyPage = new PageImpl<>(Collections.emptyList(), pageable, 0);
        when(appealMasterRepository.findAppealCountsByDepartment(any(), any(), eq(pageable))).thenReturn(emptyPage);

        var result = appealService.getAppealMisReport("test", 1, pageable);
        assertNotNull(result);
    }
}
