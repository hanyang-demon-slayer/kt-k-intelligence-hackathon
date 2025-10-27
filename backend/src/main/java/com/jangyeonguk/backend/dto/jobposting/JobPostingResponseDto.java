package com.jangyeonguk.backend.dto.jobposting;

import com.jangyeonguk.backend.domain.EmploymentType;
import com.jangyeonguk.backend.domain.JobPosting;
import com.jangyeonguk.backend.domain.PostingStatus;
import com.jangyeonguk.backend.dto.coverletter.CoverLetterQuestionResponseDto;
import com.jangyeonguk.backend.dto.resume.ResumeItemResponseDto;
import com.jangyeonguk.backend.dto.application.ApplicationResponseDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 채용공고 응답 DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobPostingResponseDto {

    private Long id;
    private String title; // 공고 제목
    private String teamDepartment; // 팀/부서
    private String jobRole; // 직무
    private EmploymentType employmentType; // 고용형태
    private LocalDate applicationStartDate; // 모집시작일
    private LocalDate applicationEndDate; // 모집마감일
    private LocalDate evaluationEndDate; // 평가 마감일
    private String description; // 설명
    private String experienceRequirements; // 경력 요구사항
    private String educationRequirements; // 학력 요구사항
    private String requiredSkills; // 요구기술, 스킬
    private Integer totalScore; // 총점
    private Integer resumeScoreWeight; // 이력서 배점 비중
    private Integer coverLetterScoreWeight; // 자기소개서 배점 비중
    private Integer passingScore; // 합격기준점수
    private Boolean aiAutomaticEvaluation; // AI 자동평가여부
    private Boolean manualReview; // 수동 검토여부
    private String publicLinkUrl; // 공개 링크 URL
    private PostingStatus postingStatus; // 공고상태
    private Long companyId; // 회사 ID
    private String companyName; // 회사명
    private Integer applicationCount; // 지원서 수

    // 중첩된 구조
    private List<ResumeItemResponseDto> resumeItems; // 이력서 항목 목록
    private List<CoverLetterQuestionResponseDto> coverLetterQuestions; // 자기소개서 질문 목록
    private List<ApplicationResponseDto> applications; // 지원서 목록 (통합 API용)

    /**
     * JobPosting 엔티티를 JobPostingResponseDto로 변환
     */
    public static JobPostingResponseDto from(JobPosting jobPosting) {
        return JobPostingResponseDto.builder()
                .id(jobPosting.getId())
                .title(jobPosting.getTitle())
                .teamDepartment(jobPosting.getTeamDepartment())
                .jobRole(jobPosting.getJobRole())
                .employmentType(jobPosting.getEmploymentType())
                .applicationStartDate(jobPosting.getApplicationStartDate() != null ? jobPosting.getApplicationStartDate().toLocalDate() : null)
                .applicationEndDate(jobPosting.getApplicationEndDate() != null ? jobPosting.getApplicationEndDate().toLocalDate() : null)
                .evaluationEndDate(jobPosting.getEvaluationEndDate() != null ? jobPosting.getEvaluationEndDate().toLocalDate() : null)
                .description(jobPosting.getDescription())
                .experienceRequirements(jobPosting.getExperienceRequirements())
                .educationRequirements(jobPosting.getEducationRequirements())
                .requiredSkills(jobPosting.getRequiredSkills())
                .totalScore(jobPosting.getTotalScore())
                .resumeScoreWeight(jobPosting.getResumeScoreWeight())
                .coverLetterScoreWeight(jobPosting.getCoverLetterScoreWeight())
                .passingScore(jobPosting.getPassingScore())
                .aiAutomaticEvaluation(jobPosting.getAiAutomaticEvaluation())
                .manualReview(jobPosting.getManualReview())
                .postingStatus(jobPosting.getPostingStatus())
                .publicLinkUrl(jobPosting.getPublicLinkUrl()) // 공개 링크 URL 추가
                .companyId(jobPosting.getCompany().getId())
                .companyName(jobPosting.getCompany().getName())
                .applicationCount(jobPosting.getApplications() != null ? jobPosting.getApplications().size() : 0) // 지원서 수 추가
                .resumeItems(jobPosting.getResumeItems() != null ?
                        jobPosting.getResumeItems().stream()
                                .map(ResumeItemResponseDto::from)
                                .collect(Collectors.toList()) : new ArrayList<>())
                .coverLetterQuestions(jobPosting.getCoverLetterQuestions() != null ?
                        jobPosting.getCoverLetterQuestions().stream()
                                .map(CoverLetterQuestionResponseDto::from)
                                .collect(Collectors.toList()) : new ArrayList<>())
                .build();
    }

    /**
     * JobPosting 엔티티를 JobPostingResponseDto로 변환 (지원서 데이터 포함)
     */
    public static JobPostingResponseDto fromWithApplications(JobPosting jobPosting) {
        return JobPostingResponseDto.builder()
                .id(jobPosting.getId())
                .title(jobPosting.getTitle())
                .teamDepartment(jobPosting.getTeamDepartment())
                .jobRole(jobPosting.getJobRole())
                .employmentType(jobPosting.getEmploymentType())
                .applicationStartDate(jobPosting.getApplicationStartDate() != null ? jobPosting.getApplicationStartDate().toLocalDate() : null)
                .applicationEndDate(jobPosting.getApplicationEndDate() != null ? jobPosting.getApplicationEndDate().toLocalDate() : null)
                .evaluationEndDate(jobPosting.getEvaluationEndDate() != null ? jobPosting.getEvaluationEndDate().toLocalDate() : null)
                .description(jobPosting.getDescription())
                .experienceRequirements(jobPosting.getExperienceRequirements())
                .educationRequirements(jobPosting.getEducationRequirements())
                .requiredSkills(jobPosting.getRequiredSkills())
                .totalScore(jobPosting.getTotalScore())
                .resumeScoreWeight(jobPosting.getResumeScoreWeight())
                .coverLetterScoreWeight(jobPosting.getCoverLetterScoreWeight())
                .passingScore(jobPosting.getPassingScore())
                .aiAutomaticEvaluation(jobPosting.getAiAutomaticEvaluation())
                .manualReview(jobPosting.getManualReview())
                .postingStatus(jobPosting.getPostingStatus())
                .publicLinkUrl(jobPosting.getPublicLinkUrl())
                .companyId(jobPosting.getCompany().getId())
                .companyName(jobPosting.getCompany().getName())
                .applicationCount(jobPosting.getApplications() != null ? jobPosting.getApplications().size() : 0)
                .resumeItems(jobPosting.getResumeItems() != null ?
                        jobPosting.getResumeItems().stream()
                                .map(ResumeItemResponseDto::from)
                                .collect(Collectors.toList()) : new ArrayList<>())
                .coverLetterQuestions(jobPosting.getCoverLetterQuestions() != null ?
                        jobPosting.getCoverLetterQuestions().stream()
                                .map(CoverLetterQuestionResponseDto::from)
                                .collect(Collectors.toList()) : new ArrayList<>())
                .applications(jobPosting.getApplications() != null ?
                        jobPosting.getApplications().stream()
                                .map(ApplicationResponseDto::from)
                                .collect(Collectors.toList()) : new ArrayList<>())
                .build();
    }
}