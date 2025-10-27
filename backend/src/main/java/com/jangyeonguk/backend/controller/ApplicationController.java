package com.jangyeonguk.backend.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jangyeonguk.backend.dto.application.ApplicationCreateRequestDto;
import com.jangyeonguk.backend.dto.application.ApplicationResponseDto;
import com.jangyeonguk.backend.dto.evaluation.EvaluationResultRequestDto;
import com.jangyeonguk.backend.dto.evaluation.EvaluationResultResponseDto;
import com.jangyeonguk.backend.domain.EvaluationResult;
import com.jangyeonguk.backend.service.ApplicationService;
import com.jangyeonguk.backend.repository.EvaluationResultRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import jakarta.validation.Valid;

/**
 * 지원서 Controller
 */
@Slf4j
@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;
    private final EvaluationResultRepository evaluationResultRepository;

    /**
     * 지원서 제출
     */
    @PostMapping("/job-postings/{jobPostingId}")
    public ResponseEntity<ApplicationResponseDto> submitApplication(
            @PathVariable Long jobPostingId,
            @Valid @RequestBody ApplicationCreateRequestDto request) {
        ApplicationResponseDto response = applicationService.submitApplication(jobPostingId, request);
        return ResponseEntity.ok(response);
    }

    /**
     * 지원서 목록 조회
     */
    @GetMapping
    public ResponseEntity<List<ApplicationResponseDto>> getApplications() {
        List<ApplicationResponseDto> response = applicationService.getApplications();
        return ResponseEntity.ok(response);
    }

    /**
     * 공고별 지원서 조회
     */
    @GetMapping("/job-postings/{jobPostingId}")
    public ResponseEntity<List<ApplicationResponseDto>> getApplicationsByJobPosting(@PathVariable Long jobPostingId) {
        List<ApplicationResponseDto> response = applicationService.getApplicationsByJobPosting(jobPostingId);
        return ResponseEntity.ok(response);
    }

    /**
     * 지원서 상세 조회 (지원자 정보, 답변, 평가 결과 포함)
     */
    @GetMapping("/{applicationId}")
    public ResponseEntity<ApplicationResponseDto> getApplicationDetails(@PathVariable Long applicationId) {
        try {
            ApplicationResponseDto response = applicationService.getApplicationById(applicationId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("지원서 상세 조회 실패 - Application ID: {}", applicationId, e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }


    /**
     * AI 평가 결과 처리 (FastAPI에서 자동 호출)
     * 
     * 호출 흐름:
     * 1. 지원서 제출 → FastAPI로 전송
     * 2. FastAPI에서 AI 평가 수행 (백그라운드)
     * 3. 평가 완료 → send_evaluation_result_to_spring_boot() 호출
     * 4. HTTP POST → /api/applications/evaluation-result
     * 5. 이 메서드 실행 → 평가 결과를 Spring Boot DB에 저장
     * 
     * @param evaluationResult FastAPI에서 전송된 AI 평가 결과
     * @return 처리 결과 메시지
     */
    @PostMapping("/evaluation-result")
    public ResponseEntity<String> processEvaluationResult(@RequestBody EvaluationResultRequestDto evaluationResult) {
        try {
            log.info("FastAPI로부터 평가 결과 수신 - 지원자: {}, 지원서 ID: {}", evaluationResult.getApplicantName(), evaluationResult.getApplicationId());
            
            applicationService.processEvaluationResult(evaluationResult);
            return ResponseEntity.ok("평가 결과가 성공적으로 처리되었습니다.");
        } catch (Exception e) {
            log.error("평가 결과 처리 실패 - 지원자: {}, 지원서 ID: {}", evaluationResult.getApplicantName(), evaluationResult.getApplicationId(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("평가 결과 처리에 실패했습니다: " + e.getMessage());
        }
    }

    /**
     * 평가 결과 조회
     */
    @GetMapping("/{applicationId}/evaluation-result")
    public ResponseEntity<EvaluationResultResponseDto> getEvaluationResult(@PathVariable Long applicationId) {
        try {
            Optional<EvaluationResult> result = evaluationResultRepository.findByApplicationId(applicationId);
            
            if (result.isPresent()) {
                return ResponseEntity.ok(EvaluationResultResponseDto.from(result.get()));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            log.error("평가 결과 조회 실패 - Application ID: {}", applicationId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * 지원서 평가 의견 및 상태 저장
     */
    @PutMapping("/{applicationId}/evaluation")
    public ResponseEntity<String> saveEvaluation(
            @PathVariable Long applicationId,
            @RequestBody Map<String, Object> evaluationData) {
        try {
            String comment = (String) evaluationData.get("comment");
            String status = (String) evaluationData.get("status");

            applicationService.saveEvaluation(applicationId, comment, status);
            return ResponseEntity.ok("평가가 성공적으로 저장되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("평가 저장에 실패했습니다: " + e.getMessage());
        }
    }
}