package com.jangyeonguk.backend.dto.coverletter;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 자기소개서 질문 평가기준 생성 요청 DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CoverLetterQuestionCriterionCreateRequestDto {

    private String name;
    private String overallDescription; // 전반적인 설명
    private List<CoverLetterQuestionCriterionDetailCreateRequestDto> details; // 상세 기준 목록
}