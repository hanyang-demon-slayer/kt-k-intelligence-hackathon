package com.jangyeonguk.backend.dto.resume;

import com.jangyeonguk.backend.domain.Grade;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 이력서 항목 평가기준 생성 요청 DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResumeItemCriterionCreateRequestDto {

    private Grade grade; // 등급 (우수, 보통 등)
    private String description; // 설명 (예: 박사학위)
    private Integer scorePerGrade; // 등급별 점수
}