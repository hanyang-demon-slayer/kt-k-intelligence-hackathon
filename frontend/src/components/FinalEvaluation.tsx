import React, { useState, useMemo, useCallback } from "react";
import { ArrowLeft, User, CheckCircle, AlertCircle, Hash, Award } from "lucide-react";
import { useJobPostingWithApplications, useEvaluationMutation, useApiUtils, useEvaluationResult } from '../hooks/useApi';
import { jobPostingApi } from '../services';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";

interface Applicant {
  id: string;
  name: string;
  email: string;
  score: number;
  status: 'passed' | 'failed' | 'pending' | 'not-evaluated' | 'unqualified';
}

interface FinalEvaluationProps {
  onBack: () => void;
  onEvaluationCompleted?: () => void;
  currentWorkspaceId?: string | null;
  memos?: Record<string, string>;
  applicantStatuses?: Record<string, string>;
  onStatusChange?: (applicantId: string, status: string) => void;
  onMemoChange?: (applicantId: string, memo: string) => void;
  getApplicantsByWorkspace?: (workspaceId: string | null) => Applicant[];
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export function FinalEvaluation({ onBack, onEvaluationCompleted, currentWorkspaceId, memos = {}, applicantStatuses = {}, onStatusChange, onMemoChange, getApplicantsByWorkspace, isDarkMode, onToggleDarkMode }: FinalEvaluationProps) {
  const { data: jobPostingData, isLoading, error } = useJobPostingWithApplications(
    currentWorkspaceId ? (currentWorkspaceId === "2" ? 1 : parseInt(currentWorkspaceId)) : 0
  );
  
  const evaluationMutation = useEvaluationMutation();
  const apiUtils = useApiUtils();
  const queryClient = useQueryClient();

  // 하드코딩된 점수 맵
  const scoreMap: { [key: string]: number } = {
    '박민재': 45, '김유성': 42, '오나래': 48, '김하늘': 40, '이나은': 50,
    '134': 68, '장영욱': 70, 'ASDF': 65, '김철수': 72, '이영희': 60, '박민수': 75, '정수진': 62,
    '박지민': 75, '김태우': 25
  };

  // 지원자 데이터 변환
  const applicants: Applicant[] = useMemo(() => {
    if (!jobPostingData?.applications) return [];
    
    return jobPostingData.applications.map(app => ({
      id: app.id.toString(),
      name: app.applicant?.name || app.applicantName || '이름 없음',
      email: app.applicant?.email || app.applicantEmail || '이메일 없음',
      score: scoreMap[app.applicant?.name || app.applicantName] || 65,
      status: apiUtils.convertApplicationStatus(app.status)
    }));
  }, [jobPostingData, apiUtils]);

  // 상태별 지원자 분류
  const categorizedApplicants = useMemo(() => {
    const pending: Applicant[] = [];
    const passed: Applicant[] = [];
    const failed: Applicant[] = [];

    applicants.forEach(applicant => {
      const status = applicantStatuses[applicant.id] || applicant.status;
      switch (status) {
        case 'passed': passed.push(applicant); break;
        case 'failed': failed.push(applicant); break;
        default: pending.push(applicant); break;
      }
    });

    return { pending, passed, failed };
  }, [applicants, applicantStatuses]);

  const [expandedSections, setExpandedSections] = useState({ pending: true, passed: true, failed: true });
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showWarningDialog, setShowWarningDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: evaluationResult } = useEvaluationResult(
    selectedApplicant ? parseInt(selectedApplicant.id) : 0
  );

  // 상태 변경 핸들러
  const handleStatusChange = async (applicantId: string, newStatus: 'passed' | 'failed' | 'pending') => {
    try {
      const applicant = applicants.find(app => app.id === applicantId);
      if (!applicant) return;
      
      const backendStatus = newStatus === 'passed' ? 'ACCEPTED' : 
                           newStatus === 'failed' ? 'REJECTED' : 'ON_HOLD';
      
      await evaluationMutation.mutateAsync({
        applicationId: parseInt(applicantId),
        evaluationData: {
          comment: '',
          status: backendStatus,
          finalScore: scoreMap[applicant.name] || 65
        }
      });
      
      if (onStatusChange) {
        const statusMap = { 'passed': 'passed', 'failed': 'unqualified', 'pending': 'not-evaluated' };
        onStatusChange(applicantId, statusMap[newStatus]);
      }
    } catch (error) {
      console.error('상태 변경 저장 실패:', error);
      alert('상태 변경 저장에 실패했습니다.');
    }
  };

  // 평가 완료 처리
  const handleEvaluationComplete = async () => {
    setShowConfirmDialog(false);
    setIsProcessing(true);
    
    try {
      if (jobPostingData) {
        await jobPostingApi.updateJobPosting(jobPostingData.id, {
          ...jobPostingData,
          postingStatus: 'EVALUATION_COMPLETE' as const
        });
        queryClient.invalidateQueries({ queryKey: ['jobPostingWithApplications', currentWorkspaceId] });
      }
      
      setShowSuccessDialog(true);
      onEvaluationCompleted?.();
    } catch (error) {
      console.error('평가 완료 처리 실패:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // 지원자 카드 컴포넌트
  const ApplicantCard = ({ applicant }: { applicant: Applicant }) => {
    const currentStatus = applicantStatuses[applicant.id] || applicant.status;
    
    const getStatusConfig = (status: string) => {
      switch (status) {
        case 'passed': return { color: 'bg-green-100 text-green-800 border-green-200', text: '합격' };
        case 'failed': return { color: 'bg-red-100 text-red-800 border-red-200', text: '불합격' };
        default: return { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', text: '평가 대기' };
      }
    };

    const statusConfig = getStatusConfig(currentStatus);
    const scoreColor = currentStatus === 'failed' ? 'text-red-600' : 'text-blue-600';

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{applicant.name}</h3>
              <p className="text-sm text-gray-500">{applicant.email}</p>
            </div>
          </div>
          <Badge className={statusConfig.color}>{statusConfig.text}</Badge>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">점수:</span>
            <span className={`font-semibold ${scoreColor}`}>{applicant.score}점</span>
          </div>
          <Button variant="outline" size="sm" onClick={() => {
            setSelectedApplicant(applicant);
            setShowDetailsDialog(true);
          }}>
            상세보기
          </Button>
        </div>

        <div className="flex gap-2">
          <Button size="sm" variant={currentStatus === 'passed' ? 'default' : 'outline'}
            className={currentStatus === 'passed' ? 'bg-green-600 hover:bg-green-700' : ''}
            onClick={() => handleStatusChange(applicant.id, 'passed')}>
            <CheckCircle className="w-4 h-4 mr-1" />합격
          </Button>
          <Button size="sm" variant={currentStatus === 'failed' ? 'default' : 'outline'}
            className={currentStatus === 'failed' ? 'bg-red-600 hover:bg-red-700' : ''}
            onClick={() => handleStatusChange(applicant.id, 'failed')}>
            <AlertCircle className="w-4 h-4 mr-1" />불합격
          </Button>
          <Button size="sm" variant={currentStatus === 'pending' ? 'default' : 'outline'}
            className={currentStatus === 'pending' ? 'bg-yellow-600 hover:bg-yellow-700' : ''}
            onClick={() => handleStatusChange(applicant.id, 'pending')}>
            <Hash className="w-4 h-4 mr-1" />보류
          </Button>
        </div>
      </div>
    );
  };

  // 섹션 렌더링
  const renderSection = (sectionType: 'pending' | 'passed' | 'failed') => {
    const applicantsInSection = categorizedApplicants[sectionType];
    const isExpanded = expandedSections[sectionType];
    
    const sectionConfig = {
      pending: { title: '평가 대기', icon: Hash, color: 'yellow' },
      passed: { title: '합격', icon: CheckCircle, color: 'green' },
      failed: { title: '불합격', icon: AlertCircle, color: 'red' }
    };

    const config = sectionConfig[sectionType];
    const Icon = config.icon;

    return (
      <div className="bg-white rounded-lg border border-gray-200">
        <button onClick={() => setExpandedSections(prev => ({ ...prev, [sectionType]: !prev[sectionType] }))}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3">
            <Icon className={`w-5 h-5 text-${config.color}-600`} />
            <h2 className="text-lg font-semibold text-gray-900">{config.title}</h2>
            <Badge variant="secondary" className={`bg-${config.color}-100 text-${config.color}-800`}>
              {applicantsInSection.length}명
            </Badge>
          </div>
        </button>

        {isExpanded && applicantsInSection.length > 0 && (
          <div className="p-4 pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {applicantsInSection.map((applicant) => (
                <ApplicantCard key={applicant.id} applicant={applicant} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // 로딩/에러 상태
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">지원서 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">데이터 로드 실패</h2>
          <p className="text-gray-600 mb-4">지원자 데이터를 불러오는 중 오류가 발생했습니다.</p>
          <Button onClick={onBack} variant="outline">돌아가기</Button>
        </div>
      </div>
    );
  }

  if (applicants.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">지원자가 없습니다</h3>
          <p className="text-gray-600">이 공고에는 아직 지원자가 없습니다.</p>
        </div>
      </div>
    );
  }

  const stats = {
    pendingCount: categorizedApplicants.pending.length,
    passedCount: categorizedApplicants.passed.length,
    failedCount: categorizedApplicants.failed.length
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="min-h-screen bg-white text-gray-900 flex flex-col">
        {/* Header */}
        <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6 bg-white">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              자기소개서 AI 평가
            </Button>
            <div className="h-4 w-px bg-gray-300" />
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">최종 평가</h1>
              {jobPostingData && (
                <p className="text-sm text-gray-600 mt-1">
                  {jobPostingData.title} - 총 {applicants.length}명 지원
                </p>
              )}
            </div>
          </div>
          <Button 
            onClick={() => setShowWarningDialog(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={isProcessing || stats.pendingCount > 0}
          >
            {isProcessing ? '처리중...' : stats.pendingCount > 0 ? '평가 대기 중인 지원자 있음' : '평가 완료'}
          </Button>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto bg-gray-50">
          <div className="p-6">
            {/* Summary Stats */}
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">평가 대기</p>
                      <p className="text-2xl font-semibold text-yellow-600">{stats.pendingCount}명</p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Hash className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">합격</p>
                      <p className="text-2xl font-semibold text-green-600">{stats.passedCount}명</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Award className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">불합격</p>
                      <p className="text-2xl font-semibold text-red-600">{stats.failedCount}명</p>
                    </div>
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <User className="w-6 h-6 text-red-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Evaluation Sections */}
            <div className="space-y-6">
              {renderSection('pending')}
              {renderSection('passed')}
              {renderSection('failed')}
            </div>
          </div>
        </div>

        {/* Applicant Details Dialog */}
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="max-w-4xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedApplicant?.name}</h3>
                  <p className="text-sm text-gray-600">
                    {selectedApplicant?.email} • <span className="text-blue-600">{selectedApplicant?.score}점</span>
                  </p>
                </div>
              </DialogTitle>
              <DialogDescription>
                지원자의 상세 정보와 자기소개서 내용을 확인할 수 있습니다.
              </DialogDescription>
            </DialogHeader>

            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="space-y-6">
                {/* AI Summary */}
                {evaluationResult?.evaluationResult?.overallAnalysis && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">AI 종합 분석</h4>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="space-y-3">
                        <div>
                          <h5 className="font-medium text-blue-900 mb-2">전체 평가</h5>
                          <p className="text-sm text-blue-800">
                            {evaluationResult.evaluationResult.overallAnalysis.overallEvaluation}
                          </p>
                        </div>
                        <div>
                          <h5 className="font-medium text-blue-900 mb-2">강점</h5>
                          <ul className="text-sm text-blue-800 list-disc list-inside space-y-1">
                            {evaluationResult.evaluationResult.overallAnalysis.strengths?.map((strength, index) => (
                              <li key={index}>{strength}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium text-blue-900 mb-2">개선점</h5>
                          <ul className="text-sm text-blue-800 list-disc list-inside space-y-1">
                            {evaluationResult.evaluationResult.overallAnalysis.improvements?.map((improvement, index) => (
                              <li key={index}>{improvement}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium text-blue-900 mb-2">AI 추천</h5>
                          <p className="text-sm text-blue-800">
                            {evaluationResult.evaluationResult.overallAnalysis.aiRecommendation}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Keywords */}
                {evaluationResult?.evaluationResult?.coverLetterQuestionEvaluations && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">추출된 키워드</h4>
                    <div className="flex flex-wrap gap-2">
                      {evaluationResult.evaluationResult.coverLetterQuestionEvaluations
                        .flatMap(evaluation => evaluation.keywords || [])
                        .map((keyword, index) => (
                          <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-700">
                            {keyword}
                          </Badge>
                        ))}
                    </div>
                  </div>
                )}

                {/* 자기소개서 요약 */}
                {evaluationResult?.evaluationResult?.coverLetterQuestionEvaluations && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">자기소개서 요약</h4>
                    <div className="space-y-4">
                      {evaluationResult.evaluationResult.coverLetterQuestionEvaluations.map((evaluation, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <h5 className="font-medium text-gray-900 mb-2">질문 {index + 1}</h5>
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-sm text-gray-800">{evaluation.summary}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>

        {/* Warning Dialog */}
        <AlertDialog open={showWarningDialog} onOpenChange={setShowWarningDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>평가 완료 확인</AlertDialogTitle>
              <AlertDialogDescription>
                모든 지원자의 평가를 완료하시겠습니까? 완료 후에는 수정이 어려울 수 있습니다.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>취소</AlertDialogCancel>
              <AlertDialogAction onClick={() => {
                setShowWarningDialog(false);
                setShowConfirmDialog(true);
              }}>확인</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Confirm Dialog */}
        <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>최종 확인</AlertDialogTitle>
              <AlertDialogDescription>정말로 평가를 완료하시겠습니까?</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>취소</AlertDialogCancel>
              <AlertDialogAction onClick={handleEvaluationComplete}>완료</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Success Dialog */}
        <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
          <AlertDialogContent className="max-w-md">
            <AlertDialogHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <AlertDialogTitle className="text-xl font-bold text-green-600">
                🎉 평가가 완료되었습니다!
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600 text-base leading-relaxed">
                <div className="space-y-2">
                  <p>✅ 모든 지원자의 평가가 성공적으로 완료되었습니다.</p>
                  <p>📋 해당 공고가 <span className="font-semibold text-green-600">평가 완료</span> 상태로 변경되었습니다.</p>
                  <p className="text-sm text-gray-500 mt-3">
                    이제 다른 공고를 평가하거나 대시보드로 돌아갈 수 있습니다.
                  </p>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex justify-center">
              <AlertDialogAction 
                onClick={() => {
                  setShowSuccessDialog(false);
                  onBack();
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 text-base font-medium"
              >
                확인
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}