import React, { useMemo } from "react";
import { useApplicationsByJobPosting, useApiUtils } from '../hooks/useApi';
import { ApplicationResponseDto } from '../services';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { 
  Users, 
  TrendingUp, 
  Target, 
  Clock, 
  Award, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  BarChart3,
  PieChart,
  Calendar,
  Star
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, LineChart, Line, Area, AreaChart } from "recharts";

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

// 워크스페이스 데이터 타입
interface WorkspaceCard {
  id: string;
  title: string;
  period: string;
  team: string;
  applicants?: number;
  status: "recruiting" | "scheduled" | "recruitment-completed" | "evaluation-completed";
}

interface ApplicantStatisticsProps {
  workspaceData: WorkspaceCard[];
  getApplicantsByWorkspace: (workspaceId: string | null) => Applicant[];
}

export function ApplicantStatistics({ workspaceData, getApplicantsByWorkspace }: ApplicantStatisticsProps) {
  // API 유틸리티 함수
  const apiUtils = useApiUtils();

  // API에서 가져온 지원자 데이터를 프론트엔드 형식으로 변환하는 함수
  const convertApplicationsToApplicants = (applications: ApplicationResponseDto[]): Applicant[] => {
    return applications.map(app => ({
      id: app.id.toString(),
      name: app.applicantName,
      email: app.applicantEmail,
      score: 0, // 실제 점수는 별도 API에서 가져와야 함
      status: apiUtils.convertApplicationStatus(app.status),
      keywords: [], // 실제 키워드는 별도 API에서 가져와야 함
      questions: [] // 실제 질문/답변은 별도 API에서 가져와야 함
    }));
  };
  // 전체 통계 데이터 계���
  const statisticsData = useMemo(() => {
    const allApplicants: Applicant[] = [];
    const workspaceStats: Array<{
      workspaceId: string;
      title: string;
      status: string;
      applicants: Applicant[];
      totalCount: number;
      evaluatedCount: number;
      passedCount: number;
      averageScore: number;
    }> = [];

    // 모든 워크스페이스의 지원자 데이터 수집
    workspaceData.forEach(workspace => {
      const applicants = getApplicantsByWorkspace(workspace.id);
      allApplicants.push(...applicants);
      
      const evaluatedApplicants = applicants.filter(a => a.status === 'passed' || a.status === 'unqualified');
      const passedApplicants = applicants.filter(a => a.status === 'passed');
      const averageScore = applicants.length > 0 ? 
        Math.round(applicants.reduce((sum, a) => sum + a.score, 0) / applicants.length) : 0;

      workspaceStats.push({
        workspaceId: workspace.id,
        title: workspace.title,
        status: workspace.status,
        applicants,
        totalCount: applicants.length,
        evaluatedCount: evaluatedApplicants.length,
        passedCount: passedApplicants.length,
        averageScore
      });
    });

    const totalApplicants = allApplicants.length;
    const totalEvaluated = allApplicants.filter(a => a.status === 'passed' || a.status === 'unqualified').length;
    const totalPassed = allApplicants.filter(a => a.status === 'passed').length;
    const totalPending = allApplicants.filter(a => a.status === 'not-evaluated').length;
    const overallAverageScore = totalApplicants > 0 ? 
      Math.round(allApplicants.reduce((sum, a) => sum + a.score, 0) / totalApplicants) : 0;
    const evaluationCompletionRate = totalApplicants > 0 ? 
      Math.round((totalEvaluated / totalApplicants) * 100) : 0;
    const passRate = totalEvaluated > 0 ? 
      Math.round((totalPassed / totalEvaluated) * 100) : 0;

    // 점수 분포 계산
    const scoreDistribution = [
      { range: '40-50점', count: allApplicants.filter(a => a.score >= 40).length, color: '#22c55e' },
      { range: '30-39점', count: allApplicants.filter(a => a.score >= 30 && a.score < 40).length, color: '#eab308' },
      { range: '20-29점', count: allApplicants.filter(a => a.score >= 20 && a.score < 30).length, color: '#f97316' },
      { range: '0-19점', count: allApplicants.filter(a => a.score < 20).length, color: '#ef4444' }
    ];

    // 직무별 통계
    const positionStats = workspaceStats.reduce((acc, workspace) => {
      const position = workspace.title.includes('BE') ? 'Backend' :
                     workspace.title.includes('FE') ? 'Frontend' :
                     workspace.title.includes('UI/UX') ? 'Designer' :
                     workspace.title.includes('기획') ? 'PM' : 'Other';
      
      if (!acc[position]) {
        acc[position] = { totalApplicants: 0, averageScore: 0, passRate: 0 };
      }
      
      acc[position].totalApplicants += workspace.totalCount;
      acc[position].averageScore = workspace.averageScore; // 단순화
      acc[position].passRate = workspace.evaluatedCount > 0 ? 
        Math.round((workspace.passedCount / workspace.evaluatedCount) * 100) : 0;
      
      return acc;
    }, {} as Record<string, { totalApplicants: number; averageScore: number; passRate: number }>);

    // 주간 지원 트렌드 (모의 데이터)
    const weeklyTrend = [
      { date: '09/16', applications: 2, evaluations: 1 },
      { date: '09/17', applications: 3, evaluations: 2 },
      { date: '09/18', applications: 1, evaluations: 3 },
      { date: '09/19', applications: 2, evaluations: 1 },
      { date: '09/20', applications: 0, evaluations: 2 },
      { date: '09/21', applications: 1, evaluations: 1 },
      { date: '09/22', applications: 1, evaluations: 0 }
    ];

    return {
      totalApplicants,
      totalEvaluated,
      totalPassed,
      totalPending,
      overallAverageScore,
      evaluationCompletionRate,
      passRate,
      workspaceStats,
      scoreDistribution,
      positionStats,
      weeklyTrend
    };
  }, [workspaceData, getApplicantsByWorkspace]);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">지원자 통계</h1>
        <p className="text-gray-600">지원자들의 상세 통계 정보와 채용 성과를 분석할 수 있습니다</p>
      </div>
      
      {/* Divider */}
      <div className="border-t border-gray-200 mb-8"></div>

      {/* 주요 지표 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 지원자</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statisticsData.totalApplicants}</div>
            <p className="text-xs text-muted-foreground">
              {statisticsData.totalPending}명 평가 대기 중
            </p>
          </CardContent>
        </Card>



        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">합격률</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statisticsData.passRate}%</div>
            <p className="text-xs text-muted-foreground">
              {statisticsData.totalPassed}/{statisticsData.totalEvaluated} 명 합격
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">평균 점수</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statisticsData.overallAverageScore}점</div>
            <p className="text-xs text-muted-foreground">
              50점 만점 기준
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 차트 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* 점수 분포 차트 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              점수 분포
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statisticsData.scoreDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 주간 트렌드 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              주간 지원/평가 트렌드
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={statisticsData.weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="applications" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                <Area type="monotone" dataKey="evaluations" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 직무별 통계 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            직무별 채용 성과
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(statisticsData.positionStats).map(([position, stats]) => (
              <div key={position} className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">{position}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>지원자</span>
                    <span className="font-medium">{stats.totalApplicants}명</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>평균 점수</span>
                    <span className="font-medium">{stats.averageScore}점</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>합격률</span>
                    <Badge variant={stats.passRate >= 50 ? "default" : "secondary"}>
                      {stats.passRate}%
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 워크스페이스별 상세 통계 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            공고별 상세 현황
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {statisticsData.workspaceStats.map((workspace) => (
              <div key={workspace.workspaceId} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">{workspace.title}</h4>
                  <Badge variant={
                    workspace.status === 'recruiting' ? 'default' :
                    workspace.status === 'scheduled' ? 'secondary' : 'outline'
                  }>
                    {workspace.status === 'recruiting' ? '모집중' :
                     workspace.status === 'scheduled' ? '예정' : '완료'}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">총 지원자</span>
                    <p className="font-medium">{workspace.totalCount}명</p>
                  </div>
                  <div>
                    <span className="text-gray-500">평가 완료</span>
                    <p className="font-medium">{workspace.evaluatedCount}명</p>
                  </div>
                  <div>
                    <span className="text-gray-500">합격자</span>
                    <p className="font-medium text-green-600">{workspace.passedCount}명</p>
                  </div>
                  <div>
                    <span className="text-gray-500">평균 점수</span>
                    <p className="font-medium">{workspace.averageScore}점</p>
                  </div>
                </div>

                {workspace.totalCount > 0 && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>평가 진행률</span>
                      <span>{Math.round((workspace.evaluatedCount / workspace.totalCount) * 100)}%</span>
                    </div>
                    <Progress 
                      value={(workspace.evaluatedCount / workspace.totalCount) * 100} 
                      className="h-2"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 인사이트 및 권장사항 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            채용 인사이트 및 권장사항
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {statisticsData.evaluationCompletionRate < 70 && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-medium text-yellow-800 mb-2">⚠️ 평가 진행 속도 개선 필요</h4>
                <p className="text-sm text-yellow-700">
                  현재 평가 완료율이 {statisticsData.evaluationCompletionRate}%입니다. 
                  적시 채용을 위해 평가 속도를 높이는 것을 권장합니다.
                </p>
              </div>
            )}
            
            {statisticsData.passRate < 30 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-medium text-red-800 mb-2">📉 합격률 점검 필요</h4>
                <p className="text-sm text-red-700">
                  현재 합격률이 {statisticsData.passRate}%로 낮습니다. 
                  채용 기준을 재검토하거나 더 많은 지원자 풀 확보를 고려해보세요.
                </p>
              </div>
            )}
            
            {statisticsData.overallAverageScore >= 35 && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">✅ 우수한 지원자 품질</h4>
                <p className="text-sm text-green-700">
                  평균 점수가 {statisticsData.overallAverageScore}점으로 높습니다. 
                  채용 마케팅이 효과적으로 작동하고 있습니다.
                </p>
              </div>
            )}
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">💡 데이터 기반 개선 제안</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• 고득점 지원자({statisticsData.scoreDistribution[0].count}명)의 지원 경로를 분석하여 채용 마케팅을 강화하세요.</li>
                <li>• 평가가 지연되는 구간을 파악하여 프로세스를 개선하세요.</li>
                <li>• 직무별 성과 차이를 분석하여 채용 전략을 세분화하세요.</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}