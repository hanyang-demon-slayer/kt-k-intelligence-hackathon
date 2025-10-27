package com.jangyeonguk.backend.service;

import com.jangyeonguk.backend.domain.*;
import com.jangyeonguk.backend.domain.CoverLetterQuestion;
import com.jangyeonguk.backend.domain.CoverLetterQuestionAnswer;
import com.jangyeonguk.backend.domain.EvaluationResult;
import com.jangyeonguk.backend.domain.JobPosting;
import com.jangyeonguk.backend.domain.ResumeItem;
import com.jangyeonguk.backend.domain.ResumeItemAnswer;
import com.jangyeonguk.backend.dto.application.ApplicationCreateRequestDto;
import com.jangyeonguk.backend.dto.application.ApplicationResponseDto;
import com.jangyeonguk.backend.dto.evaluation.EvaluationResultRequestDto;
import com.jangyeonguk.backend.repository.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

/**
 * 지원서 Service
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final ApplicantRepository applicantRepository;
    private final JobPostingRepository jobPostingRepository;
    private final ResumeItemRepository resumeItemRepository;
    private final CoverLetterQuestionRepository coverLetterQuestionRepository;
    private final ResumeItemAnswerRepository resumeItemAnswerRepository;
    private final CoverLetterQuestionAnswerRepository coverLetterQuestionAnswerRepository;
    private final EvaluationResultRepository evaluationResultRepository;
    private final AIScoringService aiScoringService;

    private final ObjectMapper objectMapper;

    /**
     * 지원서 제출
     */
    @Transactional
    public ApplicationResponseDto submitApplication(Long jobPostingId, ApplicationCreateRequestDto request) {
        
        // 채용공고 조회
        JobPosting jobPosting = jobPostingRepository.findById(jobPostingId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 채용공고입니다: " + jobPostingId));

        // 지원자 조회 또는 생성
        Applicant applicant = applicantRepository.findByEmail(request.getApplicantEmail())
                .orElseGet(() -> {
                    Applicant newApplicant = new Applicant();
                    newApplicant.setName(request.getApplicantName());
                    newApplicant.setEmail(request.getApplicantEmail());
                    return applicantRepository.save(newApplicant);
                });

        // 지원서 생성
        Application application = Application.builder()
                .status(ApplicationStatus.BEFORE_EVALUATION)
                .build();
        
        // 양방향 관계 설정
        applicant.addApplication(application);
        jobPosting.addApplication(application);

        // 지원서 저장
        Application savedApplication = applicationRepository.save(application);

        // 이력서 항목 답변 저장
        if (request.getResumeItemAnswers() != null) {
            request.getResumeItemAnswers().forEach(answerDto -> {
                ResumeItem resumeItem = resumeItemRepository.findById(answerDto.getResumeItemId())
                        .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 이력서 항목입니다: " + answerDto.getResumeItemId()));

                ResumeItemAnswer answer = ResumeItemAnswer.builder()
                        .resumeContent(answerDto.getResumeContent())
                        .resumeItem(resumeItem)
                        .build();
                
                // 양방향 관계 설정
                savedApplication.addResumeItemAnswer(answer);
                resumeItemAnswerRepository.save(answer);
            });
        }

        // 자기소개서 질문 답변 저장
        if (request.getCoverLetterQuestionAnswers() != null) {
            request.getCoverLetterQuestionAnswers().forEach(answerDto -> {
                CoverLetterQuestion question = coverLetterQuestionRepository.findById(answerDto.getCoverLetterQuestionId())
                        .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 자기소개서 질문입니다: " + answerDto.getCoverLetterQuestionId()));

                CoverLetterQuestionAnswer answer = CoverLetterQuestionAnswer.builder()
                        .answerContent(answerDto.getAnswerContent())
                        .coverLetterQuestion(question)
                        .build();
                
                // 양방향 관계 설정 
                savedApplication.addCoverLetterQuestionAnswer(answer);
                coverLetterQuestionAnswerRepository.save(answer);
            });
        }

        // AI 평가 요청
        aiScoringService.processApplicationEvaluation(savedApplication, request);

        return ApplicationResponseDto.from(savedApplication);
    }

    /**
     * 평가 결과 처리
     */
    @Transactional
    public void processEvaluationResult(EvaluationResultRequestDto evaluationResult) {
        try {
            // 지원서 조회
            Application application = applicationRepository.findById(evaluationResult.getApplicationId())
                    .orElseThrow(() -> new IllegalArgumentException("지원서를 찾을 수 없습니다."));

            // 지원서 상태를 '평가중'으로 변경
            application.setStatus(ApplicationStatus.IN_PROGRESS);
            applicationRepository.save(application);


            // 평가 결과 저장/업데이트
            Optional<EvaluationResult> existingResult = evaluationResultRepository.findByApplicationId(application.getId());
            
            if (existingResult.isPresent()) {
                // 기존 평가 결과 업데이트
                EvaluationResult existingEntity = existingResult.get();
                existingEntity.setTotalScore(calculateTotalScoreFromEvaluations(evaluationResult));
                existingEntity.setResumeScores(objectMapper.writeValueAsString(evaluationResult.getResumeEvaluations()));
                existingEntity.setCoverLetterScores(objectMapper.writeValueAsString(evaluationResult.getCoverLetterQuestionEvaluations()));
                existingEntity.setOverallEvaluation(objectMapper.writeValueAsString(evaluationResult.getOverallAnalysis()));
                evaluationResultRepository.save(existingEntity);
            } else {
                // 새로운 평가 결과 생성
                EvaluationResult newEntity = EvaluationResult.builder()
                        .application(application)
                        .jobPosting(application.getJobPosting())
                        .totalScore(calculateTotalScoreFromEvaluations(evaluationResult))
                        .resumeScores(objectMapper.writeValueAsString(evaluationResult.getResumeEvaluations()))
                        .coverLetterScores(objectMapper.writeValueAsString(evaluationResult.getCoverLetterQuestionEvaluations()))
                        .overallEvaluation(objectMapper.writeValueAsString(evaluationResult.getOverallAnalysis()))
                        .build();
                evaluationResultRepository.save(newEntity);
            }
        } catch (Exception e) {
            throw new RuntimeException("평가 결과 처리에 실패했습니다: " + e.getMessage());
        }
    }

    /**
     * 평가 결과에서 총점 계산(헬퍼 메서드)
     */
    private Integer calculateTotalScoreFromEvaluations(EvaluationResultRequestDto evaluationResult) {
        int totalScore = 0;
        
        // 이력서 평가 점수 합산
        if (evaluationResult.getResumeEvaluations() != null) {
            totalScore += evaluationResult.getResumeEvaluations().stream()
                    .mapToInt(EvaluationResultRequestDto.ResumeEvaluationDto::getScore)
                    .sum();
        }
    
        
        return totalScore;
    }

    /**
     * 지원서 ID로 상세 조회
     */
    public ApplicationResponseDto getApplicationById(Long applicationId) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new IllegalArgumentException("지원서를 찾을 수 없습니다."));
        return ApplicationResponseDto.from(application);
    }

    /**
     * 모든 지원서 조회
     */
    public List<ApplicationResponseDto> getApplications() {
        List<Application> applications = applicationRepository.findAll();
        return applications.stream()
                .map(ApplicationResponseDto::from)
                .collect(Collectors.toList());
    }

    /**
     * 공고별 지원서 조회
     */
    public List<ApplicationResponseDto> getApplicationsByJobPosting(Long jobPostingId) {
        List<Application> applications = applicationRepository.findByJobPostingId(jobPostingId);
        return applications.stream()
                .map(ApplicationResponseDto::from)
                .collect(Collectors.toList());
    }


    /**
     * 지원서 평가 의견 및 상태 저장
     */
    @Transactional
    public void saveEvaluation(Long applicationId, String comment, String status) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new IllegalArgumentException("지원서를 찾을 수 없습니다."));

        // 평가 상태 저장
        try {
            ApplicationStatus applicationStatus = ApplicationStatus.valueOf(status);
            application.setStatus(applicationStatus);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("유효하지 않은 평가 상태입니다: " + status);
        }

        applicationRepository.save(application);

        // HR 코멘트 저장 (EvaluationResult에 저장)
        Optional<EvaluationResult> evaluationResultOpt = evaluationResultRepository.findByApplicationId(applicationId);
        if (evaluationResultOpt.isPresent()) {
            EvaluationResult evaluationResult = evaluationResultOpt.get();
            evaluationResult.setHrComment(comment);
            evaluationResultRepository.save(evaluationResult);
            log.info("HR 코멘트 저장 완료 - Application ID: {}, Comment: {}", applicationId, comment);
        } else {
            log.warn("평가 결과를 찾을 수 없어 HR 코멘트를 저장할 수 없습니다 - Application ID: {}", applicationId);
        }

        log.info("지원서 평가 저장 완료 - Application ID: {}, Status: {}", applicationId, status);
    }
}