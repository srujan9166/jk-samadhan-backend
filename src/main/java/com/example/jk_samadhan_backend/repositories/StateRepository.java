package com.example.jk_samadhan_backend.repositories;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.jk_samadhan_backend.models.State;

@Repository
public interface StateRepository extends JpaRepository<State, Integer> {
    Optional<State> findByNameIgnoreCase(String name);

}
