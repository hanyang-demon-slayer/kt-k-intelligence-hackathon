package com.jangyeonguk.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jangyeonguk.backend.domain.EvaluationResult;

/**
 * 평가 결과 Repository
 */
@Repository
public interface EvaluationResultRepository extends JpaRepository<EvaluationResult, Long> {

    Optional<EvaluationResult> findByApplicationId(Long applicationId);


    List<EvaluationResult> findByJobPostingId(Long jobPostingId);
}