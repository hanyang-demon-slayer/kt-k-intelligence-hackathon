import React, { useState, useMemo } from "react";
import { FileText, Users, Clock, Eye, Calendar, MapPin, TrendingUp } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { useJobPostings, useApplicationsByJobPosting } from "../hooks/useApi";
import { useQueries } from "@tanstack/react-query";
import { JobPostingResponseDto, ApplicationResponseDto } from "../services";
import { EvaluationCriteriaModal } from "./EvaluationCriteriaModal";

interface WorkspaceCard {
  id: string;
  title: string;
  period: string;
  team: string;
  applicants?: number;
  status: "recruiting" | "scheduled" | "recruitment-completed" | "evaluation-completed";
  evaluationDeadline?: string;
}

interface ApplicationEvaluationProps {
  onViewApplication?: (workspaceId: string) => void;
}

export function ApplicationEvaluation({ onViewApplication }: ApplicationEvaluationProps) {
  // 백엔드에서 채용공고 목록 조회
  const { data: jobPostings = [], isLoading: isLoadingJobPostings } = useJobPostings();

  // 평가 기준 모달 상태
  const [isCriteriaModalOpen, setIsCriteriaModalOpen] = useState(false);
  const [selectedJobPostingId, setSelectedJobPostingId] = useState<number | null>(null);

  // 통계 계산
  const stats = useMemo(() => {
    // 평가 완료된 공고는 제외하고 계산
    const activeJobPostings = jobPostings.filter(jp => jp.postingStatus !== 'EVALUATION_COMPLETE');
    
    // 채용공고 데이터로부터 통계 계산
    const totalApplicants = jobPostings.reduce((sum, jp) => sum + (jp.applicationCount || 0), 0);
    const completedEvaluations = jobPostings.reduce((sum, jp) => {
      return sum + (jp.postingStatus === 'EVALUATION_COMPLETE' ? (jp.applicationCount || 0) : 0);
    }, 0);
    const pendingEvaluations = totalApplicants - completedEvaluations;
    const completionRate = totalApplicants > 0 ? Math.round((completedEvaluations / totalApplicants) * 100) : 0;
    
    // 모집중 + 모집마감 공고 수 합산
    const recruitingCount = jobPostings.filter(jp => jp.postingStatus === 'IN_PROGRESS').length;
    const closedCount = jobPostings.filter(jp => jp.postingStatus === 'CLOSED').length;
    const totalActivePostings = recruitingCount + closedCount;

    return {
      totalApplicants,
      completedEvaluations,
      pendingEvaluations,
      completionRate,
      activePostings: activeJobPostings,
      recruitingCount,
      closedCount,
      totalActivePostings,
      jobPostingStatistics: jobPostings.map(jp => ({
        jobPostingId: jp.id,
        jobPostingTitle: jp.title,
        totalApplications: jp.applicationCount || 0,
        completedEvaluations: jp.postingStatus === 'EVALUATION_COMPLETE' ? (jp.applicationCount || 0) : 0,
        pendingEvaluations: jp.postingStatus !== 'EVALUATION_COMPLETE' ? (jp.applicationCount || 0) : 0,
        completionRate: jp.applicationCount && jp.applicationCount > 0 ? 
          (jp.postingStatus === 'EVALUATION_COMPLETE' ? 100 : 0) : 0,
        postingStatus: jp.postingStatus
      }))
    };
  }, [jobPostings]);

  const handleEvaluateApplication = (workspaceId: string) => {
    if (onViewApplication) {
      onViewApplication(workspaceId);
    }
  };

  const handleShowEvaluationCriteria = (jobPostingId: number) => {
    setSelectedJobPostingId(jobPostingId);
    setIsCriteriaModalOpen(true);
  };

  const handleCloseCriteriaModal = () => {
    setIsCriteriaModalOpen(false);
    setSelectedJobPostingId(null);
  };

  // 로딩 상태 처리
  if (isLoadingJobPostings) {
  return (
      <div className="space-y-6">
            <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">지원서 평가</h1>
          <p className="text-sm text-gray-600">모집중이거나 완료된 공고의 지원서를 확인하고 평가합니다</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">데이터를 불러오는 중...</div>
        </div>
    </div>
  );
}

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">지원서 평가</h1>
        <p className="text-sm text-gray-600">모집중이거나 완료된 공고의 지원서를 확인하고 평가합니다</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 평가 완료율 */}
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">평가 완료율</p>
                <p className="text-3xl font-bold text-gray-900 mb-2">{stats.completionRate}%</p>
                <div className="mb-3">
                  <Progress value={stats.completionRate} className="h-2" />
                </div>
                <p className="text-sm text-gray-500">{stats.completedEvaluations}/{stats.totalApplicants}명 평가 완료</p>
              </div>
              <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center ml-4">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
              </CardContent>
            </Card>
            
        {/* 총 지원자 */}
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">총 지원자</p>
                <p className="text-3xl font-bold text-gray-900 mb-2">{stats.totalApplicants}</p>
                <p className="text-sm text-gray-500">{stats.pendingEvaluations}명 평가 대기</p>
              </div>
              <div className="h-12 w-12 bg-green-50 rounded-lg flex items-center justify-center ml-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
              </CardContent>
            </Card>
            
        {/* 활성 공고 */}
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">활성 공고</p>
                <p className="text-3xl font-bold text-gray-900 mb-2">{stats.totalActivePostings}</p>
                <p className="text-sm text-gray-500">모집중 {stats.recruitingCount}개 · 모집마감 {stats.closedCount}개</p>
              </div>
              <div className="h-12 w-12 bg-purple-50 rounded-lg flex items-center justify-center ml-4">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
            </div>
              </CardContent>
            </Card>
          </div>

        {/* 모집 완료된 공고 */}
      {stats.closedCount > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-lg font-semibold text-gray-900">모집 완료된 공고</h2>
              <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {jobPostings
              .filter(jp => jp.postingStatus === 'CLOSED')
              .map(jobPosting => {
                // 해당 공고의 통계 데이터 찾기
                const jobPostingStat = stats.jobPostingStatistics.find(
                  stat => stat.jobPostingId === jobPosting.id
                );
                
                return (
                <Card key={jobPosting.id} className="hover:shadow-lg transition-all duration-200 border border-gray-200">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{jobPosting.title}</h3>
                          <Badge variant="outline" className="text-gray-600 border-gray-300">모집 완료</Badge>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">지원자</span>
                          <span className="font-semibold text-gray-900">{jobPostingStat?.totalApplications || 0}명</span>
                        </div>
                        <div className="flex items-center justify-between text-sm mt-1">
                          <span className="text-gray-500">평가완료</span>
                          <span className="font-medium text-gray-700">{jobPostingStat?.completedEvaluations || 0}명</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-xs">
                            {jobPosting.applicationStartDate ? 
                              new Date(jobPosting.applicationStartDate).toLocaleDateString('ko-KR') : ''} - {' '}
                            {jobPosting.applicationEndDate ? 
                              new Date(jobPosting.applicationEndDate).toLocaleDateString('ko-KR') : ''}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-xs">{jobPosting.teamDepartment}, {jobPosting.jobRole}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Button 
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => handleEvaluateApplication(jobPosting.id.toString())}
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          지원서 평가
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full text-gray-600 border-gray-300"
                          onClick={() => handleShowEvaluationCriteria(jobPosting.id)}
                        >
                          <Eye className="w-3 h-3 mr-2" />
                          평가기준 확인
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* 모집중인 공고 */}
      {stats.recruitingCount > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-lg font-semibold text-gray-900">모집중인 공고</h2>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {jobPostings
              .filter(jp => jp.postingStatus === 'IN_PROGRESS')
              .map(jobPosting => {
                // 해당 공고의 통계 데이터 찾기
                const jobPostingStat = stats.jobPostingStatistics.find(
                  stat => stat.jobPostingId === jobPosting.id
                );
                
                return (
                <Card key={jobPosting.id} className="hover:shadow-lg transition-all duration-200 border border-green-200">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-green-700 mb-2 line-clamp-2">{jobPosting.title}</h3>
                          <Badge variant="outline" className="text-green-600 border-green-300 bg-green-50">모집중</Badge>
                    </div>
                  </div>

                      <div className="bg-green-50 rounded-lg p-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-green-600">지원자</span>
                          <span className="font-semibold text-green-700">{jobPostingStat?.totalApplications || 0}명</span>
                        </div>
                        <div className="flex items-center justify-between text-sm mt-1">
                          <span className="text-green-500">평가완료</span>
                          <span className="font-medium text-green-600">{jobPostingStat?.completedEvaluations || 0}명</span>
                    </div>
                  </div>

                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-xs">
                            {jobPosting.applicationStartDate ? 
                              new Date(jobPosting.applicationStartDate).toLocaleDateString('ko-KR') : ''} - {' '}
                            {jobPosting.applicationEndDate ? 
                              new Date(jobPosting.applicationEndDate).toLocaleDateString('ko-KR') : ''}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-xs">{jobPosting.teamDepartment}, {jobPosting.jobRole}</span>
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleEvaluateApplication(jobPosting.id.toString())}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        지원서 평가
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                );
              })}
                  </div>
                </div>
      )}

      {/* 평가 기준 모달 */}
      <EvaluationCriteriaModal
        isOpen={isCriteriaModalOpen}
        onClose={handleCloseCriteriaModal}
        jobPostingId={selectedJobPostingId}
      />
    </div>
  );
}