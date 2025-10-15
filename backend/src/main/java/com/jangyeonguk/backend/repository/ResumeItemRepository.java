package com.jangyeonguk.backend.repository;

import com.jangyeonguk.backend.domain.ResumeItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 이력서 항목 Repository
 */
@Repository
public interface ResumeItemRepository extends JpaRepository<ResumeItem, Long> {

    /**
     * 채용공고 ID로 이력서 항목 목록 조회
     */
    List<ResumeItem> findByJobPostingId(Long jobPostingId);

    /**
     * 공고별 이력서 항목 삭제
     */
    @Modifying
    @Query("DELETE FROM ResumeItem r WHERE r.jobPosting.id = :jobPostingId")
    void deleteByJobPostingId(@Param("jobPostingId") Long jobPostingId);

    /**
     * 채용공고 ID로 이력서 항목 목록을 평가 기준과 함께 조회 (FETCH JOIN)
     */
    @Query("SELECT DISTINCT ri FROM ResumeItem ri " +
           "LEFT JOIN FETCH ri.criteria " +
           "WHERE ri.jobPosting.id = :jobPostingId")
    List<ResumeItem> findByJobPostingIdWithCriteria(@Param("jobPostingId") Long jobPostingId);

    /**
     * 이력서 항목을 평가 기준과 함께 조회 (FETCH JOIN)
     */
    @Query("SELECT DISTINCT ri FROM ResumeItem ri " +
           "LEFT JOIN FETCH ri.criteria " +
           "WHERE ri.id = :id")
    Optional<ResumeItem> findByIdWithCriteria(@Param("id") Long id);
}