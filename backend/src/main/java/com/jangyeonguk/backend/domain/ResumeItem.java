package com.jangyeonguk.backend.domain;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

/**
 * 이력서 항목 엔티티
 */
@Entity
@Table(name = "resume_items")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResumeItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 항목 표시명 (예: 학력, 자격증)
    @Column(nullable = false)
    private String name; 

    // 입력 유형 (숫자/텍스트/파일/날짜 등)
    @Enumerated(EnumType.STRING)
    private ResumeItemType type;

    // 필수 제출 여부
    @Column(name = "is_required")
    private Boolean isRequired = false; 

    // 항목별 최대 점수
    @Column(name = "max_score")
    private Integer maxScore; 

    // 여러 ResumeItem은 하나의 JobPosting에 속한다 (N:1)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_posting_id")
    private JobPosting jobPosting;

    // 항목별 평가 기준들 (1:N)
    @OneToMany(mappedBy = "resumeItem", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ResumeItemCriterion> criteria = new ArrayList<>();

    // 항목별 지원자 답변들 (1:N)
    @OneToMany(mappedBy = "resumeItem", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ResumeItemAnswer> answers = new ArrayList<>();

    // ResumeItemCriterion 편의 메서드
    public void addCriterion(ResumeItemCriterion criterion) {
        if (criterion == null) {
            return;
        }
        this.criteria.add(criterion);
        criterion.setResumeItem(this);
    }

    public void removeCriterion(ResumeItemCriterion criterion) {
        if (criterion == null) {
            return;
        }
        this.criteria.remove(criterion);
        if (criterion.getResumeItem() == this) {
            criterion.setResumeItem(null);
        }
    }

    // ResumeItemAnswer 편의 메서드
    public void addAnswer(ResumeItemAnswer answer) {
        if (answer == null) {
            return;
        }
        this.answers.add(answer);
        answer.setResumeItem(this);
    }

    public void removeAnswer(ResumeItemAnswer answer) {
        if (answer == null) {
            return;
        }
        this.answers.remove(answer);
        if (answer.getResumeItem() == this) {
            answer.setResumeItem(null);
        }
    }
}

