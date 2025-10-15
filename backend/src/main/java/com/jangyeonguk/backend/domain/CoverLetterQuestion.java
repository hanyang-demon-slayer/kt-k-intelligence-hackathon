package com.jangyeonguk.backend.domain;

import jakarta.persistence.*;
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


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_posting_id")
    private JobPosting jobPosting;

    @OneToMany(mappedBy = "coverLetterQuestion", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<CoverLetterQuestionCriterion> criteria = new ArrayList<>();
}