package com.jangyeonguk.backend.domain;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 지원서 엔티티
 */
@Entity
@Table(name = "applications")
@Getter
@Setter
@Builder
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
    @Builder.Default
    private List<ResumeItemAnswer> resumeItemAnswers = new ArrayList<>();

    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
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