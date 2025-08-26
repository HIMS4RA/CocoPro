// IssueReportRepository.java
package com.cocopro.backend.repository;

import com.cocopro.backend.model.IssueReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IssueReportRepository extends JpaRepository<IssueReport, Long> {

    @Query("SELECT ir FROM IssueReport ir JOIN FETCH ir.manager WHERE ir.reporter.id = :reporterId")
    List<IssueReport> findByReporterIdWithManager(@Param("reporterId") Long reporterId);

    List<IssueReport> findByManagerId(Long managerId);

    @Query("SELECT ir FROM IssueReport ir JOIN FETCH ir.reporter WHERE ir.manager.id = :managerId")
    List<IssueReport> findByManagerIdWithReporter(@Param("managerId") Long managerId);

    boolean existsByIdAndManagerId(Long id, Long managerId);
}