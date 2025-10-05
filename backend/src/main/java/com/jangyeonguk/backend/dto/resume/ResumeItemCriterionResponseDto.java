package com.jangyeonguk.backend.dto.resume;

import com.jangyeonguk.backend.domain.resume.Grade;
import com.jangyeonguk.backend.domain.resume.ResumeItemCriterion;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 이력서 항목 평가기준 응답 DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResumeItemCriterionResponseDto {

    private Long id;
    private Grade grade; // 등급 (우수, 보통 등)
    private String description; // 설명 (예: 박사학위)
    private Integer scorePerGrade; // 등급별 점수

    /**
     * ResumeItemCriterion 엔티티를 ResumeItemCriterionResponseDto로 변환
     */
    public static ResumeItemCriterionResponseDto from(ResumeItemCriterion criterion) {
        return ResumeItemCriterionResponseDto.builder()
                .id(criterion.getId())
                .grade(criterion.getGrade())
                .description(criterion.getDescription())
                .scorePerGrade(criterion.getScorePerGrade())
                .build();
    }
}