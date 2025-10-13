package com.jangyeonguk.backend.domain.coverletter;

import com.jangyeonguk.backend.domain.application.Application;
import jakarta.persistence.*;
import lombok.*;

/**
 * 자기소개서 질문 답변 엔티티
 */
@Entity
@Table(name = "cover_letter_question_answers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CoverLetterQuestionAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "answer_content", columnDefinition = "TEXT")
    private String answerContent; // 답변 내용

    @Column(name = "answer_quantitative_score")
    private Integer answerQuantitativeScore; // 답변 정량 점수

    @Column(name = "answer_summary", columnDefinition = "TEXT")
    private String answerSummary; // 답변 요약

    @Column(name = "answer_qualitative_evaluation", columnDefinition = "TEXT")
    private String answerQualitativeEvaluation; // 답변 정성 평가(json)

    @Column(name = "answer_keywords", columnDefinition = "TEXT")
    private String answerKeywords; // 답변 키워드

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id")
    private Application application;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cover_letter_question_id")
    private CoverLetterQuestion coverLetterQuestion;
}