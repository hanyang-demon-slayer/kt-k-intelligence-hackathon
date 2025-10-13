package com.jangyeonguk.backend.domain.coverletter;

import com.jangyeonguk.backend.domain.resume.Grade;
import jakarta.persistence.*;
import lombok.*;

/**
 * 자기소개서 질문 평가기준 상세 엔티티
 */
@Entity
@Table(name = "cover_letter_question_criterion_details")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CoverLetterQuestionCriterionDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private Grade grade; // 등급 (우수, 보통 등)

    @Column(columnDefinition = "TEXT")
    private String description; // 설명

    @Column(name = "score_per_grade")
    private Integer scorePerGrade; // 등급별 점수

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cover_letter_question_criterion_id")
    private CoverLetterQuestionCriterion coverLetterQuestionCriterion;
}