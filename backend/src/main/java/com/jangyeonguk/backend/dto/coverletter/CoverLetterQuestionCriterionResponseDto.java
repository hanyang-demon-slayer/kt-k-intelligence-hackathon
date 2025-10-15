package com.jangyeonguk.backend.dto.coverletter;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 자기소개서 질문 평가기준 응답 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CoverLetterQuestionCriterionResponseDto {

    private Long id;
    private String name;
    private String overallDescription; // 전반적인 설명
    private List<CoverLetterQuestionCriterionDetailResponseDto> details; // 상세 기준 목록

    /**
     * CoverLetterQuestionCriterion 엔티티를 CoverLetterQuestionCriterionResponseDto로 변환
     */
    public static CoverLetterQuestionCriterionResponseDto from(com.jangyeonguk.backend.domain.CoverLetterQuestionCriterion criterion) {
        return CoverLetterQuestionCriterionResponseDto.builder()
                .id(criterion.getId())
                .name(criterion.getName())
                .overallDescription(criterion.getOverallDescription())
                .details(criterion.getDetails().stream()
                        .map(CoverLetterQuestionCriterionDetailResponseDto::from)
                        .collect(Collectors.toList()))
                .build();
    }
}