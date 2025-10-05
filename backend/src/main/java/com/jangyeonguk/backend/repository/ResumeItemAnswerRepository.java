package com.jangyeonguk.backend.repository;

import com.jangyeonguk.backend.domain.resume.ResumeItemAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 이력서 항목 답변 Repository
 */
@Repository
public interface ResumeItemAnswerRepository extends JpaRepository<ResumeItemAnswer, Long> {
    List<ResumeItemAnswer> findByApplicationId(Long applicationId);
    List<ResumeItemAnswer> findByApplicationIdAndResumeItemId(Long applicationId, Long resumeItemId);
}
