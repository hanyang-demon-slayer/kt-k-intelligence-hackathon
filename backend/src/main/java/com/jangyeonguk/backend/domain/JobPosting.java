package com.jangyeonguk.backend.domain;

import jakarta.persistence.*;
import lombok.*;
import jakarta.validation.constraints.*;

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
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobPosting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 공고 제목
    @Column(nullable = false)
    @NotBlank
    private String title;

     // 팀/부서
    @Column(name = "team_department")
    private String teamDepartment;

    // 직무
    @Column(name = "job_role")
    private String jobRole; 

    // 고용형태: 정규직/계약직/인턴 등
    @Enumerated(EnumType.STRING)
    @Column(name = "employment_type")
    @NotNull
    private EmploymentType employmentType;

    // 모집 시작일 (이후 마감/평가일과의 일관성은 서비스/검증에서 보장)
    @Column(name = "application_start_date")
    private LocalDateTime applicationStartDate;

    // 모집 마감일
    @Column(name = "application_end_date")
    private LocalDateTime applicationEndDate;

    // 평가 마감일
    @Column(name = "evaluation_end_date")
    private LocalDateTime evaluationEndDate; 

    @Column(columnDefinition = "TEXT")
    private String description; // 설명

    @Column(name = "experience_requirements", columnDefinition = "TEXT")
    private String experienceRequirements; // 경력 요구사항

    @Column(name = "education_requirements", columnDefinition = "TEXT")
    private String educationRequirements; // 학력 요구사항

    @Column(name = "required_skills", columnDefinition = "TEXT")
    private String requiredSkills; // 요구기술, 스킬

    @Column(name = "total_score")
    @Min(0)
    private Integer totalScore; // 총점

    @Column(name = "resume_score_weight")
    @Min(0)
    private Integer resumeScoreWeight; // 이력서 배점 비중

    @Column(name = "cover_letter_score_weight")
    @Min(0)
    private Integer coverLetterScoreWeight; // 자기소개서 배점 비중

    @Column(name = "passing_score")
    @Min(0)
    private Integer passingScore; // 합격기준점수

    @Column(name = "ai_automatic_evaluation")
    private Boolean aiAutomaticEvaluation; // AI 자동평가여부

    @Column(name = "manual_review")
    private Boolean manualReview; // 수동 검토여부

    // 공고 상태: 예정/진행/마감/평가완료
    @Enumerated(EnumType.STRING)
    @Column(name = "posting_status")
    private PostingStatus postingStatus; 
    
    @Column(name = "public_link_url")
    private String publicLinkUrl; // 공개 링크 URL

    // 하나의 공고는 하나의 회사에 속한다 (N:1). 연관 주인은 이쪽(FK 보유)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id")
    private Company company;

    // 하나의 공고는 여러 개의 이력서 항목을 가진다 (1:N)
    @OneToMany(mappedBy = "jobPosting", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<ResumeItem> resumeItems = new ArrayList<>();

    // 하나의 공고는 여러 개의 자기소개서 문항을 가진다 (1:N)
    @OneToMany(mappedBy = "jobPosting", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<CoverLetterQuestion> coverLetterQuestions = new ArrayList<>();

    // 하나의 공고에는 여러 지원서가 접수된다 (1:N)
    @OneToMany(mappedBy = "jobPosting", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Application> applications = new ArrayList<>();

    // 연관 컬렉션 편의 메서드: 두 측면 동기화로 일관성 보장
    public void addResumeItem(ResumeItem resumeItem) {
        if (resumeItem == null) {
            return;
        }
        this.resumeItems.add(resumeItem);
        resumeItem.setJobPosting(this);
    }

    public void removeResumeItem(ResumeItem resumeItem) {
        if (resumeItem == null) {
            return;
        }
        this.resumeItems.remove(resumeItem);
        if (resumeItem.getJobPosting() == this) {
            resumeItem.setJobPosting(null);
        }
    }

    public void addCoverLetterQuestion(CoverLetterQuestion question) {
        if (question == null) {
            return;
        }
        this.coverLetterQuestions.add(question);
        question.setJobPosting(this);
    }

    public void removeCoverLetterQuestion(CoverLetterQuestion question) {
        if (question == null) {
            return;
        }
        this.coverLetterQuestions.remove(question);
        if (question.getJobPosting() == this) {
            question.setJobPosting(null);
        }
    }

    public void addApplication(Application application) {
        if (application == null) {
            return;
        }
        this.applications.add(application);
        application.setJobPosting(this);
    }

    public void removeApplication(Application application) {
        if (application == null) {
            return;
        }
        this.applications.remove(application);
        if (application.getJobPosting() == this) {
            application.setJobPosting(null);
        }
    }

    // 총점 일관성 보장: 총점 = 이력서 배점 비중 + 자기소개서 배점 비중 (null은 0으로 간주)
    @PrePersist
    @PreUpdate
    private void ensureTotalScoreConsistency() {
        int resume = this.resumeScoreWeight != null ? this.resumeScoreWeight : 0;
        int cover = this.coverLetterScoreWeight != null ? this.coverLetterScoreWeight : 0;
        this.totalScore = resume + cover;
        if (this.passingScore != null && this.passingScore >= this.totalScore) {
            throw new IllegalStateException("합격기준점수는 총점보다 작아야 합니다.");
        }
        
        // 자기소개서 질문별 점수 총합 검증
        validateCoverLetterQuestionScores();
        
        // 이력서 항목별 점수 총합 검증
        validateResumeItemScores();
    }
    
    /**
     * 자기소개서 질문별 점수 총합이 coverLetterScoreWeight와 일치하는지 검증
     */
    private void validateCoverLetterQuestionScores() {
        if (this.coverLetterQuestions == null || this.coverLetterQuestions.isEmpty()) {
            return;
        }
        
        int totalQuestionScore = this.coverLetterQuestions.stream()
            .filter(question -> question.getMaxScore() != null)
            .mapToInt(CoverLetterQuestion::getMaxScore)
            .sum();
            
        int expectedScore = this.coverLetterScoreWeight != null ? this.coverLetterScoreWeight : 0;
        
        if (totalQuestionScore != expectedScore) {
            throw new IllegalStateException(
                String.format("자기소개서 질문별 점수 총합(%d)이 자기소개서 배점 비중(%d)과 일치하지 않습니다.", 
                    totalQuestionScore, expectedScore)
            );
        }
    }
    
    /**
     * 이력서 항목별 점수 총합이 resumeScoreWeight와 일치하는지 검증
     */
    private void validateResumeItemScores() {
        if (this.resumeItems == null || this.resumeItems.isEmpty()) {
            return;
        }
        
        int totalItemScore = this.resumeItems.stream()
            .filter(item -> item.getMaxScore() != null)
            .mapToInt(ResumeItem::getMaxScore)
            .sum();
            
        int expectedScore = this.resumeScoreWeight != null ? this.resumeScoreWeight : 0;
        
        if (totalItemScore != expectedScore) {
            throw new IllegalStateException(
                String.format("이력서 항목별 점수 총합(%d)이 이력서 배점 비중(%d)과 일치하지 않습니다.", 
                    totalItemScore, expectedScore)
            );
        }
    }
}