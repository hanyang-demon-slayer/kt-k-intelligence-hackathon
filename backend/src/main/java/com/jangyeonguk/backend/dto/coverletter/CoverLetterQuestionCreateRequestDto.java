package com.jangyeonguk.backend.dto.coverletter;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.util.List;

/**
 * 자기소개서 질문 생성 요청 DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CoverLetterQuestionCreateRequestDto {

    @NotBlank(message = "질문 내용은 필수입니다")
    private String content; // 질문 내용
    
    @NotNull(message = "필수여부는 필수입니다")
    private Boolean isRequired; // 필수여부
    
    @Min(value = 1, message = "최대글자수는 1 이상이어야 합니다")
    private Integer maxCharacters; // 최대글자수
    
    @Valid
    private List<CoverLetterQuestionCriterionCreateRequestDto> criteria; // 평가기준 목록
}