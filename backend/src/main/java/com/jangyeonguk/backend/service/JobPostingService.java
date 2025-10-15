package com.jangyeonguk.backend.service;

import com.jangyeonguk.backend.domain.Application;
import com.jangyeonguk.backend.domain.CoverLetterQuestion;
import com.jangyeonguk.backend.domain.CoverLetterQuestionCriterion;
import com.jangyeonguk.backend.domain.CoverLetterQuestionCriterionDetail;
import com.jangyeonguk.backend.domain.Company;
import com.jangyeonguk.backend.domain.JobPosting;
import com.jangyeonguk.backend.domain.PostingStatus;
import com.jangyeonguk.backend.domain.ResumeItem;
import com.jangyeonguk.backend.domain.ResumeItemCriterion;
import com.jangyeonguk.backend.dto.jobposting.JobPostingCreateRequestDto;
import com.jangyeonguk.backend.dto.jobposting.JobPostingResponseDto;
import com.jangyeonguk.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 채용공고 Service
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class JobPostingService {

    private final JobPostingRepository jobPostingRepository;
    private final ApplicationRepository applicationRepository;
    private final ResumeItemRepository resumeItemRepository;
    private final ResumeItemCriterionRepository resumeItemCriterionRepository;
    private final CoverLetterQuestionRepository coverLetterQuestionRepository;
    private final CoverLetterQuestionCriterionRepository coverLetterQuestionCriterionRepository;
    private final CoverLetterQuestionCriterionDetailRepository coverLetterQuestionCriterionDetailRepository;
    private final CompanyRepository companyRepository;


    @Value("${fastapi.base-url:http://localhost:8000}")
    private String fastApiBaseUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * 채용공고 등록
     */
    @Transactional
    public JobPostingResponseDto createJobPosting(JobPostingCreateRequestDto request) {
        // 회사 조회
        Company company = companyRepository.findAll().stream()
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("등록된 회사가 없습니다."));

        // JobPosting 엔티티 생성 및 저장
        JobPosting jobPosting = JobPosting.builder()
                .title(request.getTitle())
                .teamDepartment(request.getTeamDepartment())
                .jobRole(request.getJobRole())
                .employmentType(request.getEmploymentType())
                .applicationStartDate(request.getApplicationStartDate() != null ? request.getApplicationStartDate().atStartOfDay() : null)
                .applicationEndDate(request.getApplicationEndDate() != null ? request.getApplicationEndDate().atStartOfDay() : null)
                .evaluationEndDate(request.getEvaluationEndDate() != null ? request.getEvaluationEndDate().atStartOfDay() : null)
                .description(request.getDescription())
                .experienceRequirements(request.getExperienceRequirements())
                .educationRequirements(request.getEducationRequirements())
                .requiredSkills(request.getRequiredSkills())
                .totalScore(request.getTotalScore())
                .resumeScoreWeight(request.getResumeScoreWeight())
                .coverLetterScoreWeight(request.getCoverLetterScoreWeight())
                .passingScore(request.getPassingScore())
                .aiAutomaticEvaluation(request.getAiAutomaticEvaluation())
                .manualReview(request.getManualReview())
                .postingStatus(request.getPostingStatus())
                .company(company)
                .build();

        JobPosting savedJobPosting = jobPostingRepository.save(jobPosting);

        // 날짜에 따라 초기 상태 설정
        PostingStatus initialStatus = determinePostingStatus(savedJobPosting, LocalDateTime.now());
        savedJobPosting.setPostingStatus(initialStatus);
        
        // 공개 링크 URL 생성 (저장된 ID 사용)
        String publicLinkUrl = generatePublicLinkUrl(savedJobPosting.getId());
        savedJobPosting.setPublicLinkUrl(publicLinkUrl);
        jobPostingRepository.save(savedJobPosting);

        // ResumeItems 저장
        if (request.getResumeItems() != null) {
            request.getResumeItems().forEach(resumeItemDto -> {
                ResumeItem resumeItem = ResumeItem.builder()
                        .name(resumeItemDto.getName())
                        .type(resumeItemDto.getType())
                        .isRequired(resumeItemDto.getIsRequired())
                        .maxScore(resumeItemDto.getMaxScore())
                        .jobPosting(savedJobPosting)
                        .build();

                ResumeItem savedResumeItem = resumeItemRepository.save(resumeItem);

                // ResumeItemCriterions 저장
                if (resumeItemDto.getCriteria() != null) {
                    resumeItemDto.getCriteria().forEach(criterionDto -> {
                        ResumeItemCriterion criterion = ResumeItemCriterion.builder()
                                .grade(criterionDto.getGrade())
                                .description(criterionDto.getDescription())
                                .scorePerGrade(criterionDto.getScorePerGrade())
                                .resumeItem(savedResumeItem)
                                .build();

                        resumeItemCriterionRepository.save(criterion);
                    });
                }
            });
        }

        // CoverLetterQuestions 저장
        if (request.getCoverLetterQuestions() != null) {
            request.getCoverLetterQuestions().forEach(questionDto -> {
                CoverLetterQuestion question = CoverLetterQuestion.builder()
                        .content(questionDto.getContent())
                        .isRequired(questionDto.getIsRequired())
                        .maxCharacters(questionDto.getMaxCharacters())
                        .jobPosting(savedJobPosting)
                        .build();

                CoverLetterQuestion savedQuestion = coverLetterQuestionRepository.save(question);

                // CoverLetterQuestionCriterions 저장 부분 수정
                if (questionDto.getCriteria() != null && !questionDto.getCriteria().isEmpty()) {
                    questionDto.getCriteria().forEach(criterionDto -> {
                        // name과 overallDescription이 null이 아닌 경우에만 저장
                        if (criterionDto.getName() != null && !criterionDto.getName().trim().isEmpty()) {
                            CoverLetterQuestionCriterion criterion = CoverLetterQuestionCriterion.builder()
                                    .name(criterionDto.getName())
                                    .overallDescription(criterionDto.getOverallDescription())
                                    .coverLetterQuestion(savedQuestion)
                                    .build();

                            CoverLetterQuestionCriterion savedCriterion = coverLetterQuestionCriterionRepository.save(criterion);

                            // CoverLetterQuestionCriterionDetails 저장
                            if (criterionDto.getDetails() != null && !criterionDto.getDetails().isEmpty()) {
                                criterionDto.getDetails().forEach(detailDto -> {
                                    CoverLetterQuestionCriterionDetail detail = CoverLetterQuestionCriterionDetail.builder()
                                            .grade(detailDto.getGrade())
                                            .description(detailDto.getDescription())
                                            .scorePerGrade(detailDto.getScorePerGrade())
                                            .coverLetterQuestionCriterion(savedCriterion)
                                            .build();

                                    coverLetterQuestionCriterionDetailRepository.save(detail);
                                });
                            }
                        }
                    });
                }
            });
        }

        // JobPostingResponseDto 생성
        JobPostingResponseDto response = JobPostingResponseDto.from(savedJobPosting);

        // FAST API에 평가 기준 학습 요청 (동기)
        try {
            log.info("평가 기준 학습 시작 - JobPosting ID: {}", savedJobPosting.getId());

            // 강제로 모든 연관 데이터를 일일이 조회하여 로딩
            JobPosting completeJobPosting = jobPostingRepository.findById(savedJobPosting.getId())
                    .orElseThrow(() -> new RuntimeException("JobPosting not found: " + savedJobPosting.getId()));
            
            // ResumeItems 강제 로딩
            List<ResumeItem> resumeItems = resumeItemRepository.findByJobPostingIdWithCriteria(savedJobPosting.getId());
            log.info("Loaded ResumeItems count: {}", resumeItems.size());
            
            // 각 ResumeItem의 criteria를 일일이 조회하여 로딩
            resumeItems.forEach(resumeItem -> {
                List<ResumeItemCriterion> criteria = resumeItemCriterionRepository.findByResumeItemId(resumeItem.getId());
                resumeItem.setCriteria(criteria);
                log.info("Loaded criteria for ResumeItem {} ({}): {} criteria", resumeItem.getId(), resumeItem.getName(), criteria.size());
            });
            
            completeJobPosting.setResumeItems(resumeItems);
            
            // CoverLetterQuestions 강제 로딩
            List<CoverLetterQuestion> coverLetterQuestions = coverLetterQuestionRepository.findByJobPostingIdWithCriteria(savedJobPosting.getId());
            log.info("Loaded CoverLetterQuestions count: {}", coverLetterQuestions.size());
            
            // CoverLetterQuestionCriterion의 criteria와 details 강제 로딩
            coverLetterQuestions.forEach(question -> {
                // 1단계: CoverLetterQuestionCriterion 로딩
                List<CoverLetterQuestionCriterion> criteria = coverLetterQuestionCriterionRepository.findByCoverLetterQuestionId(question.getId());
                log.info("Loaded criteria for CoverLetterQuestion {}: {} criteria", question.getId(), criteria.size());
                
                // 2단계: 각 Criterion의 details 로딩
                criteria.forEach(criterion -> {
                    List<CoverLetterQuestionCriterionDetail> details = 
                            coverLetterQuestionCriterionDetailRepository.findByCoverLetterQuestionCriterionId(criterion.getId());
                    criterion.setDetails(details);
                    log.info("Loaded details for criterion {} ({}): {} details", criterion.getId(), criterion.getName(), details.size());
                });
                
                question.setCriteria(criteria);
            });
            
            completeJobPosting.setCoverLetterQuestions(coverLetterQuestions);
            
            // 완전한 데이터를 직접 전달하여 FastAPI 데이터 생성
            Map<String, Object> evaluationData = createFastApiEvaluationData(completeJobPosting);
            log.info("FastAPI로 전송할 JSON 데이터: {}", evaluationData);
            String fastApiResponse = sendEvaluationDataToFastApi(evaluationData);

            log.info("평가 기준 학습 완료 - JobPosting ID: {}, Response: {}", savedJobPosting.getId(), fastApiResponse);

        } catch (Exception e) {
            log.error("FAST API 연동 실패 - JobPosting ID: {}", savedJobPosting.getId(), e);
            throw new RuntimeException("평가 기준 학습에 실패했습니다: " + e.getMessage());
        }

        return response;
    }

    /**
     * 완전한 JobPosting 데이터로 FastAPI 평가 데이터 생성
     */
    private Map<String, Object> createFastApiEvaluationData(JobPosting jobPosting) {
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

        // 이력서 항목 데이터 (강제로 로딩)
        log.info("Processing ResumeItems - count: {}", jobPosting.getResumeItems() != null ? jobPosting.getResumeItems().size() : 0);
        if (jobPosting.getResumeItems() != null && !jobPosting.getResumeItems().isEmpty()) {
            evaluationData.put("resumeItems", jobPosting.getResumeItems().stream()
                    .filter(item -> {
                        // 이름, 이메일 등 점수 관련 내용이 없는 항목은 제외
                        String itemName = item.getName();
                        if ("이름".equals(itemName) || "이메일".equals(itemName)) {
                            return false;
                        }
                        
                        // maxScore가 0인 경우만 제외 (평가 기준이 없어도 포함)
                        if (item.getMaxScore() == null || item.getMaxScore() == 0) {
                            return false;
                        }
                        
                        return true;
                    })
                    .map(item -> {
                        Map<String, Object> itemData = new HashMap<>();
                        itemData.put("id", item.getId());
                        itemData.put("name", item.getName());
                        itemData.put("type", item.getType());
                        itemData.put("scoreWeight", item.getMaxScore()); // maxScore를 scoreWeight로 사용
                        itemData.put("isRequired", item.getIsRequired());

                        // 평가 기준 데이터 (없어도 빈 배열로 포함)
                        if (item.getCriteria() != null && !item.getCriteria().isEmpty()) {
                            itemData.put("criteria", item.getCriteria().stream()
                                    .map(criterion -> {
                                        Map<String, Object> criterionData = new HashMap<>();
                                        criterionData.put("grade", criterion.getGrade());
                                        criterionData.put("description", criterion.getDescription());
                                        criterionData.put("scorePerGrade", criterion.getScorePerGrade());
                                        return criterionData;
                                    })
                                    .collect(Collectors.toList()));
                        } else {
                            itemData.put("criteria", new ArrayList<>());
                        }

                        return itemData;
                    })
                    .collect(Collectors.toList()));
        } else {
            evaluationData.put("resumeItems", new ArrayList<>());
            log.info("No ResumeItems found, setting empty array");
        }

        // 자기소개서 질문 데이터 (강제로 로딩)
        log.info("Processing CoverLetterQuestions - count: {}", jobPosting.getCoverLetterQuestions() != null ? jobPosting.getCoverLetterQuestions().size() : 0);
        if (jobPosting.getCoverLetterQuestions() != null && !jobPosting.getCoverLetterQuestions().isEmpty()) {
            evaluationData.put("coverLetterQuestions", jobPosting.getCoverLetterQuestions().stream()
                    .map(question -> {
                        Map<String, Object> questionData = new HashMap<>();
                        questionData.put("id", question.getId());
                        questionData.put("content", question.getContent());
                        questionData.put("isRequired", question.getIsRequired());
                        questionData.put("maxCharacters", question.getMaxCharacters());

                        // 평가 기준 데이터 (새로운 구조: criteria -> details)
                        if (question.getCriteria() != null && !question.getCriteria().isEmpty()) {
                            questionData.put("criteria", question.getCriteria().stream()
                                    .map(criterion -> {
                                        Map<String, Object> criterionData = new HashMap<>();
                                        criterionData.put("name", criterion.getName());

                                        // 상세 기준 데이터를 details로 변경
                                        if (criterion.getDetails() != null && !criterion.getDetails().isEmpty()) {
                                            criterionData.put("details", criterion.getDetails().stream()
                                                    .map(detail -> {
                                                        Map<String, Object> detailData = new HashMap<>();
                                                        detailData.put("grade", detail.getGrade());
                                                        detailData.put("description", detail.getDescription());
                                                        // score_per_grade는 자기소개서에서는 제거 (새로운 구조에 없음)
                                                        return detailData;
                                                    })
                                                    .collect(Collectors.toList()));
                                        } else {
                                            criterionData.put("details", new ArrayList<>());
                                        }

                                        return criterionData;
                                    })
                                    .collect(Collectors.toList()));
                        } else {
                            questionData.put("criteria", new ArrayList<>());
                        }

                        return questionData;
                    })
                    .collect(Collectors.toList()));
        } else {
            evaluationData.put("coverLetterQuestions", new ArrayList<>());
            log.info("No CoverLetterQuestions found, setting empty array");
        }

        return evaluationData;
    }

    /**
     * FAST API에 평가 기준 데이터 전송 (동기)
     */
    private String sendEvaluationDataToFastApi(Map<String, Object> evaluationData) {
        try {
            String url = fastApiBaseUrl + "/api/evaluation-criteria/train";
            log.info("FastAPI로 데이터 전송 시작 - URL: {}, Data: {}", url, evaluationData);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(evaluationData, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                return response.getBody();
            } else {
                throw new RuntimeException("FAST API 응답 오류: " + response.getStatusCode());
            }

        } catch (Exception e) {
            log.error("FAST API 통신 실패", e);
            throw new RuntimeException("FAST API 통신 실패: " + e.getMessage());
        }
    }

    /**
     * 채용공고 조회
     */
    public JobPostingResponseDto getJobPosting(Long id) {
        JobPosting jobPosting = jobPostingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 채용공고입니다: " + id));

        return JobPostingResponseDto.from(jobPosting);
    }

    /**
     * 채용공고 목록 조회
     */
    public List<JobPostingResponseDto> getJobPostings() {
        List<JobPosting> jobPostings = jobPostingRepository.findAll();
        return jobPostings.stream()
                .map(JobPostingResponseDto::from)
                .collect(Collectors.toList());
    }

    /**
     * 채용공고와 모든 지원서 데이터 조회 (통합 API)
     */
    @Transactional
    public JobPostingResponseDto getJobPostingWithApplications(Long id) {
        JobPosting jobPosting = jobPostingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 채용공고입니다: " + id));

        // LAZY 로딩된 applications를 명시적으로 로드
        jobPosting.getApplications().size();
        
        // 각 application의 관련 데이터도 로드하고 resumeQuantitativeScore 계산 및 저장
        jobPosting.getApplications().forEach(application -> {
            application.getResumeItemAnswers().size();
            application.getCoverLetterQuestionAnswers().size();
            application.getApplicant().getName(); // applicant 정보 로드
            
            // resumeQuantitativeScore 계산 및 저장
            calculateAndSaveResumeQuantitativeScore(application);
        });

        return JobPostingResponseDto.fromWithApplications(jobPosting);
    }
    
    /**
     * 지원서의 resumeQuantitativeScore 계산 및 저장
     */
    private void calculateAndSaveResumeQuantitativeScore(Application application) {
        try {
            // resumeItemAnswers의 resumeScore 합계 계산
            int totalResumeScore = application.getResumeItemAnswers().stream()
                    .mapToInt(answer -> answer.getResumeScore() != null ? answer.getResumeScore() : 0)
                    .sum();
            
            // 기존 값과 다르면 업데이트
            if (application.getResumeQuantitativeScore() == null || 
                !application.getResumeQuantitativeScore().equals(totalResumeScore)) {
                
                application.setResumeQuantitativeScore(totalResumeScore);
                applicationRepository.save(application);
                
                log.info("resumeQuantitativeScore 업데이트 - Application ID: {}, 지원자: {}, 점수: {}점", 
                        application.getId(), 
                        application.getApplicant().getName(), 
                        totalResumeScore);
            }
        } catch (Exception e) {
            log.error("resumeQuantitativeScore 계산 실패 - Application ID: {}, Error: {}", 
                    application.getId(), e.getMessage(), e);
        }
    }

    /**
     * 채용공고 수정
     */
    @Transactional
    public JobPostingResponseDto updateJobPosting(Long id, JobPostingCreateRequestDto request) {
        // 기존 공고 조회
        JobPosting existingJobPosting = jobPostingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 채용공고입니다: " + id));

        // 기존 데이터를 새로운 데이터로 업데이트
        existingJobPosting.setTitle(request.getTitle());
        existingJobPosting.setTeamDepartment(request.getTeamDepartment());
        existingJobPosting.setJobRole(request.getJobRole());
        existingJobPosting.setEmploymentType(request.getEmploymentType());
        existingJobPosting.setApplicationStartDate(request.getApplicationStartDate() != null ? request.getApplicationStartDate().atStartOfDay() : null);
        existingJobPosting.setApplicationEndDate(request.getApplicationEndDate() != null ? request.getApplicationEndDate().atStartOfDay() : null);
        existingJobPosting.setEvaluationEndDate(request.getEvaluationEndDate() != null ? request.getEvaluationEndDate().atStartOfDay() : null);
        existingJobPosting.setDescription(request.getDescription());
        existingJobPosting.setExperienceRequirements(request.getExperienceRequirements());
        existingJobPosting.setEducationRequirements(request.getEducationRequirements());
        existingJobPosting.setRequiredSkills(request.getRequiredSkills());
        existingJobPosting.setTotalScore(request.getTotalScore());
        existingJobPosting.setResumeScoreWeight(request.getResumeScoreWeight());
        existingJobPosting.setCoverLetterScoreWeight(request.getCoverLetterScoreWeight());
        existingJobPosting.setPassingScore(request.getPassingScore());
        existingJobPosting.setAiAutomaticEvaluation(request.getAiAutomaticEvaluation());
        existingJobPosting.setManualReview(request.getManualReview());
        
        // 상태 업데이트 (요청에서 받은 상태 사용)
        if (request.getPostingStatus() != null) {
            log.info("채용공고 상태 수동 업데이트: {} -> {}", existingJobPosting.getPostingStatus(), request.getPostingStatus());
            existingJobPosting.setPostingStatus(request.getPostingStatus());
        } else {
            // 상태가 제공되지 않은 경우에만 자동 설정
            PostingStatus updatedStatus = determinePostingStatus(existingJobPosting, LocalDateTime.now());
            log.info("채용공고 상태 자동 업데이트: {} -> {}", existingJobPosting.getPostingStatus(), updatedStatus);
            existingJobPosting.setPostingStatus(updatedStatus);
        }

        // 기존 ResumeItems와 CoverLetterQuestions는 삭제하지 않고 상태만 업데이트
        // (기존 지원서 데이터 보존을 위해)
        
        // 새로운 ResumeItems는 기존에 없는 경우에만 추가
        if (request.getResumeItems() != null) {
            List<ResumeItem> existingResumeItems = resumeItemRepository.findByJobPostingId(id);
            if (existingResumeItems.isEmpty()) {
                // 기존 항목이 없는 경우에만 새로 추가
                request.getResumeItems().forEach(resumeItemDto -> {
                    ResumeItem resumeItem = ResumeItem.builder()
                            .name(resumeItemDto.getName())
                            .type(resumeItemDto.getType())
                            .isRequired(resumeItemDto.getIsRequired())
                            .maxScore(resumeItemDto.getMaxScore())
                            .jobPosting(existingJobPosting)
                            .build();

                    ResumeItem savedResumeItem = resumeItemRepository.save(resumeItem);

                    // ResumeItemCriterions 저장
                    if (resumeItemDto.getCriteria() != null) {
                        resumeItemDto.getCriteria().forEach(criterionDto -> {
                            ResumeItemCriterion criterion = ResumeItemCriterion.builder()
                                    .grade(criterionDto.getGrade())
                                    .description(criterionDto.getDescription())
                                    .scorePerGrade(criterionDto.getScorePerGrade())
                                    .resumeItem(savedResumeItem)
                                    .build();

                            resumeItemCriterionRepository.save(criterion);
                        });
                    }
                });
            }
        }

        // 새로운 CoverLetterQuestions는 기존에 없는 경우에만 추가
        if (request.getCoverLetterQuestions() != null) {
            List<CoverLetterQuestion> existingQuestions = coverLetterQuestionRepository.findByJobPostingId(id);
            if (existingQuestions.isEmpty()) {
                // 기존 질문이 없는 경우에만 새로 추가
                request.getCoverLetterQuestions().forEach(questionDto -> {
                    CoverLetterQuestion question = CoverLetterQuestion.builder()
                            .content(questionDto.getContent())
                            .isRequired(questionDto.getIsRequired())
                            .maxCharacters(questionDto.getMaxCharacters())
                            .jobPosting(existingJobPosting)
                            .build();

                    CoverLetterQuestion savedQuestion = coverLetterQuestionRepository.save(question);

                    // CoverLetterQuestionCriterions 저장
                    if (questionDto.getCriteria() != null && !questionDto.getCriteria().isEmpty()) {
                        questionDto.getCriteria().forEach(criterionDto -> {
                            if (criterionDto.getName() != null && !criterionDto.getName().trim().isEmpty()) {
                                CoverLetterQuestionCriterion criterion = CoverLetterQuestionCriterion.builder()
                                        .name(criterionDto.getName())
                                        .overallDescription(criterionDto.getOverallDescription())
                                        .coverLetterQuestion(savedQuestion)
                                        .build();

                                CoverLetterQuestionCriterion savedCriterion = coverLetterQuestionCriterionRepository.save(criterion);

                                // CoverLetterQuestionCriterionDetails 저장
                                if (criterionDto.getDetails() != null && !criterionDto.getDetails().isEmpty()) {
                                    criterionDto.getDetails().forEach(detailDto -> {
                                        CoverLetterQuestionCriterionDetail detail = CoverLetterQuestionCriterionDetail.builder()
                                                .grade(detailDto.getGrade())
                                                .description(detailDto.getDescription())
                                                .scorePerGrade(detailDto.getScorePerGrade())
                                                .coverLetterQuestionCriterion(savedCriterion)
                                                .build();

                                        coverLetterQuestionCriterionDetailRepository.save(detail);
                                    });
                                }
                            }
                        });
                    }
                });
            }
        }

        JobPosting updatedJobPosting = jobPostingRepository.save(existingJobPosting);
        return JobPostingResponseDto.from(updatedJobPosting);
    }

    /**
     * 공개 링크 URL 생성
     */
    private String generatePublicLinkUrl(Long jobPostingId) {
        return "http://localhost:3000/apply/" + jobPostingId;
    }

    /**
     * 채용공고 상태를 현재 시간 기준으로 업데이트
     */
    @Transactional
    public void updateJobPostingStatuses() {
        log.info("채용공고 상태 업데이트 시작");
        
        LocalDateTime now = LocalDateTime.now();
        List<JobPosting> allJobPostings = jobPostingRepository.findAll();
        
        int updatedCount = 0;
        
        for (JobPosting jobPosting : allJobPostings) {
            PostingStatus currentStatus = jobPosting.getPostingStatus();
            PostingStatus newStatus = determinePostingStatus(jobPosting, now);
            
            if (currentStatus != newStatus) {
                jobPosting.setPostingStatus(newStatus);
                jobPostingRepository.save(jobPosting);
                updatedCount++;
                
                log.info("채용공고 상태 업데이트 - ID: {}, 제목: {}, {} -> {}", 
                    jobPosting.getId(), 
                    jobPosting.getTitle(),
                    currentStatus.getDescription(), 
                    newStatus.getDescription());
            }
        }
        
        log.info("채용공고 상태 업데이트 완료 - 총 {}개 업데이트", updatedCount);
    }

    /**
     * 현재 시간 기준으로 채용공고 상태 결정
     */
    private PostingStatus determinePostingStatus(JobPosting jobPosting, LocalDateTime now) {
        LocalDateTime applicationStartDate = jobPosting.getApplicationStartDate();
        LocalDateTime applicationEndDate = jobPosting.getApplicationEndDate();
        LocalDateTime evaluationEndDate = jobPosting.getEvaluationEndDate();
        
        // null 체크 - 필수 날짜 필드가 null이면 기본값 반환
        if (applicationStartDate == null || applicationEndDate == null) {
            log.warn("채용공고 ID: {} - 필수 날짜 필드가 null입니다. applicationStartDate: {}, applicationEndDate: {}", 
                jobPosting.getId(), applicationStartDate, applicationEndDate);
            return PostingStatus.SCHEDULED; // 기본값으로 모집예정 반환
        }
        
        // evaluationEndDate가 null인 경우 applicationEndDate로 대체
        if (evaluationEndDate == null) {
            log.warn("채용공고 ID: {} - evaluationEndDate가 null입니다. applicationEndDate로 대체합니다.", jobPosting.getId());
            evaluationEndDate = applicationEndDate;
        }
        
        // 모집 시작 전
        if (now.isBefore(applicationStartDate)) {
            return PostingStatus.SCHEDULED;
        }
        // 모집 기간 중
        else if (now.isAfter(applicationStartDate) && now.isBefore(applicationEndDate)) {
            return PostingStatus.IN_PROGRESS;
        }
        // 모집 마감 후 평가 기간 중
        else if (now.isAfter(applicationEndDate) && now.isBefore(evaluationEndDate)) {
            return PostingStatus.CLOSED;
        }
        // 평가 완료
        else {
            return PostingStatus.EVALUATION_COMPLETE;
        }
    }

    /**
     * 매일 00시 00분에 채용공고 상태 업데이트
     */
    @Scheduled(cron = "0 0 0 * * *", zone = "Asia/Seoul")
    public void scheduledUpdateJobPostingStatuses() {
        log.info("스케줄된 채용공고 상태 업데이트 실행");
        updateJobPostingStatuses();
    }

}