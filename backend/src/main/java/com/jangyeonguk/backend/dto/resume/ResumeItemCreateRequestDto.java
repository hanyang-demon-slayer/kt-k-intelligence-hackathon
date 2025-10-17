package com.jangyeonguk.backend.dto.resume;

import com.jangyeonguk.backend.domain.ResumeItemType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.util.List;

/**
 * 이력서 항목 생성 요청 DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResumeItemCreateRequestDto {

    @NotBlank(message = "항목명은 필수입니다")
    private String name; // 항목명
    
    @NotNull(message = "항목 타입은 필수입니다")
    private ResumeItemType type; // 타입 (숫자, 날짜, 파일, 텍스트)
    
    @NotNull(message = "필수여부는 필수입니다")
    private Boolean isRequired; // 필수여부
    
    @Min(value = 0, message = "최대점수는 0 이상이어야 합니다")
    private Integer maxScore; // 최대점수
    
    @Valid
    private List<ResumeItemCriterionCreateRequestDto> criteria; // 평가기준 목록
}