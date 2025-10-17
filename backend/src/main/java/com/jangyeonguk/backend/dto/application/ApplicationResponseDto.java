package com.jangyeonguk.backend.dto.application;

import com.jangyeonguk.backend.domain.Application;
import com.jangyeonguk.backend.domain.ApplicationStatus;
import com.jangyeonguk.backend.dto.coverletter.CoverLetterQuestionAnswerResponseDto;
import com.jangyeonguk.backend.dto.evaluation.EvaluationResultResponseDto;
import com.jangyeonguk.backend.dto.resume.ResumeItemAnswerResponseDto;
import com.jangyeonguk.backend.dto.jobposting.JobPostingResponseDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 지원서 응답 DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationResponseDto {

    private Long id;
    private ApplicationStatus status;
    
    // 지원자 정보
    private ApplicantDto applicant;
    
    // 채용공고 정보
    private JobPostingResponseDto jobPosting;
    
    // 이력서 답변 목록
    private List<ResumeItemAnswerResponseDto> resumeItemAnswers;
    
    // 자기소개서 답변 목록
    private List<CoverLetterQuestionAnswerResponseDto> coverLetterQuestionAnswers;
    
    // 평가 결과
    private EvaluationResultResponseDto evaluationResult;
    
    // 지원자 정보 DTO
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ApplicantDto {
        private Long id;
        private String name;
        private String email;
    }

    /**
     * Application 엔티티로부터 ApplicationResponseDto 생성
     * 
     * @param application 변환할 Application 엔티티
     * @return ApplicationResponseDto (지원서의 모든 관련 정보 포함)
     */
    public static ApplicationResponseDto from(Application application) {
        return ApplicationResponseDto.builder()
                .id(application.getId())
                .status(application.getStatus())
                // 지원자 정보 매핑
                .applicant(ApplicantDto.builder()
                        .id(application.getApplicant().getId())
                        .name(application.getApplicant().getName())
                        .email(application.getApplicant().getEmail())
                        .build())
                // 채용공고 정보 매핑 (null 안전)
                .jobPosting(application.getJobPosting() != null ?
                        JobPostingResponseDto.from(application.getJobPosting()) : null)
                // 이력서 답변 목록 매핑 (null 안전, 빈 리스트 기본값)
                .resumeItemAnswers(application.getResumeItemAnswers() != null ?
                        application.getResumeItemAnswers().stream()
                                .map(ResumeItemAnswerResponseDto::from)
                                .collect(Collectors.toList()) : new ArrayList<>())
                // 자기소개서 답변 목록 매핑 (null 안전, 빈 리스트 기본값)
                .coverLetterQuestionAnswers(application.getCoverLetterQuestionAnswers() != null ?
                        application.getCoverLetterQuestionAnswers().stream()
                                .map(CoverLetterQuestionAnswerResponseDto::from)
                                .collect(Collectors.toList()) : new ArrayList<>())
                // 평가 결과 매핑 (AI 평가 완료 후에만 존재, null 안전)
                .evaluationResult(application.getEvaluationResult() != null ?
                        EvaluationResultResponseDto.from(application.getEvaluationResult()) : null)
                .build();
    }
}