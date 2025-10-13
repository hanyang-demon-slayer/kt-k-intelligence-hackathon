package com.jangyeonguk.backend.domain.jobposting;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 고용형태 열거형
 */
@Getter
@AllArgsConstructor
public enum EmploymentType {
    FULL_TIME("정규직"),
    PART_TIME("파트타임"),
    CONTRACT("계약직"),
    INTERNSHIP("인턴십"),
    FREELANCE("프리랜서");

    private final String description;
}