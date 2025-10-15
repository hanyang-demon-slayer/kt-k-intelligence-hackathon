package com.jangyeonguk.backend.dto.jobposting;

import com.jangyeonguk.backend.domain.EmploymentType;
import com.jangyeonguk.backend.domain.JobPosting;
import com.jangyeonguk.backend.domain.PostingStatus;
import com.jangyeonguk.backend.dto.coverletter.CoverLetterQuestionResponseDto;
import com.jangyeonguk.backend.dto.resume.ResumeItemResponseDto;
import com.jangyeonguk.backend.dto.application.ApplicationResponseDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

    import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 채용공고 응답 DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobPostingResponseDto {

    private Long id;
    private String title; // 공고 제목
    private String teamDepartment; // 팀/부서
    private String jobRole; // 직무
    private EmploymentType employmentType; // 고용형태
    private LocalDate applicationStartDate; // 모집시작일
    private LocalDate applicationEndDate; // 모집마감일
    private LocalDate evaluationEndDate; // 평가 마감일
    private String description; // 설명
    private String experienceRequirements; // 경력 요구사항
    private String educationRequirements; // 학력 요구사항
    private String requiredSkills; // 요구기술, 스킬
    private Integer totalScore; // 총점
    private Integer resumeScoreWeight; // 이력서 배점 비중
    private Integer coverLetterScoreWeight; // 자기소개서 배점 비중
    private Integer passingScore; // 합격기준점수
    private Boolean aiAutomaticEvaluation; // AI 자동평가여부
    private Boolean manualReview; // 수동 검토여부
    private String publicLinkUrl; // 공개 링크 URL
    private PostingStatus postingStatus; // 공고상태
    private Long companyId; // 회사 ID
    private String companyName; // 회사명
    private Integer applicationCount; // 지원서 수

    // 중첩된 구조
    private List<ResumeItemResponseDto> resumeItems; // 이력서 항목 목록
    private List<CoverLetterQuestionResponseDto> coverLetterQuestions; // 자기소개서 질문 목록
    private List<ApplicationResponseDto> applications; // 지원서 목록 (통합 API용)

    /**
     * JobPosting 엔티티를 JobPostingResponseDto로 변환
     */
    public static JobPostingResponseDto from(JobPosting jobPosting) {
        return JobPostingResponseDto.builder()
                .id(jobPosting.getId())
                .title(jobPosting.getTitle())
                .teamDepartment(jobPosting.getTeamDepartment())
                .jobRole(jobPosting.getJobRole())
                .employmentType(jobPosting.getEmploymentType())
                .applicationStartDate(jobPosting.getApplicationStartDate() != null ? jobPosting.getApplicationStartDate().toLocalDate() : null)
                .applicationEndDate(jobPosting.getApplicationEndDate() != null ? jobPosting.getApplicationEndDate().toLocalDate() : null)
                .evaluationEndDate(jobPosting.getEvaluationEndDate() != null ? jobPosting.getEvaluationEndDate().toLocalDate() : null)
                .description(jobPosting.getDescription())
                .experienceRequirements(jobPosting.getExperienceRequirements())
                .educationRequirements(jobPosting.getEducationRequirements())
                .requiredSkills(jobPosting.getRequiredSkills())
                .totalScore(jobPosting.getTotalScore())
                .resumeScoreWeight(jobPosting.getResumeScoreWeight())
                .coverLetterScoreWeight(jobPosting.getCoverLetterScoreWeight())
                .passingScore(jobPosting.getPassingScore())
                .aiAutomaticEvaluation(jobPosting.getAiAutomaticEvaluation())
                .manualReview(jobPosting.getManualReview())
                .postingStatus(jobPosting.getPostingStatus())
                .publicLinkUrl(jobPosting.getPublicLinkUrl()) // 공개 링크 URL 추가
                .companyId(jobPosting.getCompany().getId())
                .companyName(jobPosting.getCompany().getName())
                .applicationCount(jobPosting.getApplications() != null ? jobPosting.getApplications().size() : 0) // 지원서 수 추가
                .resumeItems(jobPosting.getResumeItems() != null ?
                        jobPosting.getResumeItems().stream()
                                .map(ResumeItemResponseDto::from)
                                .collect(Collectors.toList()) : new ArrayList<>())
                .coverLetterQuestions(jobPosting.getCoverLetterQuestions() != null ?
                        jobPosting.getCoverLetterQuestions().stream()
                                .map(CoverLetterQuestionResponseDto::from)
                                .collect(Collectors.toList()) : new ArrayList<>())
                .build();
    }

    /**
     * JobPosting 엔티티를 JobPostingResponseDto로 변환 (지원서 데이터 포함)
     */
    public static JobPostingResponseDto fromWithApplications(JobPosting jobPosting) {
        return JobPostingResponseDto.builder()
                .id(jobPosting.getId())
                .title(jobPosting.getTitle())
                .teamDepartment(jobPosting.getTeamDepartment())
                .jobRole(jobPosting.getJobRole())
                .employmentType(jobPosting.getEmploymentType())
                .applicationStartDate(jobPosting.getApplicationStartDate() != null ? jobPosting.getApplicationStartDate().toLocalDate() : null)
                .applicationEndDate(jobPosting.getApplicationEndDate() != null ? jobPosting.getApplicationEndDate().toLocalDate() : null)
                .evaluationEndDate(jobPosting.getEvaluationEndDate() != null ? jobPosting.getEvaluationEndDate().toLocalDate() : null)
                .description(jobPosting.getDescription())
                .experienceRequirements(jobPosting.getExperienceRequirements())
                .educationRequirements(jobPosting.getEducationRequirements())
                .requiredSkills(jobPosting.getRequiredSkills())
                .totalScore(jobPosting.getTotalScore())
                .resumeScoreWeight(jobPosting.getResumeScoreWeight())
                .coverLetterScoreWeight(jobPosting.getCoverLetterScoreWeight())
                .passingScore(jobPosting.getPassingScore())
                .aiAutomaticEvaluation(jobPosting.getAiAutomaticEvaluation())
                .manualReview(jobPosting.getManualReview())
                .postingStatus(jobPosting.getPostingStatus())
                .publicLinkUrl(jobPosting.getPublicLinkUrl())
                .companyId(jobPosting.getCompany().getId())
                .companyName(jobPosting.getCompany().getName())
                .applicationCount(jobPosting.getApplications() != null ? jobPosting.getApplications().size() : 0)
                .resumeItems(jobPosting.getResumeItems() != null ?
                        jobPosting.getResumeItems().stream()
                                .map(ResumeItemResponseDto::from)
                                .collect(Collectors.toList()) : new ArrayList<>())
                .coverLetterQuestions(jobPosting.getCoverLetterQuestions() != null ?
                        jobPosting.getCoverLetterQuestions().stream()
                                .map(CoverLetterQuestionResponseDto::from)
                                .collect(Collectors.toList()) : new ArrayList<>())
                .applications(jobPosting.getApplications() != null ?
                        jobPosting.getApplications().stream()
                                .map(ApplicationResponseDto::from)
                                .collect(Collectors.toList()) : new ArrayList<>())
                .build();
    }

    /**
     * FAST API로 보낼 평가 데이터를 Map 형태로 변환
     */
    public Map<String, Object> toFastApiEvaluationData() {
        Map<String, Object> evaluationData = new HashMap<>();

        evaluationData.put("job_posting_id", this.id);
        evaluationData.put("title", this.title);
        evaluationData.put("company_name", this.companyName);
        evaluationData.put("job_role", this.jobRole);
        evaluationData.put("total_score", this.totalScore);
        evaluationData.put("passing_score", this.passingScore);
        evaluationData.put("ai_automatic_evaluation", this.aiAutomaticEvaluation);
        evaluationData.put("manual_review", this.manualReview);
        evaluationData.put("timestamp", System.currentTimeMillis());

        // 평가 규칙 추가
        Map<String, Object> evaluationRules = new HashMap<>();
        evaluationRules.put("disqualification_criteria", List.of(
            "허위/과장된 내용 기재",
            "표절 또는 AI 생성물을 그대로 사용"
        ));
        evaluationRules.put("tie_breaker_rule", List.of(
            "직무적합(에세이 Q2)",
            "경력",
            "자격증",
            "어학"
        ));
        evaluationRules.put("final_score_formula", Map.of(
            "resume_weight", this.resumeScoreWeight / 100.0,
            "cover_letter_questions_weight", this.coverLetterScoreWeight / 100.0
        ));
        evaluationData.put("evaluation_rules", evaluationRules);

        // 이력서 항목 데이터 (점수 관련 내용이 있는 항목만 포함)
        if (this.resumeItems != null) {
            evaluationData.put("resume_items", this.resumeItems.stream()
                    .filter(item -> {
                        // 이름, 이메일 등 점수 관련 내용이 없는 항목은 제외
                        String itemName = item.getName();
                        if ("이름".equals(itemName) || "이메일".equals(itemName)) {
                            return false;
                        }
                        
                        // 평가 기준이 없거나 비어있는 경우도 제외
                        if (item.getCriteria() == null || item.getCriteria().isEmpty()) {
                            return false;
                        }
                        
                        // maxScore가 0인 경우도 제외
                        if (item.getMaxScore() == null || item.getMaxScore() == 0) {
                            return false;
                        }
                        
                        return true;
                    })
                    .map(item -> {
                        Map<String, Object> itemData = new HashMap<>();
                        itemData.put("id", item.getId());
                        itemData.put("name", item.getName());
                        itemData.put("type", item.getType());
                        itemData.put("score_weight", item.getMaxScore()); // maxScore를 score_weight로 사용
                        itemData.put("is_required", item.getIsRequired());

                        // 평가 기준 데이터
                        if (item.getCriteria() != null) {
                            itemData.put("criteria", item.getCriteria().stream()
                                    .map(criterion -> {
                                        Map<String, Object> criterionData = new HashMap<>();
                                        criterionData.put("grade", criterion.getGrade());
                                        criterionData.put("description", criterion.getDescription());
                                        criterionData.put("score_per_grade", criterion.getScorePerGrade());
                                        return criterionData;
                                    })
                                    .collect(Collectors.toList()));
                        }

                        return itemData;
                    })
                    .collect(Collectors.toList()));
        }

        // 자기소개서 질문 데이터
        if (this.coverLetterQuestions != null) {
            evaluationData.put("cover_letter_questions", this.coverLetterQuestions.stream()
                    .map(question -> {
                        Map<String, Object> questionData = new HashMap<>();
                        questionData.put("id", question.getId());
                        questionData.put("content", question.getContent());
                        questionData.put("is_required", question.getIsRequired());
                        questionData.put("max_characters", question.getMaxCharacters());

                        // 평가 기준 데이터 (새로운 구조: criteria -> details)
                        if (question.getCriteria() != null) {
                            questionData.put("criteria", question.getCriteria().stream()
                                    .map(criterion -> {
                                        Map<String, Object> criterionData = new HashMap<>();
                                        criterionData.put("name", criterion.getName());

                                        // 상세 기준 데이터를 details로 변경
                                        if (criterion.getDetails() != null) {
                                            criterionData.put("details", criterion.getDetails().stream()
                                                    .map(detail -> {
                                                        Map<String, Object> detailData = new HashMap<>();
                                                        detailData.put("grade", detail.getGrade());
                                                        detailData.put("description", detail.getDescription());
                                                        // score_per_grade는 자기소개서에서는 제거 (새로운 구조에 없음)
                                                        return detailData;
                                                    })
                                                    .collect(Collectors.toList()));
                                        }

                                        return criterionData;
                                    })
                                    .collect(Collectors.toList()));
                        }

                        return questionData;
                    })
                    .collect(Collectors.toList()));
        }

        return evaluationData;
    }
}