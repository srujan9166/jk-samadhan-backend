package com.example.jk_samadhan_backend.dto;

import lombok.*;
import java.util.List;

public class JkigramsDTO {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Summary {
        private long totalGrievanceReceived;
        private long pendingWithDepartment;
        private long forwarded;
        private long remarkAdded;
        private long resolved;
        private long rejected;
        private long doesNotPertain;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Item {
        private Long id;
        private String referenceId;
        private String category;
        private String submittedOn;
        private String applicantName;
        private String applicantGender;
        private String applicantEmail;
        private String mobileNo;
        private String constituency;
        private String cpgramsRegNo;
        private String pendingWith;
        private String jkigramsStatus;
        private String jksamadhanStatus;
        private String description;
        private String department;
        private String address;
        private String pincode;
        private String appFileName;
        private String appFilePath;
        private String deptFileName;
        private String deptFilePath;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PaginatedResponse {
        private List<Item> content;
        private long totalElements;
        private int totalPages;
        private int currentPage;
        private int pageSize;
    }
}
