package com.jangyeonguk.backend.repository;

import com.jangyeonguk.backend.domain.coverletter.CoverLetterQuestionAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 자기소개서 질문 답변 Repository
 */
@Repository
public interface CoverLetterQuestionAnswerRepository extends JpaRepository<CoverLetterQuestionAnswer, Long> {
    List<CoverLetterQuestionAnswer> findByApplicationId(Long applicationId);
    List<CoverLetterQuestionAnswer> findByApplicationIdAndCoverLetterQuestionId(Long applicationId, Long coverLetterQuestionId);
}