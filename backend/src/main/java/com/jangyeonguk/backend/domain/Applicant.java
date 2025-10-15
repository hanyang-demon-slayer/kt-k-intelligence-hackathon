package com.jangyeonguk.backend.domain;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

/**
 * 지원자 엔티티
 */
@Entity
@Table(name = "applicants")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Applicant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name; // 이름

    @Column(nullable = false, unique = true)
    private String email; // 이메일

    @OneToMany(mappedBy = "applicant", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Application> applications = new ArrayList<>();

    // Application 편의 메서드
    public void addApplication(Application application) {
        if (application == null) {
            return;
        }
        this.applications.add(application);
        application.setApplicant(this);
    }

    public void removeApplication(Application application) {
        if (application == null) {
            return;
        }
        this.applications.remove(application);
        if (application.getApplicant() == this) {
            application.setApplicant(null);
        }
    }
}