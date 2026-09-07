package com.example.jk_samadhan_backend.repositories;

import com.example.jk_samadhan_backend.models.GrievanceMaster;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

public class GrievanceSpecification {

    public static Specification<GrievanceMaster> getGrievancesSpec(
            String search, String status, String department, String district,
            String category, String dateFrom, String dateTo,
            String subCategory, String subCatL2, String subCatL3, String subCatL4,
            String origin, String finalStatus, String keyFlag) {

        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // 1. Search filter (checks uniqId, description, and citizen phone)
            if (search != null && !search.trim().isEmpty()) {
                String searchPattern = "%" + search.trim().toLowerCase() + "%";
                Predicate searchUniqId = criteriaBuilder.like(criteriaBuilder.lower(root.get("uniqId")), searchPattern);
                Predicate searchDesc = criteriaBuilder.like(criteriaBuilder.lower(root.get("description")),
                        searchPattern);

                // Join submittedBy to search by citizen mobile
                Predicate searchPhone = criteriaBuilder
                        .like(criteriaBuilder.lower(root.join("submittedBy").get("mobile")), searchPattern);

                predicates.add(criteriaBuilder.or(searchUniqId, searchDesc, searchPhone));
            }

            // 2. Status filter
            if (status != null && !status.trim().isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("status"), status.trim()));
            }

            // 3. Department filter
            if (department != null && !department.trim().isEmpty()) {
                predicates.add(
                        criteriaBuilder.equal(root.join("category").join("department").get("name"), department.trim()));
            }

            // 4. District filter
            if (district != null && !district.trim().isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.join("district").get("name"), district.trim()));
            }

            // 5. Category filter
            if (category != null && !category.trim().isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.join("category").get("name"), category.trim()));
            }

            // 6. Date Range filters (parsed as LocalDateTime)
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            if (dateFrom != null && !dateFrom.trim().isEmpty()) {
                try {
                    String cleanFrom = dateFrom.trim();
                    if (!cleanFrom.contains(" ")) {
                        cleanFrom += " 00:00:00";
                    }
                    LocalDateTime fromDate = LocalDateTime.parse(cleanFrom, formatter);
                    predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("createdAt"), fromDate));
                } catch (Exception e) {
                    try {
                        LocalDateTime fromDate = LocalDateTime.parse(dateFrom.trim());
                        predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("createdAt"), fromDate));
                    } catch (Exception e2) {
                        // ignore date parsing error
                    }
                }
            }
            if (dateTo != null && !dateTo.trim().isEmpty()) {
                try {
                    String cleanTo = dateTo.trim();
                    if (!cleanTo.contains(" ")) {
                        cleanTo += " 23:59:59";
                    }
                    LocalDateTime toDate = LocalDateTime.parse(cleanTo, formatter);
                    predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("createdAt"), toDate));
                } catch (Exception e) {
                    try {
                        LocalDateTime toDate = LocalDateTime.parse(dateTo.trim());
                        predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("createdAt"), toDate));
                    } catch (Exception e2) {
                        // ignore date parsing error
                    }
                }
            }

            // 7. SubCategory L1 filter
            if (subCategory != null && !subCategory.trim().isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.join("subCatL1").get("name"), subCategory.trim()));
            }

            // 8. SubCategory L2 filter
            if (subCatL2 != null && !subCatL2.trim().isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.join("subCatL2").get("name"), subCatL2.trim()));
            }

            // 9. SubCategory L3 filter
            if (subCatL3 != null && !subCatL3.trim().isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.join("subCatL3").get("name"), subCatL3.trim()));
            }

            // 10. SubCategory L4 filter
            if (subCatL4 != null && !subCatL4.trim().isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.join("subCatL4").get("name"), subCatL4.trim()));
            }

            // 11. Origin filter
            if (origin != null && !origin.trim().isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("origin"), origin.trim()));
            }

            // 12. FinalStatus filter
            if (finalStatus != null && !finalStatus.trim().isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("finalStatus"), finalStatus.trim()));
            }

            // 13. KeyFlag filter
            if (keyFlag != null && !keyFlag.trim().isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("keyFlag"), keyFlag.trim()));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
