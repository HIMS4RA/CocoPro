package com.cocopro.backend.repository;

import com.cocopro.backend.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Notification> findByUserIdAndReadOrderByCreatedAtDesc(Long userId, boolean read);
    List<Notification> findByUserIdAndTaskIsNotNullOrderByCreatedAtDesc(Long userId);
    List<Notification> findByTaskId(Long taskId);
}