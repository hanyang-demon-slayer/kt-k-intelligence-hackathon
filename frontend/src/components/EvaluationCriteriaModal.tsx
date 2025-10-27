import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { FileText, MessageSquare, Star, Target, Users } from "lucide-react";
import { useJobPosting } from "../hooks/useApi";

interface EvaluationCriteriaModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobPostingId: number | null;
}

export function EvaluationCriteriaModal({ isOpen, onClose, jobPostingId }: EvaluationCriteriaModalProps) {
  // 채용공고 데이터에서 평가 기준 정보 조회
  const { data: jobPostingData, isLoading, error } = useJobPosting(jobPostingId || 0);

  // 로딩 상태 처리
  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-[90vw] max-w-[1200px] h-[600px] overflow-hidden flex flex-col">
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
  if (error) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-[90vw] max-w-[1200px] h-[600px] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="text-lg font-bold text-gray-900">
              평가 기준 확인
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <div className="text-red-500">평가 기준을 불러오는데 실패했습니다.</div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // 데이터 없음 처리
  if (!jobPostingData) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-[90vw] max-w-[1200px] h-[600px] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="text-lg font-bold text-gray-900">
              평가 기준 확인
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500">평가 기준 데이터가 없습니다.</div>
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

        <div className="flex-1 overflow-auto p-1">
          <div className="space-y-6">
            {/* 기본 정보 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  기본 평가 정보
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{jobPostingData.totalScore}</div>
                    <div className="text-sm text-gray-600">총점</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{jobPostingData.resumeScoreWeight}%</div>
                    <div className="text-sm text-gray-600">이력서 배점</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{jobPostingData.coverLetterScoreWeight}%</div>
                    <div className="text-sm text-gray-600">자기소개서 배점</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{jobPostingData.passingScore}</div>
                    <div className="text-sm text-gray-600">합격 기준점</div>
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
                  {jobPostingData.resumeItems?.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{item.name}</h4>
                        <div className="flex gap-2">
                          <Badge variant={item.isRequired ? "default" : "secondary"}>
                            {item.isRequired ? "필수" : "선택"}
                          </Badge>
                          <Badge variant="outline">{item.maxScore}점</Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">타입: {item.type}</p>
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
                  {jobPostingData.coverLetterQuestions?.map((question) => (
                    <div key={question.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">질문 {question.id}</h4>
                        <div className="flex gap-2">
                          <Badge variant={question.isRequired ? "default" : "secondary"}>
                            {question.isRequired ? "필수" : "선택"}
                          </Badge>
                          <Badge variant="outline">{question.maxCharacters}자</Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">{question.content}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}