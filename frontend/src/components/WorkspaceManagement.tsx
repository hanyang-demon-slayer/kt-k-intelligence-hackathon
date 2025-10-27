import React, { useState } from "react";
import { Plus, MapPin, Users, Calendar, Copy, FileText, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { JobPostingForm } from "./JobPostingForm";
import { WorkspaceCard } from "../services/types/jobPosting";
import { toast } from "sonner";

interface WorkspaceCardProps {
  workspace: WorkspaceCard;
  onEdit?: (workspace: WorkspaceCard) => void;
}

function WorkspaceCard({ workspace, onEdit }: WorkspaceCardProps) {
  const handleCopyLink = async () => {
    if (workspace.publicLinkUrl) {
      try {
        // 최신 브라우저의 Clipboard API 사용
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(workspace.publicLinkUrl);
          toast.success('링크가 클립보드에 복사되었습니다!');
        } else {
          // 구형 브라우저나 HTTP 환경에서의 대체 방법
          const textArea = document.createElement('textarea');
          textArea.value = workspace.publicLinkUrl;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          textArea.style.top = '-999999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          
          try {
            document.execCommand('copy');
            toast.success('링크가 클립보드에 복사되었습니다!');
          } catch (err) {
            toast.error('링크 복사에 실패했습니다.');
          } finally {
            document.body.removeChild(textArea);
          }
        }
      } catch (error) {
        toast.error('링크 복사에 실패했습니다.');
      }
    } else {
      toast.error('복사할 링크가 없습니다.');
    }
  };

  const getStatusColor = (status: WorkspaceCard['status']) => {
    switch (status) {
      case 'recruiting':
        return 'bg-green-50 border-green-200';
      case 'scheduled':
        return 'bg-yellow-50 border-yellow-200';
      case 'recruitment-completed':
        return 'bg-blue-50 border-blue-200';
      case 'evaluation-completed':
        return 'bg-gray-50 border-gray-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getStatusTextColor = (status: WorkspaceCard['status']) => {
    switch (status) {
      case 'recruiting':
        return 'text-green-700';
      case 'scheduled':
        return 'text-yellow-700';
      case 'recruitment-completed':
        return 'text-blue-700';
      case 'evaluation-completed':
        return 'text-gray-700';
      default:
        return 'text-gray-700';
    }
  };

  return (
    <div className={`rounded-lg border p-4 ${getStatusColor(workspace.status)} hover:shadow-md transition-all duration-200`}>
      {/* Header */}
      <div className="mb-3">
        <h3 className={`text-base font-semibold ${getStatusTextColor(workspace.status)} mb-1`}>
          {workspace.title}
        </h3>
        <div className="flex items-center gap-2 text-gray-600 text-xs mb-2">
          <Calendar className="w-3 h-3" />
          <span>{workspace.period}</span>
        </div>
      </div>

      {/* Info */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2 text-gray-600 text-xs">
          <MapPin className="w-3 h-3" />
          <span>{workspace.team}</span>
        </div>
        
        <div className="flex items-center gap-2 text-gray-600 text-xs">
          <Users className="w-3 h-3" />
          <span>{workspace.applicants || 0}명 지원중</span>
        </div>

        {/* 서류 평가 마감일 표시 - 모든 공고에 표시 */}
        {workspace.evaluationDeadline && (
          <div className="flex items-center gap-2 text-xs">
            <Clock className="w-3 h-3 text-blue-600" />
            <span>서류평가 마감: {(() => {
              const deadline = new Date(workspace.evaluationDeadline);
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              deadline.setHours(0, 0, 0, 0);
              
              const diffTime = deadline.getTime() - today.getTime();
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              
              const formattedDate = deadline.toLocaleDateString('ko-KR', {
                month: 'short',
                day: 'numeric'
              });
              
              // 상태별로 다른 표시 방식
              if (workspace.status === 'evaluation-completed') {
                return <span className="text-gray-600">{formattedDate} (평가완료)</span>;
              } else if (workspace.status === 'recruitment-completed') {
                return <span className="text-blue-600">{formattedDate} (모집마감)</span>;
              } else if (workspace.status === 'scheduled') {
                return <span className="text-yellow-600">{formattedDate} (모집예정)</span>;
              } else {
                // recruiting 상태일 때 긴급도별 색상
                if (diffDays < 0) {
                  return <span className="text-red-600 font-medium">{formattedDate} ({Math.abs(diffDays)}일 지연)</span>;
                } else if (diffDays === 0) {
                  return <span className="text-red-600 font-medium">{formattedDate} (오늘 마감)</span>;
                } else if (diffDays <= 3) {
                  return <span className="text-orange-600 font-medium">{formattedDate} (D-{diffDays})</span>;
                }
                return <span className="text-blue-600">{formattedDate} (D-{diffDays})</span>;
              }
            })()}</span>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 my-3"></div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1 text-xs h-8 px-2"
          onClick={() => onEdit?.(workspace)}
        >
          <FileText className="w-3 h-3 mr-1" />
          모집 공고 확인 및 수정
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs h-8 px-3 flex items-center gap-1"
          disabled={!workspace.publicLinkUrl}
          onClick={handleCopyLink}
        >
          <Copy className="w-3 h-3" />
          <span className="hidden sm:inline">링크복사</span>
        </Button>
      </div>
    </div>
  );
}

interface WorkspaceManagementProps {
  completedWorkspaces?: string[];
  workspaceData?: WorkspaceCard[];
  onUpdateJobPosting?: (id: string, data: any) => void;
}

export function WorkspaceManagement({ 
  completedWorkspaces: externalCompletedWorkspaces = [],
  workspaceData = [],
  onUpdateJobPosting
}: WorkspaceManagementProps) {
  const [showPastJobPostings, setShowPastJobPostings] = useState(false);
  const [showJobPostingForm, setShowJobPostingForm] = useState(false);
  const [editingWorkspace, setEditingWorkspace] = useState<WorkspaceCard | null>(null);
  
  // 동적으로 완료 상태를 업데이트
  const updatedWorkspaceData = workspaceData.map(workspace => {
    if (externalCompletedWorkspaces.includes(workspace.id)) {
      return { ...workspace, status: 'evaluation-completed' as const };
    }
    return workspace;
  });
  
  const recruitingWorkspaces = updatedWorkspaceData.filter(w => w.status === 'recruiting');
  const scheduledWorkspaces = updatedWorkspaceData.filter(w => w.status === 'scheduled');
  
  // 모집 완료된 워크스페이스 (모집 마감 상태)
  const recruitmentCompletedWorkspaces = updatedWorkspaceData.filter(w => w.status === 'recruitment-completed');
  
  // 평가 완료된 워크스페이스 (지난 공고용)
  const evaluationCompletedWorkspaces = updatedWorkspaceData.filter(w => w.status === 'evaluation-completed');

  // 지원자 수 계산 함수
  const getTotalApplicants = (workspaces: WorkspaceCard[]) => {
    return workspaces.reduce((total, workspace) => total + (workspace.applicants || 0), 0);
  };

  const handleNewJobPosting = () => {
    setEditingWorkspace(null);
    setShowJobPostingForm(true);
  };

  const handleEditWorkspace = (workspace: WorkspaceCard) => {
    setEditingWorkspace(workspace);
    setShowJobPostingForm(true);
  };


  const handleFormCancel = () => {
    setShowJobPostingForm(false);
    setEditingWorkspace(null);
  };

  if (showJobPostingForm) {
    return (
      <JobPostingForm 
        onBack={handleFormCancel}
        editingWorkspace={editingWorkspace}
        isEditMode={!!editingWorkspace}
      />
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">채용 공고 관리</h1>
          <p className="text-sm text-gray-600">채용 공고를 생성하고 관리합니다</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="text-gray-600 hover:text-gray-900 text-sm"
            onClick={() => setShowPastJobPostings(!showPastJobPostings)}
          >
            {showPastJobPostings ? '현재 공고 보기' : '평가완료창'}
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 px-4 text-sm"
            onClick={handleNewJobPosting}
          >
            <Plus className="w-3 h-3 mr-1" />
            새 공고 등록
          </Button>
        </div>
      </div>
      
      {/* Divider */}
      <div className="border-t border-gray-200 mb-4"></div>
      
      {/* Content */}
      <div className="flex-1 space-y-6 overflow-hidden">
        {showPastJobPostings ? (
          /* 평가완료창 - 평가완료된 공고만 표시 */
          <div>
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-lg font-semibold text-gray-900">
                {getTotalApplicants(evaluationCompletedWorkspaces)}명 평가완료
              </h2>
              <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
            </div>
            {evaluationCompletedWorkspaces.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {evaluationCompletedWorkspaces.map(workspace => (
                  <WorkspaceCard 
                    key={workspace.id} 
                    workspace={workspace} 
                    onEdit={handleEditWorkspace}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">평가가 완료된 공고가 없습니다.</p>
              </div>
            )}
          </div>
        ) : (
          /* Current Job Postings View */
          <>
            {/* Recruiting Section */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-lg font-semibold text-gray-900">모집중</h2>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {recruitingWorkspaces.map(workspace => (
                  <WorkspaceCard 
                    key={workspace.id} 
                    workspace={workspace} 
                    onEdit={handleEditWorkspace}
                  />
                ))}
              </div>
            </div>

            {/* Scheduled Section */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-lg font-semibold text-gray-900">모집 예정</h2>
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {scheduledWorkspaces.map(workspace => (
                  <WorkspaceCard 
                    key={workspace.id} 
                    workspace={workspace} 
                    onEdit={handleEditWorkspace}
                  />
                ))}
              </div>
            </div>

            {/* Recruitment Completed Section - 모집완료된 공고 */}
            {recruitmentCompletedWorkspaces.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {getTotalApplicants(recruitmentCompletedWorkspaces)}명 모집완료
                  </h2>
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {recruitmentCompletedWorkspaces.map(workspace => (
                    <WorkspaceCard 
                      key={workspace.id} 
                      workspace={workspace} 
                      onEdit={handleEditWorkspace}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}