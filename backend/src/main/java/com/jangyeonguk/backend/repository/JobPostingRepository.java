package com.jangyeonguk.backend.repository;

import com.jangyeonguk.backend.domain.jobposting.JobPosting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 채용공고 Repository
 */
@Repository
public interface JobPostingRepository extends JpaRepository<JobPosting, Long> {

    /**
     * 회사 ID로 채용공고 목록 조회
     */
    List<JobPosting> findByCompanyId(Long companyId);

    /**
     * JobPosting과 연관된 모든 데이터를 함께 조회 (resumeItems, coverLetterQuestions)
     * MultipleBagFetchException을 피하기 위해 단계별로 분리
     */
    @Query("SELECT DISTINCT jp FROM JobPosting jp " +
           "LEFT JOIN FETCH jp.resumeItems " +
           "WHERE jp.id = :id")
    Optional<JobPosting> findByIdWithResumeItems(@Param("id") Long id);

    @Query("SELECT DISTINCT jp FROM JobPosting jp " +
           "LEFT JOIN FETCH jp.coverLetterQuestions " +
           "WHERE jp.id = :id")
    Optional<JobPosting> findByIdWithCoverLetterQuestions(@Param("id") Long id);
}