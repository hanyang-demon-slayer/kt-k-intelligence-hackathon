package com.jangyeonguk.backend.dto.resume;

import com.jangyeonguk.backend.domain.ResumeItemAnswer;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 이력서 항목 답변 응답 DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResumeItemAnswerResponseDto {

    private Long id;
    private String resumeContent;
    private Integer resumeScore;
    private Long resumeItemId;
    private String resumeItemName;
    private Integer maxScore;

    public static ResumeItemAnswerResponseDto from(ResumeItemAnswer answer) {
        return ResumeItemAnswerResponseDto.builder()
                .id(answer.getId())
                .resumeContent(answer.getResumeContent())
                .resumeScore(answer.getResumeScore())
                .resumeItemId(answer.getResumeItem().getId())
                .resumeItemName(answer.getResumeItem().getName())
                .maxScore(answer.getResumeItem().getMaxScore())
                .build();
    }
}
