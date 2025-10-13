package com.jangyeonguk.backend.domain.jobposting;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 공고상태 열거형
 */
@Getter
@AllArgsConstructor
public enum PostingStatus {
    SCHEDULED("모집예정"),
    IN_PROGRESS("모집중"),
    CLOSED("모집마감"),
    EVALUATION_COMPLETE("평가완료");

    private final String description;
}