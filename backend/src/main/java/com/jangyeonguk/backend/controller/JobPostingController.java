package com.jangyeonguk.backend.controller;

import com.jangyeonguk.backend.dto.jobposting.JobPostingCreateRequestDto;
import com.jangyeonguk.backend.dto.jobposting.JobPostingResponseDto;
import com.jangyeonguk.backend.service.JobPostingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;

/**
 * 채용공고 Controller
 */
@RestController
@RequestMapping("/api/job-postings")
@RequiredArgsConstructor
public class JobPostingController {

    private final JobPostingService jobPostingService;

    /**
     * 채용공고 등록
     */
    @PostMapping
    public ResponseEntity<JobPostingResponseDto> createJobPosting(@Valid @RequestBody JobPostingCreateRequestDto request) {
        JobPostingResponseDto response = jobPostingService.createJobPosting(request);
        return ResponseEntity.ok(response);
    }

    /**
     * 채용공고 조회
     */
    @GetMapping("/{id}")
    public ResponseEntity<JobPostingResponseDto> getJobPosting(@PathVariable Long id) {
        JobPostingResponseDto response = jobPostingService.getJobPosting(id);
        return ResponseEntity.ok(response);
    }

    /**
     * 채용공고 목록 조회
     */
    @GetMapping
    public ResponseEntity<List<JobPostingResponseDto>> getJobPostings() {
        List<JobPostingResponseDto> response = jobPostingService.getJobPostings();
        return ResponseEntity.ok(response);
    }


    /**
     * 채용공고 수정
     */
    @PutMapping("/{id}")
    public ResponseEntity<JobPostingResponseDto> updateJobPosting(
            @PathVariable Long id,
            @RequestBody JobPostingCreateRequestDto request) {
        JobPostingResponseDto response = jobPostingService.updateJobPosting(id, request);
        return ResponseEntity.ok(response);
    }

    /**
     * 채용공고와 모든 지원서 데이터 조회 (통합 API)
     */
    @GetMapping("/{id}/with-applications")
    public ResponseEntity<JobPostingResponseDto> getJobPostingWithApplications(@PathVariable Long id) {
        JobPostingResponseDto response = jobPostingService.getJobPostingWithApplications(id);
        return ResponseEntity.ok(response);
    }

    /**
     * 공고별 평가 기준 조회
     */
    @GetMapping("/{jobPostingId}/evaluation-criteria")
    public ResponseEntity<Map<String, Object>> getEvaluationCriteria(@PathVariable Long jobPostingId) {
        try {
            Map<String, Object> criteria = jobPostingService.getEvaluationCriteria(jobPostingId);
            return ResponseEntity.ok(criteria);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "평가 기준 조회에 실패했습니다: " + e.getMessage()));
        }
    }

}