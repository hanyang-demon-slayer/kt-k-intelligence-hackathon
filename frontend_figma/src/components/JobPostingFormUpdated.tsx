import React, { useState, useEffect } from "react";
import { ArrowLeft, Plus, Trash2, Calendar, MapPin, Users, Building, Target, Clock, Settings, GraduationCap, ShieldCheck, Heart, AlignLeft, Award, Upload, FileText, Download } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { employmentTypeOptions } from '../utils/employmentTypeUtils';

interface ResumeField {
  id: string;
  name: string;
  type: 'text' | 'select' | 'number' | 'date' | 'file' | 'CATEGORY' | 'NUMERIC_RANGE' | 'RULE_BASED_COUNT' | 'SCORE_RANGE' | 'DURATION_BASED' | 'HOURS_RANGE';
  required: boolean;
  options?: string[];
  maxScore?: number;
}

interface CoverLetterQuestion {
  id: string;
  question: string;
  maxLength: number;
  required: boolean;
  weight: number;
}

interface EvaluationCriteriaItem {
  id: string;
  name: string;
  maxScore: number;
  criteria: {
    excellent: { score: number; description: string };
    good: { score: number; description: string };
    normal: { score: number; description: string };
    poor: { score: number; description: string };
  };
}

interface WorkspaceCard {
  id: string;
  title: string;
  period: string;
  team: string;
  applicants?: number;
  status: "recruiting" | "scheduled" | "completed";
  evaluationDeadline?: string; // 평가 마감일 추가
}

interface JobPostingFormProps {
  onBack: () => void;
  onSave: (data: any) => void;
  editingWorkspace?: WorkspaceCard | null;
  isEditMode?: boolean;
}

export function JobPostingForm({ onBack, onSave, editingWorkspace, isEditMode = false }: JobPostingFormProps) {
  const [activeTab, setActiveTab] = useState("basic");
  
  // 수정 모드에서 기존 데이터를 파싱하는 함수
  const parseWorkspaceData = (workspace: WorkspaceCard) => {
    // period를 파싱하여 날짜 추출 (25.09.01 - 25.09.15 형태)
    const [startDateStr, endDateStr] = workspace.period.split(' - ');
    const parseDate = (dateStr: string) => {
      const [year, month, day] = dateStr.split('.');
      return `20${year}-${month}-${day}`;
    };

    // team에서 팀명과 직무 분리 (AI 1팀, BE 개발자 형태)
    const [teamName, positionName] = workspace.team.split(', ');
    
    // 직무명을 영어 키로 변환
    const getPositionKey = (positionName: string) => {
      const positionMap: { [key: string]: string } = {
        '프론트엔드 개발자': 'frontend',
        '백엔드 개발자': 'backend',
        '풀스택 개발자': 'fullstack',
        '모바일 개발자': 'mobile',
        'UI/UX 디자이너': 'designer',
        '기획자/PM': 'pm',
        '데이터 분석가': 'data'
      };
      return positionMap[positionName] || 'frontend';
    };

    // 고용 형태 추정 (제목에서 추출)
    const getEmploymentType = (title: string) => {
      if (title.includes('인턴')) return 'INTERNSHIP';
      if (title.includes('파트타임') || title.includes('파트타임')) return 'PART_TIME';
      if (title.includes('계약직') || title.includes('계약')) return 'CONTRACT';
      if (title.includes('프리랜서') || title.includes('프리')) return 'FREELANCE';
      if (title.includes('신입') || title.includes('경력')) return 'FULL_TIME';
      return 'FULL_TIME'; // 기본값
    };

    return {
      title: workspace.title,
      description: "",
      team: teamName,
      position: getPositionKey(positionName),
      employmentType: getEmploymentType(workspace.title),
      startDate: parseDate(startDateStr),
      endDate: parseDate(endDateStr),
      evaluationDeadline: workspace.evaluationDeadline || "", // 평가 마감일 추가
      location: "",
      experience: "",
      education: "",
      skills: ""
    };
  };

  // 기본 정보
  const [basicInfo, setBasicInfo] = useState(() => {
    if (isEditMode && editingWorkspace) {
      return parseWorkspaceData(editingWorkspace);
    }
    return {
      title: "",
      description: "",
      team: "",
      position: "",
      employmentType: "", // 기본값 설정 - 사용자가 선택하도록
      startDate: "",
      endDate: "",
      evaluationDeadline: "", // 평가 마감일 필드 추가
      location: "",
      experience: "",
      education: "",
      skills: ""
    };
  });

  // 이력서 필드 (이름, 이메일, 학력은 고정)
  const [resumeFields, setResumeFields] = useState<ResumeField[]>([
    { id: "1", name: "이름", type: "text", required: true },
    { id: "2", name: "이메일", type: "text", required: true },
    { 
      id: "3", 
      name: "학력", 
      type: "CATEGORY", 
      required: true
    },
    { 
      id: "4", 
      name: "학점", 
      type: "NUMERIC_RANGE", 
      required: true
    },
    { 
      id: "5", 
      name: "자격증", 
      type: "RULE_BASED_COUNT", 
      required: true
    },
    { 
      id: "6", 
      name: "어학", 
      type: "SCORE_RANGE", 
      required: true
    },
    { 
      id: "7", 
      name: "수상경력", 
      type: "CATEGORY", 
      required: true
    },
    { 
      id: "8", 
      name: "경력", 
      type: "DURATION_BASED", 
      required: true
    },
    { 
      id: "9", 
      name: "봉사시간", 
      type: "HOURS_RANGE", 
      required: false
    },
    { id: "10", name: "전화번호", type: "text", required: true },
    { id: "11", name: "대학교", type: "text", required: true }
  ]);

  // 자기소개서 문항
  const [coverLetterQuestions, setCoverLetterQuestions] = useState<CoverLetterQuestion[]>([
    {
      id: "1",
      question: "해당 회사에 지원한 동기를 서술하시오.",
      maxLength: 500,
      required: true,
      weight: 30
    },
    {
      id: "2", 
      question: "직무와 관련된 경험에 대해 서술하시오.",
      maxLength: 800,
      required: true,
      weight: 40
    }
  ]);

  // 평가 기준
  const [evaluationCriteria, setEvaluationCriteria] = useState({
    totalScore: 50,
    passingScore: 30,
    autoEvaluation: true,
    manualReview: true
  });

  // 이력서 평가 기준
  const [resumeEvaluationCriteria, setResumeEvaluationCriteria] = useState<EvaluationCriteriaItem[]>([
    {
      id: "education",
      name: "학력",
      maxScore: 10,
      criteria: {
        excellent: { score: 10, description: "박사 학위 (전공 일치)" },
        good: { score: 8, description: "석사 학위 (전공 일치)" },
        normal: { score: 6, description: "학사 학위 (전공 일치)" },
        poor: { score: 2, description: "전문학사/고등학교 졸업" }
      }
    },
    {
      id: "experience",
      name: "직무 경험",
      maxScore: 8,
      criteria: {
        excellent: { score: 8, description: "3년 이상 관련 경험" },
        good: { score: 6, description: "1-3년 관련 경험" },
        normal: { score: 4, description: "1년 미만 관련 경험" },
        poor: { score: 0, description: "관련 경험 없음" }
      }
    },
    {
      id: "certificates",
      name: "자격증",
      maxScore: 7,
      criteria: {
        excellent: { score: 7, description: "국가기술자격 (기사 이상)" },
        good: { score: 5, description: "국가기술자격 (산업기사)" },
        normal: { score: 4, description: "민간자격증 (관련 분야)" },
        poor: { score: 0, description: "관련 자격증 없음" }
      }
    },
    {
      id: "volunteer",
      name: "봉사시간",
      maxScore: 10,
      criteria: {
        excellent: { score: 10, description: "100시간 이상" },
        good: { score: 7, description: "50-99시간" },
        normal: { score: 5, description: "20-49시간" },
        poor: { score: 0, description: "봉사 경험 없음" }
      }
    }
  ]);

  // 자기소개서 평가 기준
  const [essayEvaluationCriteria, setEssayEvaluationCriteria] = useState<EvaluationCriteriaItem[]>([
    {
      id: "motivation",
      name: "지원동기와 입사 후 포부",
      maxScore: 25,
      criteria: {
        excellent: { score: 25, description: "명확한 동기, 구체적 목표, 회사 기여 방안 제시" },
        good: { score: 19, description: "일반적인 동기, 추상적 목표" },
        normal: { score: 14, description: "모호한 동기, 구체성 부족" },
        poor: { score: 9, description: "불분명한 동기, 준비 부족" }
      }
    },
    {
      id: "strengths",
      name: "장점과 단점",
      maxScore: 25,
      criteria: {
        excellent: { score: 25, description: "구체적 사례, 깊은 성찰, 개선 계획 명확" },
        good: { score: 19, description: "일반적 장단점, 보통 수준의 성찰" },
        normal: { score: 14, description: "추상적 표현, 사례 부족" },
        poor: { score: 9, description: "형식적 답변, 성찰 부족" }
      }
    },
    {
      id: "wordCount",
      name: "글자수",
      maxScore: 4,
      criteria: {
        excellent: { score: 4, description: "모든 항목 300자 이상, 적정 분량" },
        good: { score: 3, description: "1-2개 항목 300자 미만" },
        normal: { score: 2, description: "3개 이상 항목 300자 미만" },
        poor: { score: 1, description: "대부분 항목 200자 미만" }
      }
    }
  ]);

  const addResumeField = () => {
    const newField: ResumeField = {
      id: Date.now().toString(),
      name: "",
      type: "text",
      required: false
    };
    setResumeFields([...resumeFields, newField]);
  };

  const updateResumeField = (id: string, field: Partial<ResumeField>) => {
    setResumeFields(resumeFields.map(f => f.id === id ? { ...f, ...field } : f));
  };

  const removeResumeField = (id: string) => {
    setResumeFields(resumeFields.filter(f => f.id !== id));
  };

  const addCoverLetterQuestion = () => {
    const newQuestion: CoverLetterQuestion = {
      id: Date.now().toString(),
      question: "",
      maxLength: 500,
      required: true,
      weight: 20
    };
    setCoverLetterQuestions([...coverLetterQuestions, newQuestion]);
  };

  const updateCoverLetterQuestion = (id: string, field: Partial<CoverLetterQuestion>) => {
    setCoverLetterQuestions(coverLetterQuestions.map(q => q.id === id ? { ...q, ...field } : q));
  };

  const removeCoverLetterQuestion = (id: string) => {
    setCoverLetterQuestions(coverLetterQuestions.filter(q => q.id !== id));
  };

  // 이력서 평가 기준 관리 함수들
  const addResumeEvaluationCriteria = () => {
    const newCriteria: EvaluationCriteriaItem = {
      id: Date.now().toString(),
      name: "",
      maxScore: 10,
      criteria: {
        excellent: { score: 10, description: "" },
        good: { score: 7, description: "" },
        normal: { score: 4, description: "" },
        poor: { score: 0, description: "" }
      }
    };
    setResumeEvaluationCriteria([...resumeEvaluationCriteria, newCriteria]);
  };

  const updateResumeEvaluationCriteria = (id: string, updates: Partial<EvaluationCriteriaItem>) => {
    setResumeEvaluationCriteria(resumeEvaluationCriteria.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const removeResumeEvaluationCriteria = (id: string) => {
    setResumeEvaluationCriteria(resumeEvaluationCriteria.filter(item => item.id !== id));
  };

  // 자기소개서 평가 기준 관리 함수들
  const addEssayEvaluationCriteria = () => {
    const newCriteria: EvaluationCriteriaItem = {
      id: Date.now().toString(),
      name: "",
      maxScore: 25,
      criteria: {
        excellent: { score: 25, description: "" },
        good: { score: 19, description: "" },
        normal: { score: 14, description: "" },
        poor: { score: 9, description: "" }
      }
    };
    setEssayEvaluationCriteria([...essayEvaluationCriteria, newCriteria]);
  };

  const updateEssayEvaluationCriteria = (id: string, updates: Partial<EvaluationCriteriaItem>) => {
    setEssayEvaluationCriteria(essayEvaluationCriteria.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const removeEssayEvaluationCriteria = (id: string) => {
    setEssayEvaluationCriteria(essayEvaluationCriteria.filter(item => item.id !== id));
  };

  // 파일 업로드 관리
  const [uploadedFiles, setUploadedFiles] = useState<{
    evaluationCriteria?: File;
    essayExamples?: File;
  }>({});

  const handleFileUpload = (type: 'evaluationCriteria' | 'essayExamples', file: File) => {
    setUploadedFiles(prev => ({
      ...prev,
      [type]: file
    }));
  };

  const handleSave = () => {
    // 기본 검증
    if (!canSave) {
      alert('필수 정보를 모두 입력해주세요.');
      return;
    }

    // 가중치 검증 (경고만)
    if (totalWeight !== 100) {
      const confirm = window.confirm(
        `자기소개서 가중치의 합이 ${totalWeight}%입니다. 계속 진행하시겠습니까?`
      );
      if (!confirm) return;
    }

    // 배점 검증
    if (totalMaxScore === 0) {
      alert('이력서 항목의 배점을 설정해주세요.');
      return;
    }

    const jobPosting = {
      id: isEditMode && editingWorkspace ? editingWorkspace.id : Date.now().toString(),
      basicInfo,
      resumeFields,
      coverLetterQuestions,
      evaluationCriteria,
      resumeEvaluationCriteria,
      essayEvaluationCriteria,
      uploadedFiles,
      createdAt: isEditMode ? undefined : new Date().toISOString(),
      updatedAt: isEditMode ? new Date().toISOString() : undefined,
      status: 'scheduled' as const
    };
    
    onSave(jobPosting);
  };

  const totalWeight = coverLetterQuestions.reduce((sum, q) => sum + q.weight, 0);
  const totalMaxScore = resumeFields.reduce((sum, f) => sum + (f.maxScore || 0), 0);

  const canSave = basicInfo.title && basicInfo.team && basicInfo.position && basicInfo.employmentType && 
                  basicInfo.startDate && basicInfo.endDate && resumeFields.length > 0 && 
                  coverLetterQuestions.length > 0;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6 bg-white">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            뒤로
          </Button>
          <div className="h-4 w-px bg-gray-300" />
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {isEditMode ? '공고 수정' : '새 공고 등록'}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={onBack}>
            취소
          </Button>
          <Button 
            onClick={handleSave} 
            className="bg-blue-600 hover:bg-blue-700"
            disabled={!canSave}
          >
            {isEditMode ? '수정 완료' : '공고 저장'}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">기본 정보</TabsTrigger>
              <TabsTrigger value="resume">이력서 항목</TabsTrigger>
              <TabsTrigger value="cover-letter">자기소개서</TabsTrigger>
              <TabsTrigger value="evaluation">평가 기준</TabsTrigger>
              <TabsTrigger value="detailed-criteria">세부 기준</TabsTrigger>
            </TabsList>

            {/* 기본 정보 탭 */}
            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    기본 정보
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">공고 제목 *</Label>
                      <Input
                        id="title"
                        placeholder="예: FE 신입사원 모집"
                        value={basicInfo.title}
                        onChange={(e) => setBasicInfo({...basicInfo, title: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="team">팀/부서 *</Label>
                      <Input
                        id="team"
                        placeholder="예: AI 2팀"
                        value={basicInfo.team}
                        onChange={(e) => setBasicInfo({...basicInfo, team: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="position">직무 *</Label>
                      <Select value={basicInfo.position} onValueChange={(value) => setBasicInfo({...basicInfo, position: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="직무를 선택하세요" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="frontend">프론트엔드 개발자</SelectItem>
                          <SelectItem value="backend">백엔드 개발자</SelectItem>
                          <SelectItem value="fullstack">풀스택 개발자</SelectItem>
                          <SelectItem value="mobile">모바일 개발자</SelectItem>
                          <SelectItem value="designer">UI/UX 디자이너</SelectItem>
                          <SelectItem value="pm">기획자/PM</SelectItem>
                          <SelectItem value="data">데이터 분석가</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="employmentType">고용 형태 *</Label>
                      <Select value={basicInfo.employmentType} onValueChange={(value) => setBasicInfo({...basicInfo, employmentType: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="고용 형태를 선택하세요" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="intern">인턴</SelectItem>
                          <SelectItem value="newbie">신입</SelectItem>
                          <SelectItem value="experienced">경력</SelectItem>
                          <SelectItem value="contract">계약직</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startDate">모집 시작일 *</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={basicInfo.startDate}
                        onChange={(e) => setBasicInfo({...basicInfo, startDate: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="endDate">모집 마감일 *</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={basicInfo.endDate}
                        onChange={(e) => setBasicInfo({...basicInfo, endDate: e.target.value})}
                      />
                    </div>
                  </div>

                  {/* 서류 평가 마감일 필드 추가 */}
                  <div>
                    <Label htmlFor="evaluationDeadline" className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      서류 평가 마감일
                    </Label>
                    <Input
                      id="evaluationDeadline"
                      type="date"
                      value={basicInfo.evaluationDeadline || ""}
                      onChange={(e) => setBasicInfo({...basicInfo, evaluationDeadline: e.target.value})}
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1 ml-6">
                      인사담당자가 서류 평가를 완료해야 하는 기준일입니다. 이 날짜는 지원자에게 공개되지 않습니다.
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="description">공고 설명</Label>
                    <Textarea
                      id="description"
                      placeholder="공고에 대한 상세 설명을 입력하세요"
                      rows={4}
                      value={basicInfo.description}
                      onChange={(e) => setBasicInfo({...basicInfo, description: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="experience">경력 요구사항</Label>
                      <Input
                        id="experience"
                        placeholder="예: 신입 ~ 3년차"
                        value={basicInfo.experience}
                        onChange={(e) => setBasicInfo({...basicInfo, experience: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="education">학력 요구사항</Label>
                      <Input
                        id="education"
                        placeholder="예: 대학교 졸업"
                        value={basicInfo.education}
                        onChange={(e) => setBasicInfo({...basicInfo, education: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="skills">요구 기술/스킬</Label>
                    <Textarea
                      id="skills"
                      placeholder="필요한 기술 스택이나 스킬을 입력하세요"
                      rows={3}
                      value={basicInfo.skills}
                      onChange={(e) => setBasicInfo({...basicInfo, skills: e.target.value})}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 기존 나머지 탭들은 동일... */}
            <TabsContent value="resume">
              <div>이력서 항목 탭 내용...</div>
            </TabsContent>

            <TabsContent value="cover-letter">
              <div>자기소개서 탭 내용...</div>
            </TabsContent>

            <TabsContent value="evaluation">
              <div>평가 기준 탭 내용...</div>
            </TabsContent>

            <TabsContent value="detailed-criteria">
              <div>세부 기준 탭 내용...</div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}