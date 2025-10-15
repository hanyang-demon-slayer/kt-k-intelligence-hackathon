package com.jangyeonguk.backend.dto.coverletter;

import com.jangyeonguk.backend.domain.CoverLetterQuestion;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 자기소개서 질문 응답 DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CoverLetterQuestionResponseDto {

    private Long id;
    private String content; // 질문 내용
    private Boolean isRequired; // 필수여부
    private Integer maxCharacters; // 최대글자수
    private List<CoverLetterQuestionCriterionResponseDto> criteria; // 평가기준 목록

    /**
     * CoverLetterQuestion 엔티티를 CoverLetterQuestionResponseDto로 변환
     */
    public static CoverLetterQuestionResponseDto from(CoverLetterQuestion question) {
        return CoverLetterQuestionResponseDto.builder()
                .id(question.getId())
                .content(question.getContent())
                .isRequired(question.getIsRequired())
                .maxCharacters(question.getMaxCharacters())
                .criteria(question.getCriteria().stream()
                        .map(CoverLetterQuestionCriterionResponseDto::from)
                        .collect(Collectors.toList()))
                .build();
    }
}