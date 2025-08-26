package com.cocopro.backend.controller;

import com.cocopro.backend.model.IssueReport;
import com.cocopro.backend.model.User;
import com.cocopro.backend.repository.UserRepository;
import com.cocopro.backend.service.IssueReportService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/issue-reports")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true",
        allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST,
        RequestMethod.PUT, RequestMethod.PATCH, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class IssueReportController {

    @Autowired
    private IssueReportService issueReportService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/save")
    public ResponseEntity<IssueReport> createIssueReport(
            @RequestBody IssueReport issueReport,
            HttpSession session) {
        User reporter = (User) session.getAttribute("user");
        if (reporter == null) {
            return ResponseEntity.status(401).build();
        }

        // Validate workerName
        if (issueReport.getWorkerName() == null || !issueReport.getWorkerName().matches("^[a-zA-Z]+(?: [a-zA-Z]+)?$")) {
            return ResponseEntity.badRequest().build();
        }

        // Fetch manager details
        User manager = userRepository.findById(issueReport.getManager().getId()).orElse(null);
        if (manager == null) {
            return ResponseEntity.badRequest().build();
        }

        issueReport.setReporter(reporter);
        issueReport.setManager(manager);
        issueReport.setStatus("PENDING");
        issueReport.setCreatedAt(LocalDateTime.now());

        IssueReport savedReport = issueReportService.save(issueReport);
        return ResponseEntity.ok(savedReport);
    }

    @GetMapping("/my-reports")
    public ResponseEntity<List<IssueReport>> getMyReports(HttpSession session) {
        User reporter = (User) session.getAttribute("user");
        if (reporter == null) {
            return ResponseEntity.status(401).build();
        }

        List<IssueReport> reports = issueReportService.findByReporterId(reporter.getId());
        // Eagerly fetch manager details
        reports.forEach(report -> {
            report.getManager().getFirstName(); // Trigger fetch
            report.getManager().getLastName();
        });

        return ResponseEntity.ok(reports);
    }

    @GetMapping("/manager")
    public ResponseEntity<List<IssueReport>> getManagerIssues(HttpSession session) {
        User manager = (User) session.getAttribute("user");
        if (manager == null) {
            return ResponseEntity.status(401).build();
        }

        List<IssueReport> issues = issueReportService.findByManagerId(manager.getId());
        // Eagerly fetch reporter details
        issues.forEach(issue -> {
            issue.getReporter().getFirstName(); // Trigger fetch
            issue.getReporter().getLastName();
        });

        return ResponseEntity.ok(issues);
    }

    @PatchMapping("/{id}/status")
    @CrossOrigin(methods = RequestMethod.PATCH) // Explicitly allow PATCH
    public ResponseEntity<IssueReport> updateIssueStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> statusUpdate,
            HttpSession session) {
        User manager = (User) session.getAttribute("user");
        if (manager == null) {
            return ResponseEntity.status(401).build();
        }

        if (!issueReportService.existsByIdAndManagerId(id, manager.getId())) {
            return ResponseEntity.status(403).build();
        }

        IssueReport updatedIssue = issueReportService.updateIssueStatus(id, statusUpdate.get("status"));
        return ResponseEntity.ok(updatedIssue);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIssue(
            @PathVariable Long id,
            HttpSession session) {
        User manager = (User) session.getAttribute("user");
        if (manager == null) {
            return ResponseEntity.status(401).build();
        }

        Optional<IssueReport> existingIssue = issueReportService.findById(id);
        if (existingIssue.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        IssueReport issue = existingIssue.get();
        if (!issue.getManager().getId().equals(manager.getId())) {
            return ResponseEntity.status(403).build();
        }

        issueReportService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}