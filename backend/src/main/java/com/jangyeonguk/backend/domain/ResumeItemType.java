package com.jangyeonguk.backend.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 이력서 항목 타입 열거형
 */
@Getter
@AllArgsConstructor
public enum ResumeItemType {
    NUMBER("숫자"),
    DATE("날짜"),
    FILE("파일"),
    TEXT("텍스트");

    private final String description;
    
}