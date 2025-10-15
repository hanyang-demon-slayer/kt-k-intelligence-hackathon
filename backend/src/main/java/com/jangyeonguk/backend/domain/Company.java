package com.jangyeonguk.backend.domain;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

/**
 * 회사 엔티티
 */
@Entity
@Table(name = "companies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name; // 회사명

    // 회사 기준 1:N 채용공고. 연관 주인은 JobPosting.company
    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<JobPosting> jobPostings = new ArrayList<>();

    // 양방향 연관관계 편의 메서드: 두 측면을 동시에 동기화하여 일관성 보장
    public void addJobPosting(JobPosting jobPosting) {
        if (jobPosting == null) {
            return;
        }
        this.jobPostings.add(jobPosting);
        jobPosting.setCompany(this);
    }

    // 컬렉션/연관 모두 정리하여 고아 참조 방지
    public void removeJobPosting(JobPosting jobPosting) {
        if (jobPosting == null) {
            return;
        }
        this.jobPostings.remove(jobPosting);
        if (jobPosting.getCompany() == this) {
            jobPosting.setCompany(null);
        }
    }
}