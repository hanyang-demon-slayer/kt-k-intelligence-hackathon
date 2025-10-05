package com.jangyeonguk.backend.dto.coverletter;

import com.jangyeonguk.backend.domain.resume.Grade;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 자기소개서 질문 평가기준 상세 응답 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CoverLetterQuestionCriterionDetailResponseDto {

    private Long id;
    private Grade grade; // 등급 (우수, 보통 등)
    private String description; // 설명
    private Integer scorePerGrade; // 등급별 점수

    /**
     * CoverLetterQuestionCriterionDetail 엔티티를 CoverLetterQuestionCriterionDetailResponseDto로 변환
     */
    public static CoverLetterQuestionCriterionDetailResponseDto from(com.jangyeonguk.backend.domain.coverletter.CoverLetterQuestionCriterionDetail detail) {
        return CoverLetterQuestionCriterionDetailResponseDto.builder()
                .id(detail.getId())
                .grade(detail.getGrade())
                .description(detail.getDescription())
                .scorePerGrade(detail.getScorePerGrade())
                .build();
    }
}