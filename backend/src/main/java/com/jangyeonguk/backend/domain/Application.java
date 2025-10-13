package com.jangyeonguk.backend.domain.application;

import com.jangyeonguk.backend.domain.coverletter.CoverLetterQuestionAnswer;
import com.jangyeonguk.backend.domain.jobposting.JobPosting;
import com.jangyeonguk.backend.domain.resume.ResumeItemAnswer;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
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

    @Column(name = "total_evaluation_score")
    private Integer totalEvaluationScore; // 평가 총점

    @Column(name = "evaluation_comment", columnDefinition = "TEXT")
    private String evaluationComment; // 평가 의견

    @Column(name = "resume_quantitative_score")
    private Integer resumeQuantitativeScore; // 이력서 정량 점수

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "applicant_id")
    private Applicant applicant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_posting_id")
    private JobPosting jobPosting;

    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ResumeItemAnswer> resumeItemAnswers = new ArrayList<>();

    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<CoverLetterQuestionAnswer> coverLetterQuestionAnswers = new ArrayList<>();
}