package com.jangyeonguk.backend.repository;

import com.jangyeonguk.backend.domain.jobposting.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * 회사 Repository
 */
@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {

    /**
     * 회사 존재 여부 확인
     */
    boolean existsByName(String name);
}