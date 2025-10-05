package com.jangyeonguk.backend.domain.resume;

import com.jangyeonguk.backend.domain.application.Application;
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
public class ResumeItemAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "resume_content", columnDefinition = "TEXT")
    private String resumeContent; // 이력서 내용

    @Column(name = "resume_score")
    private Integer resumeScore; // 이력서 점수

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id")
    private Application application;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_item_id")
    private ResumeItem resumeItem;
}