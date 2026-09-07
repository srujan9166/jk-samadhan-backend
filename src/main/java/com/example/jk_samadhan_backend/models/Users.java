package com.example.jk_samadhan_backend.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "users", schema = "jks_3nf", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "username" }),
        @UniqueConstraint(columnNames = { "uuid" })
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Users implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private UUID uuid;

    @Column(nullable = false, unique = true)
    private String username;

    @JsonIgnore
    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private boolean enabled = true;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_type_id", nullable = false)
    private UserType userType;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "middle_name")
    private String middleName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "mobile")
    private String mobile;

    @Column(name = "email")
    private String email;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "designation_id")
    private Designation designation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    @Column(name = "office_name", length = 150)
    private String officeName;

    @Column(name = "gender")
    private String gender;

    @Column(name = "dob")
    private LocalDate dob;

    @Column(name = "address", columnDefinition = "TEXT")
    private String address;

    @Column(name = "pincode")
    private String pincode;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "district_id")
    private District districtEntity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "block_id")
    private Block block;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "panchayat_id")
    private Panchayat panchayat;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "municipality_id")
    private Municipality municipality;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ward_id")
    private Ward ward;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_id")
    private Users createdBy;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false, nullable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "date_of_birth")
    private String dateOfBirth;

    @Transient
    private String district;

    @Transient
    private String state;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "state_id")
    private State stateEntity;

    public String getDistrict() {
        if (this.district != null) {
            return this.district;
        }
        return this.districtEntity != null ? this.districtEntity.getName() : null;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public String getState() {
        if (this.state != null && !this.state.isBlank()) {
            return this.state;
        }
        try {
            if (this.stateEntity != null) {
                return this.stateEntity.getName();
            }
        } catch (Exception e) {}
        return null;
    }

   

    public void setState(String state) {
        this.state = state;
    }

    @Column(name = "role", nullable = false)
    private String role = "CITIZEN";

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        java.util.Set<GrantedAuthority> authorities = new java.util.HashSet<>();

        String rawRole = null;
        try {
            if (this.userType != null && this.userType.getTypeName() != null && !this.userType.getTypeName().isBlank()) {
                rawRole = this.userType.getTypeName();
            }
        } catch (Exception e) {
            // Lazy proxy initialization error fallback
        }
        if (rawRole == null || rawRole.isBlank()) {
            if (this.role != null && !this.role.isBlank()) {
                rawRole = this.role;
            } else {
                rawRole = "CITIZEN";
            }
        }

        String formattedRole = rawRole.trim();
        authorities.add(new SimpleGrantedAuthority(formattedRole));

        if (formattedRole.startsWith("ROLE_")) {
            authorities.add(new SimpleGrantedAuthority(formattedRole.substring(5).toUpperCase()));
            authorities.add(new SimpleGrantedAuthority(formattedRole.toUpperCase()));
        } else {
            authorities.add(new SimpleGrantedAuthority("ROLE_" + formattedRole.toUpperCase()));
            authorities.add(new SimpleGrantedAuthority(formattedRole.toUpperCase()));
        }

        return authorities;
    }

    @Override
    public String getUsername() {
        return this.username;
    }

    public String getName() {
        String fullName = "";
        if (this.firstName != null)
            fullName += this.firstName;
        if (this.middleName != null && !this.middleName.trim().isEmpty()) {
            fullName += " " + this.middleName.trim();
        }
        if (this.lastName != null && !this.lastName.trim().isEmpty()) {
            fullName += " " + this.lastName.trim();
        }
        return fullName.trim();
    }

    public String getPhone() {
        return this.mobile;
    }

    public java.util.Map<String, String> toProfileMap() {
        java.util.Map<String, String> profile = new java.util.HashMap<>();
        profile.put("name", getName());
        profile.put("username", this.username != null ? this.username : "");
        profile.put("email", this.email != null ? this.email : "");
        profile.put("phone", this.mobile != null ? this.mobile : "");
        profile.put("address", this.address != null ? this.address : "");
        profile.put("department", this.department != null ? this.department.getName() : "");
        
        String dist = getDistrict();
        if (dist == null || dist.isBlank()) {
            dist = "Other";
        }
        profile.put("district", dist);
        profile.put("gender", this.gender != null ? this.gender : "");
        profile.put("dateOfBirth", this.dateOfBirth != null ? this.dateOfBirth : (this.dob != null ? this.dob.toString() : ""));
        profile.put("pincode", this.pincode != null ? this.pincode : "");
        profile.put("state", (getState() != null && !getState().isBlank()) ? getState() : "Other");
        
        String activeRole = null;
        try {
            if (this.userType != null && this.userType.getTypeName() != null && !this.userType.getTypeName().isBlank()) {
                activeRole = this.userType.getTypeName();
            }
        } catch (Exception e) {}
        if (activeRole == null || activeRole.isBlank()) {
            activeRole = this.role != null ? this.role : "CITIZEN";
        }

        String mailLower = this.email != null ? this.email.toLowerCase() : "";
        String unameLower = this.username != null ? this.username.toLowerCase() : "";
        if (mailLower.contains("superadmin") || unameLower.contains("superadmin")) {
            activeRole = "ROLE_SuperAdmin";
        } else if (mailLower.contains("admin") || unameLower.contains("admin")) {
            if (!activeRole.toUpperCase().contains("ADMIN")) {
                activeRole = "ROLE_Admin";
            }
        }

        profile.put("role", activeRole);
        return profile;
    }
}