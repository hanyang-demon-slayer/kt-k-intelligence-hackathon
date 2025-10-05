package com.jangyeonguk.backend.dto.company;

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
    private String name;
}