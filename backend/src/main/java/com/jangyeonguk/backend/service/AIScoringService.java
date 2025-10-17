package com.jangyeonguk.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jangyeonguk.backend.domain.Application;
import com.jangyeonguk.backend.domain.JobPosting;
import com.jangyeonguk.backend.dto.application.ApplicationCreateRequestDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;
import java.util.ArrayList;

/**
 * AI 평가 서비스 - 지원서 자동 채점을 담당하는 Service
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AIScoringService {

    @Value("${ai.base-url:http://localhost:8000}")
    private String aiBaseUrl;

    private final ObjectMapper objectMapper;

    /**
     * AI로 보낼 지원서 데이터 생성
     */
    public Map<String, Object> createApplicationDataForAI(Application application, ApplicationCreateRequestDto request) {
        Map<String, Object> data = new HashMap<>();

        // 지원자 정보
        data.put("applicantId", application.getApplicant().getId());
        data.put("applicantName", application.getApplicant().getName());
        data.put("applicantEmail", application.getApplicant().getEmail());

        // 지원서 정보
        data.put("applicationId", application.getId());
        data.put("jobPostingId", application.getJobPosting().getId());

        // 이력서 답변 정보
        if (request.getResumeItemAnswers() != null) {
            data.put("resumeItemAnswers", request.getResumeItemAnswers().stream()
                    .map(answer -> {
                        Map<String, Object> answerData = new HashMap<>();
                        answerData.put("resumeItemId", answer.getResumeItemId());
                        answerData.put("resumeItemName", answer.getResumeItemName());
                        answerData.put("resumeContent", answer.getResumeContent());
                        return answerData;
                    })
                    .collect(Collectors.toList()));
        }

        // 자기소개서 답변 정보
        if (request.getCoverLetterQuestionAnswers() != null) {
            data.put("coverLetterQuestionAnswers", request.getCoverLetterQuestionAnswers().stream()
                    .map(answer -> {
                        Map<String, Object> answerData = new HashMap<>();
                        answerData.put("coverLetterQuestionId", answer.getCoverLetterQuestionId());
                        answerData.put("questionContent", answer.getQuestionContent());
                        answerData.put("answerContent", answer.getAnswerContent());
                        return answerData;
                    })
                    .collect(Collectors.toList()));
        }

        // 생성된 데이터 로깅
        try {
            String jsonData = objectMapper.writeValueAsString(data);
            log.info("=== AI로 보낼 지원서 데이터 ===");
            log.info("Application ID: {}", application.getId());
            log.info("Applicant: {} ({})", application.getApplicant().getName(), application.getApplicant().getEmail());
            log.info("Job Posting ID: {}", application.getJobPosting().getId());
            log.info("JSON Data: {}", jsonData);
            log.info("=== AI 데이터 끝 ===");
        } catch (Exception e) {
            log.error("AI 데이터 로깅 실패: {}", e.getMessage());
        }

        return data;
    }

    /**
     * 지원서 저장 후 AI 평가 요청 (통합 메서드)
     */
    public void processApplicationEvaluation(Application savedApplication, ApplicationCreateRequestDto request) {
        // AI로 보낼 데이터 생성
        Map<String, Object> applicationData = createApplicationDataForAI(savedApplication, request);
        
        // 비동기로 평가 요청
        requestEvaluationAsync(savedApplication.getId(), applicationData);
    }

    /**
     * 지원서 평가를 AI에 비동기로 요청
     */
    public void requestEvaluationAsync(Long applicationId, Map<String, Object> applicationData) {
        CompletableFuture.runAsync(() -> {
            try {
                log.info("AI 평가 시작 - Application ID: {}", applicationId);
                
                // AI에 데이터 전송 (응답 무시)
                sendApplicationDataToAI(applicationData);
                
                log.info("AI 평가 요청 완료 - Application ID: {} (백그라운드에서 평가 진행)", applicationId);
                
            } catch (Exception e) {
                log.error("AI 평가 요청 실패 - Application ID: {}", applicationId, e);
            }
        });
    }

    /**
     * AI에 지원서 데이터 전송 (Fire-and-Forget)
     */
    private void sendApplicationDataToAI(Map<String, Object> applicationData) {
        String url = aiBaseUrl + "/api/applications/submit";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // 전송할 데이터 로깅
        try {
            log.info("AI로 전송할 데이터: {}", objectMapper.writeValueAsString(applicationData));
        } catch (Exception e) {
            log.warn("데이터 로깅 실패: {}", e.getMessage());
        }

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(applicationData, headers);

        // 진짜 비동기로 전송 (별도 스레드에서 실행)
        CompletableFuture.runAsync(() -> {
            try {
                // 매우 짧은 타임아웃으로 설정
                org.springframework.http.client.SimpleClientHttpRequestFactory factory = new org.springframework.http.client.SimpleClientHttpRequestFactory();
                factory.setConnectTimeout(3000);  // 3초 연결 타임아웃
                factory.setReadTimeout(3000);     // 3초 읽기 타임아웃
                
                RestTemplate asyncRestTemplate = new RestTemplate(factory);
                asyncRestTemplate.postForObject(url, request, String.class);
                
                log.info("AI로 데이터 전송 완료 (비동기)");
            } catch (Exception e) {
                log.warn("AI 비동기 전송 실패 (무시됨): {}", e.getMessage());
            }
        });
    }

    /**
     * AI에서 평가 결과 조회
     */
    public Map<String, Object> getEvaluationResultFromAI(Long applicationId) {
        try {
            String url = aiBaseUrl + "/api/applications/" + applicationId + "/evaluation-result";
            log.info("AI에서 평가 결과 조회 - URL: {}", url);

            // 짧은 타임아웃으로 설정
            org.springframework.http.client.SimpleClientHttpRequestFactory factory = new org.springframework.http.client.SimpleClientHttpRequestFactory();
            factory.setConnectTimeout(5000);  // 5초 연결 타임아웃
            factory.setReadTimeout(5000);     // 5초 읽기 타임아웃
            
            RestTemplate restTemplate = new RestTemplate(factory);
            @SuppressWarnings("rawtypes")
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                log.info("AI에서 평가 결과 조회 성공 - Application ID: {}", applicationId);
                return response.getBody();
            } else {
                log.warn("AI에서 평가 결과 조회 실패 - Application ID: {}, Status: {}", applicationId, response.getStatusCode());
                return null;
            }
        } catch (Exception e) {
            log.error("AI에서 평가 결과 조회 중 오류 발생 - Application ID: {}", applicationId, e);
            return null;
        }
    }

    /**
     * JobPosting 생성 후 AI 평가 기준 학습 요청
     */
    public void processJobPostingEvaluation(JobPosting savedJobPosting) {
        // AI로 보낼 평가 데이터 생성
        Map<String, Object> evaluationData = createJobPostingEvaluationData(savedJobPosting);
        
        try {
            log.info("AI로 보낼 평가 데이터: {}", objectMapper.writeValueAsString(evaluationData));
        } catch (Exception e) {
            log.warn("평가 데이터 로깅 실패: {}", e.getMessage());
        }
        // AI에 평가 기준 학습 요청
        sendJobPostingDataToAI(evaluationData);
    }

    /**
     * JobPosting 평가 데이터 생성
     */
    private Map<String, Object> createJobPostingEvaluationData(JobPosting jobPosting) {
        Map<String, Object> evaluationData = new HashMap<>();
        
        evaluationData.put("jobPostingId", jobPosting.getId());
        evaluationData.put("title", jobPosting.getTitle());
        evaluationData.put("companyName", jobPosting.getCompany().getName());
        evaluationData.put("jobRole", jobPosting.getJobRole());
        evaluationData.put("totalScore", jobPosting.getTotalScore());
        evaluationData.put("passingScore", jobPosting.getPassingScore());
        evaluationData.put("aiAutomaticEvaluation", jobPosting.getAiAutomaticEvaluation());
        evaluationData.put("manualReview", jobPosting.getManualReview());
        evaluationData.put("timestamp", System.currentTimeMillis());

        // 이력서 항목 데이터
        evaluationData.put("resumeItems", jobPosting.getResumeItems() != null ? 
            jobPosting.getResumeItems().stream()
                .filter(item -> item.getMaxScore() != null && item.getMaxScore() > 0)
                .map(item -> {
                    Map<String, Object> itemData = new HashMap<>();
                    itemData.put("id", item.getId());
                    itemData.put("name", item.getName());
                    itemData.put("type", item.getType());
                    itemData.put("maxScore", item.getMaxScore());
                    itemData.put("isRequired", item.getIsRequired());
                    return itemData;
                })
                .collect(Collectors.toList()) : new ArrayList<>());

        // 자기소개서 질문 데이터
        evaluationData.put("coverLetterQuestions", jobPosting.getCoverLetterQuestions() != null ?
            jobPosting.getCoverLetterQuestions().stream()
                .map(question -> {
                    Map<String, Object> questionData = new HashMap<>();
                    questionData.put("id", question.getId());
                    questionData.put("content", question.getContent());
                    questionData.put("maxCharacters", question.getMaxCharacters());
                    questionData.put("isRequired", question.getIsRequired());
                    return questionData;
                })
                .collect(Collectors.toList()) : new ArrayList<>());

        return evaluationData;
    }

    /**
     * AI에 JobPosting 데이터 전송
     */
    private void sendJobPostingDataToAI(Map<String, Object> evaluationData) {
        String url = aiBaseUrl + "/api/job-postings/evaluation-criteria";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(evaluationData, headers);

        // 비동기로 전송
        CompletableFuture.runAsync(() -> {
            try {
                org.springframework.http.client.SimpleClientHttpRequestFactory factory = new org.springframework.http.client.SimpleClientHttpRequestFactory();
                factory.setConnectTimeout(3000);
                factory.setReadTimeout(3000);
                
                RestTemplate restTemplate = new RestTemplate(factory);
                restTemplate.postForObject(url, request, String.class);
                
                log.info("AI 평가 기준 학습 데이터 전송 완료");
            } catch (Exception e) {
                log.warn("AI 평가 기준 학습 데이터 전송 실패: {}", e.getMessage());
            }
        });
    }
}
