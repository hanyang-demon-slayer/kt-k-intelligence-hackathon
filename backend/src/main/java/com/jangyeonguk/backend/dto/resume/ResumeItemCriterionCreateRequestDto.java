package com.jangyeonguk.backend.dto.resume;

import com.jangyeonguk.backend.domain.Grade;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.*;

/**
 * 이력서 항목 평가기준 생성 요청 DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResumeItemCriterionCreateRequestDto {

    @NotNull(message = "등급은 필수입니다")
    private Grade grade; // 등급 (우수, 보통 등)
    
    @NotBlank(message = "설명은 필수입니다")
    private String description; // 설명 (예: 박사학위)
    
    @Min(value = 0, message = "등급별 점수는 0 이상이어야 합니다")
    private Integer scorePerGrade; // 등급별 점수
}