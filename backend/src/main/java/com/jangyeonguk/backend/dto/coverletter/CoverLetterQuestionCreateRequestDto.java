package com.jangyeonguk.backend.dto.coverletter;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 자기소개서 질문 생성 요청 DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CoverLetterQuestionCreateRequestDto {

    private String content; // 질문 내용
    private Boolean isRequired; // 필수여부
    private Integer maxCharacters; // 최대글자수
    private List<CoverLetterQuestionCriterionCreateRequestDto> criteria; // 평가기준 목록
}