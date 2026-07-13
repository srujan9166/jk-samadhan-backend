package com.example.jk_samadhan_backend.models;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "users", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "email" }),
        @UniqueConstraint(columnNames = { "mobile" })
})
public class Users implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, name = "first_name")
    private String firstName;
    @Column(name = "middle_name")
    private String middleName;
    @Column(name = "last_name")
    private String lastName;
    @Column(nullable = false, name = "username")
    private String username;
    @JsonIgnore
    @Column(nullable = false, name = "password")
    private String password;
    @Column(name = "email")
    private String email;
    @Column(name = "gender")
    private String gender;
    @Column(name = "date_of_birth")
    private String dateOfBirth;
    @Column(name = "mobile")
    private String mobile;
    @Column(nullable = false)
    private String role;
    @Column(name = "created_at")
    private String createdAt;
    @Column(name = "address")
    private String address;
    @Column(name = "pincode")
    private String pincode;
    @Column(name = "state")
    private String state;
    @Column(name = "district")
    private String district;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(
                new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override
    public String getUsername() {
        return this.mobile;
    }

    public String getName() {
        String fullName = this.firstName + " " + 
                (this.middleName != null && !this.middleName.trim().isEmpty() ? this.middleName.trim() + " " : "") + 
                this.lastName;
        return fullName.trim();
    }

    public String getPhone() {
        return this.mobile;
    }

}
