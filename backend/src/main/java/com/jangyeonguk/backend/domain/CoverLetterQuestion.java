package com.jangyeonguk.backend.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

/**
 * 자기소개서 질문 엔티티
 */
@Entity
@Table(name = "cover_letter_questions")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CoverLetterQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content; // 질문 내용

    @Column(name = "is_required")
    private Boolean isRequired; // 필수여부

    @Column(name = "max_characters")
    private Integer maxCharacters; // 최대글자수

    @Column(name = "max_score")
    @Min(0)
    private Integer maxScore; // 질문별 최대 평가 점수

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_posting_id")
    private JobPosting jobPosting;

    @OneToMany(mappedBy = "coverLetterQuestion", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<CoverLetterQuestionCriterion> criteria = new ArrayList<>();

    @OneToMany(mappedBy = "coverLetterQuestion", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<CoverLetterQuestionAnswer> answers = new ArrayList<>();

    // CoverLetterQuestionCriterion 편의 메서드
    public void addCriterion(CoverLetterQuestionCriterion criterion) {
        if (criterion == null) {
            return;
        }
        this.criteria.add(criterion);
        criterion.setCoverLetterQuestion(this);
    }

    public void removeCriterion(CoverLetterQuestionCriterion criterion) {
        if (criterion == null) {
            return;
        }
        this.criteria.remove(criterion);
        if (criterion.getCoverLetterQuestion() == this) {
            criterion.setCoverLetterQuestion(null);
        }
    }

    // CoverLetterQuestionAnswer 편의 메서드
    public void addAnswer(CoverLetterQuestionAnswer answer) {
        if (answer == null) {
            return;
        }
        this.answers.add(answer);
        answer.setCoverLetterQuestion(this);
    }

    public void removeAnswer(CoverLetterQuestionAnswer answer) {
        if (answer == null) {
            return;
        }
        this.answers.remove(answer);
        if (answer.getCoverLetterQuestion() == this) {
            answer.setCoverLetterQuestion(null);
        }
    }
}