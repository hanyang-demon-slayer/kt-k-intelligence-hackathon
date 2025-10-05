package com.jangyeonguk.backend.domain.coverletter;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

/**
 * 자기소개서 질문 평가기준 엔티티
 */
@Entity
@Table(name = "cover_letter_question_criteria")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CoverLetterQuestionCriterion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name; // 평가기준 이름

    @Column(name = "overall_description", columnDefinition = "TEXT")
    private String overallDescription; // 전반적인 설명
    // TODO: 이거 나중에 LLM이 학습한 설명으로 바꿀거임!

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cover_letter_question_id")
    private CoverLetterQuestion coverLetterQuestion;

    @OneToMany(mappedBy = "coverLetterQuestionCriterion", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<CoverLetterQuestionCriterionDetail> details = new ArrayList<>();
}