package com.jangyeonguk.backend.dto.application;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 지원서 생성 요청 DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationCreateRequestDto {

    private String applicantName; // 지원자 이름
    private String applicantEmail; // 지원자 이메일
    private List<ResumeItemAnswerDto> resumeItemAnswers; // 이력서 항목 답변
    private List<CoverLetterQuestionAnswerDto> coverLetterQuestionAnswers; // 자기소개서 질문 답변

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ResumeItemAnswerDto {
        private Long resumeItemId; // 이력서 항목 ID
        private String resumeItemName; // 이력서 항목 이름 (추가)
        private String resumeContent; // 이력서 내용
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CoverLetterQuestionAnswerDto {
        private Long coverLetterQuestionId; // 자기소개서 질문 ID
        private String questionContent; // 질문 내용 (추가)
        private String answerContent; // 답변 내용
    }
}