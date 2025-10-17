import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { FileText, MessageSquare, Star, Target, Users } from "lucide-react";
import { useEvaluationCriteria } from "../hooks/useApi";

interface EvaluationCriteriaModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobPostingId: number | null;
}

interface EvaluationCriteria {
  jobPostingId: number;
  jobPostingTitle: string;
  totalScore: number;
  resumeScoreWeight: number;
  coverLetterScoreWeight: number;
  passingScore: number;
  resumeCriteria: Array<{
    id: number;
    name: string;
    type: string;
    isRequired: boolean;
    maxScore: number;
    criteria: Array<{
      grade: string;
      description: string;
      scorePerGrade: number;
    }>;
  }>;
  coverLetterCriteria: Array<{
    id: number;
    content: string;
    isRequired: boolean;
    maxCharacters: number;
    criteria: Array<{
      name: string;
      overallDescription: string;
      details: Array<{
        grade: string;
        description: string;
        scorePerGrade: number;
      }>;
    }>;
  }>;
}

export function EvaluationCriteriaModal({ isOpen, onClose, jobPostingId }: EvaluationCriteriaModalProps) {
  // 실제 백엔드 API에서 평가 기준 데이터 조회
  const { data: criteriaData, isLoading, error } = useEvaluationCriteria(jobPostingId || 0);

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "EXCELLENT": return "bg-green-100 text-green-800 border-green-200";
      case "GOOD": return "bg-blue-100 text-blue-800 border-blue-200";
      case "AVERAGE": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "POOR": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getGradeText = (grade: string) => {
    switch (grade) {
      case "EXCELLENT": return "우수";
      case "GOOD": return "양호";
      case "AVERAGE": return "보통";
      case "POOR": return "미흡";
      default: return grade;
    }
  };

  // 로딩 상태 처리
  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent 
          className="w-[90vw] max-w-[1200px] h-[600px] overflow-hidden flex flex-col"
          style={{ 
            width: '90vw', 
            maxWidth: '1200px', 
            height: '600px',
            margin: 'auto'
          }}
        >
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="text-lg font-bold text-gray-900">
              평가 기준 확인
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500">평가 기준을 불러오는 중...</div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // 에러 상태 처리
  if (error || !criteriaData) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent 
          className="w-[90vw] max-w-[1200px] h-[600px] overflow-hidden flex flex-col"
          style={{ 
            width: '90vw', 
            maxWidth: '1200px', 
            height: '600px',
            margin: 'auto'
          }}
        >
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="text-lg font-bold text-gray-900">
              평가 기준 확인
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <div className="text-red-500">평가 기준을 불러올 수 없습니다.</div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="w-[90vw] max-w-[1200px] h-[600px] overflow-hidden flex flex-col"
        style={{ 
          width: '90vw', 
          maxWidth: '1200px', 
          height: '600px',
          margin: 'auto'
        }}
      >
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-lg font-bold text-gray-900">
            평가 기준 확인
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 pr-2 min-h-0">
          {/* 기본 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                기본 정보
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{criteriaData.totalScore}</div>
                  <div className="text-sm text-blue-600">총점</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{criteriaData.resumeScoreWeight}%</div>
                  <div className="text-sm text-green-600">이력서 비중</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{criteriaData.coverLetterScoreWeight}%</div>
                  <div className="text-sm text-purple-600">자기소개서 비중</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{criteriaData.passingScore}</div>
                  <div className="text-sm text-orange-600">합격 기준</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 이력서 평가 기준 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-green-600" />
                이력서 평가 기준
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {criteriaData.resumeCriteria.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">{item.name}</h4>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-sm">
                          {item.type}
                        </Badge>
                        {item.isRequired && (
                          <Badge variant="destructive" className="text-sm">
                            필수
                          </Badge>
                        )}
                        <Badge variant="secondary" className="text-sm">
                          {item.maxScore}점
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-3">
                      {item.criteria.map((criterion, index) => (
                        <div key={index} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <Badge className={`text-sm ${getGradeColor(criterion.grade)}`}>
                              {getGradeText(criterion.grade)}
                            </Badge>
                            <span className="text-sm font-semibold text-gray-700">
                              {criterion.scorePerGrade}점
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{criterion.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 자기소개서 평가 기준 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-purple-600" />
                자기소개서 평가 기준
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {criteriaData.coverLetterCriteria.map((question) => (
                  <div key={question.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">질문 {question.id}</h4>
                      <div className="flex items-center gap-2">
                        {question.isRequired && (
                          <Badge variant="destructive" className="text-sm">
                            필수
                          </Badge>
                        )}
                        <Badge variant="secondary" className="text-sm">
                          {question.maxCharacters}자
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <p className="text-sm text-gray-700">{question.content}</p>
                    </div>

                    <div className="space-y-3">
                      {question.criteria.map((criterion, index) => (
                        <div key={index} className="border rounded-lg p-3">
                          <h5 className="font-semibold text-gray-900 mb-2">{criterion.name}</h5>
                          <p className="text-sm text-gray-600 mb-3">{criterion.overallDescription}</p>
                          
                          <div className="grid grid-cols-4 gap-3">
                            {criterion.details.map((detail, detailIndex) => (
                              <div key={detailIndex} className="border rounded-lg p-3">
                                <div className="flex items-center justify-between mb-2">
                                  <Badge className={`text-sm ${getGradeColor(detail.grade)}`}>
                                    {getGradeText(detail.grade)}
                                  </Badge>
                                  <span className="text-sm font-semibold text-gray-700">
                                    {detail.scorePerGrade}점
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600">{detail.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
