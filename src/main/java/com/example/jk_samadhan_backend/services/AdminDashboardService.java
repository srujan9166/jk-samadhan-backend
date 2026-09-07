package com.example.jk_samadhan_backend.services;

import com.example.jk_samadhan_backend.dto.legacy.*;

public interface AdminDashboardService {
    AdminDashboardDataDTO getDashboardData(String username, Boolean showLoginToast);
    DeptMappingDataDTO getDeptMappingData(String username);
    void addDeptCategory(ReqUIDTO request, String username);
    void assignGrievance(AssignGrievanceReqDTO request, String username);
    void pullBackGrievance(PullBackReqDTO request, String username);
    void updateGrievanceResolution(UpdateGrievanceReqDTO request, String username);
    void createNodal(CreateNodalReqDTO request);
    java.util.Map<String, Object> getNodalByDepartment(String departmentName);
    java.util.List<java.util.Map<String, Object>> getDeptUsersList(String departmentName);
}
