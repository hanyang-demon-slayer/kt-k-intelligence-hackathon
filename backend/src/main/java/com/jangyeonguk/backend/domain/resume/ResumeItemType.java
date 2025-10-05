package com.jangyeonguk.backend.domain.resume;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 이력서 항목 타입 열거형
 * FastAPI와의 호환성을 위해 JSON 직렬화/역직렬화 시 문자열 값 사용
 */
@Getter
@AllArgsConstructor
public enum ResumeItemType {
    NUMBER("숫자"),
    DATE("날짜"),
    FILE("파일"),
    TEXT("텍스트"),
    CATEGORY("카테고리"),
    NUMERIC_RANGE("숫자 범위"),
    RULE_BASED_COUNT("규칙 기반 개수"),
    SCORE_RANGE("점수 범위"),
    DURATION_BASED("기간 기반"),
    HOURS_RANGE("시간 범위");

    private final String description;
    
    /**
     * JSON 직렬화 시 description 값을 사용하여 FastAPI와 호환성 확보
     */
    @JsonValue
    public String getValue() {
        return this.description;
    }
    
    /**
     * JSON 역직렬화 시 문자열 값을 Enum으로 변환
     * 프론트엔드에서 보내는 다양한 형태의 문자열을 처리
     */
    @JsonCreator
    public static ResumeItemType fromString(String value) {
        if (value == null) {
            return null;
        }
        
        // 대소문자 구분 없이 매칭
        String normalizedValue = value.trim().toUpperCase();
        
        // 직접 매칭
        for (ResumeItemType type : values()) {
            if (type.description.equals(value) || 
                type.name().equals(normalizedValue) ||
                type.name().equals(value)) {
                return type;
            }
        }
        
        // 특별한 케이스 처리
        switch (normalizedValue) {
            case "TEXT":
                return TEXT;
            case "NUMBER":
                return NUMBER;
            case "DATE":
                return DATE;
            case "FILE":
                return FILE;
            case "CATEGORY":
                return CATEGORY;
            case "NUMERIC_RANGE":
            case "NUMERICRANGE":
                return NUMERIC_RANGE;
            case "RULE_BASED_COUNT":
            case "RULEBASEDCOUNT":
                return RULE_BASED_COUNT;
            case "SCORE_RANGE":
            case "SCORERANGE":
                return SCORE_RANGE;
            case "DURATION_BASED":
            case "DURATIONBASED":
                return DURATION_BASED;
            case "HOURS_RANGE":
            case "HOURSRANGE":
                return HOURS_RANGE;
            default:
                throw new IllegalArgumentException("Unknown ResumeItemType: " + value);
        }
    }
}