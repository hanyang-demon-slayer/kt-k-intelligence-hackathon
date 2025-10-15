package com.jangyeonguk.backend.repository;

import com.jangyeonguk.backend.domain.CoverLetterQuestionCriterionDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 자기소개서 질문 평가기준 상세 Repository
 */
@Repository
public interface CoverLetterQuestionCriterionDetailRepository extends JpaRepository<CoverLetterQuestionCriterionDetail, Long> {

    /**
     * 자기소개서 질문 평가기준 ID로 상세 목록 조회
     */
    List<CoverLetterQuestionCriterionDetail> findByCoverLetterQuestionCriterionId(Long coverLetterQuestionCriterionId);
}