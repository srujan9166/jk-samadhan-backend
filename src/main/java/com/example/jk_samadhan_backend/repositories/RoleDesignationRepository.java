package com.example.jk_samadhan_backend.repositories;

import com.example.jk_samadhan_backend.models.RoleDesignation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleDesignationRepository extends JpaRepository<RoleDesignation, Integer> {
    Optional<RoleDesignation> findByRoleIdAndDesignationId(Integer roleId, Integer designationId);
    boolean existsByDesignationId(Integer designationId);
}
