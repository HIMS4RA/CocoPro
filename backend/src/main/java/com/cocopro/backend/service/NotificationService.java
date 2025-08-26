package com.cocopro.backend.service;

import com.cocopro.backend.model.Notification;
import com.cocopro.backend.model.Task;
import com.cocopro.backend.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    /**
     * Create a new notification
     * @param userId The recipient user ID
     * @param message The notification message
     * @param type The notification type (info, warning, error, success)
     * @param task The associated task (optional)
     * @return The saved notification
     */
    public void createNotification(Long userId, String message, String type, Task task) {
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setMessage(message);
        notification.setType(type);
        notification.setTask(task);
        notification.setRead(false);
        notification.setCreatedAt(java.time.LocalDateTime.now());
        notificationRepository.save(notification);
    }

    /**
     * Get all notifications for a user
     * @param userId The user's ID
     * @return List of notifications
     */
    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    /**
     * Get unread notifications for a user
     * @param userId The user's ID
     * @return List of unread notifications
     */
    public List<Notification> getUnreadNotifications(Long userId) {
        return notificationRepository.findByUserIdAndReadOrderByCreatedAtDesc(userId, false);
    }

    /**
     * Get task-related notifications for a user
     * @param userId The user's ID
     * @return List of task notifications
     */
    public List<Notification> getTaskNotifications(Long userId) {
        return notificationRepository.findByUserIdAndTaskIsNotNullOrderByCreatedAtDesc(userId);
    }

    /**
     * Mark a notification as read
     * @param notificationId The notification ID
     * @return Updated notification
     */
    public Notification markAsRead(Long notificationId) {
        Optional<Notification> notificationOpt = notificationRepository.findById(notificationId);
        if (notificationOpt.isPresent()) {
            Notification notification = notificationOpt.get();
            notification.setRead(true);
            return notificationRepository.save(notification);
        }
        throw new IllegalArgumentException("Notification not found");
    }

    /**
     * Mark all notifications as read for a user
     * @param userId The user's ID
     */
    public void markAllAsRead(Long userId) {
        List<Notification> notifications = notificationRepository.findByUserIdAndReadOrderByCreatedAtDesc(userId, false);
        for (Notification notification : notifications) {
            notification.setRead(true);
            notificationRepository.save(notification);
        }
    }

    /**
     * Delete a notification
     * @param notificationId The notification ID
     */
    public void deleteNotification(Long notificationId) {
        notificationRepository.deleteById(notificationId);
    }

    /**
     * Delete all notifications for a user
     * @param userId The user's ID
     */
    public void clearAllNotifications(Long userId) {
        List<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        notificationRepository.deleteAll(notifications);
    }

    /**
     * Get all notifications for a specific task
     * @param taskId The task ID
     * @return List of notifications related to the task
     */
    public List<Notification> getNotificationsByTaskId(Long taskId) {
        return notificationRepository.findByTaskId(taskId);
    }
    
    /**
     * Save a notification (new or updated)
     * @param notification The notification to save
     * @return The saved notification
     */
    public Notification saveNotification(Notification notification) {
        return notificationRepository.save(notification);
    }
}