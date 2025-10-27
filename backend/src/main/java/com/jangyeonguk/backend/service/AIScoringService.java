package com.jangyeonguk.backend.service;
import com.jangyeonguk.backend.domain.Application;
import com.jangyeonguk.backend.domain.JobPosting;
import com.jangyeonguk.backend.dto.application.ApplicationCreateRequestDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

/**
 * AI 평가 서비스 - 지원서 자동 채점을 담당하는 Service
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AIScoringService {

    @Value("${ai.base-url:http://localhost:8000}")
    private String aiBaseUrl;


    /**
     * 지원서 저장 후 AI 평가 요청 (통합 메서드)
     */
    public void processApplicationEvaluation(Application savedApplication, ApplicationCreateRequestDto request) {
        CompletableFuture.runAsync(() -> {
            try {
                log.info("AI 평가 요청 시작 - Application ID: {}", savedApplication.getId());
                
                // AI에 데이터 전송 (응답 무시)
                sendApplicationDataToAI(savedApplication);
                
                log.info("AI 평가 요청 완료 - Application ID: {} (백그라운드에서 평가 진행)", savedApplication.getId());
                
            } catch (Exception e) {
                log.error("AI 평가 요청 실패 - Application ID: {}", savedApplication.getId(), e);
            }
        });
    }

    /**
     * AI에 지원서 데이터 전송 (Fire-and-Forget)
     */
    private void sendApplicationDataToAI(Application application) {
        String url = aiBaseUrl + "/api/applications/submit";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Application 엔티티를 Map으로 변환 (모든 평가 데이터 포함)
        Map<String, Object> applicationData = new HashMap<>();
        applicationData.put("applicationId", application.getId());
        applicationData.put("applicantName", application.getApplicant().getName());
        applicationData.put("applicantEmail", application.getApplicant().getEmail());
        applicationData.put("jobPostingId", application.getJobPosting().getId());
        
        // 이력서 답변 데이터
        if (application.getResumeItemAnswers() != null) {
            applicationData.put("resumeItemAnswers", application.getResumeItemAnswers().stream()
                .map(answer -> Map.of(
                    "resumeItemId", answer.getResumeItem().getId(),
                    "resumeItemName", answer.getResumeItem().getName(),
                    "resumeContent", answer.getResumeContent()
                ))
                .collect(Collectors.toList()));
        }
        
        // 자기소개서 답변 데이터
        if (application.getCoverLetterQuestionAnswers() != null) {
            applicationData.put("coverLetterQuestionAnswers", application.getCoverLetterQuestionAnswers().stream()
                .map(answer -> Map.of(
                    "coverLetterQuestionId", answer.getCoverLetterQuestion().getId(),
                    "questionContent", answer.getCoverLetterQuestion().getContent(),
                    "answerContent", answer.getAnswerContent()
                ))
                .collect(Collectors.toList()));
        }


        HttpEntity<Map<String, Object>> request = new HttpEntity<>(applicationData, headers);

        RestTemplate restTemplate = new RestTemplate();
        restTemplate.postForObject(url, request, String.class);
    }


    /**
     * JobPosting 생성 후 AI 평가 기준 학습 요청
     */
    public void processJobPostingEvaluation(JobPosting savedJobPosting) {
        Map<String, Object> evaluationData = Map.of(
            "jobPostingId", savedJobPosting.getId(),
            "title", savedJobPosting.getTitle(),
            "companyName", savedJobPosting.getCompany().getName(),
            "jobRole", savedJobPosting.getJobRole(),
            "totalScore", savedJobPosting.getTotalScore(),
            "passingScore", savedJobPosting.getPassingScore()
        );
        
        String url = aiBaseUrl + "/api/job-postings/evaluation-criteria";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(evaluationData, headers);
        
        CompletableFuture.runAsync(() -> {
            try {
                new RestTemplate().postForObject(url, request, String.class);
            } catch (Exception e) {
                log.warn("AI 평가 기준 학습 데이터 전송 실패: {}", e.getMessage());
            }
        });
    }
}
