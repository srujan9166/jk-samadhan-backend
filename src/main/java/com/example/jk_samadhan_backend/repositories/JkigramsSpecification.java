package com.example.jk_samadhan_backend.repositories;

import com.example.jk_samadhan_backend.models.JkigramsDump;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class JkigramsSpecification {

    public static Specification<JkigramsDump> getJkigramsSpec(
            String search,
            String status,
            String department,
            String category) {

        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (search != null && !search.trim().isEmpty()) {
                String pattern = "%" + search.trim().toLowerCase() + "%";
                Predicate searchPredicate = cb.or(
                        cb.like(cb.lower(root.get("referenceId")), pattern),
                        cb.like(cb.lower(root.get("applicantName")), pattern),
                        cb.like(cb.lower(root.get("grievanceType")), pattern),
                        cb.like(cb.lower(root.get("department")), pattern),
                        cb.like(cb.lower(root.get("mobileno")), pattern),
                        cb.like(cb.lower(root.get("emailid")), pattern),
                        cb.like(cb.lower(root.get("constituency")), pattern),
                        cb.like(cb.lower(root.get("pendingAt")), pattern),
                        cb.like(cb.lower(root.get("currentStatus")), pattern),
                        cb.like(cb.lower(root.get("status")), pattern),
                        cb.like(cb.lower(root.get("cpgramsRegno")), pattern)
                );
                predicates.add(searchPredicate);
            }

            if (status != null && !status.trim().isEmpty() && !"ALL".equalsIgnoreCase(status)) {
                if ("dnpToOffice".equalsIgnoreCase(status) || "Does not pertain".equalsIgnoreCase(status) || "Does Not Pertain".equalsIgnoreCase(status)) {
                    predicates.add(cb.or(
                            cb.equal(cb.lower(root.get("status")), "does not pertain"),
                            cb.equal(cb.lower(root.get("status")), "dnptooffice")
                    ));
                } else {
                    predicates.add(cb.equal(cb.lower(root.get("status")), status.trim().toLowerCase()));
                }
            }

            if (department != null && !department.trim().isEmpty() && !"ALL".equalsIgnoreCase(department)) {
                predicates.add(cb.like(cb.lower(root.get("department")), "%" + department.trim().toLowerCase() + "%"));
            }

            if (category != null && !category.trim().isEmpty() && !"ALL".equalsIgnoreCase(category)) {
                predicates.add(cb.like(cb.lower(root.get("grievanceType")), "%" + category.trim().toLowerCase() + "%"));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
