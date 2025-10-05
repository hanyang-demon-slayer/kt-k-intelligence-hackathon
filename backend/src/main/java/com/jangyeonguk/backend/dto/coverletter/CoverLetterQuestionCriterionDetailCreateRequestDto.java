package com.jangyeonguk.backend.dto.coverletter;

import com.jangyeonguk.backend.domain.resume.Grade;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 자기소개서 질문 평가기준 상세 생성 요청 DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CoverLetterQuestionCriterionDetailCreateRequestDto {

    private Grade grade; // 등급 (우수, 보통 등)
    private String description; // 설명
    private Integer scorePerGrade; // 등급별 점수
}