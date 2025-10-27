import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input, Textarea } from './ui/FormInputs';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Building2, 
  MapPin, 
  Clock, 
  Users, 
  GraduationCap, 
  Briefcase, 
  Code,
  ChevronLeft,
  ChevronRight,
  FileText,
  User,
  CheckCircle,
  Home
} from 'lucide-react';
import { useJobPosting, useApplicationSubmission } from '../hooks/useApi';
import { 
  JobPostingResponseDto, 
  ResumeItemResponseDto, 
  CoverLetterQuestionResponseDto,
  ResumeItemType,
  EmploymentType
} from '../services';
import { toast, Toaster } from 'sonner';

interface ApplicationFormData {
  applicantName: string;
  applicantEmail: string;
  resumeItems: { [key: string]: string };
  coverLetterQuestions: { [key: string]: string };
}

interface EducationData {
  university: string;
  department: string;
  status: string;
}

interface GradeData {
  majorType: string; // '인문' 또는 '이공'
  grade: string; // 학점 (예: '3.9')
}

interface LanguageData {
  testType: string; // 'TOEIC' 또는 'OPIc'
  score: string; // TOEIC 점수 또는 OPIc 등급
}

interface AwardData {
  scale: string; // 'KT/정부·전국 규모', '대기업·전문협회', '교내', '동아리·지역'
  content: string; // 실제 수상 내용
}

interface ExperienceData {
  company: string; // 회사명
  position: string; // 직무
  duration: string; // 기간 (개월 수)
}

interface VolunteerData {
  hours: string; // 봉사시간 (숫자만)
}

const ApplicationForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<ApplicationFormData>({
    applicantName: '',
    applicantEmail: '',
    resumeItems: {},
    coverLetterQuestions: {}
  });

  // 학력 데이터 상태
  const [educationData, setEducationData] = useState<EducationData>({
    university: '',
    department: '',
    status: ''
  });

  // 학점 데이터 상태
  const [gradeData, setGradeData] = useState<GradeData>({
    majorType: '',
    grade: ''
  });

  // 어학 데이터 상태
  const [languageData, setLanguageData] = useState<LanguageData>({
    testType: '',
    score: ''
  });

  // 수상경력 데이터 상태
  const [awardData, setAwardData] = useState<AwardData>({
    scale: '',
    content: ''
  });

  // 경력 데이터 상태
  const [experienceData, setExperienceData] = useState<ExperienceData>({
    company: '',
    position: '',
    duration: ''
  });

  // 봉사시간 데이터 상태
  const [volunteerData, setVolunteerData] = useState<VolunteerData>({
    hours: ''
  });

  const { data: jobPosting, isLoading, error } = useJobPosting(parseInt(id || '0'));
  const submitApplicationMutation = useApplicationSubmission();

  useEffect(() => {
    if (jobPosting) {
      // 이력서 항목 초기화
      const initialResumeItems: { [key: string]: string } = {};
      jobPosting.resumeItems?.forEach(item => {
        initialResumeItems[item.id.toString()] = '';
      });
      
      // 자소서 문항 초기화
      const initialCoverLetterQuestions: { [key: string]: string } = {};
      jobPosting.coverLetterQuestions?.forEach(question => {
        initialCoverLetterQuestions[question.id.toString()] = '';
      });

      setFormData({
        applicantName: '',
        applicantEmail: '',
        resumeItems: initialResumeItems,
        coverLetterQuestions: initialCoverLetterQuestions
      });
    }
  }, [jobPosting]);

  const handleResumeItemChange = (itemId: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      resumeItems: {
        ...prev.resumeItems,
        [itemId]: value
      }
    }));
  };

  const handleCoverLetterQuestionChange = (questionId: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      coverLetterQuestions: {
        ...prev.coverLetterQuestions,
        [questionId]: value
      }
    }));
  };

  const handleApplicantInfoChange = (field: 'applicantName' | 'applicantEmail', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEducationChange = (field: keyof EducationData, value: string) => {
    setEducationData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGradeChange = (field: keyof GradeData, value: string) => {
    setGradeData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLanguageChange = (field: keyof LanguageData, value: string) => {
    setLanguageData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAwardChange = (field: keyof AwardData, value: string) => {
    setAwardData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleExperienceChange = (field: keyof ExperienceData, value: string) => {
    setExperienceData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleVolunteerChange = (field: keyof VolunteerData, value: string) => {
    setVolunteerData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 학력 데이터가 변경될 때마다 해당 항목의 값을 업데이트
  useEffect(() => {
    if (jobPosting) {
      const educationItem = jobPosting.resumeItems?.find(item => item.name === '학력');
      if (educationItem) {
        const combinedEducation = educationData.university && educationData.department && educationData.status
          ? `${educationData.university} ${educationData.department} ${educationData.status}`
          : '';
        
        setFormData(prev => ({
          ...prev,
          resumeItems: {
            ...prev.resumeItems,
            [educationItem.id.toString()]: combinedEducation
          }
        }));
      }
    }
  }, [educationData, jobPosting]);

  // 학점 데이터가 변경될 때마다 해당 항목의 값을 업데이트
  useEffect(() => {
    if (jobPosting) {
      const gradeItem = jobPosting.resumeItems?.find(item => item.name === '학점');
      if (gradeItem) {
        const combinedGrade = gradeData.majorType && gradeData.grade
          ? `${gradeData.majorType} ${gradeData.grade}`
          : '';
        
        setFormData(prev => ({
          ...prev,
          resumeItems: {
            ...prev.resumeItems,
            [gradeItem.id.toString()]: combinedGrade
          }
        }));
      }
    }
  }, [gradeData, jobPosting]);

  // 어학 데이터가 변경될 때마다 해당 항목의 값을 업데이트
  useEffect(() => {
    if (jobPosting) {
      const languageItem = jobPosting.resumeItems?.find(item => item.name === '어학');
      if (languageItem) {
        const combinedLanguage = languageData.testType && languageData.score
          ? `${languageData.testType} ${languageData.score}`
          : '';
        
        setFormData(prev => ({
          ...prev,
          resumeItems: {
            ...prev.resumeItems,
            [languageItem.id.toString()]: combinedLanguage
          }
        }));
      }
    }
  }, [languageData, jobPosting]);

  // 수상경력 데이터가 변경될 때마다 해당 항목의 값을 업데이트
  useEffect(() => {
    if (jobPosting) {
      const awardItem = jobPosting.resumeItems?.find(item => item.name === '수상경력');
      if (awardItem) {
        const combinedAward = awardData.scale && awardData.content
          ? `${awardData.scale}, ${awardData.content}`
          : '';
        
        setFormData(prev => ({
          ...prev,
          resumeItems: {
            ...prev.resumeItems,
            [awardItem.id.toString()]: combinedAward
          }
        }));
      }
    }
  }, [awardData, jobPosting]);

  // 경력 데이터가 변경될 때마다 해당 항목의 값을 업데이트
  useEffect(() => {
    if (jobPosting) {
      const experienceItem = jobPosting.resumeItems?.find(item => item.name === '경력');
      if (experienceItem) {
        const combinedExperience = experienceData.company && experienceData.position && experienceData.duration
          ? `${experienceData.company}, ${experienceData.position}, ${experienceData.duration}개월`
          : '';
        
        setFormData(prev => ({
          ...prev,
          resumeItems: {
            ...prev.resumeItems,
            [experienceItem.id.toString()]: combinedExperience
          }
        }));
      }
    }
  }, [experienceData, jobPosting]);

  // 봉사시간 데이터가 변경될 때마다 해당 항목의 값을 업데이트
  useEffect(() => {
    if (jobPosting) {
      const volunteerItem = jobPosting.resumeItems?.find(item => item.name === '봉사시간');
      if (volunteerItem) {
        const combinedVolunteer = volunteerData.hours
          ? `${volunteerData.hours}시간`
          : '';
        
        setFormData(prev => ({
          ...prev,
          resumeItems: {
            ...prev.resumeItems,
            [volunteerItem.id.toString()]: combinedVolunteer
          }
        }));
      }
    }
  }, [volunteerData, jobPosting]);

  const handleSubmit = async () => {
    if (!jobPosting || !formData.applicantName || !formData.applicantEmail) {
      toast.error('이름과 이메일을 입력해주세요.');
      return;
    }

    try {
      const applicationData = {
        applicantName: formData.applicantName,
        applicantEmail: formData.applicantEmail,
        resumeItemAnswers: jobPosting.resumeItems
          ?.filter(item => item.name !== '이름' && item.name !== '이메일')
          ?.map(item => ({
            resumeItemId: item.id,
            resumeItemName: item.name,
            resumeContent: formData.resumeItems[item.id.toString()] || ''
          })) || [],
        coverLetterQuestionAnswers: jobPosting.coverLetterQuestions?.map(question => ({
          coverLetterQuestionId: question.id,
          questionContent: question.content,
          answerContent: formData.coverLetterQuestions[question.id.toString()] || ''
        })) || []
      };

      await submitApplicationMutation.mutateAsync({
        jobPostingId: jobPosting.id,
        applicationData
      });

      // 제출 성공 시 완료 화면 표시
      setIsSubmitted(true);
    } catch (error) {
      console.error('지원서 제출 실패:', error);
    }
  };

  const getEmploymentTypeText = (type: EmploymentType) => {
    switch (type) {
      case 'FULL_TIME': return '정규직';
      case 'PART_TIME': return '파트타임';
      case 'CONTRACT': return '계약직';
      case 'INTERNSHIP': return '인턴';
      case 'FREELANCE': return '프리랜서';
      default: return type;
    }
  };


  const renderResumeItemInput = (item: ResumeItemResponseDto) => {
    const value = formData.resumeItems[item.id.toString()] || '';

    // 학력 항목에 대해서는 특별한 입력 폼 제공
    if (item.name === '학력') {
      return (
        <div className="space-y-4 mt-1">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="university" className="text-sm font-medium text-gray-700">
                대학교
              </Label>
              <Input
                id="university"
                type="text"
                value={educationData.university}
                onChange={(e) => handleEducationChange('university', e.target.value)}
                placeholder="예: 서울대학교"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="department" className="text-sm font-medium text-gray-700">
                학과/학부
              </Label>
              <Input
                id="department"
                type="text"
                value={educationData.department}
                onChange={(e) => handleEducationChange('department', e.target.value)}
                placeholder="예: 컴퓨터공학과"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="status" className="text-sm font-medium text-gray-700">
                재적상태
              </Label>
              <Select value={educationData.status} onValueChange={(value) => handleEducationChange('status', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="졸업">졸업</SelectItem>
                  <SelectItem value="재학">재학</SelectItem>
                  <SelectItem value="자퇴">자퇴</SelectItem>
                  <SelectItem value="휴학">휴학</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            입력된 내용: {educationData.university && educationData.department && educationData.status 
              ? `${educationData.university} ${educationData.department} ${educationData.status}`
              : '모든 항목을 입력해주세요'
            }
          </div>
        </div>
      );
    }

    // 학점 항목에 대해서는 특별한 입력 폼 제공
    if (item.name === '학점') {
      return (
        <div className="space-y-4 mt-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="majorType" className="text-sm font-medium text-gray-700">
                전공 유형
              </Label>
              <Select value={gradeData.majorType} onValueChange={(value) => handleGradeChange('majorType', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="전공 유형을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="인문">인문</SelectItem>
                  <SelectItem value="이공">이공</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="grade" className="text-sm font-medium text-gray-700">
                학점 (만점: 4.5)
              </Label>
              <Input
                id="grade"
                type="number"
                step="0.1"
                min="0"
                max="4.5"
                value={gradeData.grade}
                onChange={(e) => handleGradeChange('grade', e.target.value)}
                placeholder="예: 3.9"
                className="mt-1"
              />
            </div>
          </div>
          <div className="text-sm text-gray-500">
            입력된 내용: {gradeData.majorType && gradeData.grade 
              ? `${gradeData.majorType} ${gradeData.grade}`
              : '전공 유형과 학점을 입력해주세요'
            }
          </div>
        </div>
      );
    }

    // 어학 항목에 대해서는 특별한 입력 폼 제공
    if (item.name === '어학') {
      return (
        <div className="space-y-4 mt-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="testType" className="text-sm font-medium text-gray-700">
                시험 유형
              </Label>
              <Select value={languageData.testType} onValueChange={(value) => handleLanguageChange('testType', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="시험 유형을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TOEIC">TOEIC</SelectItem>
                  <SelectItem value="OPIc">OPIc</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="score" className="text-sm font-medium text-gray-700">
                {languageData.testType === 'TOEIC' ? 'TOEIC 점수' : languageData.testType === 'OPIc' ? 'OPIc 등급' : '점수/등급'}
              </Label>
              {languageData.testType === 'TOEIC' ? (
                <Input
                  id="score"
                  type="number"
                  min="0"
                  max="990"
                  value={languageData.score}
                  onChange={(e) => handleLanguageChange('score', e.target.value)}
                  placeholder="예: 850"
                  className="mt-1"
                />
              ) : languageData.testType === 'OPIc' ? (
                <Select value={languageData.score} onValueChange={(value) => handleLanguageChange('score', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="등급을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AL">AL</SelectItem>
                    <SelectItem value="IH">IH</SelectItem>
                    <SelectItem value="IM3">IM3</SelectItem>
                    <SelectItem value="IM2">IM2</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id="score"
                  type="text"
                  value={languageData.score}
                  onChange={(e) => handleLanguageChange('score', e.target.value)}
                  placeholder="시험 유형을 먼저 선택하세요"
                  className="mt-1"
                  disabled
                />
              )}
            </div>
          </div>
          <div className="text-sm text-gray-500">
            입력된 내용: {languageData.testType && languageData.score 
              ? `${languageData.testType} ${languageData.score}`
              : '시험 유형과 점수/등급을 입력해주세요'
            }
          </div>
        </div>
      );
    }

    // 수상경력 항목에 대해서는 특별한 입력 폼 제공
    if (item.name === '수상경력') {
      return (
        <div className="space-y-4 mt-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="scale" className="text-sm font-medium text-gray-700">
                수상 규모
              </Label>
              <Select value={awardData.scale} onValueChange={(value) => handleAwardChange('scale', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="수상 규모를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="KT/정부·전국 규모">KT/정부·전국 규모</SelectItem>
                  <SelectItem value="대기업·전문협회">대기업·전문협회</SelectItem>
                  <SelectItem value="교내">교내</SelectItem>
                  <SelectItem value="동아리·지역">동아리·지역</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="content" className="text-sm font-medium text-gray-700">
                수상 내용
              </Label>
              <Input
                id="content"
                type="text"
                value={awardData.content}
                onChange={(e) => handleAwardChange('content', e.target.value)}
                placeholder="예: 삼성전자 주최 알고리즘 경진대회 동상"
                className="mt-1"
              />
            </div>
          </div>
          <div className="text-sm text-gray-500">
            입력된 내용: {awardData.scale && awardData.content 
              ? `${awardData.scale}, ${awardData.content}`
              : '수상 규모와 내용을 입력해주세요'
            }
          </div>
        </div>
      );
    }

    // 경력 항목에 대해서는 특별한 입력 폼 제공
    if (item.name === '경력') {
      return (
        <div className="space-y-4 mt-1">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="company" className="text-sm font-medium text-gray-700">
                회사명
              </Label>
              <Input
                id="company"
                type="text"
                value={experienceData.company}
                onChange={(e) => handleExperienceChange('company', e.target.value)}
                placeholder="예: 네이버 웹툰"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="position" className="text-sm font-medium text-gray-700">
                직무
              </Label>
              <Input
                id="position"
                type="text"
                value={experienceData.position}
                onChange={(e) => handleExperienceChange('position', e.target.value)}
                placeholder="예: 백엔드 엔지니어"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="duration" className="text-sm font-medium text-gray-700">
                기간 (개월)
              </Label>
              <Input
                id="duration"
                type="number"
                min="1"
                value={experienceData.duration}
                onChange={(e) => handleExperienceChange('duration', e.target.value)}
                placeholder="예: 14"
                className="mt-1"
              />
            </div>
          </div>
          <div className="text-sm text-gray-500">
            입력된 내용: {experienceData.company && experienceData.position && experienceData.duration
              ? `${experienceData.company}, ${experienceData.position}, ${experienceData.duration}개월`
              : '회사명, 직무, 기간을 모두 입력해주세요'
            }
          </div>
        </div>
      );
    }

    // 봉사시간 항목에 대해서는 특별한 입력 폼 제공
    if (item.name === '봉사시간') {
      return (
        <div className="space-y-4 mt-1">
          <div className="max-w-xs">
            <Label htmlFor="hours" className="text-sm font-medium text-gray-700">
              봉사시간
            </Label>
            <Input
              id="hours"
              type="number"
              min="0"
              value={volunteerData.hours}
              onChange={(e) => handleVolunteerChange('hours', e.target.value)}
              placeholder="예: 50"
              className="mt-1"
            />
          </div>
          <div className="text-sm text-gray-500">
            입력된 내용: {volunteerData.hours
              ? `${volunteerData.hours}시간`
              : '봉사시간을 입력해주세요'
            }
          </div>
        </div>
      );
    }

    switch (item.type) {
      case 'NUMBER':
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => handleResumeItemChange(item.id.toString(), e.target.value)}
            placeholder="숫자를 입력하세요"
            className="mt-1"
          />
        );
      case 'DATE':
        return (
          <Input
            type="date"
            value={value}
            onChange={(e) => handleResumeItemChange(item.id.toString(), e.target.value)}
            className="mt-1"
          />
        );
      case 'TEXT':
      default:
        return (
          <Input
            type="text"
            value={value}
            onChange={(e) => handleResumeItemChange(item.id.toString(), e.target.value)}
            placeholder="내용을 입력하세요"
            className="mt-1"
          />
        );
    }
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">채용공고 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error || !jobPosting) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">채용공고를 찾을 수 없습니다</h1>
          <p className="text-gray-600 mb-4">요청하신 채용공고가 존재하지 않거나 삭제되었습니다.</p>
          <Button onClick={() => navigate('/')} variant="outline">
            홈으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  // 제출 완료 화면
  if (isSubmitted) {
    return (
      <>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-6">
            <div className="bg-green-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">제출이 완료되었습니다</h1>
            <p className="text-gray-600 mb-8 leading-relaxed">
              지원서가 성공적으로 제출되었습니다.<br />
              검토 후 연락드리겠습니다.
            </p>
            <div className="space-y-3">
              <Button 
                onClick={() => navigate('/')} 
                className="w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                홈으로 돌아가기
              </Button>
              <p className="text-sm text-gray-500">
                지원해주셔서 감사합니다.
              </p>
            </div>
          </div>
        </div>
        <Toaster position="top-right" richColors />
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Building2 className="w-8 h-8 text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{jobPosting.companyName}</h1>
                  <p className="text-gray-600">지원서 작성</p>
                </div>
              </div>
              <Badge variant="outline" className="text-sm">
                {currentStep}/3 단계
              </Badge>
            </div>
          </div>
        </div>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center py-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
                <div className="ml-2 text-sm font-medium text-gray-700">
                  {step === 1 && '공고 안내'}
                  {step === 2 && '이력서 항목'}
                  {step === 3 && '자기소개서'}
                </div>
                {step < 3 && (
                  <div className={`w-12 h-0.5 mx-4 ${
                    step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {currentStep === 1 && (
          <div className="space-y-6">
            {/* 지원자 정보 입력 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  지원자 정보
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="applicantName" className="text-sm font-medium">
                      이름 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="applicantName"
                      type="text"
                      value={formData.applicantName}
                      onChange={(e) => handleApplicantInfoChange('applicantName', e.target.value)}
                      placeholder="이름을 입력하세요"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="applicantEmail" className="text-sm font-medium">
                      이메일 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="applicantEmail"
                      type="email"
                      value={formData.applicantEmail}
                      onChange={(e) => handleApplicantInfoChange('applicantEmail', e.target.value)}
                      placeholder="이메일을 입력하세요"
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  채용공고 정보
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{jobPosting.title}</h2>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Building2 className="w-4 h-4" />
                      {jobPosting.teamDepartment}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {jobPosting.jobRole}
                    </div>
                    <div className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      {getEmploymentTypeText(jobPosting.employmentType)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      모집 기간
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">모집 시작:</span>
                        <span className="font-medium">
                          {jobPosting.applicationStartDate ? 
                            new Date(jobPosting.applicationStartDate).toLocaleDateString('ko-KR') : 
                            '미정'
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">모집 마감:</span>
                        <span className="font-medium">
                          {jobPosting.applicationEndDate ? 
                            new Date(jobPosting.applicationEndDate).toLocaleDateString('ko-KR') : 
                            '미정'
                          }
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" />
                      요구사항
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-600">경력:</span>
                        <span className="ml-2 font-medium">{jobPosting.experienceRequirements || '무관'}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">학력:</span>
                        <span className="ml-2 font-medium">{jobPosting.educationRequirements || '무관'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {jobPosting.description && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">공고 설명</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700 whitespace-pre-wrap">{jobPosting.description}</p>
                    </div>
                  </div>
                )}

                {jobPosting.requiredSkills && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Code className="w-4 h-4" />
                      요구 기술/스킬
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {jobPosting.requiredSkills.split(',').map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill.trim()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  이력서 항목 작성
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {jobPosting.resumeItems && jobPosting.resumeItems.length > 0 ? (
                  jobPosting.resumeItems
                    .filter(item => item.name !== '이름' && item.name !== '이메일')
                    .map((item) => (
                    <div key={item.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-base font-medium">
                          {item.name}
                          {item.isRequired && <span className="text-red-500 ml-1">*</span>}
                        </Label>
                      </div>
                      {renderResumeItemInput(item)}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <User className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>작성할 이력서 항목이 없습니다.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  자기소개서 작성
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {jobPosting.coverLetterQuestions && jobPosting.coverLetterQuestions.length > 0 ? (
                  jobPosting.coverLetterQuestions.map((question) => (
                    <div key={question.id} className="space-y-2">
                      <Label className="text-base font-medium">
                        {question.content}
                        {question.isRequired && <span className="text-red-500 ml-1">*</span>}
                      </Label>
                      <Textarea
                        value={formData.coverLetterQuestions[question.id.toString()] || ''}
                        onChange={(e) => handleCoverLetterQuestionChange(question.id.toString(), e.target.value)}
                        placeholder="답변을 입력하세요"
                        rows={4}
                        className="mt-1"
                      />
                      <div className="text-sm text-gray-500">
                        최대 {question.maxCharacters}자
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>작성할 자기소개서 문항이 없습니다.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            이전
          </Button>

          <div className="flex items-center gap-3">
            {currentStep === 3 ? (
              <Button
                onClick={handleSubmit}
                disabled={submitApplicationMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
              >
                {submitApplicationMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    제출 중...
                  </>
                ) : (
                  '지원서 제출'
                )}
              </Button>
            ) : (
              <Button
                onClick={nextStep}
                className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
              >
                다음
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
      </div>
      <Toaster position="top-right" richColors />
    </>
  );
};

export default ApplicationForm;
