package com.jangyeonguk.backend.dto.jobposting;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jangyeonguk.backend.domain.EmploymentType;
import com.jangyeonguk.backend.domain.PostingStatus;
import com.jangyeonguk.backend.dto.coverletter.CoverLetterQuestionCreateRequestDto;
import com.jangyeonguk.backend.dto.resume.ResumeItemCreateRequestDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 채용공고 생성 요청 DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class JobPostingCreateRequestDto {

    @NotBlank(message = "공고 제목은 필수입니다")
    private String title; // 공고 제목
    
    private String teamDepartment; // 팀/부서
    private String jobRole; // 직무
    
    @NotNull(message = "고용형태는 필수입니다")
    private EmploymentType employmentType; // 고용형태
    
    @JsonFormat(pattern = "yyyy-MM-dd['T'HH:mm:ss]")
    private LocalDateTime applicationStartDate; // 모집시작일
    
    @JsonFormat(pattern = "yyyy-MM-dd['T'HH:mm:ss]")
    private LocalDateTime applicationEndDate; // 모집마감일
    
    @JsonFormat(pattern = "yyyy-MM-dd['T'HH:mm:ss]")
    private LocalDateTime evaluationEndDate; // 평가 마감일
    private String description; // 설명
    private String experienceRequirements; // 경력 요구사항
    private String educationRequirements; // 학력 요구사항
    private String requiredSkills; // 요구기술, 스킬
    @Min(value = 0, message = "총점은 0 이상이어야 합니다")
    private Integer totalScore; // 총점
    
    @Min(value = 0, message = "이력서 배점 비중은 0 이상이어야 합니다")
    private Integer resumeScoreWeight; // 이력서 배점 비중
    
    @Min(value = 0, message = "자기소개서 배점 비중은 0 이상이어야 합니다")
    private Integer coverLetterScoreWeight; // 자기소개서 배점 비중
    
    @Min(value = 0, message = "합격기준점수는 0 이상이어야 합니다")
    private Integer passingScore; // 합격기준점수
    private Boolean aiAutomaticEvaluation; // AI 자동평가여부
    private Boolean manualReview; // 수동 검토여부

    @Valid
    @NotEmpty(message = "이력서 항목은 최소 1개 이상 필요합니다")
    private List<ResumeItemCreateRequestDto> resumeItems; // 이력서 항목 목록
    
    @Valid
    @NotEmpty(message = "자기소개서 질문은 최소 1개 이상 필요합니다")
    private List<CoverLetterQuestionCreateRequestDto> coverLetterQuestions; // 자기소개서 질문 목록
}