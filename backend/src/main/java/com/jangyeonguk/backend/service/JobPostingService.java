package com.jangyeonguk.backend.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
        
        // ResumeItems 추가
        if (request.getResumeItems() != null) {
            request.getResumeItems().forEach(resumeItemDto -> {
                ResumeItem resumeItem = ResumeItem.builder()
                        .name(resumeItemDto.getName())
                        .type(resumeItemDto.getType())
                        .isRequired(resumeItemDto.getIsRequired())
                        .maxScore(resumeItemDto.getMaxScore())
                        .build();
                jobPosting.addResumeItem(resumeItem);
                
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
            });
        }

        // CoverLetterQuestions 추가
        if (request.getCoverLetterQuestions() != null) {
            request.getCoverLetterQuestions().forEach(questionDto -> {
                CoverLetterQuestion question = CoverLetterQuestion.builder()
                        .content(questionDto.getContent())
                        .isRequired(questionDto.getIsRequired())
                        .maxCharacters(questionDto.getMaxCharacters())
                        .build();
                jobPosting.addCoverLetterQuestion(question);
                
                if (questionDto.getCriteria() != null && !questionDto.getCriteria().isEmpty()) {
                    questionDto.getCriteria().forEach(criterionDto -> {
                        if (criterionDto.getName() != null && !criterionDto.getName().trim().isEmpty()) {
                            CoverLetterQuestionCriterion criterion = CoverLetterQuestionCriterion.builder()
                                    .name(criterionDto.getName())
                                    .overallDescription(criterionDto.getOverallDescription())
                                    .build();
                            question.addCriterion(criterion);
                            
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
        JobPosting jobPosting = jobPostingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 채용공고입니다: " + id));

        // 기본 정보 업데이트
        jobPosting.setTitle(request.getTitle());
        jobPosting.setTeamDepartment(request.getTeamDepartment());
        jobPosting.setJobRole(request.getJobRole());
        jobPosting.setEmploymentType(request.getEmploymentType());
        jobPosting.setApplicationStartDate(request.getApplicationStartDate());
        jobPosting.setApplicationEndDate(request.getApplicationEndDate());
        jobPosting.setEvaluationEndDate(request.getEvaluationEndDate());
        jobPosting.setDescription(request.getDescription());
        jobPosting.setExperienceRequirements(request.getExperienceRequirements());
        jobPosting.setEducationRequirements(request.getEducationRequirements());
        jobPosting.setRequiredSkills(request.getRequiredSkills());
        jobPosting.setTotalScore(request.getTotalScore());
        jobPosting.setResumeScoreWeight(request.getResumeScoreWeight());
        jobPosting.setCoverLetterScoreWeight(request.getCoverLetterScoreWeight());
        jobPosting.setPassingScore(request.getPassingScore());
        jobPosting.setAiAutomaticEvaluation(request.getAiAutomaticEvaluation());
        jobPosting.setManualReview(request.getManualReview());
        
        // 상태 자동 업데이트
        jobPosting.setPostingStatus(determinePostingStatus(jobPosting, LocalDateTime.now()));

        JobPosting updatedJobPosting = jobPostingRepository.save(jobPosting);
        return JobPostingResponseDto.from(updatedJobPosting);
    }

    /**
     * 공개 링크 URL 생성
     */
    private String generatePublicLinkUrl(Long jobPostingId) {
        return "http://localhost:3000/apply/" + jobPostingId;
    }


    /**
     * 현재 시간 기준으로 채용공고 상태 결정
     */
    private PostingStatus determinePostingStatus(JobPosting jobPosting, LocalDateTime now) {
        LocalDateTime startDate = jobPosting.getApplicationStartDate();
        LocalDateTime endDate = jobPosting.getApplicationEndDate();
        LocalDateTime evalEndDate = jobPosting.getEvaluationEndDate();
        
        if (startDate == null || endDate == null) {
            return PostingStatus.SCHEDULED;
        }
        
        if (evalEndDate == null) {
            evalEndDate = endDate;
        }
        
        if (now.isBefore(startDate)) return PostingStatus.SCHEDULED;
        if (now.isBefore(endDate)) return PostingStatus.IN_PROGRESS;
        if (now.isBefore(evalEndDate)) return PostingStatus.CLOSED;
        return PostingStatus.EVALUATION_COMPLETE;
    }

    /**
     * 매일 00시 00분에 채용공고 상태 업데이트
     */
    @Scheduled(cron = "0 0 0 * * *", zone = "Asia/Seoul")
    public void scheduledUpdateJobPostingStatuses() {
        LocalDateTime now = LocalDateTime.now();
        
        long updatedCount = jobPostingRepository.findAll().stream()
                .filter(jobPosting -> {
                    PostingStatus newStatus = determinePostingStatus(jobPosting, now);
                    return jobPosting.getPostingStatus() != newStatus;
                })
                .peek(jobPosting -> {
                    PostingStatus currentStatus = jobPosting.getPostingStatus();
                    PostingStatus newStatus = determinePostingStatus(jobPosting, now);
                    jobPosting.setPostingStatus(newStatus);
                    jobPostingRepository.save(jobPosting);
                    
                    log.info("채용공고 상태 업데이트 - ID: {}, 제목: {}, {} -> {}", 
                        jobPosting.getId(), 
                        jobPosting.getTitle(),
                        currentStatus.getDescription(), 
                        newStatus.getDescription());
                })
                .count();
        
        log.info("채용공고 상태 업데이트 완료 - 총 {}개 업데이트", updatedCount);
    }



}