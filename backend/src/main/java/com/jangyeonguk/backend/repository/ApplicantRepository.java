package com.jangyeonguk.backend.repository;

import com.jangyeonguk.backend.domain.Applicant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 지원자 Repository
 */
@Repository
public interface ApplicantRepository extends JpaRepository<Applicant, Long> {
    List<Applicant> findAllByEmail(String email);
    Optional<Applicant> findByEmail(String email);
}