package com.jangyeonguk.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jangyeonguk.backend.domain.Company;
import com.jangyeonguk.backend.dto.company.CompanyCreateRequestDto;
import com.jangyeonguk.backend.dto.company.CompanyResponseDto;
import com.jangyeonguk.backend.repository.CompanyRepository;

import lombok.RequiredArgsConstructor;

/**
 * 회사 관리 Service
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CompanyService {

    private final CompanyRepository companyRepository;

    /**
     * 회사 생성
     */
    @Transactional
    public CompanyResponseDto createCompany(CompanyCreateRequestDto request) {
        // 이미 등록된 회사가 있는지 확인
        if (companyRepository.existsByName(request.getName())) {
            throw new IllegalArgumentException("이미 등록된 회사입니다: " + request.getName());
        }

        Company company = Company.builder()
                .name(request.getName())
                .build();

        Company savedCompany = companyRepository.save(company);
        return CompanyResponseDto.from(savedCompany);
    }

    /**
     * 첫 번째 회사 조회
     */
    public CompanyResponseDto getFirstCompany() {
        Company company = companyRepository.findAll().stream()
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("등록된 회사가 없습니다."));

        return CompanyResponseDto.from(company);
    }

}