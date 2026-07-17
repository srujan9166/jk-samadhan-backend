package com.example.jk_samadhan_backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.jk_samadhan_backend.models.AssignedUsers;
import java.util.List;

@Repository
public interface AssignedUsersRepository extends JpaRepository<AssignedUsers, Long> {
    List<AssignedUsers> findByGrievanceId(Long grievanceId);
    List<AssignedUsers> findByAssignedToId(Long assignedToId);
}
