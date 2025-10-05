package com.jangyeonguk.backend.repository;

import com.jangyeonguk.backend.domain.coverletter.CoverLetterQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 자기소개서 질문 Repository
 */
@Repository
public interface CoverLetterQuestionRepository extends JpaRepository<CoverLetterQuestion, Long> {

    /**
     * 채용공고 ID로 자기소개서 질문 목록 조회
     */
    List<CoverLetterQuestion> findByJobPostingId(Long jobPostingId);

    /**
     * 공고별 자기소개서 질문 삭제
     */
    @Modifying
    @Query("DELETE FROM CoverLetterQuestion c WHERE c.jobPosting.id = :jobPostingId")
    void deleteByJobPostingId(@Param("jobPostingId") Long jobPostingId);

    /**
     * 채용공고 ID로 자기소개서 질문 목록을 평가 기준과 함께 조회 (FETCH JOIN)
     * MultipleBagFetchException을 피하기 위해 단계별로 분리
     */
    @Query("SELECT DISTINCT clq FROM CoverLetterQuestion clq " +
           "LEFT JOIN FETCH clq.criteria " +
           "WHERE clq.jobPosting.id = :jobPostingId")
    List<CoverLetterQuestion> findByJobPostingIdWithCriteria(@Param("jobPostingId") Long jobPostingId);

    /**
     * 자기소개서 질문을 평가 기준과 함께 조회 (FETCH JOIN)
     * MultipleBagFetchException을 피하기 위해 단계별로 분리
     */
    @Query("SELECT DISTINCT clq FROM CoverLetterQuestion clq " +
           "LEFT JOIN FETCH clq.criteria " +
           "WHERE clq.id = :id")
    Optional<CoverLetterQuestion> findByIdWithCriteria(@Param("id") Long id);
}