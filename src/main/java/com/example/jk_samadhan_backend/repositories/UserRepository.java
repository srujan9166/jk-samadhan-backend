package com.example.jk_samadhan_backend.repositories;

import java.util.Optional;
import java.util.UUID;

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

    @EntityGraph(attributePaths = { "userType", "districtEntity" })
    Optional<Users> findByUsername(String username);

    Optional<Users> findByMobile(String mobile);

    Optional<Users> findByEmail(String email);

    @EntityGraph(attributePaths = { "userType", "districtEntity" })
    Optional<Users> findByUuid(UUID uuid);

    @EntityGraph(attributePaths = { "userType", "districtEntity" })
    @Query("SELECT u FROM Users u WHERE u.username = :identifier OR u.mobile = :identifier OR u.email = :identifier")
    Optional<Users> findByIdentifier(@Param("identifier") String identifier);

    @Query(value = "SELECT * FROM public.users WHERE username = :username AND enabled = 1", nativeQuery = true)
    java.util.List<Object[]> findNodalDetailsRaw(@Param("username") String username);

}
