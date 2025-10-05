export default function Frame1() {
  return (
    <div className="relative size-full">
      <div className="absolute bg-[#d9d9d9] h-[43px] left-0 top-0 w-[477px]" />
      <div className="absolute flex flex-col font-['Pretendard:SemiBold',_sans-serif] justify-center leading-[0] left-2 not-italic text-[12px] text-black text-nowrap top-3.5 translate-y-[-50%]">
        <p className="leading-[normal] whitespace-pre">지원자에 대한 메모를 입력하세요</p>
      </div>
      <div className="absolute bg-[#d9d9d9] h-[22px] left-[287px] top-[53px] w-[60px]" />
      <div className="absolute bg-[#d9d9d9] h-[22px] left-[352px] top-[53px] w-[60px]" />
      <div className="absolute bg-[#d9d9d9] h-[22px] left-[417px] top-[53px] w-[60px]" />
      <div className="absolute flex flex-col font-['Pretendard:SemiBold',_sans-serif] justify-center leading-[0] left-[306px] not-italic text-[12px] text-black text-nowrap top-16 translate-y-[-50%]">
        <p className="leading-[normal] whitespace-pre">합격</p>
      </div>
      <div className="absolute flex flex-col font-['Pretendard:SemiBold',_sans-serif] justify-center leading-[0] left-[431px] not-italic text-[12px] text-black text-nowrap top-16 translate-y-[-50%]">
        <p className="leading-[normal] whitespace-pre">불합격</p>
      </div>
      <div className="absolute flex flex-col font-['Pretendard:SemiBold',_sans-serif] justify-center leading-[0] left-[371px] not-italic text-[12px] text-black text-nowrap top-16 translate-y-[-50%]">
        <p className="leading-[normal] whitespace-pre">보류</p>
      </div>
    </div>
  );
}