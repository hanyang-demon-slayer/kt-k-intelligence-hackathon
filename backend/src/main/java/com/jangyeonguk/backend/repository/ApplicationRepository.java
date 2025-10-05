package com.jangyeonguk.backend.repository;

import com.jangyeonguk.backend.domain.application.Applicant;
import com.jangyeonguk.backend.domain.application.Application;
import com.jangyeonguk.backend.domain.application.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 지원서 Repository
 */
@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByJobPostingId(Long jobPostingId);

    List<Application> findByApplicant(Applicant applicant);

    // 추가된 메서드
    Optional<Application> findByApplicantEmailAndJobPostingId(String applicantEmail, Long jobPostingId);
    
    // 공고별 지원서 수 조회
    long countByJobPostingId(Long jobPostingId);
    
    // 공고별 특정 상태의 지원서 수 조회
    long countByJobPostingIdAndStatusIn(Long jobPostingId, List<ApplicationStatus> statuses);

    /**
     * 채용공고 ID로 지원서 목록을 모든 연관 데이터와 함께 조회 (FETCH JOIN)
     */
    @Query("SELECT DISTINCT a FROM Application a " +
           "LEFT JOIN FETCH a.applicant " +
           "LEFT JOIN FETCH a.resumeItemAnswers ria " +
           "LEFT JOIN FETCH a.coverLetterQuestionAnswers clqa " +
           "WHERE a.jobPosting.id = :jobPostingId")
    List<Application> findByJobPostingIdWithAllData(@Param("jobPostingId") Long jobPostingId);

    /**
     * 지원서를 모든 연관 데이터와 함께 조회 (FETCH JOIN)
     */
    @Query("SELECT DISTINCT a FROM Application a " +
           "LEFT JOIN FETCH a.applicant " +
           "LEFT JOIN FETCH a.resumeItemAnswers ria " +
           "LEFT JOIN FETCH a.coverLetterQuestionAnswers clqa " +
           "WHERE a.id = :id")
    Optional<Application> findByIdWithAllData(@Param("id") Long id);

    /**
     * 지원서를 지원자 정보와 함께 조회 (FETCH JOIN)
     */
    @Query("SELECT DISTINCT a FROM Application a " +
           "LEFT JOIN FETCH a.applicant " +
           "WHERE a.id = :id")
    Optional<Application> findByIdWithApplicant(@Param("id") Long id);
}