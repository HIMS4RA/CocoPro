package com.cocopro.backend.controller;

import com.cocopro.backend.model.Task;
import com.cocopro.backend.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PATCH, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class TaskController {

    @Autowired
    private TaskService taskService;

    /**
     * Assign a task to a worker - modified to support anyone-to-anyone assignments
     * @param taskRequest The task details including workerId
     * @return The saved task
     */
    @PostMapping("/assign")
    public ResponseEntity<?> assignTask(@RequestBody Map<String, Object> taskRequest) {
        try {
            // Extract workerId from the request
            Long workerId = null;
            if (taskRequest.containsKey("workerId")) {
                workerId = Long.valueOf(taskRequest.get("workerId").toString());
            }

            // Create a new Task object
            Task task = new Task();
            task.setTitle((String) taskRequest.get("title"));
            task.setDescription((String) taskRequest.get("description"));
            task.setDeadline(java.time.LocalDate.parse((String) taskRequest.get("deadline")));
            task.setPriority((String) taskRequest.get("priority"));
            task.setStatus("pending");

            // Call service to assign task (modified service method)
            Task assignedTask = taskService.assignTask(task, workerId);

            // Send notification to the worker
            taskService.sendNotification(workerId, "You have been assigned a new task: " + task.getTitle());

            return ResponseEntity.status(HttpStatus.CREATED).body(assignedTask);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error assigning task: " + e.getMessage());
        }
    }

    /**
     * Get all tasks for a worker
     * @param workerId The worker's ID
     * @return List of tasks
     */
    @GetMapping("/worker/{workerId}")
    public ResponseEntity<List<Task>> getWorkerTasks(@PathVariable Long workerId) {
        List<Task> tasks = taskService.getWorkerTasks(workerId);
        return ResponseEntity.ok(tasks);
    }

    /**
     * Update task status
     * @param taskId The task ID
     * @param statusUpdate Map containing the new status
     * @return Updated task
     */
    @PatchMapping("/{taskId}/status")
    public ResponseEntity<?> updateTaskStatus(
            @PathVariable Long taskId,
            @RequestBody Map<String, String> statusUpdate) {
        try {
            String status = statusUpdate.get("status");
            Task updatedTask = taskService.updateTaskStatus(taskId, status);
            return ResponseEntity.ok(updatedTask);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating task status: " + e.getMessage());
        }
    }

    /**
     * Get all tasks in the system
     * @return List of all tasks
     */
    @GetMapping("/all")
    public ResponseEntity<List<Task>> getAllTasks() {
        List<Task> tasks = taskService.getAllTasks();
        return ResponseEntity.ok(tasks);
    }

    /**
     * Delete a task by ID
     * @param taskId The task ID to delete
     * @return Success message
     */
    @DeleteMapping("/{taskId}")
    public ResponseEntity<?> deleteTask(@PathVariable Long taskId) {
        try {
            // Check if task exists
            if (!taskService.existsById(taskId)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Task not found");
            }
            
            // Get the task before deleting it
            Task task = taskService.findById(taskId).get();
            
            // Create a notification for the worker about task completion
            if (task.getWorker() != null) {
                String message = "Task \"" + task.getTitle() + "\" has been marked as completed";
                taskService.createNotification(
                        task.getWorker().getId(),
                        message,
                        "success",
                        null
                );
                
                // Also notify supervisor
                if (task.getSupervisor() != null) {
                    String supervisorMessage = "Task \"" + task.getTitle() + "\" assigned to " + 
                        task.getWorker().getFirstName() + " has been completed";
                    taskService.createNotification(
                            task.getSupervisor().getId(),
                            supervisorMessage,
                            "info",
                            null
                    );
                }
            }
            
            // Delete the task with proper handling of related notifications
            taskService.deleteTaskAndRelatedNotifications(taskId);
            
            return ResponseEntity.ok(Map.of("message", "Task completed successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting task: " + e.getMessage());
        }
    }
}