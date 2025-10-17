package com.jangyeonguk.backend.dto.company;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 회사 생성 요청 DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CompanyCreateRequestDto {
    @NotNull(message = "회사명은 필수입니다.")
    @NotBlank(message = "회사명은 공백일 수 없습니다.")
    private String name;
}