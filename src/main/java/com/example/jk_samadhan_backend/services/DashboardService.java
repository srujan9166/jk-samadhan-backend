package com.example.jk_samadhan_backend.services;

import com.example.jk_samadhan_backend.dto.DashboardResponseDTO;
import java.security.Principal;

public interface DashboardService {
    DashboardResponseDTO getDashboardData(Principal principal);
}
