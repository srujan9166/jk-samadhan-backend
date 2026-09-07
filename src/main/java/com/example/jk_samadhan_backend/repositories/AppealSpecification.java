package com.example.jk_samadhan_backend.repositories;

import com.example.jk_samadhan_backend.models.AppealMaster;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

public class AppealSpecification {

    public static Specification<AppealMaster> getAppealsSpec(
            String search, Integer departmentId, Integer districtId, Long appealedToId) {

        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // 1. Search filter (checks appealUniqId, description, and grievance uniqId)
            if (search != null && !search.trim().isEmpty()) {
                String searchPattern = "%" + search.trim().toLowerCase() + "%";
                Predicate searchAppealUniqId = criteriaBuilder.like(criteriaBuilder.lower(root.get("appealUniqId")), searchPattern);
                Predicate searchDesc = criteriaBuilder.like(criteriaBuilder.lower(root.get("description")), searchPattern);
                Predicate searchGrievanceUniqId = criteriaBuilder.like(criteriaBuilder.lower(root.join("grievance").get("uniqId")), searchPattern);

                predicates.add(criteriaBuilder.or(searchAppealUniqId, searchDesc, searchGrievanceUniqId));
            }

            // 2. Department filter
            if (departmentId != null) {
                predicates.add(criteriaBuilder.equal(root.join("grievance").join("category").join("department").get("id"), departmentId));
            }

            // 3. District filter
            if (districtId != null) {
                predicates.add(criteriaBuilder.equal(root.join("grievance").join("district").get("id"), districtId));
            }

            // 4. Appealed To Nodal filter
            if (appealedToId != null) {
                predicates.add(criteriaBuilder.equal(root.join("appealedTo").get("id"), appealedToId));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
