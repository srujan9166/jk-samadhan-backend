package com.example.jk_samadhan_backend.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.jk_samadhan_backend.models.Users;

@Repository
public interface UserRepository extends JpaRepository<Users,Long> {

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByMobile(String mobile);

    Optional<Users> findByUsername(String username);

    Optional<Users> findByMobile(String mobile);

}
