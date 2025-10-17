package com.jangyeonguk.backend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jangyeonguk.backend.domain.Company;
import com.jangyeonguk.backend.domain.CoverLetterQuestion;
import com.jangyeonguk.backend.domain.CoverLetterQuestionCriterion;
import com.jangyeonguk.backend.domain.CoverLetterQuestionCriterionDetail;
import com.jangyeonguk.backend.domain.JobPosting;
import com.jangyeonguk.backend.domain.PostingStatus;
import com.jangyeonguk.backend.domain.ResumeItem;
import com.jangyeonguk.backend.domain.ResumeItemCriterion;
import com.jangyeonguk.backend.dto.jobposting.JobPostingCreateRequestDto;
import com.jangyeonguk.backend.dto.jobposting.JobPostingResponseDto;
import com.jangyeonguk.backend.dto.resume.ResumeItemCreateRequestDto;
import com.jangyeonguk.backend.dto.coverletter.CoverLetterQuestionCreateRequestDto;
import com.jangyeonguk.backend.repository.CompanyRepository;
import com.jangyeonguk.backend.repository.CoverLetterQuestionCriterionDetailRepository;
import com.jangyeonguk.backend.repository.CoverLetterQuestionCriterionRepository;
import com.jangyeonguk.backend.repository.CoverLetterQuestionRepository;
import com.jangyeonguk.backend.repository.JobPostingRepository;
import com.jangyeonguk.backend.repository.ResumeItemCriterionRepository;
import com.jangyeonguk.backend.repository.ResumeItemRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 채용공고 Service
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class JobPostingService {

    private final JobPostingRepository jobPostingRepository;
    private final ResumeItemRepository resumeItemRepository;
    private final ResumeItemCriterionRepository resumeItemCriterionRepository;
    private final CoverLetterQuestionRepository coverLetterQuestionRepository;
    private final CoverLetterQuestionCriterionRepository coverLetterQuestionCriterionRepository;
    private final CoverLetterQuestionCriterionDetailRepository coverLetterQuestionCriterionDetailRepository;
    private final CompanyRepository companyRepository;
    private final AIScoringService aiScoringService;

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
                .applicationStartDate(request.getApplicationStartDate())
                .applicationEndDate(request.getApplicationEndDate())
                .evaluationEndDate(request.getEvaluationEndDate())
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
                .build();
        
        // 연관관계 편의 메서드 사용
        company.addJobPosting(jobPosting);

        // 날짜에 따라 초기 상태 설정
        PostingStatus initialStatus = determinePostingStatus(jobPosting, LocalDateTime.now());
        jobPosting.setPostingStatus(initialStatus);
        
        // ResumeItems와 CoverLetterQuestions를 JobPosting에 추가
        if (request.getResumeItems() != null) {
            request.getResumeItems().forEach(resumeItemDto -> {
                addResumeItemToJobPosting(jobPosting, resumeItemDto);
            });
        }

        if (request.getCoverLetterQuestions() != null) {
            request.getCoverLetterQuestions().forEach(questionDto -> {
                addCoverLetterQuestionToJobPosting(jobPosting, questionDto);
            });
        }

        // 한 번에 모든 엔티티 저장 (CascadeType.ALL로 인해 연관 엔티티들도 자동 저장)
        JobPosting savedJobPosting = jobPostingRepository.save(jobPosting);
        
        // 실제 ID로 URL 생성 및 설정
        String publicLinkUrl = generatePublicLinkUrl(savedJobPosting.getId());
        savedJobPosting.setPublicLinkUrl(publicLinkUrl);
        
        // URL 변경사항을 DB에 저장
        jobPostingRepository.save(savedJobPosting);

        // JobPostingResponseDto 생성
        JobPostingResponseDto response = JobPostingResponseDto.from(savedJobPosting);

        // AI 평가 기준 학습
        aiScoringService.processJobPostingEvaluation(savedJobPosting);

        return response;
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
            
        });

        return JobPostingResponseDto.fromWithApplications(jobPosting);
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
        existingJobPosting.setApplicationStartDate(request.getApplicationStartDate());
        existingJobPosting.setApplicationEndDate(request.getApplicationEndDate());
        existingJobPosting.setEvaluationEndDate(request.getEvaluationEndDate());
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
        
        // 상태는 항상 자동으로 결정 (날짜 기반)
        PostingStatus updatedStatus = determinePostingStatus(existingJobPosting, LocalDateTime.now());
        log.info("채용공고 상태 자동 업데이트: {} -> {}", existingJobPosting.getPostingStatus(), updatedStatus);
        existingJobPosting.setPostingStatus(updatedStatus);

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

    /**
     * ResumeItem을 JobPosting에 추가하는 편의 메서드
     */
    private void addResumeItemToJobPosting(JobPosting jobPosting, ResumeItemCreateRequestDto resumeItemDto) {
        ResumeItem resumeItem = ResumeItem.builder()
                .name(resumeItemDto.getName())
                .type(resumeItemDto.getType())
                .isRequired(resumeItemDto.getIsRequired())
                .maxScore(resumeItemDto.getMaxScore())
                .build();

        // 연관관계 편의 메서드 사용
        jobPosting.addResumeItem(resumeItem);

        // ResumeItemCriterions 추가
        if (resumeItemDto.getCriteria() != null) {
            resumeItemDto.getCriteria().forEach(criterionDto -> {
                ResumeItemCriterion criterion = ResumeItemCriterion.builder()
                        .grade(criterionDto.getGrade())
                        .description(criterionDto.getDescription())
                        .scorePerGrade(criterionDto.getScorePerGrade())
                        .build();
                
                resumeItem.addCriterion(criterion);
            });
        }
    }

    /**
     * CoverLetterQuestion을 JobPosting에 추가하는 편의 메서드
     */
    private void addCoverLetterQuestionToJobPosting(JobPosting jobPosting, CoverLetterQuestionCreateRequestDto questionDto) {
        CoverLetterQuestion question = CoverLetterQuestion.builder()
                .content(questionDto.getContent())
                .isRequired(questionDto.getIsRequired())
                .maxCharacters(questionDto.getMaxCharacters())
                .build();

        // 연관관계 편의 메서드 사용
        jobPosting.addCoverLetterQuestion(question);

        // CoverLetterQuestionCriterions 추가
        if (questionDto.getCriteria() != null && !questionDto.getCriteria().isEmpty()) {
            questionDto.getCriteria().forEach(criterionDto -> {
                if (criterionDto.getName() != null && !criterionDto.getName().trim().isEmpty()) {
                    CoverLetterQuestionCriterion criterion = CoverLetterQuestionCriterion.builder()
                            .name(criterionDto.getName())
                            .overallDescription(criterionDto.getOverallDescription())
                            .build();

                    question.addCriterion(criterion);

                    // CoverLetterQuestionCriterionDetails 추가
                    if (criterionDto.getDetails() != null && !criterionDto.getDetails().isEmpty()) {
                        criterionDto.getDetails().forEach(detailDto -> {
                            CoverLetterQuestionCriterionDetail detail = CoverLetterQuestionCriterionDetail.builder()
                                    .grade(detailDto.getGrade())
                                    .description(detailDto.getDescription())
                                    .scorePerGrade(detailDto.getScorePerGrade())
                                    .build();
                            
                            criterion.addDetail(detail);
                        });
                    }
                }
            });
        }
    }

}