package com.example.jk_samadhan_backend.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardResponseDTO {
    private UserInfoDTO userInformation;
    private DashboardCountsDTO dashboardCounts;
    private List<NotificationDTO> notifications;
    private List<AppealSummaryDTO> appeals;
    private JKIGRAMSSummaryDTO jkigramsSummary;
    private CPGRAMSSummaryDTO cpgramsSummary;
    private List<GrievanceSummaryDTO> grievances;
}
