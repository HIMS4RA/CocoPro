package com.cocopro.backend.service;

import com.cocopro.backend.model.Notification;
import com.cocopro.backend.model.Task;
import com.cocopro.backend.model.User;
import com.cocopro.backend.repository.TaskRepository;
import com.cocopro.backend.repository.UserRepository;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Validator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private Validator validator;

    private User getCurrentUser() {
        // In a real application, you would get this from security context
        // For demo purposes, let's return a default user (ID 1)
        Optional<User> currentUser = userRepository.findById(1L);
        return currentUser.orElse(null);
    }

    @Transactional
    public Task assignTask(Task task, Long workerId) {
        if (workerId == null) {
            throw new IllegalArgumentException("Worker ID is required");
        }

        // Get the worker (recipient)
        Optional<User> workerOpt = userRepository.findById(workerId);
        if (!workerOpt.isPresent()) {
            throw new IllegalArgumentException("Worker not found");
        }

        // Get current user (or use default for demo)
        User currentUser = getCurrentUser();
        if (currentUser == null) {
            throw new IllegalArgumentException("Current user could not be determined");
        }

        // Validate the task
        Set<ConstraintViolation<Task>> violations = validator.validate(task);
        if (!violations.isEmpty()) {
            throw new ConstraintViolationException(violations);
        }

        // Additional validation for deadline
        if (task.getDeadline() != null && task.getDeadline().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Task deadline cannot be in the past");
        }

        // Set up the task
        task.setWorker(workerOpt.get());
        task.setSupervisor(currentUser); // Current user is the sender
        task.setAssignedDate(LocalDate.now());
        task.setStatus("pending");

        // Save the task
        Task assignedTask = taskRepository.save(task);

        // Create and send notification with the task attached
        String message = "You have been assigned a new task: " + task.getTitle();
        notificationService.createNotification(workerId, message, "info", assignedTask);

        return assignedTask;
    }

    public List<Task> getWorkerTasks(Long workerId) {
        return taskRepository.findByWorkerId(workerId);
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public Task updateTaskStatus(Long taskId, String status) {
        Optional<Task> taskOpt = taskRepository.findById(taskId);
        if (!taskOpt.isPresent()) {
            throw new IllegalArgumentException("Task not found");
        }

        Task task = taskOpt.get();

        // Validate status
        if (!status.matches("pending|in-progress|completed")) {
            throw new IllegalArgumentException("Invalid status: " + status);
        }

        // Store the old status to check for change
        String oldStatus = task.getStatus();

        task.setStatus(status);
        Task updatedTask = taskRepository.save(task);

        // If status changed to completed, notify the supervisor
        if (task.getSupervisor() != null && "completed".equals(status) && !status.equals(oldStatus)) {
            String message = "Task \"" + task.getTitle() + "\" has been marked as completed";
            notificationService.createNotification(
                    task.getSupervisor().getId(),
                    message,
                    "success",
                    task
            );
        }

        return updatedTask;
    }

    public void sendNotification(Long workerId, String s) {
    }

    /**
     * Check if a task exists by its ID
     * @param taskId The task ID to check
     * @return True if the task exists, false otherwise
     */
    public boolean existsById(Long taskId) {
        return taskRepository.existsById(taskId);
    }
    
    /**
     * Find a task by its ID
     * @param taskId The task ID to find
     * @return Optional containing the task, or empty if not found
     */
    public Optional<Task> findById(Long taskId) {
        return taskRepository.findById(taskId);
    }
    
    /**
     * Delete a task by its ID
     * @param taskId The task ID to delete
     */
    public void deleteById(Long taskId) {
        taskRepository.deleteById(taskId);
    }
    
    /**
     * Create a notification wrapper method that delegates to NotificationService
     * @param userId The user ID to notify
     * @param message The notification message
     * @param type The notification type
     * @param task The associated task (can be null)
     */
    public void createNotification(Long userId, String message, String type, Task task) {
        notificationService.createNotification(userId, message, type, task);
    }

    /**
     * Delete a task and its related notifications to avoid foreign key constraint violations
     * @param taskId The task ID to delete
     */
    public void deleteTaskAndRelatedNotifications(Long taskId) {
        // First get all notifications related to this task and either:
        // 1. Set their task reference to null, or
        // 2. Delete them entirely
        
        // Option 1: Get notifications and set task reference to null
        List<Notification> relatedNotifications = notificationService.getNotificationsByTaskId(taskId);
        for (Notification notification : relatedNotifications) {
            // Set the task reference to null to avoid constraint violation
            notification.setTask(null);
            notificationService.saveNotification(notification);
        }
        
        // Now that the task is no longer referenced, we can delete it
        taskRepository.deleteById(taskId);
    }
}