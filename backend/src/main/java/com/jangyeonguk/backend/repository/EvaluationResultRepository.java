package com.jangyeonguk.backend.repository;

import com.jangyeonguk.backend.domain.EvaluationResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 평가 결과 Repository
 */
@Repository
public interface EvaluationResultRepository extends JpaRepository<EvaluationResult, Long> {

    Optional<EvaluationResult> findByApplicationId(Long applicationId);

    Optional<EvaluationResult> findByApplicantEmailAndJobPostingId(String applicantEmail, Long jobPostingId);

    List<EvaluationResult> findByJobPostingId(Long jobPostingId);
}