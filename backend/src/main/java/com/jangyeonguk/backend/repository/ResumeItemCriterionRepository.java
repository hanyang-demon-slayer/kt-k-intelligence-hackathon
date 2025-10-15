package com.jangyeonguk.backend.repository;

import com.jangyeonguk.backend.domain.ResumeItemCriterion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 이력서 항목 평가기준 Repository
 */
@Repository
public interface ResumeItemCriterionRepository extends JpaRepository<ResumeItemCriterion, Long> {

    /**
     * 이력서 항목 ID로 평가기준 목록 조회
     */
    List<ResumeItemCriterion> findByResumeItemId(Long resumeItemId);
}