package com.jangyeonguk.backend.controller;

import com.jangyeonguk.backend.dto.company.CompanyCreateRequestDto;
import com.jangyeonguk.backend.dto.company.CompanyResponseDto;
import com.jangyeonguk.backend.service.CompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 회사 Controller
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
    public ResponseEntity<CompanyResponseDto> registerCompany(@RequestBody CompanyCreateRequestDto request) {
        CompanyResponseDto response = companyService.registerCompany(request);
        return ResponseEntity.ok(response);
    }

    /**
     * 회사 조회
     */
    @GetMapping
    public ResponseEntity<CompanyResponseDto> getCompany() {
        CompanyResponseDto response = companyService.getCompany();
        return ResponseEntity.ok(response);
    }
}