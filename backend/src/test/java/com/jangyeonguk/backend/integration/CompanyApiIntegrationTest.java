package com.jangyeonguk.backend.integration;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jangyeonguk.backend.domain.Company;
import com.jangyeonguk.backend.dto.company.CompanyCreateRequestDto;
import com.jangyeonguk.backend.dto.company.CompanyResponseDto;
import com.jangyeonguk.backend.repository.CompanyRepository;

/**
 * Company API 통합 테스트
 */
@SpringBootTest
@AutoConfigureWebMvc
@ActiveProfiles("test")
@Transactional
public class CompanyApiIntegrationTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        // 테스트 전 데이터 초기화
        companyRepository.deleteAll();
    }

    @Test
    void 회사_등록_성공() throws Exception {
        // Given
        CompanyCreateRequestDto request = new CompanyCreateRequestDto();
        request.setName("테스트 회사");

        // When & Then
        mockMvc.perform(post("/api/companies")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", notNullValue()))
                .andExpect(jsonPath("$.name", is("테스트 회사")));

        // 데이터베이스 검증
        assert companyRepository.count() == 1;
        Company savedCompany = companyRepository.findAll().get(0);
        assert savedCompany.getName().equals("테스트 회사");
    }

    @Test
    void 중복_회사명_등록_실패() throws Exception {
        // Given - 이미 등록된 회사
        Company existingCompany = new Company();
        existingCompany.setName("기존 회사");
        companyRepository.save(existingCompany);

        CompanyCreateRequestDto request = new CompanyCreateRequestDto();
        request.setName("기존 회사");

        // When & Then
        mockMvc.perform(post("/api/companies")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.message", is("이미 등록된 회사입니다: 기존 회사")));
    }

    @Test
    void 첫_번째_회사_조회_성공() throws Exception {
        // Given - 회사 데이터 생성
        Company company1 = new Company();
        company1.setName("첫 번째 회사");
        companyRepository.save(company1);

        Company company2 = new Company();
        company2.setName("두 번째 회사");
        companyRepository.save(company2);

        // When & Then
        mockMvc.perform(get("/api/companies"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", notNullValue()))
                .andExpect(jsonPath("$.name", is("첫 번째 회사")));
    }

    @Test
    void 등록된_회사가_없을_때_조회_실패() throws Exception {
        // Given - 등록된 회사가 없는 상태

        // When & Then
        mockMvc.perform(get("/api/companies"))
                .andExpect(status().isNotFound())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.message", is("등록된 회사가 없습니다.")));
    }

    @Test
    void 회사명_빈값_등록_실패() throws Exception {
        // Given
        CompanyCreateRequestDto request = new CompanyCreateRequestDto();
        request.setName("");

        // When & Then
        mockMvc.perform(post("/api/companies")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isInternalServerError())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    void 회사명_null_등록_실패() throws Exception {
        // Given
        CompanyCreateRequestDto request = new CompanyCreateRequestDto();
        request.setName(null);

        // When & Then
        mockMvc.perform(post("/api/companies")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isInternalServerError())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    void 전체_API_플로우_테스트() throws Exception {
        // 1. 회사 등록
        CompanyCreateRequestDto request = new CompanyCreateRequestDto();
        request.setName("플로우 테스트 회사");

        String response = mockMvc.perform(post("/api/companies")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        CompanyResponseDto createdCompany = objectMapper.readValue(response, CompanyResponseDto.class);

        // 2. 등록된 회사 조회
        mockMvc.perform(get("/api/companies"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(createdCompany.getId().intValue())))
                .andExpect(jsonPath("$.name", is("플로우 테스트 회사")));
    }
}
