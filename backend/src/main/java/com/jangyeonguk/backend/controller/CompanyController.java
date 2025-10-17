package com.jangyeonguk.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jangyeonguk.backend.dto.company.CompanyCreateRequestDto;
import com.jangyeonguk.backend.dto.company.CompanyResponseDto;
import com.jangyeonguk.backend.service.CompanyService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 * 회사 관리 Controller
 */
@RestController
@RequestMapping("/api/companies")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyService companyService;

    /**
     * 회사 등록
     */
    @PostMapping
    public ResponseEntity<CompanyResponseDto> createCompany(@Valid @RequestBody CompanyCreateRequestDto request) {
        CompanyResponseDto response = companyService.createCompany(request);
        return ResponseEntity.ok(response);
    }

    /**
     * 첫 번째 회사 조회
     */
    @GetMapping
    public ResponseEntity<CompanyResponseDto> getFirstCompany() {
        CompanyResponseDto response = companyService.getFirstCompany();
        return ResponseEntity.ok(response);
    }
}