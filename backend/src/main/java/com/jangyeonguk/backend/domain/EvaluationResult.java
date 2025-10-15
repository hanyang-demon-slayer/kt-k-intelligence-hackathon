package com.jangyeonguk.backend.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 평가 결과 엔티티
 */
@Entity
@Table(name = "evaluation_results")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EvaluationResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false)
    private Application application;

    @Column(name = "applicant_name", nullable = false)
    private String applicantName;

    @Column(name = "applicant_email", nullable = false)
    private String applicantEmail;

    @Column(name = "job_posting_id", nullable = false)
    private Long jobPostingId;

    @Column(name = "total_score", nullable = false)
    private Integer totalScore;

    @Column(name = "resume_scores", columnDefinition = "TEXT")
    private String resumeScores; // JSON 형태로 저장

    @Column(name = "cover_letter_scores", columnDefinition = "TEXT")
    private String coverLetterScores; // JSON 형태로 저장

    @Column(name = "overall_evaluation", columnDefinition = "TEXT")
    private String overallEvaluation; // JSON 형태로 저장

    @Column(name = "evaluation_completed_at")
    private LocalDateTime evaluationCompletedAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}