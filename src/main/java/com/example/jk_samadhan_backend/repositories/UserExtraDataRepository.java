package com.example.jk_samadhan_backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.jk_samadhan_backend.models.UserExtraData;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserExtraDataRepository extends JpaRepository<UserExtraData, Long> {
    List<UserExtraData> findByUserId(Long userId);
    Optional<UserExtraData> findByUserIdAndDataKey(Long userId, String dataKey);
}
