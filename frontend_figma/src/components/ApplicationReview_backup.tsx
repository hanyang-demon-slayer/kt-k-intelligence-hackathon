import React, { useState, useMemo, useEffect } from "react";
import { Search, FileText, ChevronLeft, ChevronRight, ArrowLeft, ChevronDown, ChevronUp, Sun, Moon, User, Brain, Target, TrendingUp, AlertTriangle, CheckCircle, XCircle, Award, GraduationCap, ShieldCheck, Heart, Zap, BookOpen, Lightbulb, Eye, MessageSquare, Briefcase, Star } from "lucide-react";
import { useApplicationsByJobPosting, useEvaluationMutation, useApiUtils, useJobPostings, useApplicationEvaluationResult } from '../hooks/useApi';
import { ApplicationResponseDto, ApplicationStatus } from '../services/api';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Separator } from "./ui/separator";

interface Applicant {
  id: string;
  name: string;
  email: string;
  score: number;
  status: 'passed' | 'failed' | 'pending' | 'not-evaluated' | 'unqualified';
  keywords: string[];
  questions: {
    question: string;
    answer: string;
    charCount: string;
  }[];
}

interface ApplicationReviewProps {
  onBack: () => void;
  onFinalEvaluation: () => void;
  currentWorkspaceId?: string;
  memos: Record<string, string>;
  setMemos: (applicantId: string, memo: string) => void;
  applicantStatuses: Record<string, string>;
  setApplicantStatuses: (applicantId: string, status: string) => void;
  getApplicantsByWorkspace: (workspaceId: string | null) => Applicant[];
}

export function ApplicationReview({ onBack, onFinalEvaluation, currentWorkspaceId, memos, setMemos, applicantStatuses, setApplicantStatuses, getApplicantsByWorkspace }: ApplicationReviewProps) {
  // API 호출
  const { data: applications = [], isLoading: applicationsLoading } = useApplicationsByJobPosting(
    currentWorkspaceId ? parseInt(currentWorkspaceId) : 0
  );
  const { data: jobPostings = [] } = useJobPostings();
  const evaluationMutation = useEvaluationMutation();
  const apiUtils = useApiUtils();

  // API에서 가져온 지원자 데이터를 프론트엔드 형식으로 변환
  const convertApplicationsToApplicants = (applications: ApplicationResponseDto[]): Applicant[] => {
    return applications.map(app => ({
      id: app.id.toString(),
      name: app.applicantName,
      email: app.applicantEmail,
      score: 0, // TODO: 실제 점수는 별도 API에서 가져와야 함
      status: apiUtils.convertApplicationStatus(app.status),
      keywords: [], // TODO: 실제 키워드는 별도 API에서 가져와야 함
      questions: [] // TODO: 실제 질문/답변은 별도 API에서 가져와야 함
    }));
  };

  const applicants: Applicant[] = convertApplicationsToApplicants(applications);

  // 워크스페이스별 기본 선택 지원자 설정
  const getDefaultApplicant = (workspaceId: string | null) => {
    if (applicants.length > 0) {
      return applicants[0].name;
    }
    return '지원자 없음';
  };
  
  const [selectedApplicant, setSelectedApplicant] = useState(getDefaultApplicant(currentWorkspaceId ?? null));

  // 현재 공고의 이력서 점수 비중 가져오기
  const currentJobPosting = jobPostings.find(jp => jp.id.toString() === currentWorkspaceId);
  const resumeScoreWeight = currentJobPosting?.resumeScoreWeight || 50; // 기본값 50점

  // 선택된 지원자의 평가 결과 가져오기
  const selectedApplicantForEvaluation = applicants.find(app => app.name === selectedApplicant);
  const { data: evaluationResult, isLoading: evaluationLoading } = useApplicationEvaluationResult(
    selectedApplicantForEvaluation?.id ? parseInt(selectedApplicantForEvaluation.id) : null
  );
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [showScoreDetails, setShowScoreDetails] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showWarningDialog, setShowWarningDialog] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'essay' | 'ai'>('info');

  // 지원자 데이터가 변경되면 선택된 지원자 업데이트
  useEffect(() => {
    if (applicants.length > 0 && !applicants.find(app => app.name === selectedApplicant)) {
      setSelectedApplicant(applicants[0].name);
    }
  }, [applicants, selectedApplicant]);

  const filteredApplicants = useMemo(() => 
    applicants.filter(applicant => 
      applicant.name.toLowerCase().includes(searchQuery.toLowerCase())
    ), [searchQuery, applicants]
  );

  // 평가 상태별로 지원자를 그룹화 (실시간 상태 반영)
  const categorizedApplicants = useMemo(() => {
    const applicantsWithCurrentStatus = filteredApplicants.map(applicant => ({
      ...applicant,
      currentStatus: applicantStatuses[applicant.id] || applicant.status
    }));

    const notEvaluated = applicantsWithCurrentStatus.filter(applicant => 
      applicant.currentStatus === 'not-evaluated' || applicant.currentStatus === 'pending'
    );
    const evaluated = applicantsWithCurrentStatus.filter(applicant => 
      applicant.currentStatus === 'passed' || applicant.currentStatus === 'failed'
    );
    const unqualified = applicantsWithCurrentStatus.filter(applicant => 
      applicant.currentStatus === 'unqualified'
    );
    
    return {
      notEvaluated: notEvaluated.sort((a, b) => a.name.localeCompare(b.name)),
      evaluated: evaluated.sort((a, b) => a.name.localeCompare(b.name)),
      unqualified: unqualified.sort((a, b) => a.name.localeCompare(b.name))
    };
  }, [filteredApplicants, applicantStatuses]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'bg-blue-500';
      case 'failed': return 'bg-red-500';
      case 'pending': return 'bg-yellow-500';
      case 'not-evaluated': return 'bg-gray-400';
      case 'unqualified': return 'bg-red-600';
      default: return 'bg-gray-400';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 40) return 'text-blue-600 dark:text-blue-400';
    if (score >= 30) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  const selectedApplicantData = useMemo(() => {
    return applicants.find(a => a.name === selectedApplicant) || applicants[0]; // 김지원을 기본값으로
  }, [selectedApplicant, applicants]);

  // 평가자 액션 핸들러
  const handleMemoChange = (memo: string) => {
    // 지원자 이름으로 ID 찾기
    const applicant = applicants.find(a => a.name === selectedApplicant);
    if (applicant) {
      setMemos(applicant.id, memo);
    }
  };

  const handleStatusChange = async (status: 'passed' | 'failed' | 'pending') => {
    // 지원자 이름으로 ID 찾기
    const applicant = applicants.find(a => a.name === selectedApplicant);
    if (applicant) {
      try {
        // API를 통해 평가 저장
        await evaluationMutation.mutateAsync({
          applicationId: parseInt(applicant.id),
          evaluationData: {
            comment: memos[applicant.id] || '',
            status: status
          }
        });
        
        // 로컬 상태도 업데이트
        setApplicantStatuses(applicant.id, status);
      } catch (error) {
        console.error('평가 저장 실패:', error);
        // 에러 발생 시에도 로컬 상태는 업데이트 (사용자 경험 개선)
        setApplicantStatuses(applicant.id, status);
      }
    }
  };

  // 현재 선택된 지원자의 실제 상태 (변경된 상태가 있으면 그것을, 없으면 원래 상태)
  const getCurrentStatus = (applicantName: string, originalStatus: string) => {
    // 지원자 이름으로 ID 찾기
    const applicant = applicants.find(a => a.name === applicantName);
    if (applicant) {
      return applicantStatuses[applicant.id] || originalStatus;
    }
    return originalStatus;
  };

  // 미충족 사유 반환 함수
  const getUnqualifiedReason = (applicantName: string) => {
    switch (applicantName) {
      case '권혁진':
        return '학점 기준 미충족';
      case '송민재':
        return '자격증 기준 미충족';
      case '이민지':
        return '어학 점수 기준 미충족';
      default:
        return '기준 미충족';
    }
  };

  // 실제 평가 결과에서 점수 세부사항 계산 - resumeScores JSON 파싱
  const getDetailedScores = () => {
    if (!evaluationResult) {
      return {
        resumeItems: [],
        coverLetterItems: [],
        totalResumeScore: 0,
        totalMaxScore: 0
      };
    }

    // resume_scores JSON 파싱
    let resumeEvaluations: any[] = [];
    try {
      if (typeof evaluationResult.resume_scores === 'string') {
        resumeEvaluations = JSON.parse(evaluationResult.resume_scores);
      } else if (Array.isArray(evaluationResult.resume_scores)) {
        resumeEvaluations = evaluationResult.resume_scores;
      }
    } catch (error) {
      console.error('resume_scores 파싱 오류:', error);
      resumeEvaluations = [];
    }

    // 현재 공고의 ResumeItem 정보 가져오기
    const currentJobPosting = jobPostings.find(jp => jp.id.toString() === currentWorkspaceId);
    const resumeItems = currentJobPosting?.resumeItems || [];

    // 이력서 평가 결과와 ResumeItem 정보 연결
    const resumeItemsWithDetails = resumeEvaluations.map(evalItem => {
      // resumeItemId로 ResumeItem 조회 (타입 변환 고려)
      const resumeItem = resumeItems.find(item => 
        item.id === evalItem.resumeItemId || 
        item.id === Number(evalItem.resumeItemId) ||
        Number(item.id) === evalItem.resumeItemId
      );
      
      const maxScore = evalItem.maxScore !== undefined ? evalItem.maxScore : (resumeItem?.maxScore !== undefined ? resumeItem.maxScore : 10);
      
      return {
        name: resumeItem?.name || evalItem.resumeItemName || '알 수 없는 항목',
        score: evalItem.score || 0,
        maxScore: maxScore, // maxScore가 0이어도 유효한 값으로 처리
        content: evalItem.resumeContent || '',
        description: `${resumeItem?.name || evalItem.resumeItemName}: ${evalItem.score || 0}/${maxScore}점`
      };
    });

    // 자기소개서 평가 결과를 그대로 반환
    const coverLetterItems = evaluationResult.coverLetterQuestionEvaluations?.map(item => ({
      name: `자기소개서 문항 ${item.coverLetterQuestionId}`,
      score: item.answerEvaluations?.find(evaluation => evaluation.grade === '긍정') ? 5 : 3, // 긍정이면 5점, 부정이면 3점
      maxScore: 5,
      content: item.summary || '',
      description: `자기소개서: ${item.answerEvaluations?.find(evaluation => evaluation.grade === '긍정') ? 5 : 3}/5점`
    })) || [];

    // 총점 계산
    const totalResumeScore = resumeItemsWithDetails.reduce((sum, item) => sum + item.score, 0);
    const totalMaxScore = resumeItemsWithDetails.reduce((sum, item) => sum + item.maxScore, 0);

    return {
      resumeItems: resumeItemsWithDetails,
      coverLetterItems,
      totalResumeScore,
      totalMaxScore
    };
  };

  // 자기소개서 분석 데이터
  const getEssayAnalysis = (applicantName: string, questionNumber: number) => {
    if (applicantName === '이지호') {
      if (questionNumber === 1) {
        return {
          keyPoints: [
            { text: '사용자 경험을 최우선으로 생각하며', category: 'attitude', score: 'excellent' },
            { text: 'AI 기술과 결합된 웹 서비스 개발에 큰 관심', category: 'motivation', score: 'good' },
            { text: 'React와 TypeScript를 중심으로 한 모던 프론트엔드 기술 스택에 능숙', category: 'technical', score: 'excellent' },
            { text: '팀 프로젝트를 통해 디자이너, 백엔드 개발자와의 협업 경험', category: 'collaboration', score: 'good' }
          ],
          evaluationCriteria: {
            motivation: { feedback: '지원 동기가 구체적이고 회사에 대한 이해도가 높음' },
            relevance: { feedback: '직무와의 연관성이 명확하게 드러남' },
            specificity: { feedback: '구체적인 기술 스택과 경험을 제시' },
            passion: { feedback: '개발에 대한 열정과 목표가 잘 표현됨' }
          },
          suggestions: [
            '회사의 구체적인 프로젝트나 기술에 대한 언급이 있다면 더 좋을 것',
            '본인만의 차별화된 강점을 더 부각시킬 필요',
            '향후 기여 방안을 더 구체적으로 제시하면 좋을 것'
          ]
        };
      } else {
        return {
          keyPoints: [
            { text: '실시간 협업 대시보드', category: 'project', score: 'excellent' },
            { text: '초기 로딩 시간을 40% 단축', category: 'achievement', score: 'excellent' },
            { text: 'React.memo와 useMemo를 적절히 활용', category: 'technical', score: 'good' },
            { text: 'ARIA 라벨과 키보드 네비게이션을 구현', category: 'quality', score: 'good' }
          ],
          evaluationCriteria: {
            experience: { feedback: '구체적이고 의미있는 프로젝트 경험 제시' },
            technical: { feedback: '최신 기술 스택 활용과 성능 최적화 경험' },
            achievement: { feedback: '정량적 성과 지표 제시 (40% 단축)' },
            teamwork: { feedback: '협업 도구와 프로세스에 대한 이해' }
          },
          suggestions: [
            '프로젝트의 사업적 임팩트나 사용자 수 등 규모 언급 필요',
            '기술적 챌린지와 해결 과정을 더 자세히 설명',
            '리더십이나 주도적 역할에 대한 경험 추가 필요'
          ]
        };
      }
    }
    
    // 김지원 기본값
    if (questionNumber === 1) {
      return {
        keyPoints: [
          { text: 'AI 기술이 사회에 미치는 영향에 깊이 공감', category: 'motivation', score: 'good' },
          { text: 'AI 모델의 성능을 최적화하고 안정적인 서비스를 제공', category: 'goal', score: 'good' },
          { text: '자료구조, 알고리즘, 네트워크 지식', category: 'technical', score: 'good' },
          { text: '팀 프로젝트를 통해 동료들과 협업하며 문제를 해결', category: 'collaboration', score: 'excellent' }
        ],
        evaluationCriteria: {
          motivation: { feedback: '일반적인 동기 서술, 구체성 부족' },
          relevance: { feedback: 'AI와 백엔드 연결점 잘 제시' },
          specificity: { feedback: '구체적인 경험이나 프로젝트 부족' },
          passion: { feedback: '열정은 느껴지나 차별화 부족' }
        },
        suggestions: [
          '더 구체적인 지원 동기와 회사 연구 필요',
          '본인만의 독특한 경험이나 관점 추가',
          '향후 구체적인 기여 방안 제시 필요'
        ]
      };
    } else {
      return {
        keyPoints: [
          { text: '사용자 맞춤형 추천 시스템', category: 'project', score: 'good' },
          { text: '응답 속도를 30% 이상 향상', category: 'achievement', score: 'good' },
          { text: 'Python과 Django를 활용', category: 'technical', score: 'good' },
          { text: 'GitHub을 통한 버전 관리와 코드 리뷰', category: 'process', score: 'good' }
        ],
        evaluationCriteria: {
          experience: { feedback: '의미있는 프로젝트이나 규모나 임팩트 불분명' },
          technical: { feedback: '백엔드 기술 스택 보유하나 깊이 부족' },
          achievement: { feedback: '성과 지표 있으나 구체적 설명 부족' },
          teamwork: { feedback: '협업 프로세스에 대한 좋은 이해' }
        },
        suggestions: [
          '프로젝트의 사용자 수나 데이터 규모 등 구체적 정보 필요',
          '기술적 어려움과 해결 과정 상세 설명',
          '본인의 역할과 기여도를 더 명확히 제시'
        ]
      };
    }
  };

  // AI 분석 데이터
  const getAIAnalysis = (applicantName: string) => {
    if (applicantName === '이지호') {
      return {
        overallAssessment: '우수한 프론트엔드 개발 역량과 실무 경험을 보유한 지원자입니다.',
        strengths: [
          'React, TypeScript 등 최신 프론트엔드 기술 스택 보유',
          '성능 최적화 경험 (로딩 시간 40% 단축)',
          '접근성을 고려한 개발 경험',
          '팀 협업 및 커뮤니케이션 능력'
        ],
        weaknesses: [
          '백엔드 경험 부족',
          '대규모 프로젝트 경험 한정적',
          '리더십 경험 부족'
        ],
        keyInsights: [
          '실무 중심의 구체적인 경험 서술',
          '기술적 역량과 비즈니스 가치 연결 능력',
          '지속적인 학습 의지 표현'
        ],
        recommendation: '합격 권장',
        confidenceLevel: 85
      };
    }
    
    // 김지원 기본값
    return {
      overallAssessment: '견고한 백엔드 개발 기초와 AI 분야에 대한 명확한 목표를 가진 지원자입니다.',
      strengths: [
        'Python, Django 등 백엔드 기술 스택 보유',
        'AI 분야에 대한 관심과 이해',
        '클라우드 인프라 구축 경험',
        '데이터베이스 최적화 경험 (30% 성능 향상)'
      ],
      weaknesses: [
        '프론트엔드 기술 경험 부족',
        '자기소개서 구체성 부족',
        '프로젝트 규모의 한계'
      ],
      keyInsights: [
        'AI 분야에 대한 진정성 있는 관심',
        '기술적 문제 해결 경험',
        '팀워크와 커뮤니케이션 중시'
      ],
      recommendation: '조건부 합격',
      confidenceLevel: 75
    };
  };

  // 지원자별 데이터
  const getApplicantData = (applicantName: string) => {
    if (applicantName === '이지호') {
      return {
        1: {
          question: "해당 회사에 지원한 동기를 서술하시오. (500자)",
          charCount: "485자 / 500자",
          answer: `프론트엔드 개발자로서 사용자 경험을 최우선으로 생각하며, AI 기술과 결합된 웹 서비스 개발에 큰 관심을 가지고 있습니다. 귀사의 AI 서비스들이 직관적이고 접근성 높은 인터페이스로 사용자들에게 혁신적인 경험을 제공하는 것을 보며 강한 매력을 느꼈습니다.

저는 React와 TypeScript를 중심으로 한 모던 프론트엔드 기술 스택에 능숙하며, 사용자 중심의 UI/UX 설계와 구현에 열정을 가지고 있습니다. 특히 복잡한 데이터를 시각적으로 이해하기 쉽게 표현하고, 사용자의 니즈�� 파악하여 직관적인 인터페이스를 구현하는 것에 흥미를 느낍니다.

또한 팀 프로젝트를 통해 디자이너, 백엔드 개발자와의 협업 경험을 쌓으며 효과적인 커뮤니케이션과 코드 리뷰 문화의 중요성을 깨달았습니다. 귀사의 AI 팀에 합류하여 사용자가 AI 기술을 더욱 쉽고 자연스럽게 활용할 수 있는 프론트엔드 환경을 구축하는 데 기여하고 싶습니다.`,
          tags: ["# React", "# TypeScript", "# UI/UX", "# 협업"],
          summary: `지원자는 사용자 경험을 중시하는 프론트엔드 개발자로서 AI 기술과 결합된 웹 서비스 개발에 관심을 표명했습니다. React와 TypeScript 중심의 모던 기술 스택 역량과 복잡한 데이터의 시각화, 직관적 인터페이스 구현에 대한 열정을 강조했습니다. 팀 협업과 커뮤니케이션 경험도 언급하며 AI 서비스의 사용자 접근성 향상에 기여하고자 하는 의지를 보였습니다.`,
          basicInfo: {
            university: "한양대학교",
            gpa: "3.78 / 4.5",
            certificate: "웹디자인기능사",
            language: "TOEIC 880점",
            awards: "대학생 프로그래밍 대회 3등",
            experience: "FE 개발 인턴 4개월"
          }
        },
        2: {
          question: "직무와 관련된 경험에 대해 서술하시오. (800자)",
          charCount: "750자 / 800자",
          answer: `프론트엔드 개발자로서의 역량을 쌓기 위해 다양한 프로젝트를 통해 실무 경험을 축적해왔습니다. 특히 사용자 인터페이스 최적화와 성능 개선에 중점을 두어 개발해왔습니다.

가장 의미 있었던 프로젝트는 '실시간 협업 대시보드'를 개발한 것입니다. 이 프로젝트에서 저는 React와 TypeScript를 활용하여 여러 사용자가 동시에 데이터를 조작하고 시각화할 수 있는 인터페이스를 구현했습니다. 실시간 데이터 동기화를 위해 WebSocket을 활용했고, 상태 관리는 Zustand를 사용하여 복잡한 데이터 플로우를 효율적으로 관리했습니다.

성능 최적화 측면에서는 React.memo와 useMemo를 적절히 활용하여 불필요한 리렌더링을 방지하고, 코드 스플리팅을 통해 초기 로딩 시간을 40% 단축시켰습니다. 또한 접근성을 고려하여 ARIA 라벨과 키보드 네비게이션을 구현하여 모든 사용자가 원활하게 서비스를 이용할 수 있도록 했습니다.

협업 과정에서는 Figma를 통해 디자이너와 긴밀히 소통하며 디자인 시스템을 구축했고, Storybook을 활용하여 컴포넌트 문서화를 진행했습니다. 또한 Jest와 React Testing Library를 사용한 테스트 작성으로 코드 품질을 향상시켰습니다.

이러한 경험을 바탕으로 사용자 중심의 프론트엔드 개발자로서 귀사의 AI 서비스 발전에 기여하고 싶습니다.`,
          tags: ["# React", "# TypeScript", "# 성능최적화", "# 접근성"],
          summary: `지원자는 '실시간 협업 대시보드' 프로젝트를 통해 React, TypeScript, WebSocket, Zustand를 활용한 복잡한 인터페이스 구현 경험을 강조했습니다. 성능 최적화를 통해 로딩 시간 40% 단축, 접근성 고려한 ARIA 구현, Figma를 통한 디자이너 협업, Storybook 문서화, Jest/React Testing Library를 활용한 테스트 경험을 언급했습니다.`,
          basicInfo: {
            university: "한양대학교",
            gpa: "3.78 / 4.5",
            certificate: "웹디자인기능사",
            language: "TOEIC 880점",
            awards: "대학생 프로그래밍 대회 3등",
            experience: "FE 개발 인턴 4개월"
          }
        }
      };
    }
    
    // 기본 김지원 데이터
    return {
      1: {
        question: "해당 회사에 지원한 동기를 서술하시오. (500자)",
        charCount: "430자 / 500자",
        answer: `AI 기술이 사회에 미치는 영향에 깊이 공감하며, AI 기술을 실제 서비스로 구현하는 백엔드 개발에 흥미를 느껴왔습니다. 특히, 귀사의 AI 개발 팀이 진행하는 프로젝트들이 사용자에게 혁신적인 가치를 제공한다는 점에 강한 매력을 느꼈습니다.

저는 8기의 일원이 되어 AI 모델의 성능을 최적화하고 사용자에게 안정적인 서비스를 제공하는 백엔드 시스템을 구축하는 데 기여하고 싶습니다. 학교에서 컴퓨터 공학을 전공하며 습득한 자료구조, 알고리즘, 네트워크 지식을 바탕으로 백엔드 개발 역량을 꾸준히 쌓아왔습니다. 클라우드 기반 인프라 구축과 API 개발 경험을 통해, 복잡한 시스템을 효율적으로 설계하고 구현하는 능력을 길렀습니다.

또한, 팀 프로젝트를 통해 동료들과 협업하며 문제를 해결하고, 더 나은 결과물을 만들기 위해 끊임없이 소통하는 자세를 익혔습니다. 이러한 경험과 열정을 바탕으로 AI 개발 팀의 성장에 기여하고, AI 기술이 더 많은 사람에게 긍정적인 영향을 미칠 수 있도록 최선을 다하겠습니다.`,
        tags: ["# 백엔드", "# AI", "# 협업"],
        summary: `지원자는 AI 모델의 성능을 최적화하고 안정적인 서비스를 제공하는 백엔드 시스템 구축에 기여하고 싶다는 포부를 밝혔습니다. 이를 뒷받침하기 위해 학교에서 배운 컴퓨터 공학 지식(자료구조, 알고리즘, 네트워크)과 클라우드 기반 인프라 구축, API 개발 경험을 통해 쌓은 역량을 강조했습니다.`,
        basicInfo: {
          university: "한양대학교",
          gpa: "3.96 / 4.5",
          certificate: "정보처리기사",
          language: "TOEIC 930점",
          awards: "KT 헤커톤 예선 9등, 학술재 은상",
          experience: "BE 팀 인턴 6개월"
        }
      },
      2: {
        question: "직무와 관련된 경험에 대해 서술하시오. (800자)",
        charCount: "720자 / 800자",
        answer: `저는 백엔드 개발에 대한 깊은 이해를 바탕으로 다양한 프로젝트를 수행하며 실무 역량을 쌓아왔습니다. 특히, 사용자의 데이터를 효율적으로 처리하고, 안정적인 서비스를 제공하는 시스템 구축에 중점을 두었습니다.

가장 대표적인 경험은 '사용자 맞춤형 추천 시스템'을 개발한 것입니다. 이 프로젝트에서 저는 백엔드 개발을 담당하며, Python과 Django를 활용해 사용자의 활동 데이터를 수집하고 분석하는 API를 설계했습니다. 특히, 대량의 데이터를 실시간으로 처리하기 위해 데이터베이스 쿼리를 최적화하고 캐싱 전략을 도입하여 응답 속도를 30% 이상 향상시켰습니다. 이 과정에서 발생한 데이터 정합성 문제는 비동기 처리와 에러 핸들링 로직을 추가하며 해결했습니다.

또한, 클라우드 환경에서 서비스 배포 및 운영 경험도 있습니다. Docker를 활용해 애플리케이션을 컨테이너화하고, AWS EC2에 배포하여 서비스 안정성을 확보했습니다. 이를 통해 개발 환경과 운영 환경의 차이로 인한 문제를 최소화하고, 지속적인 통합 및 배포(CI/CD) 프로세스를 이해하게 되었습니다.

팀 프로젝트를 진행하며 협업의 중요성을 깨달았습니다. GitHub을 통한 버전 관리와 코드 리뷰를 통해 코드 품질을 높였고, 매일 진행되는 스크럼 회의를 통해 팀원들과 소통하며 프로젝트의 목표와 진행 상황을 공유했습니다. 또한, 예기치 않은 문제 발생 시, 적극적으로 해결책을 모색하고 팀원들과 지식을 공유하며 효과적으로 문제를 해결했습니다.

이러한 경험들을 통해 저는 백엔드 개발에 필요한 기술적인 역량뿐만 아니라, 협업을 통해 시너지를 창출하는 자세를 갖추게 되었습니다. 귀사 AI 개발 팀의 백엔드 인턴으로 합류하여, 제가 가진 지식과 경험을 바탕으로 팀의 목표 달성에 기여하고 싶습니다.`,
        tags: ["# Python", "# Django", "# AWS", "# 최적화"],
        summary: `지원자는 '사용자 맞춤형 추천 시스템' 개발을 통해 실무 경험을 쌓았다고 밝혔습니다. Python과 Django를 활용한 API 설계, 데이터베이스 최적화를 통한 30% 성능 향상, Docker와 AWS를 활용한 클라우드 배포 경험을 강조했습니다. 또한 GitHub을 통한 코드 리뷰와 스크럼 회의를 통한 협업 경험도 언급했습니다.`,
        basicInfo: {
          university: "한양대학교",
          gpa: "3.96 / 4.5",
          certificate: "정보처리기사",
          language: "TOEIC 930점",
          awards: "KT 헤커톤 예선 9등, 학술재 은상",
          experience: "BE 팀 인턴 6개월"
        }
      }
    };
  };

  const currentApplicantData = useMemo(() => {
    return getApplicantData(selectedApplicant);
  }, [selectedApplicant]);
  
  const currentQuestionData = useMemo(() => {
    return currentApplicantData[currentQuestion as keyof typeof currentApplicantData];
  }, [currentApplicantData, currentQuestion]);

  const detailedScores = useMemo(() => {
    return getDetailedScores();
  }, [evaluationResult, jobPostings, currentWorkspaceId]);

  // 실제 총점 계산
  const actualTotalScore = useMemo(() => {
    const scores = getDetailedScores();
    return scores.totalResumeScore;
  }, [evaluationResult, jobPostings, currentWorkspaceId]);

  const aiAnalysis = useMemo(() => {
    return getAIAnalysis(selectedApplicant);
  }, [selectedApplicant]);

  const essayAnalysis = useMemo(() => {
    return getEssayAnalysis(selectedApplicant, currentQuestion);
  }, [selectedApplicant, currentQuestion]);

  // 문항 네비게이션 핸들러
  const handleNextQuestion = () => {
    if (currentQuestion < 2) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // 최종 평가 진행 핸들러
  const handleFinalEvaluationClick = () => {
    // 모집 중인 공고인지 확인 (id "1": BE 인턴십 8기 모집, id "2": FE 신입사원 모집)
    const isRecruitingWorkspace = currentWorkspaceId === "1" || currentWorkspaceId === "2";
    
    if (isRecruitingWorkspace) {
      setShowWarningDialog(true);
    } else {
      onFinalEvaluation();
    }
  };

  // 특정 문장을 하이라이트하는 함수
  const renderAnswerWithHighlights = (answer: string) => {
    // 현재 선택된 지원자와 문항의 핵심 포인트 가져오기
    const keyPoints = essayAnalysis.keyPoints;
    
    let highlightedAnswer = answer;
    
    // 각 핵심 포인트에 대해 하이라이트 적용
    keyPoints.forEach((point, index) => {
      if (highlightedAnswer.includes(point.text)) {
        const colorClass = point.score === 'excellent' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                          point.score === 'good' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' :
                          'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
        
        const tooltipText = `${point.category === 'motivation' ? '동기' :
                             point.category === 'technical' ? '기술' :
                             point.category === 'collaboration' ? '협업' :
                             point.category === 'project' ? '프로젝트' :
                             point.category === 'achievement' ? '성과' :
                             point.category === 'attitude' ? '태도' :
                             point.category === 'goal' ? '목표' :
                             point.category === 'quality' ? '품질' :
                             point.category === 'process' ? '프로세스' : point.category} 관련 ${point.score === 'excellent' ? '우수' : point.score === 'good' ? '좋은' : '보통'} 내용`;
        
        highlightedAnswer = highlightedAnswer.replace(
          point.text,
          `<mark class="${colorClass} px-1 py-0.5 rounded cursor-help" title="${tooltipText}">${point.text}</mark>`
        );
      }
    });
    
    // HTML을 JSX로 변환하여 반환
    return <span dangerouslySetInnerHTML={{ __html: highlightedAnswer }} />;
  };

  // 현재 선택된 지원자의 메모 가져오기
  const getCurrentMemo = () => {
    const applicant = applicants.find(a => a.name === selectedApplicant);
    return applicant ? (memos[applicant.id] || '') : '';
  };

  // 로딩 상태 처리
  if (applicationsLoading) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">지원서 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`h-screen flex flex-col ${isDarkMode ? 'dark' : ''}`}>
        <div className="h-screen bg-white dark:bg-background text-gray-900 dark:text-foreground flex flex-col">
          {/* Header */}
          <div className="h-16 border-b border-gray-200 dark:border-border flex items-center justify-between px-6 bg-white dark:bg-background">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                목록
              </Button>
              <div className="h-4 w-px bg-gray-300 dark:bg-border" />
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-foreground">지원서 상세 평가</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="hover:bg-gray-100 dark:hover:bg-accent"
              >
                {isDarkMode ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </Button>
              <Button 
                onClick={handleFinalEvaluationClick}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2"
              >
                최종 평가 진행
              </Button>
            </div>
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* Left Sidebar - Applicant List */}
            <div className="w-64 border-r border-gray-200 dark:border-border bg-gray-50 dark:bg-muted flex flex-col">
              {/* Workspace Info */}
              <div className="p-4 border-b border-gray-200 dark:border-border bg-white dark:bg-background">
                <h3 className="font-semibold text-gray-900 dark:text-foreground mb-1">
                  {currentWorkspaceId === "2" ? "FE 신입사원 모집" : "BE 인턴십 8기 모집"}
                </h3>
                <div className="space-y-2">
                  <div className="text-sm text-gray-600 dark:text-muted-foreground">
                    {currentWorkspaceId === "2" ? "2025.09.03 ~ 2025.09.12" : "2025.09.01 ~ 2025.09.15"}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-muted-foreground">
                    {applicants.length}개 지원서
                  </div>
                  <div className="text-sm text-gray-600 dark:text-muted-foreground">
                    평가완료 {categorizedApplicants.evaluated.length + categorizedApplicants.unqualified.length} / {applicants.length}
                  </div>
                </div>
              </div>

              {/* Search */}
              <div className="p-4 bg-white dark:bg-background border-b border-gray-200 dark:border-border">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="검색"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-gray-50 dark:bg-input-background border-gray-200 dark:border-border"
                  />
                </div>
              </div>

              {/* Applicant List */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-4 space-y-4">
                  {/* 평가 진행 전 섹션 */}
                  {categorizedApplicants.notEvaluated.length > 0 && (
                    <div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-foreground mb-3">
                        평가 진행 전 ({categorizedApplicants.notEvaluated.length}명)
                      </div>
                      <div className="space-y-2">
                        {categorizedApplicants.notEvaluated.map((applicant) => (
                          <div
                            key={applicant.id}
                            onClick={() => setSelectedApplicant(applicant.name)}
                            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                              selectedApplicant === applicant.name
                                ? 'bg-blue-50 dark:bg-accent border-2 border-blue-200 dark:border-primary/20'
                                : 'hover:bg-gray-100 dark:hover:bg-accent/50'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-2 h-2 rounded-full ${getStatusColor(getCurrentStatus(applicant.name, applicant.status))}`} />
                              <span className="font-medium text-foreground">{applicant.name}</span>
                            </div>
                            <span className={`text-sm font-medium ${getScoreColor(applicant.score)}`}>
                              {applicant.score}점
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 평가 완료 섹션 */}
                  {categorizedApplicants.evaluated.length > 0 && (
                    <div className={categorizedApplicants.notEvaluated.length > 0 ? 'pt-4 border-t border-gray-200 dark:border-border' : ''}>
                      <div className="text-sm font-semibold text-gray-900 dark:text-foreground mb-3">
                        평가 완료 ({categorizedApplicants.evaluated.length}명)
                      </div>
                      <div className="space-y-2">
                        {categorizedApplicants.evaluated.map((applicant) => (
                          <div
                            key={applicant.id}
                            onClick={() => setSelectedApplicant(applicant.name)}
                            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors bg-blue-50/30 dark:bg-blue-900/10 ${
                              selectedApplicant === applicant.name
                                ? 'bg-blue-50 dark:bg-accent border-2 border-blue-200 dark:border-primary/20'
                                : 'hover:bg-blue-50 dark:hover:bg-blue-900/20'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-2 h-2 rounded-full ${getStatusColor(getCurrentStatus(applicant.name, applicant.status))}`} />
                              <span className="font-medium text-foreground">{applicant.name}</span>
                            </div>
                            <span className={`text-sm font-medium ${getScoreColor(applicant.score)}`}>
                              {applicant.score}점
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 심사 기준 미충족 섹션 */}
                  {categorizedApplicants.unqualified.length > 0 && (
                    <div className={categorizedApplicants.notEvaluated.length > 0 || categorizedApplicants.evaluated.length > 0 ? 'pt-4 border-t border-gray-200 dark:border-border' : ''}>
                      <div className="text-sm font-semibold text-gray-900 dark:text-foreground mb-3">
                        심사 기준 미충족 ({categorizedApplicants.unqualified.length}명)
                      </div>
                      <div className="space-y-2">
                        {categorizedApplicants.unqualified.map((applicant) => (
                          <div
                            key={applicant.id}
                            onClick={() => setSelectedApplicant(applicant.name)}
                            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors bg-red-50/30 dark:bg-red-900/10 ${
                              selectedApplicant === applicant.name
                                ? 'bg-blue-50 dark:bg-accent border-2 border-blue-200 dark:border-primary/20'
                                : 'hover:bg-red-50 dark:hover:bg-red-900/20'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-2 h-2 rounded-full ${getStatusColor(getCurrentStatus(applicant.name, applicant.status))}`} />
                              <span className="font-medium text-foreground">{applicant.name}</span>
                            </div>
                            <span className={`text-sm font-medium ${getScoreColor(applicant.score)}`}>
                              {applicant.score}점
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto">
                <div className="p-6">
                  {/* 지원자 기본 정보 */}
                  <div className="bg-white dark:bg-background border border-gray-200 dark:border-border rounded-lg p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 dark:bg-muted rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-gray-600 dark:text-muted-foreground" />
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold text-gray-900 dark:text-foreground">{selectedApplicant}</h2>
                          <p className="text-gray-600 dark:text-muted-foreground">{selectedApplicantData?.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600 dark:text-muted-foreground mb-1">총점</div>
                        <div className={`text-2xl font-semibold ${getScoreColor(actualTotalScore)}`}>
                          {actualTotalScore}점 / {detailedScores.totalMaxScore}점
                        </div>
                      </div>
                    </div>

                    {/* 점수 세부사항 */}
                    <div className="border-t border-gray-200 dark:border-border pt-4">
                      <Button
                        variant="ghost"
                        onClick={() => setShowScoreDetails(!showScoreDetails)}
                        className="flex items-center gap-2 text-sm text-gray-600 dark:text-muted-foreground hover:text-gray-900 dark:hover:text-foreground"
                      >
                        점수 세부사항
                        {showScoreDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </Button>
                      
                      {showScoreDetails && (
                        <div className="mt-4 space-y-4">
                          {/* 이력서 항목들 - 실제 지원자 응답과 평가 결과 */}
                          {detailedScores.resumeItems.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">이력서 평가</h4>
                              <div className="space-y-4">
                                {detailedScores.resumeItems.map((item, index) => (
                                  <div key={index} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.name}</span>
                                      <span className={`text-sm font-medium ${getScoreColor(item.score)}`}>
                                        {item.score}/{item.maxScore}점
                                      </span>
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                      <span className="font-medium">지원자 응답: </span>
                                      <span className="italic">"{item.content}"</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* 자기소개서 항목들 - 실제 지원자 응답과 평가 결과 */}
                          {evaluationResult?.coverLetterQuestionEvaluations && evaluationResult.coverLetterQuestionEvaluations.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">자기소개서 평가</h4>
                              <div className="space-y-4">
                                {evaluationResult.coverLetterQuestionEvaluations.map((item, index) => (
                                  <div key={index} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        자기소개서 문항 {item.coverLetterQuestionId}
                                      </span>
                                      <span className={`text-sm font-medium ${getScoreColor(item.answerEvaluations?.find(evaluation => evaluation.grade === '긍정') ? 5 : 3)}`}>
                                        {item.answerEvaluations?.find(evaluation => evaluation.grade === '긍정') ? 5 : 3}/5점
                                      </span>
                                    </div>
                                    
                                    {/* 평가 결과 */}
                                    {item.answerEvaluations && item.answerEvaluations.length > 0 && (
                                      <div className="space-y-2">
                                        {item.answerEvaluations.map((evaluation, evalIndex) => (
                                          <div key={evalIndex} className="text-sm">
                                            <div className="flex items-center gap-2 mb-1">
                                              <span className="font-medium text-gray-700 dark:text-gray-300">평가 결과:</span>
                                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                evaluation.grade === '긍정' 
                                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                              }`}>
                                                {evaluation.grade}
                                              </span>
                                            </div>
                                            <div className="text-gray-600 dark:text-gray-400 mb-1">
                                              <span className="font-medium">평가된 내용: </span>
                                              <span className="italic">"{evaluation.evaluatedContent}"</span>
                                            </div>
                                            <div className="text-gray-600 dark:text-gray-400">
                                              <span className="font-medium">평가 이유: </span>
                                              <span>{evaluation.evaluationReason}</span>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                    
                                    {/* 키워드 */}
                                    {item.keywords && item.keywords.length > 0 && (
                                      <div className="mt-2">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">키워드: </span>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                          {item.keywords.map((keyword, keywordIndex) => (
                                            <span key={keywordIndex} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded dark:bg-blue-900 dark:text-blue-200">
                                              {keyword}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                    
                                    {/* 요약 */}
                                    {item.summary && (
                                      <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                        <span className="font-medium">요약: </span>
                                        <span>{item.summary}</span>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* 평가 결과가 없는 경우 */}
                          {(!evaluationResult?.resumeEvaluations || evaluationResult.resumeEvaluations.length === 0) && 
                           (!evaluationResult?.coverLetterQuestionEvaluations || evaluationResult.coverLetterQuestionEvaluations.length === 0) && (
                            <div className="text-center py-8">
                              <p className="text-sm text-gray-500 dark:text-gray-400">평가 결과가 없습니다.</p>
                              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">평가가 완료되면 점수가 표시됩니다.</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* 심사 기준 미충족 지원자의 사유 표시 */}
                    {selectedApplicantData?.status === 'unqualified' && (
                      <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
                          <AlertTriangle className="w-4 h-4" />
                          <span className="font-medium">심사 기준 미충족</span>
                        </div>
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">{getUnqualifiedReason(selectedApplicant)}</p>
                      </div>
                    )}
                  </div>

                  {/* 탭 네비게이션 */}
                  <div className="bg-white dark:bg-background border border-gray-200 dark:border-border rounded-lg overflow-hidden">
                    <div className="border-b border-gray-200 dark:border-border">
                      <div className="flex">
                        {['info', 'essay', 'ai'].map((tab) => (
                          <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`flex-1 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                              activeTab === tab
                                ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                                : 'border-transparent text-gray-600 dark:text-muted-foreground hover:text-gray-900 dark:hover:text-foreground hover:bg-gray-50 dark:hover:bg-muted'
                            }`}
                          >
                            <div className="flex items-center justify-center gap-2">
                              {tab === 'info' && <User className="w-4 h-4" />}
                              {tab === 'essay' && <FileText className="w-4 h-4" />}
                              {tab === 'ai' && <Brain className="w-4 h-4" />}
                              {tab === 'info' && '이력서'}
                              {tab === 'essay' && '자기소개서'}
                              {tab === 'ai' && 'AI 분석'}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 탭 컨텐츠 */}
                    <div className="p-6">
                      {/* 이력서 탭 */}
                      {activeTab === 'info' && (
                        <div className="space-y-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-4">
                              {detailedScores.resumeItems.slice(0, Math.ceil(detailedScores.resumeItems.length / 2)).map((item, index) => {
                                // 기존 아이콘들을 순환하여 사용
                                const icons = [
                                  <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
                                  <ShieldCheck className="w-5 h-5 text-green-600 dark:text-green-400" />,
                                  <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
                                  <Award className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />,
                                  <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
                                  <BookOpen className="w-5 h-5 text-orange-600 dark:text-orange-400" />,
                                  <Briefcase className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
                                  <Star className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                                ];
                                const selectedIcon = icons[index % icons.length];
                                
                                return (
                                  <div key={index} className="flex items-center gap-3">
                                    {selectedIcon}
                                    <div>
                                      <div className="font-medium text-gray-900 dark:text-foreground">{item.name}</div>
                                      <div className="text-sm text-gray-600 dark:text-muted-foreground">
                                        {item.content}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                            
                            <div className="space-y-4">
                              {detailedScores.resumeItems.slice(Math.ceil(detailedScores.resumeItems.length / 2)).map((item, index) => {
                                // 기존 아이콘들을 순환하여 사용
                                const icons = [
                                  <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
                                  <ShieldCheck className="w-5 h-5 text-green-600 dark:text-green-400" />,
                                  <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
                                  <Award className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />,
                                  <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
                                  <BookOpen className="w-5 h-5 text-orange-600 dark:text-orange-400" />,
                                  <Briefcase className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
                                  <Star className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                                ];
                                const iconIndex = (index + Math.ceil(detailedScores.resumeItems.length / 2)) % icons.length;
                                const selectedIcon = icons[iconIndex];
                                
                                return (
                                  <div key={index} className="flex items-center gap-3">
                                    {selectedIcon}
                                    <div>
                                      <div className="font-medium text-gray-900 dark:text-foreground">{item.name}</div>
                                      <div className="text-sm text-gray-600 dark:text-muted-foreground">
                                        {item.content}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 자기소개서 탭 */}
                      {activeTab === 'essay' && (
                        <div className="space-y-6">
                          {/* 문항 네비게이션 */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-foreground">
                                문항 {currentQuestion} / 2
                              </h3>
                              <div className="text-sm text-gray-600 dark:text-muted-foreground">
                                {currentQuestionData?.charCount}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handlePrevQuestion}
                                disabled={currentQuestion === 1}
                              >
                                <ChevronLeft className="w-4 h-4" />
                                이전
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handleNextQuestion}
                                disabled={currentQuestion === 2}
                              >
                                다음
                                <ChevronRight className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          {/* 문항 제목 */}
                          <div className="bg-gray-50 dark:bg-muted rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 dark:text-foreground">
                              {currentQuestionData?.question}
                            </h4>
                          </div>

                          {/* 키워드 태그 */}
                          <div className="flex flex-wrap gap-2">
                            {currentQuestionData?.tags?.map((tag: string, index: number) => (
                              <Badge key={index} variant="secondary" className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          {/* 자기소개서 내용 */}
                          <div className="bg-gray-50 dark:bg-muted rounded-lg p-4">
                            <div className="text-sm leading-relaxed text-gray-900 dark:text-foreground whitespace-pre-wrap">
                              {renderAnswerWithHighlights(currentQuestionData?.answer || '')}
                            </div>
                          </div>

                          {/* 요약 */}
                          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                            <h5 className="font-medium text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-2">
                              <Eye className="w-4 h-4" />
                              요약
                            </h5>
                            <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
                              {currentQuestionData?.summary}
                            </p>
                          </div>

                          {/* 핵심 포인트 */}
                          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                            <h5 className="font-medium text-green-900 dark:text-green-300 mb-3 flex items-center gap-2">
                              <Lightbulb className="w-4 h-4" />
                              핵심 포인트
                            </h5>
                            <div className="space-y-2">
                              {essayAnalysis.keyPoints.map((point, index) => (
                                <div key={index} className="flex items-start gap-3">
                                  <div className={`w-2 h-2 rounded-full mt-2 ${
                                    point.score === 'excellent' ? 'bg-green-500' :
                                    point.score === 'good' ? 'bg-blue-500' : 'bg-yellow-500'
                                  }`} />
                                  <div className="flex-1">
                                    <div className="text-sm text-green-800 dark:text-green-200">
                                      {point.text}
                                    </div>
                                    <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                                      {point.category === 'motivation' ? '동기' :
                                       point.category === 'technical' ? '기술' :
                                       point.category === 'collaboration' ? '협업' :
                                       point.category === 'project' ? '프로젝트' :
                                       point.category === 'achievement' ? '성과' :
                                       point.category === 'attitude' ? '태도' :
                                       point.category === 'goal' ? '목표' :
                                       point.category === 'quality' ? '품질' :
                                       point.category === 'process' ? '프로세스' : point.category} • 
                                      {point.score === 'excellent' ? '우수' : point.score === 'good' ? '좋음' : '보통'}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* 평가 기준별 점수 */}
                          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                            <h5 className="font-medium text-purple-900 dark:text-purple-300 mb-3 flex items-center gap-2">
                              <Target className="w-4 h-4" />
                              평가 기준별 내용 분석
                            </h5>
                            <div className="space-y-4">
                              {Object.entries(essayAnalysis.evaluationCriteria).map(([key, criteria]) => (
                                <div key={key} className="border-l-3 border-purple-300 dark:border-purple-600 pl-3">
                                  <div className="mb-2">
                                    <h6 className="text-sm font-medium text-purple-800 dark:text-purple-200 mb-1">
                                      {key === 'motivation' ? '지원 동기' :
                                       key === 'relevance' ? '직무 연관성' :
                                       key === 'specificity' ? '구체성' :
                                       key === 'passion' ? '열정 및 목표' :
                                       key === 'experience' ? '경험 및 역량' :
                                       key === 'technical' ? '기술적 역량' :
                                       key === 'achievement' ? '성과 및 결과' :
                                       key === 'teamwork' ? '협업 및 소통' : key}
                                    </h6>
                                  </div>
                                  <p className="text-sm text-purple-700 dark:text-purple-300 leading-relaxed">
                                    {criteria.feedback}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* 개선 제안 */}
                          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                            <h5 className="font-medium text-orange-900 dark:text-orange-300 mb-3 flex items-center gap-2">
                              <TrendingUp className="w-4 h-4" />
                              개선 제안
                            </h5>
                            <ul className="space-y-2">
                              {essayAnalysis.suggestions.map((suggestion, index) => (
                                <li key={index} className="text-sm text-orange-800 dark:text-orange-200 flex items-start gap-2">
                                  <span className="text-orange-600 dark:text-orange-400 mt-1">•</span>
                                  <span>{suggestion}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}

                      {/* AI 분석 탭 */}
                      {activeTab === 'ai' && (
                        <div className="space-y-6">
                          {/* 종합 평가 */}
                          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4">
                            <h5 className="font-medium text-indigo-900 dark:text-indigo-300 mb-3 flex items-center gap-2">
                              <Brain className="w-4 h-4" />
                              종합 평가
                            </h5>
                            <p className="text-sm text-indigo-800 dark:text-indigo-200 leading-relaxed">
                              {aiAnalysis.overallAssessment}
                            </p>
                          </div>

                          {/* 강점 */}
                          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                            <h5 className="font-medium text-green-900 dark:text-green-300 mb-3 flex items-center gap-2">
                              <CheckCircle className="w-4 h-4" />
                              강점
                            </h5>
                            <ul className="space-y-2">
                              {aiAnalysis.strengths.map((strength, index) => (
                                <li key={index} className="text-sm text-green-800 dark:text-green-200 flex items-start gap-2">
                                  <span className="text-green-600 dark:text-green-400 mt-1">•</span>
                                  <span>{strength}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* 개선점 */}
                          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                            <h5 className="font-medium text-red-900 dark:text-red-300 mb-3 flex items-center gap-2">
                              <XCircle className="w-4 h-4" />
                              개선점
                            </h5>
                            <ul className="space-y-2">
                              {aiAnalysis.weaknesses.map((weakness, index) => (
                                <li key={index} className="text-sm text-red-800 dark:text-red-200 flex items-start gap-2">
                                  <span className="text-red-600 dark:text-red-400 mt-1">•</span>
                                  <span>{weakness}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* 핵심 인사이트 */}
                          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                            <h5 className="font-medium text-blue-900 dark:text-blue-300 mb-3 flex items-center gap-2">
                              <Lightbulb className="w-4 h-4" />
                              핵심 인사이트
                            </h5>
                            <ul className="space-y-2">
                              {aiAnalysis.keyInsights.map((insight, index) => (
                                <li key={index} className="text-sm text-blue-800 dark:text-blue-200 flex items-start gap-2">
                                  <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                                  <span>{insight}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* AI 추천 결과 */}
                          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                            <h5 className="font-medium text-purple-900 dark:text-purple-300 mb-3 flex items-center gap-2">
                              <Target className="w-4 h-4" />
                              AI 추천 결과
                            </h5>
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-lg font-semibold text-purple-900 dark:text-purple-300">
                                  {aiAnalysis.recommendation}
                                </div>
                                <div className="text-sm text-purple-700 dark:text-purple-400">
                                  신뢰도: {aiAnalysis.confidenceLevel}%
                                </div>
                              </div>
                              <div className="w-16 h-16 relative">
                                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                                  <path
                                    d="M18 2.0845
                                      a 15.9155 15.9155 0 0 1 0 31.831
                                      a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="rgb(196 181 253)"
                                    strokeWidth="3"
                                  />
                                  <path
                                    d="M18 2.0845
                                      a 15.9155 15.9155 0 0 1 0 31.831
                                      a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="rgb(124 58 237)"
                                    strokeWidth="3"
                                    strokeDasharray={`${aiAnalysis.confidenceLevel}, 100`}
                                  />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <span className="text-xs font-medium text-purple-900 dark:text-purple-300">
                                    {aiAnalysis.confidenceLevel}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 하단 평가 의견 작성 영역 */}
              <div className="border-t border-gray-200 dark:border-border bg-white dark:bg-background p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-gray-600 dark:text-muted-foreground" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-foreground">평가 의견</h3>
                  </div>
                  
                  <Textarea
                    placeholder="지원자에 대한 평가 의견을 작성해주세요..."
                    value={getCurrentMemo()}
                    onChange={(e) => handleMemoChange(e.target.value)}
                    className="min-h-[100px] resize-none"
                  />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 dark:text-muted-foreground">
                        평가 상태:
                      </span>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant={getCurrentStatus(selectedApplicant, selectedApplicantData?.status || '') === 'passed' ? 'default' : 'outline'}
                          onClick={() => handleStatusChange('passed')}
                          className="h-8"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          합격
                        </Button>
                        <Button
                          size="sm"
                          variant={getCurrentStatus(selectedApplicant, selectedApplicantData?.status || '') === 'failed' ? 'default' : 'outline'}
                          onClick={() => handleStatusChange('failed')}
                          className="h-8"
                        >
                          <XCircle className="w-3 h-3 mr-1" />
                          불합격
                        </Button>
                        <Button
                          size="sm"
                          variant={getCurrentStatus(selectedApplicant, selectedApplicantData?.status || '') === 'pending' ? 'default' : 'outline'}
                          onClick={() => handleStatusChange('pending')}
                          className="h-8"
                        >
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          보류
                        </Button>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-500 dark:text-muted-foreground">
                      {getCurrentMemo().length}/500자
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Warning Dialog */}
      <AlertDialog open={showWarningDialog} onOpenChange={setShowWarningDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>모집 진행 중</AlertDialogTitle>
            <AlertDialogDescription>
              현재 모집이 진행 중인 공고입니다. 최종 평가를 진행하시겠습니까?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setShowWarningDialog(false)}>
              취소
            </Button>
            <AlertDialogAction onClick={() => {
              setShowWarningDialog(false);
              onFinalEvaluation();
            }}>
              진행
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}