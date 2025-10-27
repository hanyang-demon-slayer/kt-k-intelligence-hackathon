package com.jangyeonguk.backend.domain;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_posting_id", nullable = false)
    private JobPosting jobPosting;

    @Column(name = "total_score", nullable = false)
    private Integer totalScore;

    @Column(name = "resume_scores", columnDefinition = "TEXT")
    private String resumeScores; // JSON 형태로 저장

    @Column(name = "cover_letter_scores", columnDefinition = "TEXT")
    private String coverLetterScores; // JSON 형태로 저장

    @Column(name = "overall_evaluation", columnDefinition = "TEXT")
    private String overallEvaluation; // JSON 형태로 저장

    @Column(name = "hr_comment", columnDefinition = "TEXT")
    private String hrComment; // HR 담당자 추가 코멘트

    @Column(name = "created_at")
    private LocalDateTime createdAt; // 생성일시

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}