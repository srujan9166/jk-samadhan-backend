package com.example.jk_samadhan_backend.repositories;

import com.example.jk_samadhan_backend.models.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Integer> {

    @Query(value = "SELECT * FROM jks_3nf.notification WHERE type='NOTIFICATION' AND isactive = 1 " +
            "AND (validtill > CURRENT_TIMESTAMP OR validtill IS NULL) " +
            "AND notificationsentto IN (:allVal, :allDeptsVal, :deptVal) ORDER BY id DESC", nativeQuery = true)
    List<Notification> findActiveNotifications(
            @Param("allVal") String allVal,
            @Param("allDeptsVal") String allDeptsVal,
            @Param("deptVal") String deptVal
    );
}
