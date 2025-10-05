package com.jangyeonguk.backend.domain.resume;

import jakarta.persistence.*;
import lombok.*;

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

    @Enumerated(EnumType.STRING)
    private Grade grade; // 등급 (우수, 보통 등)

    @Column(columnDefinition = "TEXT")
    private String description; // 설명 (예: 박사학위)

    @Column(name = "score_per_grade")
    private Integer scorePerGrade; // 등급별 점수

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_item_id")
    private ResumeItem resumeItem;
}