import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { getKoreanDate } from "../utils/dateUtils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface WorkspaceCard {
  id: string;
  title: string;
  period: string;
  team: string;
  applicants?: number;
  status: "recruiting" | "scheduled" | "recruitment-completed" | "evaluation-completed";
  evaluationDeadline?: string; // 평가 마감일 추가
}

interface RecruitmentPeriod {
  start: Date;
  end: Date;
  title: string;
  status: "recruiting" | "scheduled" | "recruitment-completed" | "evaluation-completed";
  color: string;
  evaluationDeadline?: Date; // 평가 마감일 추가
}

interface RecruitmentCalendarProps {
  workspaceData?: WorkspaceCard[];
}

export function RecruitmentCalendar({ workspaceData = [] }: RecruitmentCalendarProps) {
  const today = getKoreanDate();
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  

  // 워크스페이스 데이터에서 모집 기간 추출 (평가완료 제외)
  const recruitmentPeriods: RecruitmentPeriod[] = workspaceData
    .filter(workspace => workspace.status !== "evaluation-completed") // 평가완료 제외
    .map((workspace, index) => {
    const [startDateStr, endDateStr] = workspace.period.split(' - ');
    
    // 날짜 문자열 파싱 (25.09.01 형태)
    const parseDate = (dateStr: string) => {
      const [year, month, day] = dateStr.split('.');
      return new Date(2000 + parseInt(year), parseInt(month) - 1, parseInt(day));
    };

    const start = parseDate(startDateStr);
    const end = parseDate(endDateStr);
    
    
    // 평가 마감일 파싱
    let evaluationDeadline: Date | undefined;
    if (workspace.evaluationDeadline) {
      evaluationDeadline = new Date(workspace.evaluationDeadline);
    }
    
    // 직무에 따른 색상 할당
    const getColorForPosition = (team: string, index: number) => {
      if (team.includes('백엔드') || team.includes('BE')) return 'yellow';
      if (team.includes('프론트엔드') || team.includes('FE')) return 'green';
      if (team.includes('UI/UX') || team.includes('디자이너')) return 'purple';
      if (team.includes('PM') || team.includes('기획')) return 'gray';
      
      // 새로운 공고의 경우 순환하여 색상 배정
      const colors = ['blue', 'red', 'indigo', 'pink', 'cyan'];
      return colors[index % colors.length];
    };

    return {
      start,
      end,
      title: workspace.title,
      status: workspace.status,
      color: getColorForPosition(workspace.team, index),
      evaluationDeadline
    };
  });

  // 색상별 CSS 클래스 매핑 (기존 방식 - 직무별)
  const getColorClasses = (color: string) => {
    const colorMap: { [key: string]: { bg: string, text: string, border: string, line: string } } = {
      yellow: { bg: 'bg-yellow-50', text: 'text-yellow-900', border: 'border-yellow-200', line: 'bg-yellow-400' },
      green: { bg: 'bg-green-50', text: 'text-green-900', border: 'border-green-200', line: 'bg-green-400' },
      purple: { bg: 'bg-purple-50', text: 'text-purple-900', border: 'border-purple-200', line: 'bg-purple-400' },
      gray: { bg: 'bg-gray-50', text: 'text-gray-900', border: 'border-gray-200', line: 'bg-gray-400' },
      blue: { bg: 'bg-blue-50', text: 'text-blue-900', border: 'border-blue-200', line: 'bg-blue-400' },
      red: { bg: 'bg-red-50', text: 'text-red-900', border: 'border-red-200', line: 'bg-red-400' },
      indigo: { bg: 'bg-indigo-50', text: 'text-indigo-900', border: 'border-indigo-200', line: 'bg-indigo-400' },
      pink: { bg: 'bg-pink-50', text: 'text-pink-900', border: 'border-pink-200', line: 'bg-pink-400' },
      cyan: { bg: 'bg-cyan-50', text: 'text-cyan-900', border: 'border-cyan-200', line: 'bg-cyan-400' },
    };
    return colorMap[color] || colorMap.blue;
  };

  // 상태별 CSS 클래스 매핑 (통일된 색상 팔레트 + 그라데이션 바)
  const getStatusColorClasses = (status: "recruiting" | "scheduled" | "recruitment-completed" | "evaluation-completed") => {
    const statusColorMap: { [key: string]: { bg: string, text: string, border: string, line: string, cardBg: string, gradient: string } } = {
      recruiting: { 
        bg: 'bg-green-50', 
        text: 'text-green-800', 
        border: 'border-green-200', 
        line: 'bg-green-500',
        cardBg: 'bg-green-50',
        gradient: 'from-green-400 to-green-600'
      },
      scheduled: { 
        bg: 'bg-yellow-50', 
        text: 'text-yellow-800', 
        border: 'border-yellow-200', 
        line: 'bg-yellow-500',
        cardBg: 'bg-yellow-50',
        gradient: 'from-yellow-400 to-yellow-600'
      },
      'recruitment-completed': { 
        bg: 'bg-blue-50', 
        text: 'text-blue-700', 
        border: 'border-blue-200', 
        line: 'bg-blue-500',
        cardBg: 'bg-blue-50',
        gradient: 'from-blue-400 to-blue-600'
      },
      'evaluation-completed': { 
        bg: 'bg-gray-50', 
        text: 'text-gray-700', 
        border: 'border-gray-200', 
        line: 'bg-gray-400',
        cardBg: 'bg-gray-50',
        gradient: 'from-gray-400 to-gray-600'
      },
    };
    return statusColorMap[status] || statusColorMap.scheduled;
  };

  // 주별로 모집 기간의 연속성을 계산하는 함수
  const getRecruitmentSegmentForWeek = (week: Date[], recruitmentPeriod: {start: Date, end: Date}) => {
    const weekStart = week[0];
    const weekEnd = week[6];
    
    // 이 주에 모집 기간이 포함되는지 확인
    if (recruitmentPeriod.end < weekStart || recruitmentPeriod.start > weekEnd) {
      return null;
    }
    
    // 시작과 끝 인덱스 계산
    let startIndex = 0;
    let endIndex = 6;
    
    for (let i = 0; i < 7; i++) {
      if (week[i] >= recruitmentPeriod.start) {
        startIndex = i;
        break;
      }
    }
    
    for (let i = 6; i >= 0; i--) {
      if (week[i] <= recruitmentPeriod.end) {
        endIndex = i;
        break;
      }
    }
    
    return { startIndex, endIndex };
  };

  // 달력 생성 함수
  const generateCalendar = (): Date[][] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const calendar: Date[][] = [];
    const current = new Date(startDate);
    
    for (let week = 0; week < 6; week++) {
      const weekDays: Date[] = [];
      for (let day = 0; day < 7; day++) {
        weekDays.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
      calendar.push(weekDays);
      
      // 다음 달 날짜가 2개 이상 들어가면 중단
      if (weekDays.some(date => date.getMonth() > month && date.getDate() > 7)) {
        break;
      }
    }
    
    return calendar;
  };

  // 모집 기간의 날짜 수 계산
  const calculateDuration = (start: Date, end: Date) => {
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const calendar = generateCalendar();
  const monthNames = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
  
  // 달력 높이를 동적으로 계산 (주 수에 따라)
  const calendarHeight = calendar.length * 70 + 100; // 주당 70px + 헤더 100px

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm" style={{ minHeight: `${calendarHeight + 100}px` }}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">모집 일정</h3>
            <p className="text-sm text-gray-500 mt-1">채용공고 일정을 한눈에 확인하세요</p>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            {recruitmentPeriods
              .sort((a, b) => {
                // 모집중 → 모집예정 → 모집완료 → 평가완료 순으로 정렬
                const statusOrder = { 'recruiting': 0, 'scheduled': 1, 'recruitment-completed': 2, 'evaluation-completed': 3 };
                return statusOrder[a.status] - statusOrder[b.status];
              })
              .map((period, index) => {
              const colorClasses = getStatusColorClasses(period.status); // 상태별 색상 사용
              const position = period.title.includes('개발자') ? 
                period.title.split(' ')[0] : 
                period.title.split(' ').slice(0, 2).join(' ');
              
              // 상태별 표시 텍스트
              const statusText = period.status === 'recruiting' ? '모집중' : 
                                period.status === 'scheduled' ? '모집예정' : '완료';
              
              return (
                <div key={index} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50">
                  <div className={`w-2.5 h-2.5 ${colorClasses.line} rounded-full`}></div>
                  <span className="text-sm font-medium text-gray-700">{position}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${colorClasses.bg} ${colorClasses.text} border ${colorClasses.border}`}>
                    {statusText}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          {/* 달력 - 동적 높이 적용 */}
          <div 
            className="col-span-2 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200"
            style={{ minHeight: `${calendarHeight}px` }}
          >
            {/* 달력 헤더 */}
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-semibold text-gray-900">
                {currentDate.getFullYear()}년 {monthNames[currentDate.getMonth()]}
              </h4>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
                  className="p-2 hover:bg-gray-200 rounded-lg"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
                  className="p-2 hover:bg-gray-200 rounded-lg"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 요일 헤더 */}
            <div className="grid grid-cols-7 mb-2">
              {dayNames.map((day, index) => (
                <div key={index} className="text-center py-3 text-sm font-semibold text-gray-700">
                  {day}
                </div>
              ))}
            </div>

            {/* 달력 본체 - 동적 간격 */}
            <div className="space-y-2">
              {calendar.map((week, weekIndex) => {
                // 각 모집 기간에 대한 세그먼트 계산
                const segments = recruitmentPeriods.map(period => ({
                  ...period,
                  segment: getRecruitmentSegmentForWeek(week, period)
                })).filter(item => item.segment !== null);
                
                return (
                  <div key={weekIndex} className="relative">
                    <div className="grid grid-cols-7">
                      {week.map((date, dayIndex) => {
                        const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                        const isToday = date.getFullYear() === today.getFullYear() && 
                                       date.getMonth() === today.getMonth() && 
                                       date.getDate() === today.getDate();
                        
                        // 이 날짜가 평가 마감일인지 확인
                        const isEvaluationDeadline = recruitmentPeriods.some(period => {
                          if (!period.evaluationDeadline) return false;
                          return period.evaluationDeadline.getFullYear() === date.getFullYear() &&
                                 period.evaluationDeadline.getMonth() === date.getMonth() &&
                                 period.evaluationDeadline.getDate() === date.getDate();
                        });
                        
                        const evaluationDeadlineTooltip = isEvaluationDeadline ? 
                          recruitmentPeriods
                            .filter(period => {
                              if (!period.evaluationDeadline) return false;
                              return period.evaluationDeadline.getFullYear() === date.getFullYear() &&
                                     period.evaluationDeadline.getMonth() === date.getMonth() &&
                                     period.evaluationDeadline.getDate() === date.getDate();
                            })
                            .map(period => `${period.title} 서류평가 마감`)
                            .join('\n') 
                          : '';

                        // 이 날짜가 모집 기간에 포함되는지 확인 (날짜 비교 개선)
                        const isInRecruitmentPeriod = recruitmentPeriods.some(period => {
                          const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                          const startOnly = new Date(period.start.getFullYear(), period.start.getMonth(), period.start.getDate());
                          const endOnly = new Date(period.end.getFullYear(), period.end.getMonth(), period.end.getDate());
                          const isInPeriod = dateOnly >= startOnly && dateOnly <= endOnly;
                          
                          
                          return isInPeriod;
                        });

                        // 이 날짜의 모집 기간들 찾기
                        const activePeriods = recruitmentPeriods.filter(period => {
                          const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                          const startOnly = new Date(period.start.getFullYear(), period.start.getMonth(), period.start.getDate());
                          const endOnly = new Date(period.end.getFullYear(), period.end.getMonth(), period.end.getDate());
                          return dateOnly >= startOnly && dateOnly <= endOnly;
                        });

                        return (
                          <div key={dayIndex} className="relative p-1">
                            <div className="flex flex-col items-center">
                              {isEvaluationDeadline ? (
                                <TooltipProvider>
                                  <Tooltip delayDuration={100}>
                                    <TooltipTrigger asChild>
                                      <div 
                                        className={`
                                          h-10 w-10 flex items-center justify-center text-sm relative rounded-lg transition-all duration-200
                                          ${isCurrentMonth ? 'text-gray-800' : 'text-gray-400'}
                                          ${isToday ? 'bg-blue-500 text-white font-semibold shadow-md' : 'hover:bg-white hover:shadow-sm'}
                                          ${isEvaluationDeadline && !isToday ? 'bg-red-50 border border-red-200 font-semibold text-red-700' : ''}
                                          cursor-pointer mx-auto
                                        `}
                                      >
                                        {date.getDate()}
                                        {/* 평가 마감일 표시 */}
                                        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-400 rounded-full flex items-center justify-center">
                                          <div className="w-1 h-1 bg-white rounded-full"></div>
                                        </div>
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <div className="text-sm">
                                        {evaluationDeadlineTooltip.split('\n').map((line, index) => (
                                          <div key={index}>{line}</div>
                                        ))}
                                      </div>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              ) : (
                                <div 
                                  className={`
                                    h-10 w-10 flex items-center justify-center text-sm relative rounded-lg transition-all duration-200
                                    ${isCurrentMonth ? 'text-gray-800' : 'text-gray-400'}
                                    ${isToday ? 'bg-blue-500 text-white font-semibold shadow-md' : 'hover:bg-white hover:shadow-sm'}
                                    cursor-pointer mx-auto
                                  `}
                                >
                                  {date.getDate()}
                                </div>
                              )}
                              
                              {/* 모집 기간 바 표시 */}
                              {isInRecruitmentPeriod && (
                                <div className="flex flex-col gap-0.5 mt-1 w-full">
                                  {activePeriods.map((period, periodIndex) => {
                                    // 상태별 색상 사용
                                    const colorClasses = getStatusColorClasses(period.status);
                                    return (
                                      <div
                                        key={periodIndex}
                                        className={`h-3 w-full rounded-full ${colorClasses.line} shadow-md`}
                                        title={`${period.title} - ${period.status === 'recruiting' ? '모집중' : period.status === 'scheduled' ? '모집예정' : '완료'}`}
                                      />
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                  </div>
                );
              })}
            </div>
          </div>

          {/* 모집 일정 세부사항 - 동적 높이 */}
          <div className="col-span-1 space-y-3" style={{ minHeight: `${calendarHeight}px` }}>
            {recruitmentPeriods.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">등록된 모집 일정이 없습니다.</p>
              </div>
            ) : (
              recruitmentPeriods
                .sort((a, b) => {
                  // 모집중 → 모집예정 → 모집완료 → 평가완료 순으로 정렬
                  const statusOrder = { 'recruiting': 0, 'scheduled': 1, 'recruitment-completed': 2, 'evaluation-completed': 3 };
                  return statusOrder[a.status] - statusOrder[b.status];
                })
                .map((period, index) => {
                const colorClasses = getStatusColorClasses(period.status);
                const duration = calculateDuration(period.start, period.end);
                const position = period.title.includes('개발자') ? 
                  period.title.split(' ').slice(0, 2).join(' ') : 
                  period.title.split(' ').slice(0, 2).join(' ');
                
                // 상태별 표시 텍스트
                const statusText = period.status === 'recruiting' ? '모집중' : 
                                  period.status === 'scheduled' ? '모집 예정' : '완료';
                
                return (
                  <div key={index} className={`${colorClasses.cardBg} border ${colorClasses.border} rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow duration-200`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 ${colorClasses.line} rounded-full flex-shrink-0 shadow-sm`}></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className={`font-semibold ${colorClasses.text}`}>{position}</h4>
                          <span className={`text-xs px-2 py-1 rounded-full ${colorClasses.bg} ${colorClasses.text} border ${colorClasses.border} font-medium`}>
                            {statusText}
                          </span>
                        </div>
                        <p className={`text-sm ${colorClasses.text.replace('800', '600')} mt-1 font-medium`}>
                          {period.start.getFullYear().toString().slice(2)}.
                          {(period.start.getMonth() + 1).toString().padStart(2, '0')}.
                          {period.start.getDate().toString().padStart(2, '0')} - {" "}
                          {period.end.getFullYear().toString().slice(2)}.
                          {(period.end.getMonth() + 1).toString().padStart(2, '0')}.
                          {period.end.getDate().toString().padStart(2, '0')}
                        </p>
                        <p className={`text-xs ${colorClasses.text} mt-1`}>
                          {duration}일간 모집
                        </p>
                        
                        {/* 서류 평가 마감일 표시 */}
                        {period.evaluationDeadline && (
                          <div className={`flex items-center gap-1 mt-1 text-xs ${colorClasses.text}`}>
                            <Clock className="w-3 h-3 text-red-500" />
                            <span>서류평가 마감: {period.evaluationDeadline.getFullYear().toString().slice(2)}.
                              {(period.evaluationDeadline.getMonth() + 1).toString().padStart(2, '0')}.
                              {period.evaluationDeadline.getDate().toString().padStart(2, '0')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}