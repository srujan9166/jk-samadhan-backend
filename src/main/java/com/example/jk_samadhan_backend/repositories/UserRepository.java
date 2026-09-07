package com.example.jk_samadhan_backend.repositories;

import java.util.Optional;
import java.util.UUID;
import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.jk_samadhan_backend.models.Users;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface UserRepository extends JpaRepository<Users, Long> {

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByMobile(String mobile);

    @EntityGraph(attributePaths = { "userType", "districtEntity", "stateEntity" })
    Optional<Users> findByUsername(String username);

    Optional<Users> findByMobile(String mobile);

    Optional<Users> findByEmail(String email);

    @EntityGraph(attributePaths = { "userType", "districtEntity", "stateEntity" })
    Optional<Users> findByUuid(UUID uuid);

    @EntityGraph(attributePaths = { "userType", "districtEntity", "stateEntity" })
    @Query("SELECT u FROM Users u WHERE u.username = :identifier OR u.mobile = :identifier OR u.email = :identifier")
    Optional<Users> findByIdentifier(@Param("identifier") String identifier);

    @Query(value = "SELECT * FROM public.users WHERE username = :username AND enabled = 1", nativeQuery = true)
    java.util.List<Object[]> findNodalDetailsRaw(@Param("username") String username);

    @Query("SELECT u FROM Users u WHERE u.userType.id = 7 AND u.department.id = :deptId")
    List<Users> findAppellateByDepartment(@Param("deptId") Integer deptId);

    @Query("SELECT u FROM Users u WHERE u.userType.id = 7")
    List<Users> findAllAppellates();

    @Query("SELECT u FROM Users u WHERE u.department.name = :deptName AND (u.role = 'ADMIN' OR u.userType.typeName = 'ROLE_Admin')")
    List<Users> findNodalByDepartmentName(@Param("deptName") String deptName);

    boolean existsByDesignationId(Integer designationId);
}
