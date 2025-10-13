package com.jangyeonguk.backend.domain.resume;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 등급 열거형
 */
@Getter
@AllArgsConstructor
public enum Grade {
    EXCELLENT("우수"),
    GOOD("양호"),
    NORMAL("보통"),
    POOR("미흡");

    private final String description;
}