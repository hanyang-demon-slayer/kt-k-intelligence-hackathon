package com.jangyeonguk.backend.domain.resume;

import com.jangyeonguk.backend.domain.jobposting.JobPosting;
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

    @Column(nullable = false)
    private String name; // 항목명

    @Enumerated(EnumType.STRING)
    private ResumeItemType type; // 타입 (숫자, 날짜, 파일, 텍스트)


    @Column(name = "is_required")
    private Boolean isRequired; // 필수여부

    @Column(name = "max_score")
    private Integer maxScore; // 최대점수

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_posting_id")
    private JobPosting jobPosting;

    @OneToMany(mappedBy = "resumeItem", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<ResumeItemCriterion> criteria = new ArrayList<>();
}

