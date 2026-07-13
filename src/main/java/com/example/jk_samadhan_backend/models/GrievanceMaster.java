package com.example.jk_samadhan_backend.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Table(name = "grievance_master")
@Entity
@Getter
@Setter
public class GrievanceMaster {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String mobile;

    private String email;

    private String gender;

    private String dateOfBirth;

    private String address;

    private String pincode;

    private String state;

    private String district;

    private String windowType;

    private String department;

    private String grievanceCategory;

    private String pertainDivision;

    private String pertainDistrict;

    private String description;
     
    private String fileName;

    private String filePath;

    private String secondfileName;

    private String secondfilePath;

    

    



}
