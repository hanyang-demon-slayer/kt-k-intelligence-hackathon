package com.jangyeonguk.backend.domain;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

/**
 * 지원서 엔티티
 */
@Entity
@Table(name = "applications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private ApplicationStatus status; // 상태 (평가전, 평가중, 평가후, 탈락, 합격, 보류)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "applicant_id")
    private Applicant applicant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_posting_id")
    private JobPosting jobPosting;

    @OneToOne(mappedBy = "application", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private EvaluationResult evaluationResult;

    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ResumeItemAnswer> resumeItemAnswers = new ArrayList<>();

    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<CoverLetterQuestionAnswer> coverLetterQuestionAnswers = new ArrayList<>();

    // EvaluationResult 편의 메서드
    public void setEvaluationResult(EvaluationResult evaluationResult) {
        this.evaluationResult = evaluationResult;
        if (evaluationResult != null && evaluationResult.getApplication() != this) {
            evaluationResult.setApplication(this);
        }
    }

    // ResumeItemAnswer 편의 메서드
    public void addResumeItemAnswer(ResumeItemAnswer resumeItemAnswer) {
        if (resumeItemAnswer == null) {
            return;
        }
        this.resumeItemAnswers.add(resumeItemAnswer);
        resumeItemAnswer.setApplication(this);
    }

    public void removeResumeItemAnswer(ResumeItemAnswer resumeItemAnswer) {
        if (resumeItemAnswer == null) {
            return;
        }
        this.resumeItemAnswers.remove(resumeItemAnswer);
        if (resumeItemAnswer.getApplication() == this) {
            resumeItemAnswer.setApplication(null);
        }
    }

    // CoverLetterQuestionAnswer 편의 메서드
    public void addCoverLetterQuestionAnswer(CoverLetterQuestionAnswer coverLetterQuestionAnswer) {
        if (coverLetterQuestionAnswer == null) {
            return;
        }
        this.coverLetterQuestionAnswers.add(coverLetterQuestionAnswer);
        coverLetterQuestionAnswer.setApplication(this);
    }

    public void removeCoverLetterQuestionAnswer(CoverLetterQuestionAnswer coverLetterQuestionAnswer) {
        if (coverLetterQuestionAnswer == null) {
            return;
        }
        this.coverLetterQuestionAnswers.remove(coverLetterQuestionAnswer);
        if (coverLetterQuestionAnswer.getApplication() == this) {
            coverLetterQuestionAnswer.setApplication(null);
        }
    }
}