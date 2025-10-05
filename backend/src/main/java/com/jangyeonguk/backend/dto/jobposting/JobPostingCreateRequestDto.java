package com.jangyeonguk.backend.dto.jobposting;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jangyeonguk.backend.domain.jobposting.EmploymentType;
import com.jangyeonguk.backend.domain.jobposting.PostingStatus;
import com.jangyeonguk.backend.dto.coverletter.CoverLetterQuestionCreateRequestDto;
import com.jangyeonguk.backend.dto.resume.ResumeItemCreateRequestDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

/**
 * 채용공고 생성 요청 DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class JobPostingCreateRequestDto {

    private String title; // 공고 제목
    private String teamDepartment; // 팀/부서
    private String jobRole; // 직무
    private EmploymentType employmentType; // 고용형태
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate applicationStartDate; // 모집시작일
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate applicationEndDate; // 모집마감일
    
    @JsonFormat(pattern = "yyyy-MM-dd")
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
    private PostingStatus postingStatus; // 공고상태

    // 중첩된 구조
    private List<ResumeItemCreateRequestDto> resumeItems; // 이력서 항목 목록
    private List<CoverLetterQuestionCreateRequestDto> coverLetterQuestions; // 자기소개서 질문 목록
}