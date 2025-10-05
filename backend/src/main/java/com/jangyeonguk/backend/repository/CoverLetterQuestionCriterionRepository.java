package com.jangyeonguk.backend.repository;

import com.jangyeonguk.backend.domain.coverletter.CoverLetterQuestionCriterion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 자기소개서 질문 평가기준 Repository
 */
@Repository
public interface CoverLetterQuestionCriterionRepository extends JpaRepository<CoverLetterQuestionCriterion, Long> {

    /**
     * 자기소개서 질문 ID로 평가기준 목록 조회
     */
    List<CoverLetterQuestionCriterion> findByCoverLetterQuestionId(Long coverLetterQuestionId);

    /**
     * 자기소개서 질문 ID로 평가기준 목록을 details와 함께 조회 (FETCH JOIN)
     */
    @Query("SELECT DISTINCT clqc FROM CoverLetterQuestionCriterion clqc " +
           "LEFT JOIN FETCH clqc.details " +
           "WHERE clqc.coverLetterQuestion.id = :coverLetterQuestionId")
    List<CoverLetterQuestionCriterion> findByCoverLetterQuestionIdWithDetails(@Param("coverLetterQuestionId") Long coverLetterQuestionId);

    /**
     * 평가기준을 details와 함께 조회 (FETCH JOIN)
     */
    @Query("SELECT DISTINCT clqc FROM CoverLetterQuestionCriterion clqc " +
           "LEFT JOIN FETCH clqc.details " +
           "WHERE clqc.id = :id")
    Optional<CoverLetterQuestionCriterion> findByIdWithDetails(@Param("id") Long id);
}