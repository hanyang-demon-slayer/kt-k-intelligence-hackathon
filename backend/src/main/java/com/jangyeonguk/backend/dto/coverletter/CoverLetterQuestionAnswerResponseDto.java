package com.jangyeonguk.backend.dto.coverletter;

import com.jangyeonguk.backend.domain.CoverLetterQuestionAnswer;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 자기소개서 질문 답변 응답 DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CoverLetterQuestionAnswerResponseDto {

    private Long id;
    private String answerContent;
    private Long coverLetterQuestionId;
    private String questionContent;
    private Integer maxCharacters;

    public static CoverLetterQuestionAnswerResponseDto from(CoverLetterQuestionAnswer answer) {
        return CoverLetterQuestionAnswerResponseDto.builder()
                .id(answer.getId())
                .answerContent(answer.getAnswerContent())
                .coverLetterQuestionId(answer.getCoverLetterQuestion().getId())
                .questionContent(answer.getCoverLetterQuestion().getContent())
                .maxCharacters(answer.getCoverLetterQuestion().getMaxCharacters())
                .build();
    }
}
