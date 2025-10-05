// 한국 시간 기준 현재 날짜 가져오기
export const getKoreanDate = () => {
  // 한국 시간대(Asia/Seoul)로 현재 시간을 가져옴
  const now = new Date();
  const koreanTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Seoul"}));
  return koreanTime;
};

// 날짜 문자열 파싱 (25.09.01 형태)
export const parseDate = (dateStr: string) => {
  const [year, month, day] = dateStr.split('.');
  return new Date(2000 + parseInt(year), parseInt(month) - 1, parseInt(day));
};

// 모집 기간 상태를 동적으로 계산하는 함수
export const calculateWorkspaceStatus = (period: string): "recruiting" | "scheduled" | "completed" => {
  const [startDateStr, endDateStr] = period.split(' - ');
  
  const startDate = parseDate(startDateStr);
  const endDate = parseDate(endDateStr);
  const today = getKoreanDate();
  
  // 날짜만 비교하기 위해 시간을 00:00:00으로 설정
  const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const startDateOnly = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  const endDateOnly = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

  if (todayDateOnly < startDateOnly) {
    return "scheduled"; // 모집 예정
  } else if (todayDateOnly >= startDateOnly && todayDateOnly <= endDateOnly) {
    return "recruiting"; // 모집중
  } else {
    return "completed"; // 완료
  }
};