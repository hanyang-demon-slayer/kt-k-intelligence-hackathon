package com.jangyeonguk.backend.dto.evaluation;

import com.jangyeonguk.backend.domain.EvaluationResult;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 평가 결과 응답 DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EvaluationResultResponseDto {

    private Long id;
    private String applicantName;
    private String applicantEmail;
    private Long jobPostingId;
    private Integer totalScore;
    private String resumeScores;
    private String coverLetterScores;
    private String overallEvaluation;
    private String hrComment; // HR 담당자 추가 코멘트
    private String evaluationCompletedAt;
    private String createdAt;

    public static EvaluationResultResponseDto from(EvaluationResult evaluationResult) {
        return EvaluationResultResponseDto.builder()
                .id(evaluationResult.getId())
                .applicantName(evaluationResult.getApplication() != null ? 
                    evaluationResult.getApplication().getApplicant().getName() : null)
                .applicantEmail(evaluationResult.getApplication() != null ? 
                    evaluationResult.getApplication().getApplicant().getEmail() : null)
                .jobPostingId(evaluationResult.getJobPosting() != null ? 
                    evaluationResult.getJobPosting().getId() : null)
                .totalScore(evaluationResult.getTotalScore())
                .resumeScores(evaluationResult.getResumeScores())
                .coverLetterScores(evaluationResult.getCoverLetterScores())
                .overallEvaluation(evaluationResult.getOverallEvaluation())
                .hrComment(evaluationResult.getHrComment())
                .createdAt(evaluationResult.getCreatedAt() != null ? 
                    evaluationResult.getCreatedAt().toString() : null)
                .build();
    }
}
