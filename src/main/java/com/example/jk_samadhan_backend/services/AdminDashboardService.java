package com.example.jk_samadhan_backend.services;

import com.example.jk_samadhan_backend.dto.legacy.AdminDashboardDataDTO;
import com.example.jk_samadhan_backend.dto.legacy.DeptMappingDataDTO;
import com.example.jk_samadhan_backend.dto.legacy.ReqUIDTO;

public interface AdminDashboardService {
    AdminDashboardDataDTO getDashboardData(String username, Boolean showLoginToast);
    DeptMappingDataDTO getDeptMappingData(String username);
    void addDeptCategory(ReqUIDTO request, String username);
}
