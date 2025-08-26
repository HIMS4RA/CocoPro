package com.cocopro.backend.repository;

import com.cocopro.backend.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByWorkerId(Long workerId);
    List<Task> findBySupervisorId(Long supervisorId);
}