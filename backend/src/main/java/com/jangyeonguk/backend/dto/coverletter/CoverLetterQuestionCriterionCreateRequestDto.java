package com.jangyeonguk.backend.dto.coverletter;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.util.List;

/**
 * 자기소개서 질문 평가기준 생성 요청 DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CoverLetterQuestionCriterionCreateRequestDto {

    @NotBlank(message = "기준명은 필수입니다")
    private String name;
    
    private String overallDescription; // 전반적인 설명
    
    @Valid
    private List<CoverLetterQuestionCriterionDetailCreateRequestDto> details; // 상세 기준 목록
}