package com.example.jk_samadhan_backend.dto.legacy;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminDashboardDataDTO {
    private String keyOne;
    private String keyTwo;
    private String keyThree;
    private boolean showLoginToast;
    private String loggedInUserFullName;
    private String userType;
    private Integer userLevel;
    private String userDepartment;
    private String userflag;

    private List<GrievanceSummaryDTO> totall;
    private List<String> depts;
    private List<NotificationDTO> notifications;

    private String totalG;
    private String propDisp;
    private String pending;
    private String resolved;
    private String pendingWithAdmin;
    private String fwd;
    private String rmk;
    private String fwdByOtherDep;
    private String resolvedByOtherDep;
    private String rejectedByOtherDep;
    private String pendingAtOtherDep;
    private String proposeDispAtOtherDep;
    private String forwardedpAtOtherDep;
    private String dnpAtOtherDep;
    private String remarkAtOtherDep;
    private String fwdOtherDep;
    private String cpgramClosed;
    private String fwdToCPGRAM;
    private String normalFlagCount;
    private String priorityFlagCount;
    private String web;
    private String App;
    private String forwarded;
    private String totalClosed;
    private String totalCPGRAM;
    private int dNpCount;
    private String rejected;
    private String DNP;
    private String remark;
    private int appealReceviedCount;

    private int jkiTotal;
    private int jkiPending;
    private int jkiForwarded;
    private int jkiRemarksAdded;
    private int jkiResolved;
    private int jkiRejected;
    private int jkiDNP;
}
