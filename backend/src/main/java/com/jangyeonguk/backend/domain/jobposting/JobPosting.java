package com.jangyeonguk.backend.domain.jobposting;

import com.jangyeonguk.backend.domain.application.Application;
import com.jangyeonguk.backend.domain.coverletter.CoverLetterQuestion;
import com.jangyeonguk.backend.domain.resume.ResumeItem;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * 채용공고 엔티티
 */
@Entity
@Table(name = "job_postings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobPosting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title; // 공고 제목

    @Column(name = "team_department")
    private String teamDepartment; // 팀/부서

    @Column(name = "job_role")
    private String jobRole; // 직무

    @Enumerated(EnumType.STRING)
    @Column(name = "employment_type")
    private EmploymentType employmentType; // 고용형태

    @Column(name = "application_start_date")
    private LocalDateTime applicationStartDate; // 모집시작일

    @Column(name = "application_end_date")
    private LocalDateTime applicationEndDate; // 모집마감일

    @Column(name = "evaluation_end_date")
    private LocalDateTime evaluationEndDate; // 평가 마감일

    @Column(columnDefinition = "TEXT")
    private String description; // 설명

    @Column(name = "experience_requirements", columnDefinition = "TEXT")
    private String experienceRequirements; // 경력 요구사항

    @Column(name = "education_requirements", columnDefinition = "TEXT")
    private String educationRequirements; // 학력 요구사항

    @Column(name = "required_skills", columnDefinition = "TEXT")
    private String requiredSkills; // 요구기술, 스킬

    @Column(name = "total_score")
    private Integer totalScore; // 총점

    @Column(name = "resume_score_weight")
    private Integer resumeScoreWeight; // 이력서 배점 비중

    @Column(name = "cover_letter_score_weight")
    private Integer coverLetterScoreWeight; // 자기소개서 배점 비중

    @Column(name = "passing_score")
    private Integer passingScore; // 합격기준점수

    @Column(name = "ai_automatic_evaluation")
    private Boolean aiAutomaticEvaluation; // AI 자동평가여부

    @Column(name = "manual_review")
    private Boolean manualReview; // 수동 검토여부

    @Enumerated(EnumType.STRING)
    @Column(name = "posting_status")
    private PostingStatus postingStatus; // 공고상태


    @Column(name = "public_link_url")
    private String publicLinkUrl; // 공개 링크 URL

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id")
    private Company company;

    @OneToMany(mappedBy = "jobPosting", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<ResumeItem> resumeItems = new ArrayList<>();

    @OneToMany(mappedBy = "jobPosting", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<CoverLetterQuestion> coverLetterQuestions = new ArrayList<>();

    @OneToMany(mappedBy = "jobPosting", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Application> applications = new ArrayList<>();
}