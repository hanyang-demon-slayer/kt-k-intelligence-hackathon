import svgPaths from "./svg-tr5rb35yz1";
import imgPickPleLogo from "figma:asset/68ef30948d03254f653ed7463b0a1de5e0d29006.png";

function Frame() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-4" data-name="Frame">
      <div className="absolute bottom-[20.83%] left-[20.83%] right-1/2 top-[20.83%]" data-name="Vector">
        <div className="absolute inset-[-7.14%_-14.29%]" style={{ "--stroke-0": "rgba(255, 255, 255, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7 11">
            <path d={svgPaths.p13fc740} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-1/2 left-[20.83%] right-[20.83%] top-1/2" data-name="Vector">
        <div className="absolute inset-[-0.67px_-7.14%]" style={{ "--stroke-0": "rgba(255, 255, 255, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 2">
            <path d="M10.3333 1H1" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Svg() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center overflow-clip relative shrink-0 size-4" data-name="SVG">
      <Frame />
    </div>
  );
}

function SvgMargin() {
  return (
    <div className="box-border content-stretch flex flex-col h-4 items-start justify-start pl-0 pr-2 py-0 relative shrink-0 w-6" data-name="SVG:margin">
      <Svg />
    </div>
  );
}

function Button() {
  return (
    <div className="h-8 relative rounded-[8px] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex gap-1.5 h-8 items-center justify-start px-2.5 py-2 relative w-full">
          <SvgMargin />
          <div className="flex flex-col font-['Malgun_Gothic:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-nowrap text-white">
            <p className="leading-[20px] whitespace-pre">워크스페이스 목록</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Heading3() {
  return (
    <div className="content-stretch flex flex-col items-start justify-start overflow-clip relative shrink-0 w-full" data-name="Heading 3">
      <div className="flex flex-col font-['Malgun_Gothic:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-white w-full">
        <p className="leading-[24px]">BE 인턴십 8기 모집</p>
      </div>
    </div>
  );
}

function Svg1() {
  return (
    <div className="relative shrink-0 size-3" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="SVG">
          <path d={svgPaths.p2023d200} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p2d617c80} id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex gap-1 items-center justify-start relative shrink-0 w-full" data-name="Container">
      <Svg1 />
      <div className="flex flex-col font-['Malgun_Gothic:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#99a1af] text-[12px] text-nowrap">
        <p className="leading-[16px] whitespace-pre">서울</p>
      </div>
    </div>
  );
}

function Svg2() {
  return (
    <div className="relative shrink-0 size-3" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="SVG">
          <path d={svgPaths.p38fdee00} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p2fd9e500} id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p3b81ea80} id="Vector_3" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p13058e80} id="Vector_4" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex gap-1 items-center justify-start relative shrink-0 w-full" data-name="Container">
      <Svg2 />
      <div className="flex flex-col font-['Malgun_Gothic:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#99a1af] text-[12px] text-nowrap">
        <p className="leading-[16px] whitespace-pre">24개 지원서</p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-col gap-1 items-start justify-start relative shrink-0 w-full" data-name="Container">
      <Container />
      <Container1 />
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex flex-col gap-1 items-start justify-start relative shrink-0 w-full" data-name="Container">
      <Heading3 />
      <Container2 />
    </div>
  );
}

function HorizontalBorder() {
  return (
    <div className="box-border content-stretch flex flex-col gap-3 items-start justify-start pb-[16.667px] pt-0 px-0 relative shrink-0 w-full" data-name="HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[#364153] border-[0px_0px_0.667px] border-solid inset-0 pointer-events-none" />
      <Button />
      <Container3 />
    </div>
  );
}

function Margin() {
  return (
    <div className="absolute box-border content-stretch flex flex-col items-start justify-start left-4 pb-4 pt-0 px-0 right-[16px] top-4" data-name="Margin">
      <HorizontalBorder />
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex flex-col items-start justify-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Malgun_Gothic:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#d1d5dc] text-[12px] text-nowrap">
        <p className="leading-[16px] whitespace-pre">평가완료 4 / 5</p>
      </div>
    </div>
  );
}

function Border() {
  return (
    <div className="relative rounded-[8px] shrink-0" data-name="Border">
      <div className="box-border content-stretch flex items-center justify-center overflow-clip px-[8.667px] py-[2.667px] relative">
        <div className="flex flex-col font-['Malgun_Gothic:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-center text-gray-200 text-nowrap">
          <p className="leading-[16px] whitespace-pre">평균 80점</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#6a7282] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container5() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center relative size-full">
        <div className="content-stretch flex items-center justify-between relative w-full">
          <Container4 />
          <Border />
        </div>
      </div>
    </div>
  );
}

function Margin1() {
  return (
    <div className="absolute box-border content-stretch flex flex-col items-start justify-start left-4 pb-4 pt-0 px-0 right-[16px] top-[210px]" data-name="Margin">
      <Container5 />
    </div>
  );
}

function Container6() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px overflow-clip relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Malgun_Gothic:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-[rgba(255,255,255,0.5)] w-full">
        <p className="leading-[normal]">지원자 검색</p>
      </div>
    </div>
  );
}

function Input() {
  return (
    <div className="bg-[#364153] relative rounded-[10px] shrink-0 w-full" data-name="Input">
      <div className="flex flex-row justify-center overflow-clip relative size-full">
        <div className="box-border content-stretch flex items-start justify-center pl-[40.667px] pr-[16.667px] py-[9.33px] relative w-full">
          <Container6 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#4a5565] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Svg3() {
  return (
    <div className="absolute left-3 size-4 translate-y-[-50%]" data-name="SVG" style={{ top: "calc(50% - 0.005px)" }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="SVG">
          <path d="M14 14L11.1067 11.1067" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p107a080} id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex flex-col items-start justify-start relative shrink-0 w-full" data-name="Container">
      <Input />
      <Svg3 />
    </div>
  );
}

function Margin2() {
  return (
    <div className="absolute box-border content-stretch flex flex-col items-start justify-start left-4 pb-4 pt-0 px-0 right-[16px] top-[156.67px]" data-name="Margin">
      <Container7 />
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex flex-col items-start justify-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Malgun_Gothic:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-gray-200 text-nowrap">
        <p className="leading-[20px] whitespace-pre">ㄱ</p>
      </div>
    </div>
  );
}

function Margin3() {
  return (
    <div className="box-border content-stretch flex flex-col h-2 items-start justify-start pl-0 pr-2 py-0 relative shrink-0 w-4" data-name="Margin">
      <div className="bg-[#00c950] rounded-[2.23696e+07px] shrink-0 size-2" data-name="Background" />
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex flex-col items-start justify-start overflow-clip relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Malgun_Gothic:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-gray-100 text-nowrap">
        <p className="leading-[20px] whitespace-pre">김지원</p>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="content-stretch flex items-center justify-start relative shrink-0 w-full" data-name="Container">
      <Margin3 />
      <Container9 />
    </div>
  );
}

function Margin4() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0" data-name="Margin">
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-col items-start justify-start pl-0 pr-2 py-0 relative w-full">
          <Container10 />
        </div>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex flex-col items-end justify-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Malgun_Gothic:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#51a2ff] text-[12px] text-nowrap text-right">
        <p className="leading-[16px] whitespace-pre">85점</p>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex flex-col items-start justify-start relative shrink-0" data-name="Container">
      <Container11 />
    </div>
  );
}

function OverlayVerticalBorder() {
  return (
    <div className="bg-[rgba(21,93,252,0.2)] relative rounded-[4px] shrink-0 w-full" data-name="Overlay+VerticalBorder">
      <div aria-hidden="true" className="absolute border-[#2b7fff] border-[0px_0px_0px_2px] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex items-center justify-between pl-2.5 pr-2 py-2 relative w-full">
          <Margin4 />
          <Container12 />
        </div>
      </div>
    </div>
  );
}

function Margin5() {
  return (
    <div className="box-border content-stretch flex flex-col h-2 items-start justify-start pl-0 pr-2 py-0 relative shrink-0 w-4" data-name="Margin">
      <div className="bg-[#00c950] rounded-[2.23696e+07px] shrink-0 size-2" data-name="Background" />
    </div>
  );
}

function Container13() {
  return (
    <div className="content-stretch flex flex-col items-start justify-start overflow-clip relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Malgun_Gothic:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-gray-100 text-nowrap">
        <p className="leading-[20px] whitespace-pre">김대연</p>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="content-stretch flex items-center justify-start relative shrink-0 w-full" data-name="Container">
      <Margin5 />
      <Container13 />
    </div>
  );
}

function Margin6() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0" data-name="Margin">
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-col items-start justify-start pl-0 pr-2 py-0 relative w-full">
          <Container14 />
        </div>
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="content-stretch flex flex-col items-end justify-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Malgun_Gothic:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#fdc700] text-[12px] text-nowrap text-right">
        <p className="leading-[16px] whitespace-pre">72점</p>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="content-stretch flex flex-col items-start justify-start relative shrink-0" data-name="Container">
      <Container15 />
    </div>
  );
}

function Container17() {
  return (
    <div className="relative rounded-[4px] shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex items-center justify-between pb-2 pt-1 px-2 relative w-full">
          <Margin6 />
          <Container16 />
        </div>
      </div>
    </div>
  );
}

function Margin7() {
  return (
    <div className="box-border content-stretch flex flex-col h-2 items-start justify-start pl-0 pr-2 py-0 relative shrink-0 w-4" data-name="Margin">
      <div className="bg-[#00c950] rounded-[2.23696e+07px] shrink-0 size-2" data-name="Background" />
    </div>
  );
}

function Container18() {
  return (
    <div className="content-stretch flex flex-col items-start justify-start overflow-clip relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Malgun_Gothic:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-gray-100 text-nowrap">
        <p className="leading-[20px] whitespace-pre">김다원</p>
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="content-stretch flex items-center justify-start relative shrink-0 w-full" data-name="Container">
      <Margin7 />
      <Container18 />
    </div>
  );
}

function Margin8() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0" data-name="Margin">
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-col items-start justify-start pl-0 pr-2 py-0 relative w-full">
          <Container19 />
        </div>
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="content-stretch flex flex-col items-end justify-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Malgun_Gothic:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#51a2ff] text-[12px] text-nowrap text-right">
        <p className="leading-[16px] whitespace-pre">88점</p>
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="content-stretch flex flex-col items-start justify-start relative shrink-0" data-name="Container">
      <Container20 />
    </div>
  );
}

function Container22() {
  return (
    <div className="relative rounded-[4px] shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex items-center justify-between pb-2 pt-1 px-2 relative w-full">
          <Margin8 />
          <Container21 />
        </div>
      </div>
    </div>
  );
}

function Margin9() {
  return (
    <div className="box-border content-stretch flex flex-col h-2 items-start justify-start pl-0 pr-2 py-0 relative shrink-0 w-4" data-name="Margin">
      <div className="bg-[#2b7fff] rounded-[2.23696e+07px] shrink-0 size-2" data-name="Background" />
    </div>
  );
}

function Container23() {
  return (
    <div className="content-stretch flex flex-col items-start justify-start overflow-clip relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Malgun_Gothic:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-gray-100 text-nowrap">
        <p className="leading-[20px] whitespace-pre">김명준</p>
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="content-stretch flex items-center justify-start relative shrink-0 w-full" data-name="Container">
      <Margin9 />
      <Container23 />
    </div>
  );
}

function Margin10() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0" data-name="Margin">
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-col items-start justify-start pl-0 pr-2 py-0 relative w-full">
          <Container24 />
        </div>
      </div>
    </div>
  );
}

function Container25() {
  return (
    <div className="content-stretch flex flex-col items-end justify-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Malgun_Gothic:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#fdc700] text-[12px] text-nowrap text-right">
        <p className="leading-[16px] whitespace-pre">76점</p>
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="content-stretch flex flex-col items-start justify-start relative shrink-0" data-name="Container">
      <Container25 />
    </div>
  );
}

function Container27() {
  return (
    <div className="relative rounded-[4px] shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex items-center justify-between pb-2 pt-1 px-2 relative w-full">
          <Margin10 />
          <Container26 />
        </div>
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="box-border content-stretch flex flex-col items-start justify-start pb-0 pt-2 px-0 relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Malgun_Gothic:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-gray-200 text-nowrap">
        <p className="leading-[20px] whitespace-pre">ㄴ</p>
      </div>
    </div>
  );
}

function Margin11() {
  return (
    <div className="box-border content-stretch flex flex-col h-2 items-start justify-start pl-0 pr-2 py-0 relative shrink-0 w-4" data-name="Margin">
      <div className="bg-[#00c950] rounded-[2.23696e+07px] shrink-0 size-2" data-name="Background" />
    </div>
  );
}

function Container29() {
  return (
    <div className="content-stretch flex flex-col items-start justify-start overflow-clip relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Malgun_Gothic:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-gray-100 text-nowrap">
        <p className="leading-[20px] whitespace-pre">남희원</p>
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div className="content-stretch flex items-center justify-start relative shrink-0 w-full" data-name="Container">
      <Margin11 />
      <Container29 />
    </div>
  );
}

function Margin12() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0" data-name="Margin">
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-col items-start justify-start pl-0 pr-2 py-0 relative w-full">
          <Container30 />
        </div>
      </div>
    </div>
  );
}

function Container31() {
  return (
    <div className="content-stretch flex flex-col items-end justify-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Malgun_Gothic:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#51a2ff] text-[12px] text-nowrap text-right">
        <p className="leading-[16px] whitespace-pre">81점</p>
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div className="content-stretch flex flex-col items-start justify-start relative shrink-0" data-name="Container">
      <Container31 />
    </div>
  );
}

function Container33() {
  return (
    <div className="relative rounded-[4px] shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex items-center justify-between p-[8px] relative w-full">
          <Margin12 />
          <Container32 />
        </div>
      </div>
    </div>
  );
}

function Container34() {
  return (
    <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start min-w-[223.33px] pl-0 pr-2 py-0 relative shrink-0" data-name="Container">
      <Container8 />
      <OverlayVerticalBorder />
      <Container17 />
      <Container22 />
      <Container27 />
      <Container28 />
      <Container33 />
    </div>
  );
}

function Container35() {
  return (
    <div className="absolute bottom-4 content-stretch flex flex-col items-start justify-start left-4 overflow-x-clip overflow-y-auto right-[16px] top-[247.33px]" data-name="Container">
      <Container34 />
    </div>
  );
}

function Background() {
  return (
    <div className="basis-0 bg-[#1e2939] grow min-h-px min-w-px relative shrink-0 w-full" data-name="Background">
      <Margin />
      <Margin1 />
      <Margin2 />
      <Container35 />
    </div>
  );
}

function BackgroundVerticalBorder() {
  return (
    <div className="bg-[#1e2939] box-border content-stretch flex flex-col h-full items-start justify-center pl-0 pr-[0.667px] py-0 relative shrink-0 w-64" data-name="Background+VerticalBorder">
      <div aria-hidden="true" className="absolute border-[#364153] border-[0px_0.667px_0px_0px] border-solid inset-0 pointer-events-none" />
      <Background />
    </div>
  );
}

function Heading1() {
  return (
    <div className="content-stretch flex flex-col items-start justify-start relative shrink-0" data-name="Heading 1">
      <div className="flex flex-col font-['Malgun_Gothic:Bold',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[24px] text-nowrap text-white">
        <p className="leading-[32px] whitespace-pre">자기소개서 AI 평가</p>
      </div>
    </div>
  );
}

function Container36() {
  return (
    <div className="content-stretch flex gap-2 items-center justify-start relative shrink-0 w-full" data-name="Container">
      <Heading1 />
    </div>
  );
}

function Paragraph() {
  return (
    <div className="content-stretch flex gap-1 items-start justify-start relative shrink-0 w-full" data-name="Paragraph">
      <div className="flex flex-col font-['Malgun_Gothic:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#99a1af] text-[14px] text-nowrap">
        <p className="leading-[20px] whitespace-pre">김지원 • rlawldnjs@gmail.com</p>
      </div>
    </div>
  );
}

function Container37() {
  return (
    <div className="absolute content-stretch flex flex-col gap-1 items-start justify-start left-0 top-1/2 translate-y-[-50%]" data-name="Container">
      <Container36 />
      <Paragraph />
    </div>
  );
}

function Background1() {
  return (
    <div className="bg-[#00a63e] box-border content-stretch flex items-center justify-center overflow-clip px-[8.667px] py-[2.667px] relative rounded-[8px] self-stretch shrink-0" data-name="Background">
      <div className="flex flex-col font-['Malgun_Gothic:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-center text-nowrap text-white">
        <p className="leading-[16px] whitespace-pre">최종 평가 진행</p>
      </div>
    </div>
  );
}

function Container38() {
  return (
    <div className="absolute content-stretch flex gap-2 items-start justify-start left-[1013px] translate-y-[-50%]" data-name="Container" style={{ top: "calc(50% - 0.333px)" }}>
      <Background1 />
    </div>
  );
}

function Container39() {
  return (
    <div className="absolute h-14 left-6 right-6 top-6" data-name="Container">
      <Container37 />
      <Container38 />
    </div>
  );
}

function BackgroundHorizontalBorder() {
  return (
    <div className="bg-[#1e2939] h-[104.667px] relative shrink-0 w-full" data-name="Background+HorizontalBorder" style={{ marginBottom: "-1.42109e-14px" }}>
      <div aria-hidden="true" className="absolute border-[#364153] border-[0px_0px_0.667px] border-solid inset-0 pointer-events-none" />
      <Container39 />
    </div>
  );
}

function Heading2() {
  return (
    <div className="content-stretch flex flex-col items-start justify-start relative shrink-0 w-full" data-name="Heading 2">
      <div className="flex flex-col font-['Malgun_Gothic:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[18px] text-white w-full">
        <p className="leading-[28px]">1. 해당 회사에 지원한 동기를 서술하시오. (500자)</p>
      </div>
    </div>
  );
}

function Svg4() {
  return (
    <div className="relative shrink-0 size-4" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="SVG">
          <path d={svgPaths.p19416e00} id="Vector" stroke="var(--stroke-0, #D1D5DC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3e059a80} id="Vector_2" stroke="var(--stroke-0, #D1D5DC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M6.66667 6H5.33333" id="Vector_3" stroke="var(--stroke-0, #D1D5DC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M10.6667 8.66667H5.33333" id="Vector_4" stroke="var(--stroke-0, #D1D5DC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M10.6667 11.3333H5.33333" id="Vector_5" stroke="var(--stroke-0, #D1D5DC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container40() {
  return (
    <div className="content-stretch flex gap-1 items-center justify-start relative shrink-0" data-name="Container">
      <Svg4 />
      <div className="flex flex-col font-['Malgun_Gothic:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#d1d5dc] text-[14px] text-nowrap">
        <p className="leading-[20px] whitespace-pre">430자 / 500자</p>
      </div>
    </div>
  );
}

function Container41() {
  return (
    <div className="content-stretch flex gap-4 items-center justify-start relative shrink-0 w-full" data-name="Container">
      <Container40 />
    </div>
  );
}

function Container42() {
  return (
    <div className="content-stretch flex flex-col gap-[7.995px] items-start justify-start relative shrink-0 w-full" data-name="Container">
      <Heading2 />
      <Container41 />
    </div>
  );
}

function Margin13() {
  return (
    <div className="box-border content-stretch flex flex-col items-start justify-start pb-4 pt-0 px-0 relative shrink-0 w-full" data-name="Margin">
      <Container42 />
    </div>
  );
}

function Container43() {
  return (
    <div className="absolute content-stretch flex flex-col items-start justify-start left-0 translate-y-[-50%]" data-name="Container" style={{ top: "calc(50% - 0.333px)" }}>
      <div className="flex flex-col font-['Malgun_Gothic:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#d1d5dc] text-[14px] text-nowrap">
        <p className="leading-[20px] whitespace-pre">1 / 2 문항</p>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-4" data-name="Frame">
      <div className="absolute bottom-1/4 left-[37.5%] right-[37.5%] top-1/4" data-name="Vector">
        <div className="absolute inset-[-8.33%_-16.67%]" style={{ "--stroke-0": "rgba(255, 255, 255, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 10">
            <path d="M5 9L1 5L5 1" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Svg5() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-4" data-name="SVG">
      <Frame1 />
    </div>
  );
}

function SvgMargin1() {
  return (
    <div className="box-border content-stretch flex flex-col h-4 items-start justify-start pl-0 pr-1 py-0 relative shrink-0 w-5" data-name="SVG:margin">
      <Svg5 />
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-[#364153] box-border content-stretch flex gap-1.5 h-8 items-center justify-center opacity-50 px-2.5 py-0 relative rounded-[8px] shrink-0" data-name="Button">
      <SvgMargin1 />
      <div className="flex flex-col font-['Malgun_Gothic:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-nowrap text-white">
        <p className="leading-[20px] whitespace-pre">이전</p>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-4" data-name="Frame">
      <div className="absolute bottom-1/4 left-[37.5%] right-[37.5%] top-1/4" data-name="Vector">
        <div className="absolute inset-[-8.33%_-16.67%]" style={{ "--stroke-0": "rgba(255, 255, 255, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 10">
            <path d="M1 9L5 5L1 1" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Svg6() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-4" data-name="SVG">
      <Frame2 />
    </div>
  );
}

function SvgMargin2() {
  return (
    <div className="box-border content-stretch flex flex-col h-4 items-start justify-start pl-1 pr-0 py-0 relative shrink-0 w-5" data-name="SVG:margin">
      <Svg6 />
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-[#364153] box-border content-stretch flex gap-1.5 h-8 items-center justify-center px-2.5 py-0 relative rounded-[8px] shrink-0" data-name="Button">
      <div className="flex flex-col font-['Malgun_Gothic:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-nowrap text-white">
        <p className="leading-[20px] whitespace-pre">다음</p>
      </div>
      <SvgMargin2 />
    </div>
  );
}

function Container44() {
  return (
    <div className="absolute content-stretch flex gap-2 items-start justify-start left-[533px] translate-y-[-50%]" data-name="Container" style={{ top: "calc(50% - 0.333px)" }}>
      <Button1 />
      <Button2 />
    </div>
  );
}

function HorizontalBorder1() {
  return (
    <div className="h-[48.667px] relative shrink-0 w-full" data-name="HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[#364153] border-[0.667px_0px_0px] border-solid inset-0 pointer-events-none" />
      <Container43 />
      <Container44 />
    </div>
  );
}

function Margin14() {
  return (
    <div className="absolute box-border content-stretch flex flex-col items-start justify-start left-[32.33px] pb-0 pt-4 px-0 right-[-0.33px] top-[421.67px]" data-name="Margin">
      <HorizontalBorder1 />
    </div>
  );
}

function Container45() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-full" data-name="Container">
      <Margin14 />
      <div className="absolute flex flex-col font-['Malgun_Gothic:Regular',_sans-serif] h-[290px] justify-center leading-[0] left-[19.33px] not-italic text-[14px] text-gray-100 top-[99.67px] translate-y-[-50%] w-[700px]">
        <p className="leading-[22.75px]">AI 기술은 더 이상 공상과학 소설 속 이야기가 아닌, 현실의 문제를 해결하는 핵심 도구로 자리 잡았습니다. 저는 이러한 AI 기술의 무한한 가능성을 일찍이 깨닫고, 학부 시절부터 꾸준히 관련 분야에 대한 지식과 실무 경험을 쌓아왔습니다. 특히, 자율 주행 시스템 프로젝트에 참여하며 복잡한 센서 데이터 전처리부터 딥러닝 모델 설계 및 튜닝, 그리고 실제 환경에서의 성능 최적화 과정을 직접 경험했습니다. 이 프로젝트를 통해 단순히 이론적인 지식을 넘어, 실제 문제에 부딪히며 해결책을 단계적으로 모색하고, 최신 논문을 통해 기술적 한계를 극복하는 실질적인 역량을 기를 수 있었습니다.</p>
      </div>
    </div>
  );
}

function BackgroundBorder() {
  return (
    <div className="basis-0 bg-[#1e2939] grow min-h-px min-w-px relative rounded-[14px] shrink-0 w-full" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[#364153] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="flex flex-col justify-center relative size-full">
        <div className="box-border content-stretch flex flex-col items-start justify-center p-[0.667px] relative size-full">
          <Container45 />
        </div>
      </div>
    </div>
  );
}

function Margin15() {
  return (
    <div className="box-border content-stretch flex flex-col h-[504px] items-start justify-center pb-4 pt-0 px-0 relative shrink-0 w-full" data-name="Margin">
      <BackgroundBorder />
    </div>
  );
}

function Background2() {
  return (
    <div className="basis-0 bg-[#101828] grow h-[886.58px] min-h-[886.58px] min-w-px relative shrink-0" data-name="Background">
      <div className="min-h-inherit relative size-full">
        <div className="box-border content-stretch flex flex-col h-[886.58px] items-start justify-start min-h-inherit p-[24px] relative w-full">
          <Margin13 />
          <Margin15 />
        </div>
      </div>
    </div>
  );
}

function Tabpanel() {
  return (
    <div className="absolute content-stretch flex flex-col inset-0 items-start justify-start overflow-x-clip overflow-y-auto" data-name="Tabpanel">
      <div className="flex flex-col font-['Malgun_Gothic:Regular',_sans-serif] justify-center leading-[16px] not-italic relative shrink-0 text-[20px] text-nowrap text-white whitespace-pre">
        <p className="mb-0">AI 요약</p>
        <p className="mb-0">&nbsp;</p>
        <p className="mb-0">{`# 적극성  # AI  # 자율주행`}</p>
        <p className="mb-0">&nbsp;</p>
        <p className="mb-0">&nbsp;</p>
        <p className="mb-0">&nbsp;</p>
        <p className="mb-0">&nbsp;</p>
        <p className="mb-0">AI가 공상과학 보다는 현실에 가까워지는</p>
        <p className="mb-0">과정을 경험하며, 단순히 이론적인 부분보</p>
        <p className="mb-0">다는 여러 프로젝트에 참여하며 기술적 한</p>
        <p>계를 극복하고자 노력했습니다</p>
      </div>
    </div>
  );
}

function Container46() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-full" data-name="Container">
      <Tabpanel />
    </div>
  );
}

function BackgroundVerticalBorder1() {
  return (
    <div className="bg-[#101828] box-border content-stretch flex flex-col h-[803px] items-start justify-center pl-[0.667px] pr-0 py-0 relative shrink-0 w-96" data-name="Background+VerticalBorder">
      <div aria-hidden="true" className="absolute border-[#364153] border-[0px_0px_0px_0.667px] border-solid inset-0 pointer-events-none" />
      <Container46 />
    </div>
  );
}

function Container47() {
  return (
    <div className="basis-0 content-stretch flex grow items-start justify-start min-h-px min-w-px relative shrink-0 w-full" data-name="Container" style={{ marginBottom: "-1.42109e-14px", gap: "1.13687e-13px" }}>
      <Background2 />
      <BackgroundVerticalBorder1 />
    </div>
  );
}

function Container48() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow h-[900px] items-start justify-start min-h-px min-w-px relative shrink-0" data-name="Container">
      <BackgroundHorizontalBorder />
      <Container47 />
    </div>
  );
}

function Background3() {
  return (
    <div className="bg-[#101828] content-stretch flex h-[900px] items-start justify-start relative shrink-0 w-full" data-name="Background">
      <BackgroundVerticalBorder />
      <Container48 />
    </div>
  );
}

function Background4() {
  return (
    <div className="bg-[#101828] content-stretch flex flex-col items-start justify-start min-h-[900px] relative shrink-0 w-full" data-name="Background">
      <Background3 />
    </div>
  );
}

function Container49() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative shrink-0 w-full" data-name="Container">
      <Background4 />
    </div>
  );
}

function PickPleLogo() {
  return <div className="bg-no-repeat bg-size-[100%_100%] bg-top-left max-w-8 shrink-0 size-6" data-name="Pick-ple Logo" style={{ backgroundImage: `url('${imgPickPleLogo}')` }} />;
}

function OverlayBorder() {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] box-border content-stretch flex items-center justify-center p-[0.667px] relative rounded-[6px] shrink-0 size-8" data-name="Overlay+Border">
      <div aria-hidden="true" className="absolute border border-[#4a5565] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <PickPleLogo />
    </div>
  );
}

function Margin16() {
  return (
    <div className="box-border content-stretch flex flex-col h-8 items-start justify-start pl-0 pr-3 py-0 relative shrink-0 w-11" data-name="Margin">
      <OverlayBorder />
    </div>
  );
}

function Container50() {
  return (
    <div className="content-stretch flex flex-col items-start justify-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Malgun_Gothic:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[13.672px] text-nowrap text-white">
        <p className="leading-[20px] whitespace-pre">Pick-ple</p>
      </div>
    </div>
  );
}

function Container51() {
  return (
    <div className="box-border content-stretch flex h-full items-center justify-start pl-4 pr-0 py-0 relative shrink-0" data-name="Container">
      <Margin16 />
      <Container50 />
    </div>
  );
}

function Svg7() {
  return (
    <div className="relative shrink-0 size-4" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="SVG">
          <path d="M3.33333 8H12.6667" id="Vector" stroke="var(--stroke-0, #D1D5DC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button3() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 size-12" data-name="Button">
      <Svg7 />
    </div>
  );
}

function Svg8() {
  return (
    <div className="relative shrink-0 size-3" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="SVG">
          <path d={svgPaths.p2471b880} id="Vector" stroke="var(--stroke-0, #D1D5DC)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Button4() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 size-12" data-name="Button">
      <Svg8 />
    </div>
  );
}

function Svg9() {
  return (
    <div className="relative shrink-0 size-4" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="SVG">
          <path d="M12 4L4 12" id="Vector" stroke="var(--stroke-0, #D1D5DC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M4 4L12 12" id="Vector_2" stroke="var(--stroke-0, #D1D5DC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button5() {
  return (
    <div className="content-stretch flex items-center justify-center relative rounded-tr-[10px] shrink-0 size-12" data-name="Button">
      <Svg9 />
    </div>
  );
}

function Container52() {
  return (
    <div className="content-stretch flex h-full items-start justify-start relative shrink-0" data-name="Container">
      <Button3 />
      <Button4 />
      <Button5 />
    </div>
  );
}

function BackgroundHorizontalBorder1() {
  return (
    <div className="absolute bg-[#1e2939] box-border content-stretch flex h-12 items-center justify-between left-0 pb-[0.667px] pt-0 px-0 top-[-48px] w-[1424.67px]" data-name="Background+HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[#364153] border-[0px_0px_0.667px] border-solid inset-0 pointer-events-none" />
      <Container51 />
      <Container52 />
    </div>
  );
}

export default function Body() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start justify-center relative size-full" data-name="Body">
      <BackgroundHorizontalBorder1 />
      <Container49 />
    </div>
  );
}