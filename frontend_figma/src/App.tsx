import React, { useState, useMemo, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { StatCard } from "./components/StatCard";
import { ProgressSection } from "./components/ProgressSection";
import { EvaluationSection } from "./components/EvaluationSection";
import { RecruitmentCalendar } from "./components/RecruitmentCalendar";
import { WorkspaceManagement } from "./components/WorkspaceManagement";
import { ApplicationReview } from "./components/ApplicationReview";
import { FinalEvaluation } from "./components/FinalEvaluation";
import { ApplicationEvaluation } from "./components/ApplicationEvaluation";
import { ApplicantStatistics } from "./components/ApplicantStatistics";
import CompanyRegistration from "./components/CompanyRegistration";
import { MapPin, FileText, Clock, Star } from "lucide-react";
import { Toaster } from "sonner";
import { getKoreanDate, calculateWorkspaceStatus } from "./utils/dateUtils";
import {
  useJobPostings,
  useCompany,
  useApplicationsByJobPosting,
  useMultipleApplications,
  useApiUtils
} from './hooks/useApi';
import { 
  JobPostingResponseDto, 
  ApplicationResponseDto,
  PostingStatus,
  ApplicationStatus 
} from './services/api';

// 워크스페이스 데이터 타입
interface WorkspaceCard {
  id: string;
  title: string;
  period: string;
  team: string;
  applicants?: number;
  status: "recruiting" | "scheduled" | "recruitment-completed" | "evaluation-completed";
  evaluationDeadline?: string; // 서류 평가 마감일 추가
}

// 평가 기준 데이터 타입
interface EvaluationCriteriaItem {
  id: string;
  name: string;
  maxScore: number;
  criteria: {
    excellent: { score: number; description: string };
    good: { score: number; description: string };
    fair: { score: number; description: string };
    poor: { score: number; description: string };
  };
}

// 지원자 데이터 타입
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

// API에서 가져온 지원자 데이터를 프론트엔드 형식으로 변환하는 함수
const convertApplicationsToApplicants = (applications: ApplicationResponseDto[]): Applicant[] => {
  return applications.map(app => ({
    id: app.id.toString(),
    name: app.applicantName,
    email: app.applicantEmail,
    score: 0, // TODO: 실제 점수는 별도 API에서 가져와야 함
    status: 'not-evaluated' as const, // TODO: 실제 상태는 API에서 가져와야 함
    keywords: [], // TODO: 실제 키워드는 별도 API에서 가져와야 함
    questions: [] // TODO: 실제 질문/답변은 별도 API에서 가져와야 함
  }));
};

// 워크스페이스별 지원자 데이터를 가져오는 함수 (기존 인터페이스 유지)
const getApplicantsByWorkspace = (workspaceId: string | null): Applicant[] => {
  // TODO: 실제로는 useApplicationsByJobPosting 훅을 사용해야 하지만,
  // 현재는 컴포넌트 외부에서 호출되므로 빈 배열 반환
  // 나중에 이 함수를 컴포넌트 내부로 이동하거나 다른 방식으로 처리 필요
  return [];
};

export default function App() {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [currentView, setCurrentView] = useState<'main' | 'application-review' | 'final-evaluation'>('main');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [completedWorkspaces, setCompletedWorkspaces] = useState<string[]>([]);
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState<string | null>(null);
  // API 호출
  const { data: jobPostings = [], isLoading: jobPostingsLoading } = useJobPostings();
  const { data: company, isLoading: companyLoading } = useCompany();
  const apiUtils = useApiUtils();

  // 기업 등록 상태는 API에서 가져온 회사 데이터로 판단
  const isCompanyRegistered = !!company;

  // 기업 등록 완료 핸들러
  const handleCompanyRegistrationComplete = () => {
    // API 데이터가 업데이트되면 자동으로 isCompanyRegistered가 true가 됨
    // 추가 작업이 필요하지 않음
  };

  // 다크모드 토글 함수
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // 모집중인 워크스페이스 ID들 추출
  const recruitingWorkspaceIds = useMemo(() => {
    return jobPostings
      .filter(jobPosting => apiUtils.convertPostingStatus(jobPosting.postingStatus) === 'recruiting')
      .map(jobPosting => jobPosting.id);
  }, [jobPostings, apiUtils]);

  // 모집중인 워크스페이스들의 지원서 데이터 가져오기
  const applicationsQueries = useMultipleApplications(recruitingWorkspaceIds);

  // 날짜 형식 변환 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear().toString().slice(2); // 2자리 연도
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

  // 직무 이름 변환 함수 (백엔드 jobRole과 매핑)
  const getPositionName = (jobRole: string) => {
    // 백엔드에서 jobRole이 이미 한글로 저장되어 있다면 그대로 사용
    // 아니면 영어 키를 한글로 변환
    const positionMap: { [key: string]: string } = {
      'frontend': '프론트엔드 개발자',
      'backend': '백엔드 개발자',
      'fullstack': '풀스택 개발자',
      'mobile': '모바일 개발자',
      'designer': 'UI/UX 디자이너',
      'pm': '기획자/PM',
      'data': '데이터 분석가'
    };
    return positionMap[jobRole] || jobRole;
  };
  
  // 워크스페이스별 평가 기준 저장
  const [workspaceEvaluationCriteria, setWorkspaceEvaluationCriteria] = useState<{
    [workspaceId: string]: {
      resumeEvaluationCriteria: EvaluationCriteriaItem[];
      essayEvaluationCriteria: EvaluationCriteriaItem[];
    };
  }>({});

  // 평가 의견 및 상태 관리
  const [memos, setMemos] = useState<Record<string, string>>({});
  const [applicantStatuses, setApplicantStatuses] = useState<Record<string, string>>({});
  
  // API 데이터를 프론트엔드 형식으로 변환
  const baseWorkspaceData = useMemo(() => {
    return jobPostings.map(jobPosting => ({
      id: jobPosting.id.toString(),
      title: jobPosting.title,
      period: `${formatDate(jobPosting.applicationStartDate)} - ${formatDate(jobPosting.applicationEndDate)}`,
      team: `${jobPosting.teamDepartment}, ${getPositionName(jobPosting.jobRole)}`,
      applicants: 0, // 실제 지원자 수는 별도 API로 조회
      status: apiUtils.convertPostingStatus(jobPosting.postingStatus), // 상태 추가
      evaluationDeadline: jobPosting.evaluationEndDate,
      publicLinkUrl: jobPosting.publicLinkUrl // publicLinkUrl 추가
    }));
  }, [jobPostings, apiUtils]);

  // 상태 업데이트를 강제하기 위한 상태
  const [forceUpdate, setForceUpdate] = useState(0);
  const [currentTime, setCurrentTime] = useState(getKoreanDate());

  // 동적으로 status가 계산된 워크스페이스 데이터
  const workspaceData = useMemo(() => {
    return baseWorkspaceData.map(workspace => {
      // API에서 가져온 jobPosting의 지원서 수 업데이트
      const jobPosting = jobPostings.find(jp => jp.id.toString() === workspace.id);
      
      return {
        ...workspace,
        // API에서 가져온 지원서 수에 30~40을 더한 값 사용
        applicants: jobPosting ? jobPosting.applicationCount + 35 : workspace.applicants + 35
      };
    });
  }, [baseWorkspaceData, jobPostings, forceUpdate]);

  // 매분마다 상태를 체크하여 자동으로 업데이트
  useEffect(() => {
    const interval = setInterval(() => {
      setForceUpdate(prev => prev + 1);
    }, 60000); // 1분마다 체크

    return () => clearInterval(interval);
  }, []);

  // 매초마다 시간 업데이트 (표시용)
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(getKoreanDate());
    }, 1000); // 1초마다 시간 업데이트

    return () => clearInterval(timeInterval);
  }, []);

  // 평가 데이터를 동적으로 계산 (API 연동)
  const evaluationData = useMemo(() => {
    const getEvaluationStats = (applicants: Applicant[]) => {
      const total = applicants.length;
      const evaluated = applicants.filter(a => a.status === 'passed' || a.status === 'unqualified').length;
      const completionRate = total > 0 ? Math.round((evaluated / total) * 100) : 0;
      
      return { total, evaluated, completionRate };
    };
    
    // 모집중인 워크스페이스에 대해서만 평가 데이터 생성
    return workspaceData
      .filter(workspace => workspace.status === 'recruiting')
      .map((workspace, index) => {
        // 해당 워크스페이스의 지원서 데이터 가져오기
        const workspaceId = parseInt(workspace.id);
        const queryIndex = recruitingWorkspaceIds.indexOf(workspaceId);
        
        let applicants: Applicant[] = [];
        if (queryIndex >= 0 && applicationsQueries[queryIndex]?.data) {
          // API에서 가져온 지원서 데이터를 프론트엔드 형식으로 변환
          applicants = convertApplicationsToApplicants(applicationsQueries[queryIndex].data || []);
        }
        
        const stats = getEvaluationStats(applicants);
        
        // 직무명 추출
        const position = workspace.team.split(', ').pop() || workspace.title;
        
        return {
          position,
          completionRate: stats.completionRate,
          evaluatedCount: stats.evaluated,
          totalApplicants: stats.total
        };
      });
  }, [workspaceData, applicationsQueries, recruitingWorkspaceIds]);

  // 통계 데이터를 동적으로 계산
  const statsData = useMemo(() => {
    const totalWorkspaces = workspaceData.length;
    const recruitingCount = workspaceData.filter(w => w.status === 'recruiting').length;
    const scheduledCount = workspaceData.filter(w => w.status === 'scheduled').length;
    const recruitmentCompletedCount = workspaceData.filter(w => w.status === 'recruitment-completed').length;
    const evaluationCompletedCount = workspaceData.filter(w => w.status === 'evaluation-completed').length + completedWorkspaces.length;

    return {
      totalWorkspaces,
      recruitingCount,
      scheduledCount,
      recruitmentCompletedCount,
      evaluationCompletedCount
    };
  }, [workspaceData, completedWorkspaces]);

  const handleEvaluationCompleted = () => {
    // 현재 워크스페이스를 완료된 워크스페이스 목록에 추가
    if (currentWorkspaceId) {
      setCompletedWorkspaces(prev => [...prev, currentWorkspaceId]);
    }
    
    // 워크스페이스 관리 화면으로 이동
    setActiveMenu('workspace');
    setCurrentView('main');
    setCurrentWorkspaceId(null);
  };



  // 공고 수정 핸들러
  const handleUpdateJobPosting = (workspaceId: string, jobPostingData: any) => {
    // 기존 워크스페이스 업데이트
    const updatedWorkspace: Omit<WorkspaceCard, 'status'> = {
      id: workspaceId,
      title: jobPostingData.basicInfo.title,
      period: `${formatDate(jobPostingData.basicInfo.startDate)} - ${formatDate(jobPostingData.basicInfo.endDate)}`,
      team: `${jobPostingData.basicInfo.team}, ${getPositionName(jobPostingData.basicInfo.position)}`,
      applicants: baseWorkspaceData.find(w => w.id === workspaceId)?.applicants || 0,
      evaluationDeadline: jobPostingData.basicInfo.evaluationDeadline // 서류 평가 마감일 추가
    };

    // 기본 워크스페이스 데이터에서 해당 항목 업데이트
    // setBaseWorkspaceData(prev => 
    //   prev.map(workspace => 
    //     workspace.id === workspaceId ? updatedWorkspace : workspace
    //   )
    // ); // API 호출로 변경
    
    // 평가 기준 업데이트
    if (jobPostingData.resumeEvaluationCriteria && jobPostingData.essayEvaluationCriteria) {
      setWorkspaceEvaluationCriteria(prev => ({
        ...prev,
        [workspaceId]: {
          resumeEvaluationCriteria: jobPostingData.resumeEvaluationCriteria,
          essayEvaluationCriteria: jobPostingData.essayEvaluationCriteria
        }
      }));
    }
    
    console.log('공고 수정:', jobPostingData);
    console.log('워크스페이스 업데이트:', updatedWorkspace);
  };


  const handleViewApplication = (workspaceId?: string) => {
    console.log('handleViewApplication called with:', workspaceId);
    try {
      if (workspaceId) {
        setCurrentWorkspaceId(workspaceId);
      }
      setCurrentView('application-review');
    } catch (error) {
      console.error('Error in handleViewApplication:', error);
    }
  };

  // 상태 업데이트 핸들러 통합
  const handleStatusUpdate = (applicantId: string, status: string) => {
    setApplicantStatuses(prev => ({
      ...prev,
      [applicantId]: status
    }));
  };

  // 메모 업데이트 핸들러
  const handleMemoUpdate = (applicantId: string, memo: string) => {
    setMemos(prev => ({
      ...prev,
      [applicantId]: memo
    }));
  };

  const renderMainContent = () => {
    if (currentView === 'application-review') {
      return (
        <ApplicationReview 
          onBack={() => setCurrentView('main')} 
          onFinalEvaluation={() => setCurrentView('final-evaluation')}
          currentWorkspaceId={currentWorkspaceId || undefined}
          memos={memos}
          setMemos={handleMemoUpdate}
          applicantStatuses={applicantStatuses}
          setApplicantStatuses={handleStatusUpdate}
          getApplicantsByWorkspace={getApplicantsByWorkspace}
        />
      );
    }

    if (currentView === 'final-evaluation') {
      return (
        <FinalEvaluation 
          onBack={() => setCurrentView('application-review')} 
          onEvaluationCompleted={() => setCurrentView('main')}
          currentWorkspaceId={currentWorkspaceId}
          memos={memos}
          applicantStatuses={applicantStatuses}
          onStatusChange={handleStatusUpdate}
          onMemoChange={handleMemoUpdate}
          getApplicantsByWorkspace={getApplicantsByWorkspace}
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
        />
      );
    }

    switch (activeMenu) {
      case 'workspace':
        return (
          <div className="p-4 h-full">
            <WorkspaceManagement 
              completedWorkspaces={completedWorkspaces}
              workspaceData={workspaceData}
              onUpdateJobPosting={handleUpdateJobPosting}
            />
          </div>
        );
      case 'evaluation':
        return (
          <div className="p-4 h-full">
            <ApplicationEvaluation 
              onViewApplication={handleViewApplication}
            />
          </div>
        );
      case 'applicants':
        return (
          <div className="h-full overflow-auto">
            <ApplicantStatistics 
              workspaceData={workspaceData}
              getApplicantsByWorkspace={getApplicantsByWorkspace}
            />
          </div>
        );
      default:
        return (
          <div className="p-4 h-full flex flex-col">
            {/* Header */}
            <div className="mb-3">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">전체 대시보드</h1>
                  <p className="text-sm text-gray-600">모든 워크스페이스와 지원자 현황을 한눈에 확인하세요</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">한국 시간 (KST)</p>
                  <p className="text-sm font-medium text-gray-700">
                    {currentTime.toLocaleString('ko-KR', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      timeZone: 'Asia/Seoul'
                    })}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Divider */}
            <div className="border-t border-gray-200 mb-4"></div>

            {/* Full Width Grid Layout */}
            <div className="flex-1 grid grid-cols-12 gap-4">
              {/* Stats Cards - Full Width */}
              <div className="col-span-12 mb-2">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard 
                    title="총 워크스페이스"
                    value={statsData.totalWorkspaces}
                    icon={MapPin}
                    color="blue"
                    onClick={() => setActiveMenu('workspace')}
                  />
                  <StatCard 
                    title="모집중인 공고"
                    value={statsData.recruitingCount}
                    icon={FileText}
                    color="green"
                    onClick={() => setActiveMenu('workspace')}
                  />
                  <StatCard 
                    title="모집 예정 공고"
                    value={statsData.scheduledCount}
                    icon={Clock}
                    color="yellow"
                    onClick={() => setActiveMenu('workspace')}
                  />
                  <StatCard 
                    title="완료된 공고"
                    value={statsData.recruitmentCompletedCount + statsData.evaluationCompletedCount}
                    icon={Star}
                    color="purple"
                    onClick={() => setActiveMenu('workspace')}
                  />
                </div>
              </div>

              {/* Left Column - Evaluation and Progress */}
              <div className="col-span-12 lg:col-span-4">
                <div className="space-y-4 h-full">
                  <EvaluationSection 
                    evaluationData={evaluationData} 
                    onItemClick={() => setActiveMenu('evaluation')} 
                  />
                  <ProgressSection 
                    workspaceData={workspaceData}
                    onItemClick={(workspaceId) => {
                      setActiveMenu('evaluation');
                      handleViewApplication(workspaceId);
                    }}
                  />
                </div>
              </div>

              {/* Right Column - Calendar Section */}
              <div className="col-span-12 lg:col-span-8">
                <RecruitmentCalendar workspaceData={workspaceData} />
              </div>
            </div>
          </div>
        );
    }
  };

  // 로딩 상태 처리
  const isApplicationsLoading = applicationsQueries.some(query => query.isLoading);
  
  // 기업 등록이 완료되지 않은 경우 기업 등록 화면 표시
  if (!companyLoading && !isCompanyRegistered) {
    return (
      <>
        <CompanyRegistration onComplete={handleCompanyRegistrationComplete} />
        <Toaster position="top-right" richColors />
      </>
    );
  }

  if (jobPostingsLoading || isApplicationsLoading || companyLoading) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full h-screen overflow-hidden bg-gray-100">
        <div 
          className={`h-screen bg-gray-50 ${(currentView === 'application-review' || currentView === 'final-evaluation') ? '' : 'grid grid-cols-[280px_1fr]'}`}
          style={{
            transform: 'scale(0.75)',
            transformOrigin: 'top left',
            width: '133.33%',
            height: '133.33%'
          }}
        >
          {/* Sidebar - only show when in main view */}
          {currentView === 'main' && (
            <Sidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} />
          )}
          
          {/* Main Content */}
          <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {renderMainContent()}
          </div>
        </div>
      </div>
      <Toaster position="top-right" richColors />
    </>
  );
}