package com.jangyeonguk.backend.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
import com.jangyeonguk.backend.dto.evaluation.EvaluationResultDto;
import com.jangyeonguk.backend.dto.evaluation.EvaluationResultResponseDto;
import com.jangyeonguk.backend.service.ApplicationService;
import com.jangyeonguk.backend.service.AIScoringService;

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
    private final AIScoringService aiScoringService;

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
     * 평가 결과 처리
     */
    @PostMapping("/evaluation-result")
    public ResponseEntity<String> processEvaluationResult(@RequestBody EvaluationResultDto evaluationResult) {
        try {
            log.info("FastAPI로부터 평가 결과 수신 - 지원자: {}, 지원서 ID: {}", evaluationResult.getApplicantName(), evaluationResult.getApplicationId());
            
            // 평가 결과 전체 데이터를 JSON으로 로그 출력
            try {
                com.fasterxml.jackson.databind.ObjectMapper objectMapper = new com.fasterxml.jackson.databind.ObjectMapper();
                String jsonResult = objectMapper.writeValueAsString(evaluationResult);
                log.info("=== FastAPI 평가 결과 전체 데이터 ===");
                log.info("{}", jsonResult);
                log.info("=== 평가 결과 데이터 끝 ===");
            } catch (Exception jsonException) {
                log.error("평가 결과 JSON 변환 실패: {}", jsonException.getMessage());
            }
            
            applicationService.processEvaluationResult(evaluationResult);
            return ResponseEntity.ok("평가 결과가 성공적으로 처리되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("평가 결과 처리에 실패했습니다: " + e.getMessage());
        }
    }

    /**
     * 지원서 ID로 지원자 정보와 답변 조회
     */
    @GetMapping("/{applicationId}/details")
    public ResponseEntity<Map<String, Object>> getApplicationDetails(@PathVariable Long applicationId) {
        try {
            Map<String, Object> response = applicationService.getApplicationDetails(applicationId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    /**
     * 지원서의 자기소개서 문항 데이터 조회
     */
    @GetMapping("/{applicationId}/cover-letter-questions")
    public ResponseEntity<Map<String, Object>> getCoverLetterQuestions(@PathVariable Long applicationId) {
        try {
            Map<String, Object> response = applicationService.getCoverLetterQuestions(applicationId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    /**
     * FastAPI에서 평가 결과 조회 및 저장
     */
    @GetMapping("/{applicationId}/evaluation-result")
    public ResponseEntity<Map<String, Object>> getEvaluationResult(@PathVariable Long applicationId) {
        try {
            log.info("FastAPI에서 평가 결과 조회 및 저장 요청 - Application ID: {}", applicationId);
            
            // 1. FastAPI에서 평가 결과 조회
            Map<String, Object> fastApiResponse = aiScoringService.getEvaluationResultFromAI(applicationId);
            
            // 2. FastAPI 응답이 성공적이고 평가 결과가 있는 경우
            if (fastApiResponse != null && 
                Boolean.TRUE.equals(fastApiResponse.get("success")) && 
                fastApiResponse.get("evaluationResult") != null) {
                
                log.info("FastAPI에서 평가 결과 조회 성공 - Application ID: {}", applicationId);
                
                // 3. FastAPI 응답을 EvaluationResultDto로 변환하여 저장
                try {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> evaluationResultData = (Map<String, Object>) fastApiResponse.get("evaluationResult");
                    EvaluationResultDto evaluationResultDto = convertMapToEvaluationResultDto(evaluationResultData);
                    
                    // 4. 평가 결과를 데이터베이스에 저장
                    log.info("평가 결과 저장 시작 - Application ID: {}", applicationId);
                    applicationService.processEvaluationResult(evaluationResultDto);
                    
                    log.info("평가 결과 저장 완료 - Application ID: {}", applicationId);
                    
                    // 5. 저장된 결과를 응답에 포함
                    fastApiResponse.put("saved", true);
                    fastApiResponse.put("message", "평가 결과를 성공적으로 조회하고 저장했습니다.");
                    
                } catch (Exception saveException) {
                    log.error("평가 결과 저장 실패 - Application ID: {}", applicationId, saveException);
                    fastApiResponse.put("saved", false);
                    fastApiResponse.put("saveError", "평가 결과 저장에 실패했습니다: " + saveException.getMessage());
                }
            } else {
                log.warn("FastAPI에서 평가 결과를 찾을 수 없음 - Application ID: {}", applicationId);
                if (fastApiResponse != null) {
                    fastApiResponse.put("saved", false);
                    fastApiResponse.put("message", "평가 결과를 찾을 수 없습니다. 평가가 아직 완료되지 않았습니다.");
                } else {
                    fastApiResponse = Map.of(
                        "success", false,
                        "saved", false,
                        "message", "FastAPI에서 응답을 받을 수 없습니다."
                    );
                }
            }
            
            return ResponseEntity.ok(fastApiResponse);
        } catch (Exception e) {
            log.error("평가 결과 조회 및 저장 실패 - Application ID: {}", applicationId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", "평가 결과 조회 및 저장에 실패했습니다: " + e.getMessage()));
        }
    }

    /**
     * Object를 Long으로 안전하게 변환하는 헬퍼 메서드
     */
    private Long convertToLong(Object obj) {
        if (obj == null) {
            return 0L;
        }
        if (obj instanceof Number) {
            return ((Number) obj).longValue();
        }
        if (obj instanceof String) {
            try {
                return Long.parseLong((String) obj);
            } catch (NumberFormatException e) {
                log.warn("Long 파싱 실패: {}", obj);
                return 0L;
            }
        }
        log.warn("Long 변환 불가능한 타입: {}", obj.getClass().getSimpleName());
        return 0L;
    }

    /**
     * FastAPI Map 데이터를 EvaluationResultDto로 변환
     */
    private EvaluationResultDto convertMapToEvaluationResultDto(Map<String, Object> evaluationResultData) {
        try {
            // 기본 정보 추출 (안전한 타입 변환)
            Long applicantId = convertToLong(evaluationResultData.get("applicantId"));
            String applicantName = (String) evaluationResultData.get("applicantName");
            String applicantEmail = (String) evaluationResultData.get("applicantEmail");
            Long applicationId = convertToLong(evaluationResultData.get("applicationId"));
            Long jobPostingId = convertToLong(evaluationResultData.get("jobPostingId"));
            
            // 이력서 평가 결과 변환
            List<EvaluationResultDto.ResumeEvaluationDto> resumeEvaluations = new ArrayList<>();
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> resumeEvaluationsData = (List<Map<String, Object>>) evaluationResultData.get("resumeEvaluations");
            if (resumeEvaluationsData != null) {
                resumeEvaluations = resumeEvaluationsData.stream()
                        .map(this::convertToResumeEvaluationDto)
                        .collect(Collectors.toList());
            }
            
            // 자기소개서 평가 결과 변환
            List<EvaluationResultDto.CoverLetterQuestionEvaluationDto> coverLetterEvaluations = new ArrayList<>();
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> coverLetterEvaluationsData = (List<Map<String, Object>>) evaluationResultData.get("coverLetterQuestionEvaluations");
            if (coverLetterEvaluationsData != null) {
                coverLetterEvaluations = coverLetterEvaluationsData.stream()
                        .map(this::convertToCoverLetterQuestionEvaluationDto)
                        .collect(Collectors.toList());
            }
            
            // 종합 분석 변환
            EvaluationResultDto.OverallAnalysisDto overallAnalysis = null;
            @SuppressWarnings("unchecked")
            Map<String, Object> overallAnalysisData = (Map<String, Object>) evaluationResultData.get("overallAnalysis");
            if (overallAnalysisData != null) {
                overallAnalysis = convertToOverallAnalysisDto(overallAnalysisData);
            }
            
            return new EvaluationResultDto(
                    applicantId, applicantName, applicantEmail, applicationId, jobPostingId,
                    resumeEvaluations, coverLetterEvaluations, overallAnalysis
            );
        } catch (Exception e) {
            log.error("Map을 EvaluationResultDto로 변환 실패: {}", e.getMessage(), e);
            throw new RuntimeException("평가 결과 데이터 변환에 실패했습니다.", e);
        }
    }
    
    private EvaluationResultDto.ResumeEvaluationDto convertToResumeEvaluationDto(Map<String, Object> data) {
        // score 안전한 변환
        Integer score = 0;
        Object scoreObj = data.get("score");
        if (scoreObj != null) {
            if (scoreObj instanceof Number) {
                score = ((Number) scoreObj).intValue();
            } else if (scoreObj instanceof String) {
                try {
                    score = Integer.parseInt((String) scoreObj);
                } catch (NumberFormatException e) {
                    log.warn("score 파싱 실패: {}", scoreObj);
                    score = 0;
                }
            }
        }
        
        return new EvaluationResultDto.ResumeEvaluationDto(
                convertToLong(data.get("resumeItemId")),
                (String) data.get("resumeItemName"),
                (String) data.get("resumeContent"),
                score
        );
    }
    
    private EvaluationResultDto.CoverLetterQuestionEvaluationDto convertToCoverLetterQuestionEvaluationDto(Map<String, Object> data) {
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> answerEvaluationsData = (List<Map<String, Object>>) data.get("answerEvaluations");
        List<EvaluationResultDto.CoverLetterAnswerEvaluationDto> answerEvaluations = new ArrayList<>();
        
        if (answerEvaluationsData != null) {
            answerEvaluations = answerEvaluationsData.stream()
                    .map(this::convertToCoverLetterAnswerEvaluationDto)
                    .collect(Collectors.toList());
        }
        
        @SuppressWarnings("unchecked")
        List<String> keywords = (List<String>) data.get("keywords");
        
        return new EvaluationResultDto.CoverLetterQuestionEvaluationDto(
                convertToLong(data.get("coverLetterQuestionId")),
                keywords,
                (String) data.get("summary"),
                answerEvaluations
        );
    }
    
    private EvaluationResultDto.CoverLetterAnswerEvaluationDto convertToCoverLetterAnswerEvaluationDto(Map<String, Object> data) {
        return new EvaluationResultDto.CoverLetterAnswerEvaluationDto(
                (String) data.get("evaluationCriteriaName"),
                (String) data.get("grade"),
                (String) data.get("evaluatedContent"),
                (String) data.get("evaluationReason")
        );
    }
    
    private EvaluationResultDto.OverallAnalysisDto convertToOverallAnalysisDto(Map<String, Object> data) {
        @SuppressWarnings("unchecked")
        List<String> strengths = (List<String>) data.get("strengths");
        @SuppressWarnings("unchecked")
        List<String> improvements = (List<String>) data.get("improvements");
        
        // aiReliability 처리 (String 또는 Number 모두 지원)
        Double aiReliability = 0.0;
        Object aiReliabilityObj = data.get("aiReliability");
        if (aiReliabilityObj != null) {
            if (aiReliabilityObj instanceof Number) {
                aiReliability = ((Number) aiReliabilityObj).doubleValue();
            } else if (aiReliabilityObj instanceof String) {
                try {
                    aiReliability = Double.parseDouble((String) aiReliabilityObj);
                } catch (NumberFormatException e) {
                    log.warn("aiReliability 파싱 실패: {}", aiReliabilityObj);
                    aiReliability = 0.0;
                }
            }
        }
        
        return new EvaluationResultDto.OverallAnalysisDto(
                (String) data.get("overallEvaluation"),
                strengths,
                improvements,
                (String) data.get("aiRecommendation"),
                aiReliability
        );
    }

    /**
     * 지원서의 평가 결과 조회 (데이터베이스에서)
     */
    @GetMapping("/{applicationId}/evaluation-result-db")
    public ResponseEntity<EvaluationResultDto> getApplicationEvaluationResult(@PathVariable Long applicationId) {
        try {
            EvaluationResultDto response = applicationService.getApplicationEvaluationResult(applicationId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    /**
     * ApplicationId로 EvaluationResult 조회 (새로운 API)
     */
    @GetMapping("/{applicationId}/evaluation-result-detail")
    public ResponseEntity<EvaluationResultResponseDto> getEvaluationResultByApplicationId(@PathVariable Long applicationId) {
        try {
            EvaluationResultResponseDto response = applicationService.getEvaluationResultByApplicationId(applicationId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(null);
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

    /**
     * 공고별 지원서 통계 조회
     */
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getApplicationStatistics() {
        try {
            Map<String, Object> statistics = applicationService.getApplicationStatisticsByJobPosting();
            return ResponseEntity.ok(statistics);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "통계 조회에 실패했습니다: " + e.getMessage()));
        }
    }

    /**
     * 공고별 평가 기준 조회
     */
    @GetMapping("/job-postings/{jobPostingId}/evaluation-criteria")
    public ResponseEntity<Map<String, Object>> getEvaluationCriteria(@PathVariable Long jobPostingId) {
        try {
            Map<String, Object> criteria = applicationService.getEvaluationCriteria(jobPostingId);
            return ResponseEntity.ok(criteria);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "평가 기준 조회에 실패했습니다: " + e.getMessage()));
        }
    }

    /**
     * 관리자용 임시 평가 결과 처리 (테스트용)
     */
    @PostMapping("/admin/evaluation-result")
    public ResponseEntity<Map<String, Object>> processEvaluationResultForAdmin(@RequestBody EvaluationResultDto evaluationResult) {
        try {
            // 관리자용 로깅
            System.out.println("=== 관리자용 평가 결과 처리 시작 ===");
            System.out.println("지원자: " + evaluationResult.getApplicantName());
            System.out.println("이메일: " + evaluationResult.getApplicantEmail());
            System.out.println("공고 ID: " + evaluationResult.getJobPostingId());
            System.out.println("지원서 ID: " + evaluationResult.getApplicationId());
            
            // 평가 결과 처리
            applicationService.processEvaluationResultForAdmin(evaluationResult);
            
            Map<String, Object> response = new java.util.HashMap<>();
            response.put("success", true);
            response.put("message", "관리자용 평가 결과가 성공적으로 처리되었습니다.");
            response.put("applicantName", evaluationResult.getApplicantName());
            response.put("jobPostingId", evaluationResult.getJobPostingId());
            response.put("timestamp", java.time.LocalDateTime.now());
            
            System.out.println("=== 관리자용 평가 결과 처리 완료 ===");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("=== 관리자용 평가 결과 처리 실패 ===");
            System.err.println("오류: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> errorResponse = new java.util.HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "관리자용 평가 결과 처리에 실패했습니다: " + e.getMessage());
            errorResponse.put("timestamp", java.time.LocalDateTime.now());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}