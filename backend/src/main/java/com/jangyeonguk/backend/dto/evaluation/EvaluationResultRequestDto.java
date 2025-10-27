package com.jangyeonguk.backend.dto.evaluation;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * LLM 평가 결과 요청 DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EvaluationResultRequestDto {

    // 1. 지원자 정보
    private Long applicantId;
    private String applicantName;
    private String applicantEmail;

    // 2. 지원서 정보
    private Long applicationId;
    private Long jobPostingId;

    // 3. 이력서 평가 결과
    private List<ResumeEvaluationDto> resumeEvaluations;

    // 4. 자기소개서 평가 결과
    private List<CoverLetterQuestionEvaluationDto> coverLetterQuestionEvaluations;

    // 5. 종합 분석
    private OverallAnalysisDto overallAnalysis;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ResumeEvaluationDto {
        private Long resumeItemId;
        private String resumeItemName;
        private String resumeContent;
        private Integer score; // 지원자 점수
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CoverLetterQuestionEvaluationDto {
        private Long coverLetterQuestionId;
        private List<String> keywords; // 문항 별 키워드
        private String summary; // 문항 별 요약
        private List<CoverLetterAnswerEvaluationDto> answerEvaluations; // 문항 답변별 평가 (여러번 평가 가능)
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CoverLetterAnswerEvaluationDto {
        private String evaluationCriteriaName; // 평가 기준 이름
        private String grade; // 'EXCELLENT', 'GOOD', 'NORMAL', 'POOR'
        private String evaluatedContent; // 평가가 된 자기소개서 내 내용
        private String evaluationReason; // 그렇게 평가한 이유
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OverallAnalysisDto {
        private String overallEvaluation; // 종합평가 (1줄)
        private List<String> strengths; // 강점 (5개정도)
        private List<String> improvements; // 개선점 (5개정도)
        private String aiRecommendation; // AI 추천결과 (합격 권장, 탈락 권장)
        private Double aiReliability; // AI 신뢰도
    }
}
