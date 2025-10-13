package com.jangyeonguk.backend.domain.application;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 지원서 상태 열거형
 */
@Getter
@AllArgsConstructor
public enum ApplicationStatus {
    BEFORE_EVALUATION("평가전"),
    IN_PROGRESS("평가중"),
    REJECTED("탈락"),
    ACCEPTED("합격"),
    ON_HOLD("보류");

    private final String description;
}