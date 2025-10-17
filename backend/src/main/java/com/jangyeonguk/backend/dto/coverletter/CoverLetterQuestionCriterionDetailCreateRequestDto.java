package com.jangyeonguk.backend.dto.coverletter;

import com.jangyeonguk.backend.domain.Grade;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.*;

/**
 * 자기소개서 질문 평가기준 상세 생성 요청 DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CoverLetterQuestionCriterionDetailCreateRequestDto {

    @NotNull(message = "등급은 필수입니다")
    private Grade grade; // 등급 (우수, 보통 등)
    
    @NotBlank(message = "설명은 필수입니다")
    private String description; // 설명
    
    @Min(value = 0, message = "등급별 점수는 0 이상이어야 합니다")
    private Integer scorePerGrade; // 등급별 점수
}