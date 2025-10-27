package com.jangyeonguk.backend.dto.application;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

/**
 * 지원서 생성 요청 DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationCreateRequestDto {

    @NotBlank(message = "지원자 이름은 필수입니다")
    private String applicantName; // 지원자 이름
    
    @NotBlank(message = "지원자 이메일은 필수입니다")
    @Email(message = "올바른 이메일 형식이 아닙니다")
    private String applicantEmail; // 지원자 이메일
    
    @NotNull(message = "이력서 답변은 필수입니다")
    private List<ResumeItemAnswerDto> resumeItemAnswers; // 이력서 항목 답변
    
    @NotNull(message = "자기소개서 답변은 필수입니다")
    private List<CoverLetterQuestionAnswerDto> coverLetterQuestionAnswers; // 자기소개서 질문 답변

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ResumeItemAnswerDto {
        private Long resumeItemId; // 이력서 항목 ID
        private String resumeItemName; // 이력서 항목 이름
        
        @NotBlank(message = "이력서 내용은 필수입니다")
        private String resumeContent; // 이력서 내용
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CoverLetterQuestionAnswerDto {
        private Long coverLetterQuestionId; // 자기소개서 질문 ID
        private String questionContent; // 질문 내용
        
        @NotBlank(message = "자기소개서 답변 내용은 필수입니다")
        private String answerContent; // 답변 내용
    }
}