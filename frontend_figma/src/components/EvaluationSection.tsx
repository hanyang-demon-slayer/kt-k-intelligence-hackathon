interface EvaluationItem {
  position: string;
  completionRate?: number;
  evaluatedCount: number;
  totalApplicants: number;
}

interface EvaluationSectionProps {
  evaluationData?: EvaluationItem[];
  onItemClick?: (position: string) => void;
}

function EvaluationItem({ position, completionRate = 0, evaluatedCount, totalApplicants, onClick }: EvaluationItem & { onClick?: () => void }) {
  return (
    <div 
      className={`flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 ${onClick ? 'cursor-pointer hover:shadow-md hover:scale-105' : ''}`}
      onClick={onClick}
    >
      <div className="flex-1">
        <span className="text-gray-700">{position}</span>
        <div className="mt-2">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-500">평가 완료율</span>
            <span className="text-gray-700 font-medium">{completionRate}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      </div>
      <div className="ml-4">
        <span className="text-sm text-gray-600">
          {evaluatedCount}/{totalApplicants}
        </span>
      </div>
    </div>
  );
}

export function EvaluationSection({ evaluationData = [], onItemClick }: EvaluationSectionProps) {
  // 평가 데이터가 없으면 기본 메시지 표시
  if (evaluationData.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">자기소개서 평가 완료 비율</h3>
        </div>
        <div className="p-6">
          <p className="text-gray-500 text-center">평가 가능한 지원서가 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">자기소개서 평가 완료 비율</h3>
      </div>
      <div className="p-6 space-y-4">
        {evaluationData.map((item, index) => (
          <EvaluationItem 
            key={index} 
            {...item} 
            onClick={onItemClick ? () => onItemClick(item.position) : undefined}
          />
        ))}
      </div>
    </div>
  );
}