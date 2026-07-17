package com.example.jk_samadhan_backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.jk_samadhan_backend.models.AppealAssignUser;
import java.util.List;

@Repository
public interface AppealAssignUserRepository extends JpaRepository<AppealAssignUser, Long> {
    List<AppealAssignUser> findByAppealId(Long appealId);
    List<AppealAssignUser> findByAssignedToId(Long assignedToId);
}
