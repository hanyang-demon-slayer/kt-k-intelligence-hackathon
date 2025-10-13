package com.jangyeonguk.backend.domain;

import jakarta.persistence.*;
import lombok.*;
import com.jangyeonguk.backend.domain.Grade;
import com.jangyeonguk.backend.domain.ResumeItem;

/**
 * 이력서 항목 평가기준 엔티티
 */
@Entity
@Table(name = "resume_item_criteria")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResumeItemCriterion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 등급 (우수/양호/보통/미흡)
    @Enumerated(EnumType.STRING)
    private Grade grade;

    @Column(columnDefinition = "TEXT")
    private String description; // 설명 (예: 박사학위)

    // 등급별 점수
    @Column(name = "score_per_grade")
    private Integer scorePerGrade;

    // 여러 평가기준은 하나의 이력서 항목에 속한다 (N:1)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_item_id")
    private ResumeItem resumeItem;
}