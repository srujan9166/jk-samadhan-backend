package com.example.jk_samadhan_backend.repositories;

import com.example.jk_samadhan_backend.models.JkigramsDump;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface JkigramsDumpRepository extends JpaRepository<JkigramsDump, Long>, JpaSpecificationExecutor<JkigramsDump> {
    Optional<JkigramsDump> findByReferenceId(String referenceId);
}
