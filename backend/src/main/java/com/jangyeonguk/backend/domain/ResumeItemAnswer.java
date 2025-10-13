package com.jangyeonguk.backend.domain;

import com.jangyeonguk.backend.domain.Application;
import jakarta.persistence.*;
import lombok.*;

/**
 * 이력서 항목 답변 엔티티
 */
@Entity
@Table(name = "resume_item_answers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResumeItemAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 제출한 이력서 답변 내용
    @Column(name = "resume_content", columnDefinition = "TEXT")
    private String resumeContent;

    // 평가 결과 점수 (정량 평가)
    @Column(name = "resume_score")
    private Integer resumeScore;

    // 여러 답변은 하나의 지원서에 속함 (N:1)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id")
    private Application application;

    // 여러 답변은 하나의 이력서 항목에 속함 (N:1)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_item_id")
    private ResumeItem resumeItem;
}