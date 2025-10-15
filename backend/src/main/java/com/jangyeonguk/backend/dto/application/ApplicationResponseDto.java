package com.jangyeonguk.backend.dto.application;

import com.jangyeonguk.backend.domain.Application;
import com.jangyeonguk.backend.domain.ApplicationStatus;
import com.jangyeonguk.backend.dto.coverletter.CoverLetterQuestionAnswerResponseDto;
import com.jangyeonguk.backend.dto.evaluation.EvaluationResultResponseDto;
import com.jangyeonguk.backend.dto.resume.ResumeItemAnswerResponseDto;
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

    public static ApplicationResponseDto from(Application application) {
        return ApplicationResponseDto.builder()
                .id(application.getId())
                .status(application.getStatus())
                .applicant(ApplicantDto.builder()
                        .id(application.getApplicant().getId())
                        .name(application.getApplicant().getName())
                        .email(application.getApplicant().getEmail())
                        .build())
                .resumeItemAnswers(application.getResumeItemAnswers() != null ?
                        application.getResumeItemAnswers().stream()
                                .map(ResumeItemAnswerResponseDto::from)
                                .collect(Collectors.toList()) : new ArrayList<>())
                .coverLetterQuestionAnswers(application.getCoverLetterQuestionAnswers() != null ?
                        application.getCoverLetterQuestionAnswers().stream()
                                .map(CoverLetterQuestionAnswerResponseDto::from)
                                .collect(Collectors.toList()) : new ArrayList<>())
                .evaluationResult(application.getEvaluationResult() != null ?
                        EvaluationResultResponseDto.from(application.getEvaluationResult()) : null)
                .build();
    }
}