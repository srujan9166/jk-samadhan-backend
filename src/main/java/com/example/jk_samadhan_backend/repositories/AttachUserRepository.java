package com.example.jk_samadhan_backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.jk_samadhan_backend.models.AttachUser;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttachUserRepository extends JpaRepository<AttachUser, Long> {
    List<AttachUser> findByParentUserId(Long parentUserId);
    List<AttachUser> findByChildUserId(Long childUserId);
    Optional<AttachUser> findByParentUserIdAndChildUserId(Long parentUserId, Long childUserId);
}
