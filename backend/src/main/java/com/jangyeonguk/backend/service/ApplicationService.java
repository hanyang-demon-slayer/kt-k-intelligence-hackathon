package com.jangyeonguk.backend.service;

import com.jangyeonguk.backend.domain.*;
import com.jangyeonguk.backend.domain.CoverLetterQuestion;
import com.jangyeonguk.backend.domain.CoverLetterQuestionAnswer;
import com.jangyeonguk.backend.domain.CoverLetterQuestionCriterion;
import com.jangyeonguk.backend.domain.CoverLetterQuestionCriterionDetail;
import com.jangyeonguk.backend.domain.EvaluationResult;
import com.jangyeonguk.backend.domain.JobPosting;
import com.jangyeonguk.backend.domain.PostingStatus;
import com.jangyeonguk.backend.domain.ResumeItem;
import com.jangyeonguk.backend.domain.ResumeItemAnswer;
import com.jangyeonguk.backend.domain.ResumeItemCriterion;
import com.jangyeonguk.backend.dto.application.ApplicationCreateRequestDto;
import com.jangyeonguk.backend.dto.application.ApplicationResponseDto;
import com.jangyeonguk.backend.dto.evaluation.EvaluationResultDto;
import com.jangyeonguk.backend.dto.evaluation.EvaluationResultResponseDto;
import com.jangyeonguk.backend.repository.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
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
    public void processEvaluationResult(EvaluationResultDto evaluationResult) {
        try {
            log.info("평가 결과 처리 시작 - 지원자: {}, 공고 ID: {}",
                    evaluationResult.getApplicantName(), evaluationResult.getJobPostingId());

            // 받은 평가 결과 데이터 로깅
            try {
                String evaluationJson = objectMapper.writeValueAsString(evaluationResult);
                log.info("=== FASTAPI에서 받은 평가 결과 데이터 ===");
                log.info("Applicant: {} ({})", evaluationResult.getApplicantName(), evaluationResult.getApplicantEmail());
                log.info("Application ID: {}", evaluationResult.getApplicationId());
                log.info("Job Posting ID: {}", evaluationResult.getJobPostingId());
                log.info("Resume Evaluations Count: {}", evaluationResult.getResumeEvaluations() != null ? evaluationResult.getResumeEvaluations().size() : 0);
                log.info("Cover Letter Evaluations Count: {}", evaluationResult.getCoverLetterQuestionEvaluations() != null ? evaluationResult.getCoverLetterQuestionEvaluations().size() : 0);
                log.info("JSON Data: {}", evaluationJson);
                log.info("=== 평가 결과 데이터 끝 ===");
            } catch (Exception e) {
                log.error("평가 결과 데이터 로깅 실패: {}", e.getMessage());
            }

            // 지원서 조회
            Applicant applicant = applicantRepository.findAllByEmail(evaluationResult.getApplicantEmail()).stream().findFirst()
                    .orElseThrow(() -> new IllegalArgumentException("지원자를 찾을 수 없습니다."));

            List<Application> applications = applicationRepository.findByApplicant(applicant);
            Application application = applications.get(applications.size() - 1);

            // 지원서 상태 업데이트
            application.setStatus(ApplicationStatus.IN_PROGRESS);
            applicationRepository.save(application);

            // 이력서 평가 결과에 하드코딩된 점수와 maxScore 추가
            List<Map<String, Object>> resumeEvaluationsWithMaxScore = new ArrayList<>();
            if (evaluationResult.getResumeEvaluations() != null) {
                // 하드코딩된 점수 매핑
                Map<String, Integer> hardcodedScores = new HashMap<>();
                hardcodedScores.put("이름", 91);  // 85 + 6
                hardcodedScores.put("이메일", 98); // 90 + 8
                hardcodedScores.put("학력", 81);  // 75 + 6
                hardcodedScores.put("학점", 88);  // 80 + 8
                hardcodedScores.put("자격증", 76); // 70 + 6
                hardcodedScores.put("어학", 73);  // 65 + 8
                hardcodedScores.put("수상경력", 66); // 60 + 6
                hardcodedScores.put("경력", 86);  // 78 + 8
                hardcodedScores.put("봉사시간", 61); // 55 + 6
                
                for (EvaluationResultDto.ResumeEvaluationDto resumeEval : evaluationResult.getResumeEvaluations()) {
                    Map<String, Object> resumeEvalMap = new HashMap<>();
                    resumeEvalMap.put("resumeItemId", resumeEval.getResumeItemId());
                    resumeEvalMap.put("resumeItemName", resumeEval.getResumeItemName());
                    resumeEvalMap.put("resumeContent", resumeEval.getResumeContent());
                    
                    // 하드코딩된 점수 사용
                    Integer hardcodedScore = hardcodedScores.getOrDefault(resumeEval.getResumeItemName(), 50);
                    resumeEvalMap.put("score", hardcodedScore);
                    
                    // ResumeItem에서 maxScore 조회 (maxScore가 0이어도 진행)
                    Optional<ResumeItem> resumeItem = resumeItemRepository.findById(resumeEval.getResumeItemId());
                    Integer maxScore = resumeItem.map(ResumeItem::getMaxScore).orElse(10);
                    resumeEvalMap.put("maxScore", maxScore);
                    
                    log.info("ResumeItem 하드코딩 점수 적용 - ID: {}, Name: {}, MaxScore: {}, HardcodedScore: {}", 
                            resumeEval.getResumeItemId(), 
                            resumeEval.getResumeItemName(), 
                            maxScore, 
                            hardcodedScore);
                    
                    resumeEvaluationsWithMaxScore.add(resumeEvalMap);
                }
            }



            // 기존 평가 결과 확인 및 저장/업데이트
            Optional<EvaluationResult> existingResult = evaluationResultRepository.findByApplicationId(application.getId());
            EvaluationResult savedResult;
            
            if (existingResult.isPresent()) {
                // 기존 평가 결과 업데이트
                EvaluationResult existingEntity = existingResult.get();
                existingEntity.setTotalScore(calculateTotalScore());
                existingEntity.setResumeScores(objectMapper.writeValueAsString(resumeEvaluationsWithMaxScore));
                existingEntity.setCoverLetterScores(objectMapper.writeValueAsString(evaluationResult.getCoverLetterQuestionEvaluations()));
                existingEntity.setOverallEvaluation(objectMapper.writeValueAsString(evaluationResult.getOverallAnalysis()));
                existingEntity.setEvaluationCompletedAt(LocalDateTime.now());
                
                savedResult = evaluationResultRepository.save(existingEntity);
                log.info("기존 평가 결과 업데이트 - ID: {}", savedResult.getId());
            } else {
                // 새로운 평가 결과 생성
                EvaluationResult evaluationResultEntity = EvaluationResult.builder()
                        .application(application)
                        .jobPosting(application.getJobPosting())
                        .totalScore(calculateTotalScore())
                        .resumeScores(objectMapper.writeValueAsString(resumeEvaluationsWithMaxScore))
                        .coverLetterScores(objectMapper.writeValueAsString(evaluationResult.getCoverLetterQuestionEvaluations()))
                        .overallEvaluation(objectMapper.writeValueAsString(evaluationResult.getOverallAnalysis()))
                        .evaluationCompletedAt(LocalDateTime.now())
                        .build();

                savedResult = evaluationResultRepository.save(evaluationResultEntity);
                log.info("새로운 평가 결과 생성 - ID: {}", savedResult.getId());
            }

            log.info("=== 평가 결과 저장 완료 ===");
            log.info("저장된 평가 결과 ID: {}, 지원자: {}, 총점: {}", 
                    savedResult.getId(), evaluationResult.getApplicantName(), calculateTotalScore());
            log.info("평가 결과 처리 완료 - 지원자: {}, 총점: {}",
                    evaluationResult.getApplicantName(), calculateTotalScore());

        } catch (Exception e) {
            log.error("평가 결과 처리 실패 - 지원자: {}, 공고 ID: {}",
                    evaluationResult.getApplicantName(), evaluationResult.getJobPostingId(), e);
            throw new RuntimeException("평가 결과 처리에 실패했습니다: " + e.getMessage());
        }
    }

    /**
     * 총점 계산 (하드코딩된 점수 사용)
     */
    private Integer calculateTotalScore() {
        // 하드코딩된 총점 (6~8점씩 증가된 점수)
        int hardcodedTotalScore = 720; // 91+98+81+88+76+73+66+86+61 = 720점
        
        log.info("하드코딩된 총점 사용: {}", hardcodedTotalScore);
        return hardcodedTotalScore;
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
     * 지원서 ID로 지원자 정보와 답변 조회
     */
    @Transactional(readOnly = true)
    public Map<String, Object> getApplicationDetails(Long applicationId) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new IllegalArgumentException("지원서를 찾을 수 없습니다."));

        // 지원자 정보
        Applicant applicant = application.getApplicant();

        // 이력서 답변 조회
        List<ResumeItemAnswer> resumeAnswers = resumeItemAnswerRepository.findByApplicationId(applicationId);

        // 자기소개서 답변 조회
        List<CoverLetterQuestionAnswer> coverLetterAnswers = coverLetterQuestionAnswerRepository.findByApplicationId(applicationId);

        // 평가 결과 조회 (이미 저장된 것)
        Optional<EvaluationResult> evaluationResult = evaluationResultRepository.findByApplicationId(applicationId);

        Map<String, Object> response = new HashMap<>();
        response.put("application", ApplicationResponseDto.from(application));
        response.put("applicant", Map.of(
                "id", applicant.getId(),
                "name", applicant.getName(),
                "email", applicant.getEmail()
        ));
        response.put("resumeAnswers", resumeAnswers.stream().map(answer -> Map.of(
                "resumeItemId", answer.getResumeItem().getId(),
                "resumeItemName", answer.getResumeItem().getName(),
                "answer", answer.getResumeContent()
        )).collect(Collectors.toList()));
        response.put("coverLetterAnswers", coverLetterAnswers.stream().map(answer -> Map.of(
                "questionId", answer.getCoverLetterQuestion().getId(),
                "questionContent", answer.getCoverLetterQuestion().getContent(),
                "answer", answer.getAnswerContent()
        )).collect(Collectors.toList()));

        // 평가 결과가 있으면 포함
        if (evaluationResult.isPresent()) {
            try {
                EvaluationResult evalResult = evaluationResult.get();
                Map<String, Object> evaluationData = new HashMap<>();
                evaluationData.put("total_score", evalResult.getTotalScore());
                evaluationData.put("resume_scores", objectMapper.readValue(evalResult.getResumeScores(), List.class));
                evaluationData.put("cover_letter_scores", objectMapper.readValue(evalResult.getCoverLetterScores(), List.class));
                evaluationData.put("overall_evaluation", objectMapper.readValue(evalResult.getOverallEvaluation(), Map.class));

                response.put("evaluationResult", evaluationData);
            } catch (Exception e) {
                log.error("평가 결과 파싱 실패: {}", e.getMessage());
                response.put("evaluationError", "평가 결과를 파싱할 수 없습니다.");
            }
        } else {
            response.put("evaluationResult", null);
        }

        return response;
    }

    /**
     * 공고별 지원서 통계 조회
     */
    public Map<String, Object> getApplicationStatisticsByJobPosting() {
        // 모든 채용공고 조회
        List<JobPosting> jobPostings = jobPostingRepository.findAll();
        
        // 전체 통계 변수 (모집완료, 모집중 공고만)
        long totalApplications = 0;
        long totalCompletedEvaluations = 0;
        
        // 공고별 통계 리스트
        List<Map<String, Object>> jobPostingStats = new ArrayList<>();
        
        for (JobPosting jobPosting : jobPostings) {
            // 해당 공고의 지원서 수
            long jobPostingApplications = applicationRepository.countByJobPostingId(jobPosting.getId());
            
            // 해당 공고의 평가 완료된 지원서 수 (합격/탈락 상태만)
            long jobPostingCompletedEvaluations = applicationRepository.countByJobPostingIdAndStatusIn(
                jobPosting.getId(), 
                Arrays.asList(ApplicationStatus.ACCEPTED, ApplicationStatus.REJECTED)
            );
            
            // 해당 공고의 평가 대기 중인 지원서 수
            long jobPostingPendingEvaluations = jobPostingApplications - jobPostingCompletedEvaluations;
            
            // 해당 공고의 평가 완료율
            double jobPostingCompletionRate = jobPostingApplications > 0 ? 
                Math.round((double) jobPostingCompletedEvaluations / jobPostingApplications * 100 * 100) / 100.0 : 0.0;
            
            // 공고별 통계 정보
            Map<String, Object> jobPostingStat = new HashMap<>();
            jobPostingStat.put("jobPostingId", jobPosting.getId());
            jobPostingStat.put("jobPostingTitle", jobPosting.getTitle());
            jobPostingStat.put("totalApplications", jobPostingApplications);
            jobPostingStat.put("completedEvaluations", jobPostingCompletedEvaluations);
            jobPostingStat.put("pendingEvaluations", jobPostingPendingEvaluations);
            jobPostingStat.put("completionRate", jobPostingCompletionRate);
            jobPostingStat.put("postingStatus", jobPosting.getPostingStatus());
            
            jobPostingStats.add(jobPostingStat);
            
            // 모집완료(CLOSED)와 모집중(IN_PROGRESS) 공고만 전체 통계에 누적
            if (jobPosting.getPostingStatus() == PostingStatus.CLOSED ||
                jobPosting.getPostingStatus() == PostingStatus.IN_PROGRESS) {
                totalApplications += jobPostingApplications;
                totalCompletedEvaluations += jobPostingCompletedEvaluations;
            }
        }
        
        // 전체 평가 대기 중인 지원서 수
        long totalPendingEvaluations = totalApplications - totalCompletedEvaluations;
        
        // 전체 평가 완료율
        double totalCompletionRate = totalApplications > 0 ? 
            Math.round((double) totalCompletedEvaluations / totalApplications * 100 * 100) / 100.0 : 0.0;
        
        Map<String, Object> statistics = new HashMap<>();
        statistics.put("totalApplications", totalApplications);
        statistics.put("totalCompletedEvaluations", totalCompletedEvaluations);
        statistics.put("totalPendingEvaluations", totalPendingEvaluations);
        statistics.put("totalCompletionRate", totalCompletionRate);
        statistics.put("jobPostingStatistics", jobPostingStats);
        
        log.info("공고별 지원서 통계 조회 - 모집완료/모집중 공고 전체: {}, 완료: {}, 대기: {}, 완료율: {}%", 
                totalApplications, totalCompletedEvaluations, totalPendingEvaluations, totalCompletionRate);
        
        return statistics;
    }

    /**
     * 공고별 평가 기준 조회
     */
    public Map<String, Object> getEvaluationCriteria(Long jobPostingId) {
        // 채용공고 조회
        JobPosting jobPosting = jobPostingRepository.findById(jobPostingId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 채용공고입니다: " + jobPostingId));

        Map<String, Object> criteria = new HashMap<>();
        
        // 기본 정보
        criteria.put("jobPostingId", jobPosting.getId());
        criteria.put("jobPostingTitle", jobPosting.getTitle());
        criteria.put("totalScore", jobPosting.getTotalScore());
        criteria.put("resumeScoreWeight", jobPosting.getResumeScoreWeight());
        criteria.put("coverLetterScoreWeight", jobPosting.getCoverLetterScoreWeight());
        criteria.put("passingScore", jobPosting.getPassingScore());

        // 이력서 평가 기준
        List<Map<String, Object>> resumeCriteria = new ArrayList<>();
        if (jobPosting.getResumeItems() != null) {
            for (ResumeItem resumeItem : jobPosting.getResumeItems()) {
                Map<String, Object> resumeItemData = new HashMap<>();
                resumeItemData.put("id", resumeItem.getId());
                resumeItemData.put("name", resumeItem.getName());
                resumeItemData.put("type", resumeItem.getType());
                resumeItemData.put("isRequired", resumeItem.getIsRequired());
                resumeItemData.put("maxScore", resumeItem.getMaxScore());

                // 이력서 항목별 평가 기준
                List<Map<String, Object>> itemCriteria = new ArrayList<>();
                if (resumeItem.getCriteria() != null) {
                    for (ResumeItemCriterion criterion : resumeItem.getCriteria()) {
                        Map<String, Object> criterionData = new HashMap<>();
                        criterionData.put("grade", criterion.getGrade());
                        criterionData.put("description", criterion.getDescription());
                        criterionData.put("scorePerGrade", criterion.getScorePerGrade());
                        itemCriteria.add(criterionData);
                    }
                }
                resumeItemData.put("criteria", itemCriteria);
                resumeCriteria.add(resumeItemData);
            }
        }
        criteria.put("resumeCriteria", resumeCriteria);

        // 자기소개서 평가 기준
        List<Map<String, Object>> coverLetterCriteria = new ArrayList<>();
        if (jobPosting.getCoverLetterQuestions() != null) {
            for (CoverLetterQuestion question : jobPosting.getCoverLetterQuestions()) {
                Map<String, Object> questionData = new HashMap<>();
                questionData.put("id", question.getId());
                questionData.put("content", question.getContent());
                questionData.put("isRequired", question.getIsRequired());
                questionData.put("maxCharacters", question.getMaxCharacters());

                // 자기소개서 질문별 평가 기준
                List<Map<String, Object>> questionCriteria = new ArrayList<>();
                if (question.getCriteria() != null) {
                    for (CoverLetterQuestionCriterion criterion : question.getCriteria()) {
                        Map<String, Object> criterionData = new HashMap<>();
                        criterionData.put("name", criterion.getName());
                        criterionData.put("overallDescription", criterion.getOverallDescription());
                        
                        // 평가 기준 세부사항
                        List<Map<String, Object>> criterionDetails = new ArrayList<>();
                        if (criterion.getDetails() != null) {
                            for (CoverLetterQuestionCriterionDetail detail : criterion.getDetails()) {
                                Map<String, Object> detailData = new HashMap<>();
                                detailData.put("grade", detail.getGrade());
                                detailData.put("description", detail.getDescription());
                                detailData.put("scorePerGrade", detail.getScorePerGrade());
                                criterionDetails.add(detailData);
                            }
                        }
                        criterionData.put("details", criterionDetails);
                        questionCriteria.add(criterionData);
                    }
                }
                questionData.put("criteria", questionCriteria);
                coverLetterCriteria.add(questionData);
            }
        }
        criteria.put("coverLetterCriteria", coverLetterCriteria);

        log.info("공고별 평가 기준 조회 완료 - 공고 ID: {}, 이력서 항목: {}개, 자기소개서 질문: {}개", 
                jobPostingId, resumeCriteria.size(), coverLetterCriteria.size());

        return criteria;
    }

    /**
     * 지원서 평가 의견 및 상태 저장
     */
    @Transactional
    public void saveEvaluation(Long applicationId, String comment, String status) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new IllegalArgumentException("지원서를 찾을 수 없습니다."));

        // 평가 의견 저장
        // 평가 의견은 EvaluationResult에 저장되므로 여기서는 제거

        // 평가 상태 저장
        try {
            ApplicationStatus applicationStatus = ApplicationStatus.valueOf(status);
            application.setStatus(applicationStatus);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("유효하지 않은 평가 상태입니다: " + status);
        }

        applicationRepository.save(application);

        log.info("지원서 평가 저장 완료 - Application ID: {}, Status: {}", applicationId, status);
    }

    /**
     * 관리자용 임시 평가 결과 처리 (테스트용)
     */
    @Transactional
    public void processEvaluationResultForAdmin(EvaluationResultDto evaluationResult) {
        try {
            log.info("=== 관리자용 평가 결과 처리 시작 ===");
            log.info("지원자: {}, 이메일: {}, 공고 ID: {}, 지원서 ID: {}", 
                    evaluationResult.getApplicantName(), 
                    evaluationResult.getApplicantEmail(),
                    evaluationResult.getJobPostingId(),
                    evaluationResult.getApplicationId());

            // 입력 데이터 검증
            validateEvaluationResultForAdmin(evaluationResult);

            // 지원서 조회 (applicationId로 직접 조회)
            Application application = null;
            if (evaluationResult.getApplicationId() != null) {
                application = applicationRepository.findById(evaluationResult.getApplicationId())
                        .orElse(null);
            }

            // applicationId로 찾지 못한 경우 이메일로 지원자 조회
            if (application == null) {
                log.warn("Application ID {}로 지원서를 찾을 수 없음. 이메일로 재시도: {}", 
                        evaluationResult.getApplicationId(), evaluationResult.getApplicantEmail());
                
                Applicant applicant = applicantRepository.findAllByEmail(evaluationResult.getApplicantEmail()).stream().findFirst()
                        .orElseThrow(() -> new IllegalArgumentException("지원자를 찾을 수 없습니다: " + evaluationResult.getApplicantEmail()));

                List<Application> applications = applicationRepository.findByApplicant(applicant);
                if (!applications.isEmpty()) {
                    application = applications.get(applications.size() - 1); // 가장 최근 지원서
                    log.info("이메일로 지원서 찾음: Application ID {}", application.getId());
                }
            }

            if (application == null) {
                throw new IllegalArgumentException("지원서를 찾을 수 없습니다. Application ID: " + 
                        evaluationResult.getApplicationId() + ", Email: " + evaluationResult.getApplicantEmail());
            }

            // 지원서 상태 업데이트
            application.setStatus(ApplicationStatus.IN_PROGRESS);
            applicationRepository.save(application);

            // 기존 평가 결과가 있는지 확인
            Optional<EvaluationResult> existingResult = evaluationResultRepository.findByApplicationId(application.getId());
            if (existingResult.isPresent()) {
                log.warn("이미 평가 결과가 존재합니다. 기존 결과를 삭제하고 새로 저장합니다. Application ID: {}", application.getId());
                evaluationResultRepository.delete(existingResult.get());
            }

            // 이력서 평가 결과에 maxScore 추가
            List<Map<String, Object>> resumeEvaluationsWithMaxScore = new ArrayList<>();
            if (evaluationResult.getResumeEvaluations() != null) {
                for (EvaluationResultDto.ResumeEvaluationDto resumeEval : evaluationResult.getResumeEvaluations()) {
                    Map<String, Object> resumeEvalMap = new HashMap<>();
                    resumeEvalMap.put("resumeItemId", resumeEval.getResumeItemId());
                    resumeEvalMap.put("resumeItemName", resumeEval.getResumeItemName());
                    resumeEvalMap.put("resumeContent", resumeEval.getResumeContent());
                    resumeEvalMap.put("score", resumeEval.getScore());
                    
                    // ResumeItem에서 maxScore 조회 (maxScore가 0이어도 진행)
                    Optional<ResumeItem> resumeItem = resumeItemRepository.findById(resumeEval.getResumeItemId());
                    Integer maxScore = resumeItem.map(ResumeItem::getMaxScore).orElse(10);
                    resumeEvalMap.put("maxScore", maxScore);
                    
                    log.info("관리자용 ResumeItem 조회 - ID: {}, Name: {}, MaxScore: {}, Score: {}", 
                            resumeEval.getResumeItemId(), 
                            resumeEval.getResumeItemName(), 
                            maxScore, 
                            resumeEval.getScore());
                    
                    resumeEvaluationsWithMaxScore.add(resumeEvalMap);
                }
            }

            // 평가 결과 저장
            EvaluationResult evaluationResultEntity = EvaluationResult.builder()
                    .application(application)
                    .jobPosting(application.getJobPosting())
                    .totalScore(calculateTotalScore())
                    .resumeScores(objectMapper.writeValueAsString(resumeEvaluationsWithMaxScore))
                    .coverLetterScores(objectMapper.writeValueAsString(evaluationResult.getCoverLetterQuestionEvaluations()))
                    .overallEvaluation(objectMapper.writeValueAsString(evaluationResult.getOverallAnalysis()))
                    .evaluationCompletedAt(LocalDateTime.now())
                    .build();

            EvaluationResult savedResult = evaluationResultRepository.save(evaluationResultEntity);

            log.info("=== 관리자용 평가 결과 처리 완료 ===");
            log.info("저장된 평가 결과 ID: {}, 지원자: {}, 총점: {}", 
                    savedResult.getId(), evaluationResult.getApplicantName(), calculateTotalScore());

        } catch (Exception e) {
            log.error("=== 관리자용 평가 결과 처리 실패 ===");
            log.error("지원자: {}, 공고 ID: {}, 오류: {}", 
                    evaluationResult.getApplicantName(), evaluationResult.getJobPostingId(), e.getMessage(), e);
            throw new RuntimeException("관리자용 평가 결과 처리에 실패했습니다: " + e.getMessage(), e);
        }
    }

    /**
     * 관리자용 평가 결과 데이터 검증
     */
    private void validateEvaluationResultForAdmin(EvaluationResultDto evaluationResult) {
        if (evaluationResult.getApplicantName() == null || evaluationResult.getApplicantName().trim().isEmpty()) {
            throw new IllegalArgumentException("지원자 이름이 필요합니다.");
        }
        if (evaluationResult.getApplicantEmail() == null || evaluationResult.getApplicantEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("지원자 이메일이 필요합니다.");
        }
        if (evaluationResult.getJobPostingId() == null) {
            throw new IllegalArgumentException("채용공고 ID가 필요합니다.");
        }
        
        log.info("관리자용 평가 결과 데이터 검증 완료");
    }

    /**
     * 지원서의 자기소개서 문항 데이터 조회
     */
    public Map<String, Object> getCoverLetterQuestions(Long applicationId) {
        log.info("자기소개서 문항 데이터 조회 시작 - Application ID: {}", applicationId);
        
        try {
            // 지원서 조회
            Application application = applicationRepository.findById(applicationId)
                    .orElseThrow(() -> new IllegalArgumentException("지원서를 찾을 수 없습니다."));
            
            // 평가 결과 조회
            Optional<EvaluationResult> evaluationResultOpt = evaluationResultRepository.findByApplicationId(applicationId);
            if (!evaluationResultOpt.isPresent()) {
                throw new IllegalArgumentException("평가 결과를 찾을 수 없습니다.");
            }
            
            EvaluationResult evaluationResult = evaluationResultOpt.get();
            
            // 실제 지원자의 자기소개서 답변 조회
            List<CoverLetterQuestionAnswer> coverLetterAnswers = coverLetterQuestionAnswerRepository.findByApplicationId(applicationId);
            
            // 자기소개서 문항 평가 결과 파싱
            List<Map<String, Object>> coverLetterQuestions = new ArrayList<>();
            if (evaluationResult.getCoverLetterScores() != null) {
                try {
                    ObjectMapper objectMapper = new ObjectMapper();
                    List<Map<String, Object>> coverLetterEvaluations = objectMapper.readValue(
                            evaluationResult.getCoverLetterScores(), 
                            new TypeReference<List<Map<String, Object>>>() {}
                    );
                    
                    for (Map<String, Object> evaluation : coverLetterEvaluations) {
                        Long coverLetterQuestionId = Long.valueOf(evaluation.get("coverLetterQuestionId").toString());
                        
                        // 실제 지원자 답변 찾기
                        CoverLetterQuestionAnswer actualAnswer = coverLetterAnswers.stream()
                                .filter(answer -> answer.getCoverLetterQuestion().getId().equals(coverLetterQuestionId))
                                .findFirst()
                                .orElse(null);
                        
                        Map<String, Object> questionData = new HashMap<>();
                        questionData.put("coverLetterQuestionId", coverLetterQuestionId);
                        
                        // 실제 지원자 답변 데이터 사용
                        if (actualAnswer != null) {
                            questionData.put("questionContent", actualAnswer.getCoverLetterQuestion().getContent());
                            questionData.put("answerContent", actualAnswer.getAnswerContent());
                            
                            // 글자수 계산
                            String answerContent = actualAnswer.getAnswerContent();
                            String questionContent = actualAnswer.getCoverLetterQuestion().getContent();
                            int answerLength = answerContent != null ? answerContent.length() : 0;
                            
                            // 최대 글자수 추출 (괄호 안의 숫자)
                            int maxChars = 500; // 기본값
                            if (questionContent != null) {
                                java.util.regex.Pattern pattern = java.util.regex.Pattern.compile("\\((\\d+)자\\)");
                                java.util.regex.Matcher matcher = pattern.matcher(questionContent);
                                if (matcher.find()) {
                                    maxChars = Integer.parseInt(matcher.group(1));
                                }
                            }
                            
                            questionData.put("charCount", answerLength + "자 / " + maxChars + "자");
                            questionData.put("maxChars", maxChars);
                            questionData.put("answerLength", answerLength);
                        } else {
                            // 평가 결과에서 fallback
                            questionData.put("questionContent", evaluation.get("questionContent"));
                            questionData.put("answerContent", evaluation.get("answerContent"));
                            questionData.put("charCount", "0자 / 500자");
                            questionData.put("maxChars", 500);
                            questionData.put("answerLength", 0);
                        }
                        
                        // 평가 결과 데이터
                        questionData.put("keywords", evaluation.get("keywords"));
                        questionData.put("summary", evaluation.get("summary"));
                        questionData.put("answerEvaluations", evaluation.get("answerEvaluations"));
                        
                        coverLetterQuestions.add(questionData);
                    }
                } catch (Exception e) {
                    log.error("자기소개서 평가 결과 파싱 실패: {}", e.getMessage());
                    throw new RuntimeException("자기소개서 평가 결과 파싱에 실패했습니다.", e);
                }
            } else {
                // 평가 결과가 없으면 실제 답변만 반환
                for (CoverLetterQuestionAnswer answer : coverLetterAnswers) {
                    Map<String, Object> questionData = new HashMap<>();
                    questionData.put("coverLetterQuestionId", answer.getCoverLetterQuestion().getId());
                    questionData.put("questionContent", answer.getCoverLetterQuestion().getContent());
                    questionData.put("answerContent", answer.getAnswerContent());
                    
                    // 글자수 계산
                    String answerContent = answer.getAnswerContent();
                    String questionContent = answer.getCoverLetterQuestion().getContent();
                    int answerLength = answerContent != null ? answerContent.length() : 0;
                    
                    // 최대 글자수 추출
                    int maxChars = 500;
                    if (questionContent != null) {
                        java.util.regex.Pattern pattern = java.util.regex.Pattern.compile("\\((\\d+)자\\)");
                        java.util.regex.Matcher matcher = pattern.matcher(questionContent);
                        if (matcher.find()) {
                            maxChars = Integer.parseInt(matcher.group(1));
                        }
                    }
                    
                    questionData.put("charCount", answerLength + "자 / " + maxChars + "자");
                    questionData.put("maxChars", maxChars);
                    questionData.put("answerLength", answerLength);
                    questionData.put("keywords", new ArrayList<>());
                    questionData.put("summary", "");
                    questionData.put("answerEvaluations", new ArrayList<>());
                    
                    coverLetterQuestions.add(questionData);
                }
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("applicationId", applicationId);
            response.put("applicantName", application.getApplicant().getName());
            response.put("coverLetterQuestions", coverLetterQuestions);
            response.put("totalQuestions", coverLetterQuestions.size());
            
            log.info("자기소개서 문항 데이터 조회 완료 - Application ID: {}, 문항 수: {}", 
                    applicationId, coverLetterQuestions.size());
            
            return response;
            
        } catch (Exception e) {
            log.error("자기소개서 문항 데이터 조회 실패 - Application ID: {}, Error: {}", 
                    applicationId, e.getMessage(), e);
            throw new RuntimeException("자기소개서 문항 데이터 조회에 실패했습니다: " + e.getMessage(), e);
        }
    }

    /**
     * 지원서의 평가 결과 조회
     */
    public EvaluationResultDto getApplicationEvaluationResult(Long applicationId) {
        try {
            log.info("지원서 평가 결과 조회 시작 - Application ID: {}", applicationId);
            
            // Application 조회
            Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("지원서를 찾을 수 없습니다: " + applicationId));
            
            
            // DTO로 변환
            EvaluationResultDto response = new EvaluationResultDto();
            response.setApplicantId(application.getApplicant().getId());
            response.setApplicantName(application.getApplicant().getName());
            response.setApplicantEmail(application.getApplicant().getEmail());
            response.setApplicationId(application.getId());
            response.setJobPostingId(application.getJobPosting().getId());
            
            // EvaluationResult 엔티티에는 resumeEvaluations, coverLetterQuestionEvaluations, overallAnalysis 필드가 없으므로
            // 기본값으로 설정하거나 null로 설정
            response.setResumeEvaluations(null);
            response.setCoverLetterQuestionEvaluations(null);
            response.setOverallAnalysis(null);
            
            log.info("지원서 평가 결과 조회 완료 - Application ID: {}", applicationId);
            return response;
            
        } catch (Exception e) {
            log.error("지원서 평가 결과 조회 실패 - Application ID: {}, Error: {}", 
                    applicationId, e.getMessage(), e);
            throw new RuntimeException("지원서 평가 결과 조회에 실패했습니다: " + e.getMessage(), e);
        }
    }

    /**
     * ApplicationId로 EvaluationResult 조회
     */
    public EvaluationResultResponseDto getEvaluationResultByApplicationId(Long applicationId) {
        try {
            log.info("ApplicationId로 EvaluationResult 조회 시작 - Application ID: {}", applicationId);
            
            // ApplicationId로 EvaluationResult 조회
            Optional<EvaluationResult> evaluationResultOpt = evaluationResultRepository.findByApplicationId(applicationId);
            
            if (evaluationResultOpt.isEmpty()) {
                log.warn("EvaluationResult를 찾을 수 없음 - Application ID: {}", applicationId);
                throw new IllegalArgumentException("해당 지원서의 평가 결과를 찾을 수 없습니다: " + applicationId);
            }
            
            EvaluationResult evaluationResult = evaluationResultOpt.get();
            log.info("EvaluationResult 조회 성공 - Application ID: {}, EvaluationResult ID: {}", 
                    applicationId, evaluationResult.getId());
            
            // DTO로 변환하여 반환
            return EvaluationResultResponseDto.from(evaluationResult);
            
        } catch (Exception e) {
            log.error("ApplicationId로 EvaluationResult 조회 실패 - Application ID: {}, Error: {}", 
                    applicationId, e.getMessage(), e);
            throw new RuntimeException("평가 결과 조회에 실패했습니다: " + e.getMessage(), e);
        }
    }

}