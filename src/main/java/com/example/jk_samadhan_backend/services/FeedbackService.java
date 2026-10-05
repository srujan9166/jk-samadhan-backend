package com.example.jk_samadhan_backend.services;

import com.example.jk_samadhan_backend.dto.FeedbackDTO;
import com.example.jk_samadhan_backend.dto.FeedbackMisReportDTO;
import com.example.jk_samadhan_backend.dto.FeedbackSummaryDTO;
import com.example.jk_samadhan_backend.dto.PaginatedFeedbackResponseDTO;
import com.example.jk_samadhan_backend.repositories.FeedbackRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;

    public FeedbackService(FeedbackRepository feedbackRepository) {
        this.feedbackRepository = feedbackRepository;
    }

    @Transactional(readOnly = true)
    public FeedbackSummaryDTO getFeedbackSummary(
            String department, String district, String category,
            String gender, String satisfaction, String dateFrom, String dateTo) {

        Object[] row = feedbackRepository.fetchFeedbackSummaryRaw(
                department, district, category, gender, satisfaction, dateFrom, dateTo);

        if (row == null || row.length == 0) {
            return FeedbackSummaryDTO.builder().build();
        }

        // If returned array wraps elements
        Object[] cols = row;
        if (row.length == 1 && row[0] instanceof Object[] inner) {
            cols = inner;
        }

        long total = cols[0] != null ? ((Number) cols[0]).longValue() : 0;
        long satYes = cols[1] != null ? ((Number) cols[1]).longValue() : 0;
        long satNo = cols[2] != null ? ((Number) cols[2]).longValue() : 0;
        long callYes = cols[3] != null ? ((Number) cols[3]).longValue() : 0;
        long callNo = cols[4] != null ? ((Number) cols[4]).longValue() : 0;

        long expExc = cols[5] != null ? ((Number) cols[5]).longValue() : 0;
        long expGood = cols[6] != null ? ((Number) cols[6]).longValue() : 0;
        long expAvg = cols[7] != null ? ((Number) cols[7]).longValue() : 0;
        long expPoor = cols[8] != null ? ((Number) cols[8]).longValue() : 0;

        long timeVerySat = cols[9] != null ? ((Number) cols[9]).longValue() : 0;
        long timeSat = cols[10] != null ? ((Number) cols[10]).longValue() : 0;
        long timeDissat = cols[11] != null ? ((Number) cols[11]).longValue() : 0;

        long reuseYesDef = cols[12] != null ? ((Number) cols[12]).longValue() : 0;
        long reuseMaybe = cols[13] != null ? ((Number) cols[13]).longValue() : 0;
        long reuseNo = cols[14] != null ? ((Number) cols[14]).longValue() : 0;

        double avgScore = cols[15] != null ? Math.round(((Number) cols[15]).doubleValue() * 100.0) / 100.0 : 0.0;

        double totalD = total > 0 ? (double) total : 1.0;

        return FeedbackSummaryDTO.builder()
                .totalFeedbacks(total)
                .satisfiedYesCount(satYes)
                .satisfiedNoCount(satNo)
                .satisfiedYesPercent(Math.round((satYes * 100.0 / totalD) * 100.0) / 100.0)
                .satisfiedNoPercent(Math.round((satNo * 100.0 / totalD) * 100.0) / 100.0)

                .callReceivedYesCount(callYes)
                .callReceivedNoCount(callNo)
                .callReceivedYesPercent(Math.round((callYes * 100.0 / totalD) * 100.0) / 100.0)
                .callReceivedNoPercent(Math.round((callNo * 100.0 / totalD) * 100.0) / 100.0)

                .experienceExcellentCount(expExc)
                .experienceGoodCount(expGood)
                .experienceAverageCount(expAvg)
                .experiencePoorCount(expPoor)
                .experienceExcellentPercent(Math.round((expExc * 100.0 / totalD) * 100.0) / 100.0)
                .experienceGoodPercent(Math.round((expGood * 100.0 / totalD) * 100.0) / 100.0)
                .experienceAveragePercent(Math.round((expAvg * 100.0 / totalD) * 100.0) / 100.0)
                .experiencePoorPercent(Math.round((expPoor * 100.0 / totalD) * 100.0) / 100.0)

                .timeVerySatisfiedCount(timeVerySat)
                .timeSatisfiedCount(timeSat)
                .timeDissatisfiedCount(timeDissat)

                .reuseYesDefinitelyCount(reuseYesDef)
                .reuseMaybeLessTimeCount(reuseMaybe)
                .reuseNoNeverCount(reuseNo)
                .avgRating(avgScore)
                .build();
    }

    @Transactional(readOnly = true)
    public PaginatedFeedbackResponseDTO getFeedbackList(
            String department, String district, String category,
            String gender, String satisfaction, String dateFrom, String dateTo,
            String search, int page, int size) {

        Pageable pageable = PageRequest.of(page, size);

        List<Object[]> rawList = feedbackRepository.fetchFeedbackListRaw(
                department, district, category, gender, satisfaction, dateFrom, dateTo, search, pageable);

        long totalElements = feedbackRepository.countFeedbackListRaw(
                department, district, category, gender, satisfaction, dateFrom, dateTo, search);

        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");
        List<FeedbackDTO> content = new ArrayList<>();

        for (Object[] row : rawList) {
            Long id = row[0] != null ? ((Number) row[0]).longValue() : null;
            Long grievanceId = row[1] != null ? ((Number) row[1]).longValue() : null;
            String uniqId = row[2] != null ? row[2].toString() : "";
            String compName = row[3] != null ? row[3].toString() : "";
            String compMobile = row[4] != null ? row[4].toString() : "";
            String dept = row[5] != null ? row[5].toString() : "";
            String cat = row[6] != null ? row[6].toString() : "";
            String dist = row[7] != null ? row[7].toString() : "";
            String gen = row[8] != null ? row[8].toString() : "";
            String sat = row[9] != null ? row[9].toString() : "";
            String callRec = row[10] != null ? row[10].toString() : "";
            String exp = row[11] != null ? row[11].toString() : "";
            String timeSat = row[12] != null ? row[12].toString() : "";
            String reuse = row[13] != null ? row[13].toString() : "";
            Integer r1 = row[14] != null ? ((Number) row[14]).intValue() : null;
            Integer r2 = row[15] != null ? ((Number) row[15]).intValue() : null;
            Integer score = row[16] != null ? ((Number) row[16]).intValue() : null;
            String desc = row[17] != null ? row[17].toString() : "";
            String poorReason = row[18] != null ? row[18].toString() : "";

            String createdAtStr = "N/A";
            if (row[19] instanceof java.time.OffsetDateTime odt) {
                createdAtStr = odt.format(dtf);
            } else if (row[19] instanceof java.time.LocalDateTime ldt) {
                createdAtStr = ldt.format(dtf);
            } else if (row[19] instanceof java.util.Date d) {
                createdAtStr = new java.text.SimpleDateFormat("dd-MM-yyyy HH:mm:ss").format(d);
            } else if (row[19] != null) {
                createdAtStr = row[19].toString();
            }

            content.add(FeedbackDTO.builder()
                    .id(id)
                    .grievanceId(grievanceId)
                    .uniqId(uniqId)
                    .complainantName(compName)
                    .complainantMobile(compMobile)
                    .department(dept)
                    .category(cat)
                    .district(dist)
                    .gender(gen)
                    .satisfied(sat)
                    .callReceived(callRec)
                    .overallExperience(exp)
                    .timeSatisfaction(timeSat)
                    .reusePortal(reuse)
                    .rating1(r1)
                    .rating2(r2)
                    .feedbackScore(score)
                    .description(desc)
                    .poorReason(poorReason)
                    .createdAt(createdAtStr)
                    .build());
        }

        int totalPages = (int) Math.ceil((double) totalElements / size);

        return PaginatedFeedbackResponseDTO.builder()
                .content(content)
                .currentPage(page)
                .pageSize(size)
                .totalElements(totalElements)
                .totalPages(totalPages)
                .build();
    }

    @Transactional(readOnly = true)
    public List<FeedbackMisReportDTO> getFeedbackMisReport(
            String department, String district, String dateFrom, String dateTo) {

        List<Object[]> rawList = feedbackRepository.fetchFeedbackMisReportRaw(
                department, district, dateFrom, dateTo);

        List<FeedbackMisReportDTO> result = new ArrayList<>();
        for (Object[] row : rawList) {
            String dept = row[0] != null ? row[0].toString() : "Unassigned Department";
            long totalGrievances = row[1] != null ? ((Number) row[1]).longValue() : 0;
            double satYesP = row[2] != null ? ((Number) row[2]).doubleValue() : 0.0;
            double satNoP = row[3] != null ? ((Number) row[3]).doubleValue() : 0.0;
            double callYesP = row[4] != null ? ((Number) row[4]).doubleValue() : 0.0;
            double callNoP = row[5] != null ? ((Number) row[5]).doubleValue() : 0.0;
            double expExcP = row[6] != null ? ((Number) row[6]).doubleValue() : 0.0;
            double expGoodP = row[7] != null ? ((Number) row[7]).doubleValue() : 0.0;
            double expAvgP = row[8] != null ? ((Number) row[8]).doubleValue() : 0.0;
            double expPoorP = row[9] != null ? ((Number) row[9]).doubleValue() : 0.0;

            result.add(FeedbackMisReportDTO.builder()
                    .department(dept)
                    .totalGrievances(totalGrievances)
                    .satisfiedYesPercent(satYesP)
                    .satisfiedNoPercent(satNoP)
                    .callReceivedYesPercent(callYesP)
                    .callReceivedNoPercent(callNoP)
                    .experienceExcellentPercent(expExcP)
                    .experienceGoodPercent(expGoodP)
                    .experienceAveragePercent(expAvgP)
                    .experiencePoorPercent(expPoorP)
                    .build());
        }

        return result;
    }
}
