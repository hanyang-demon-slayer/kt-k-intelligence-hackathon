package com.jangyeonguk.backend.domain;

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id")
    private Application application;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cover_letter_question_id")
    private CoverLetterQuestion coverLetterQuestion;
}