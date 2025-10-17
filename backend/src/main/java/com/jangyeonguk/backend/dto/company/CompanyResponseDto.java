package com.jangyeonguk.backend.dto.company;

import com.jangyeonguk.backend.domain.Company;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 회사 응답 DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CompanyResponseDto {
    private Long id;
    private String name;

    /**
     * Company 엔티티로부터 CompanyResponseDto 생성
     */
    public static CompanyResponseDto from(Company company) {
        if (company == null) {
            return null;
        }
        return new CompanyResponseDto(company.getId(), company.getName());
    }
}