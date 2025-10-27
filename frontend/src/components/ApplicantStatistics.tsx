import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { 
  Users, 
  TrendingUp, 
  Target, 
  Award, 
  FileText, 
  AlertCircle,
  BarChart3,
  Star
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

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
  getApplicantsByWorkspace?: (workspaceId: string | null) => any[];
}

export function ApplicantStatistics({ workspaceData, getApplicantsByWorkspace }: ApplicantStatisticsProps) {
  // 임시 모의 데이터
  const statisticsData = {
    totalApplicants: 47,
    totalEvaluated: 32,
    totalPassed: 18,
    totalPending: 15,
    overallAverageScore: 35,
    evaluationCompletionRate: 68,
    passRate: 56,
    scoreDistribution: [
      { range: '40-50점', count: 12, color: '#22c55e' },
      { range: '30-39점', count: 18, color: '#eab308' },
      { range: '20-29점', count: 12, color: '#f97316' },
      { range: '0-19점', count: 5, color: '#ef4444' }
    ],
    weeklyTrend: [
      { date: '09/16', applications: 8, evaluations: 4 },
      { date: '09/17', applications: 12, evaluations: 6 },
      { date: '09/18', applications: 6, evaluations: 8 },
      { date: '09/19', applications: 9, evaluations: 5 },
      { date: '09/20', applications: 3, evaluations: 7 },
      { date: '09/21', applications: 5, evaluations: 2 },
      { date: '09/22', applications: 4, evaluations: 0 }
    ],
    positionStats: {
      Backend: { totalApplicants: 18, averageScore: 38, passRate: 65 },
      Frontend: { totalApplicants: 15, averageScore: 34, passRate: 48 },
      Designer: { totalApplicants: 9, averageScore: 32, passRate: 45 },
      PM: { totalApplicants: 5, averageScore: 35, passRate: 55 }
    },
    workspaceStats: [
      {
        workspaceId: '1',
        title: '백엔드 개발자 공고 (BE)',
        status: 'recruiting',
        totalCount: 18,
        evaluatedCount: 12,
        passedCount: 8,
        averageScore: 38
      },
      {
        workspaceId: '2',
        title: '프론트엔드 개발자 공고 (FE)',
        status: 'recruiting',
        totalCount: 15,
        evaluatedCount: 10,
        passedCount: 5,
        averageScore: 34
      },
      {
        workspaceId: '3',
        title: 'UI/UX 디자이너 공고',
        status: 'recruiting',
        totalCount: 9,
        evaluatedCount: 7,
        passedCount: 3,
        averageScore: 32
      },
      {
        workspaceId: '4',
        title: '기획자/PM 공고',
        status: 'recruiting',
        totalCount: 5,
        evaluatedCount: 3,
        passedCount: 2,
        averageScore: 35
      }
    ]
  };

  return (
    <div className="p-8 space-y-6">
      {/* 임시 페이지 안내 */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-yellow-600" />
          <h3 className="font-medium text-yellow-800">임시 페이지입니다</h3>
        </div>
        <p className="text-sm text-yellow-700 mt-1">
          현재 모의 데이터로 구성된 임시 통계 페이지입니다. 실제 백엔드 연동은 추후 구현 예정입니다.
        </p>
      </div>

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
                  <Badge variant="default">모집중</Badge>
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
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">✅ 우수한 지원자 품질</h4>
              <p className="text-sm text-green-700">
                평균 점수가 {statisticsData.overallAverageScore}점으로 높습니다. 
                채용 마케팅이 효과적으로 작동하고 있습니다.
              </p>
            </div>
            
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