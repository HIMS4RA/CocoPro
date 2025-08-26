package com.cocopro.backend.service;

import com.cocopro.backend.model.IssueReport;
import com.cocopro.backend.repository.IssueReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class IssueReportService {

    private final IssueReportRepository issueReportRepository;

    @Autowired
    public IssueReportService(IssueReportRepository issueReportRepository) {
        this.issueReportRepository = issueReportRepository;
    }

    @Transactional
    public IssueReport save(IssueReport issueReport) {
        return issueReportRepository.save(issueReport);
    }

    @Transactional(readOnly = true)
    public List<IssueReport> findByReporterId(Long reporterId) {
        return issueReportRepository.findByReporterIdWithManager(reporterId);
    }

    @Transactional(readOnly = true)
    public List<IssueReport> findByManagerId(Long managerId) {
        return issueReportRepository.findByManagerIdWithReporter(managerId);
    }

    @Transactional(readOnly = true)
    public Optional<IssueReport> findById(Long id) {
        return issueReportRepository.findById(id);
    }

    @Transactional
    public void deleteById(Long id) {
        issueReportRepository.deleteById(id);
    }

    @Transactional
    public IssueReport updateIssueStatus(Long id, String status) {
        IssueReport issue = issueReportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Issue not found with id: " + id));

        issue.setStatus(status);
        return issueReportRepository.save(issue);
    }

    @Transactional(readOnly = true)
    public boolean existsByIdAndManagerId(Long issueId, Long managerId) {
        return issueReportRepository.existsByIdAndManagerId(issueId, managerId);
    }
}