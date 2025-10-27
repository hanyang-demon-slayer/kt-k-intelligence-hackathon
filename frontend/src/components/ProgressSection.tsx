import React from "react";
import { Badge } from "./ui/badge";
import { WorkspaceCard } from "../services/types/jobPosting";

interface JobPosting {
  position: string;
  status: "모집중" | "모집 예정" | "모집완료" | "평가완료";
  workspaceId?: string;
}

interface ProgressSectionProps {
  workspaceData?: WorkspaceCard[];
  onItemClick?: (workspaceId: string) => void;
}

const statusConfig = {
  "모집중": {
    bg: "bg-green-100",
    text: "text-green-700",
    border: "border-green-200"
  },
  "모집 예정": {
    bg: "bg-yellow-100", 
    text: "text-yellow-700",
    border: "border-yellow-200"
  },
  "모집완료": {
    bg: "bg-blue-100",
    text: "text-blue-700", 
    border: "border-blue-200"
  },
  "평가완료": {
    bg: "bg-gray-100",
    text: "text-gray-700", 
    border: "border-gray-200"
  }
};

function JobItem({ position, status, workspaceId, onClick }: JobPosting & { onClick?: () => void }) {
  const config = statusConfig[status];
  
  return (
    <div 
      className={`flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 ${onClick ? 'cursor-pointer hover:shadow-md hover:scale-105' : ''}`}
      onClick={onClick}
    >
      <span className="text-gray-700">{position}</span>
      <Badge 
        variant="outline"
        className={`${config.bg} ${config.text} ${config.border} border`}
      >
        {status}
      </Badge>
    </div>
  );
}

export function ProgressSection({ workspaceData = [], onItemClick }: ProgressSectionProps) {
  // 워크스페이스 데이터를 JobPosting 형태로 변환 (평가완료 제외)
  const jobPostings: JobPosting[] = workspaceData
    .filter(workspace => workspace.status !== "evaluation-completed") // 평가완료 제외
    .map(workspace => {
      // 직무명 추출 (team에서 마지막 부분)
      const position = workspace.team.split(', ').pop() || workspace.title;
      
      let status: "모집중" | "모집 예정" | "모집완료" | "평가완료";
      switch (workspace.status) {
        case "recruiting":
          status = "모집중";
          break;
        case "scheduled":
          status = "모집 예정";
          break;
        case "recruitment-completed":
          status = "모집완료";
          break;
        case "evaluation-completed":
          status = "평가완료";
          break;
        default:
          status = "모집중";
      }
      
      return {
        position,
        status,
        workspaceId: workspace.id
      };
    }).sort((a, b) => {
      // 모집중 → 모집예정 → 모집완료 순으로 정렬
      const statusOrder = { "모집중": 0, "모집 예정": 1, "모집완료": 2, "평가완료": 3 };
      return statusOrder[a.status] - statusOrder[b.status];
    });

  // 빈 상태 처리
  if (jobPostings.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">세부 진행 사항</h3>
        </div>
        <div className="p-6">
          <p className="text-gray-500 text-center">진행 중인 공고가 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">세부 진행 사항</h3>
      </div>
      <div className="p-6 space-y-3">
        {jobPostings.map((job, index) => (
          <JobItem 
            key={index} 
            {...job} 
            onClick={onItemClick && job.workspaceId ? () => onItemClick(job.workspaceId!) : undefined}
          />
        ))}
      </div>
    </div>
  );
}