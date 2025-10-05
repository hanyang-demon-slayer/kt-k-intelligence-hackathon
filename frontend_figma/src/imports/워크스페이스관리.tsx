import svgPaths from "./svg-hu06ow6jvv";
import imgPickPleLogo from "figma:asset/68ef30948d03254f653ed7463b0a1de5e0d29006.png";

function Heading1() {
  return (
    <div className="absolute content-stretch flex flex-col items-start justify-start left-0 right-0 top-0" data-name="Heading 1">
      <div className="flex flex-col font-['Malgun_Gothic:Bold',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[30px] text-nowrap text-white">
        <p className="leading-[36px] whitespace-pre">워크스페이스 관리</p>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="absolute content-stretch flex flex-col items-start justify-start left-0 right-0 top-11" data-name="Container">
      <div className="flex flex-col font-['Malgun_Gothic:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#99a1af] text-[16px] text-nowrap">
        <p className="leading-[24px] whitespace-pre">채용 공고별 워크스페이스를 생성하고 관리합니다</p>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute content-stretch flex flex-col items-start justify-start left-1 top-[92px] w-[359px]" data-name="Container">
      <div className="flex flex-col font-['Malgun_Gothic:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#99a1af] text-[16px] text-nowrap">
        <p className="leading-[24px] whitespace-pre">모집중</p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute h-[100px] left-0 top-1/2 translate-y-[-50%] w-[359px]" data-name="Container">
      <Heading1 />
      <Container />
      <Container1 />
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute content-stretch flex flex-col items-start justify-start left-[746px] right-[218.67px] top-11" data-name="Container">
      <div className="flex flex-col font-['Malgun_Gothic:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#99a1af] text-[16px] text-nowrap">
        <p className="leading-[24px] whitespace-pre">지난 공고 확인하기</p>
      </div>
    </div>
  );
}

function Component1() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-4" data-name="Component 1">
      <div className="absolute bottom-1/2 left-[20.83%] right-[20.83%] top-1/2" data-name="Vector">
        <div className="absolute inset-[-0.67px_-7.14%]" style={{ "--stroke-0": "rgba(255, 255, 255, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 2">
            <path d="M1 1H10.3333" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[20.83%] left-1/2 right-1/2 top-[20.83%]" data-name="Vector">
        <div className="absolute inset-[-7.14%_-0.67px]" style={{ "--stroke-0": "rgba(255, 255, 255, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 11">
            <path d="M1 1V10.3333" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Svg() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-4" data-name="SVG">
      <Component1 />
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
    <div className="absolute bg-[#155dfc] box-border content-stretch flex gap-2 h-9 items-center justify-center left-[913.32px] px-3 py-2 rounded-[8px] top-1/2 translate-y-[-50%]" data-name="Button">
      <SvgMargin />
      <div className="flex flex-col font-['Malgun_Gothic:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-nowrap text-white">
        <p className="leading-[20px] whitespace-pre">새 워크스페이스 생성</p>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="h-[100px] relative shrink-0 w-full" data-name="Container">
      <Container2 />
      <Container3 />
      <Button />
    </div>
  );
}

function Heading4() {
  return (
    <div className="content-stretch flex flex-col items-start justify-start relative shrink-0" data-name="Heading 4">
      <div className="flex flex-col font-['Malgun_Gothic:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[18px] text-nowrap text-white">
        <p className="leading-[28px] whitespace-pre">BE 인턴십 8기 모집</p>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex gap-[83px] items-center justify-start pl-0 pr-[0.01px] py-0 relative w-full">
          <Heading4 />
        </div>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="absolute box-border content-stretch flex flex-col items-start justify-start left-[0.67px] pb-[18px] pt-6 px-6 right-[0.67px] top-[0.67px]" data-name="Container">
      <Container5 />
    </div>
  );
}

function Component2() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-4" data-name="Component 1">
      <div className="absolute inset-[8.33%_16.67%]" data-name="Vector">
        <div className="absolute inset-[-5%_-6.25%]" style={{ "--stroke-0": "rgba(153, 161, 175, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 15">
            <path d={svgPaths.peb0b480} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[29.17%_37.5%_45.83%_37.5%]" data-name="Vector">
        <div className="absolute inset-[-16.667%]" style={{ "--stroke-0": "rgba(153, 161, 175, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 6">
            <path d={svgPaths.pafef4f0} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Svg1() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center overflow-clip relative shrink-0 size-4" data-name="SVG">
      <Component2 />
    </div>
  );
}

function SvgMargin1() {
  return (
    <div className="box-border content-stretch flex flex-col h-4 items-start justify-start pl-0 pr-2 py-0 relative shrink-0 w-6" data-name="SVG:margin">
      <Svg1 />
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex items-center justify-start relative shrink-0 w-full" data-name="Container">
      <SvgMargin1 />
      <div className="flex flex-col font-['Malgun_Gothic:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#99a1af] text-[16px] text-nowrap">
        <p className="leading-[24px] whitespace-pre">AI 1팀, BE 개발자</p>
      </div>
    </div>
  );
}

function Component3() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-4" data-name="Component 1">
      <div className="absolute inset-[62.5%_33.33%_12.5%_8.33%]" data-name="Vector">
        <div className="absolute inset-[-16.67%_-7.14%]" style={{ "--stroke-0": "rgba(153, 161, 175, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 6">
            <path d={svgPaths.p35e5980} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[13.03%_20.85%_54.7%_66.67%]" data-name="Vector">
        <div className="absolute inset-[-12.92%_-33.38%]" style={{ "--stroke-0": "rgba(153, 161, 175, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 7">
            <path d={svgPaths.p157f1f40} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[63.04%_8.33%_12.5%_79.17%]" data-name="Vector">
        <div className="absolute inset-[-17.04%_-33.33%_-17.04%_-33.34%]" style={{ "--stroke-0": "rgba(153, 161, 175, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 6">
            <path d={svgPaths.p34b3df00} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[12.5%_45.83%_54.17%_20.83%]" data-name="Vector">
        <div className="absolute inset-[-12.5%]" style={{ "--stroke-0": "rgba(153, 161, 175, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7 7">
            <path d={svgPaths.p36280080} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Svg2() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center overflow-clip relative shrink-0 size-4" data-name="SVG">
      <Component3 />
    </div>
  );
}

function SvgMargin2() {
  return (
    <div className="box-border content-stretch flex flex-col h-4 items-start justify-start pl-0 pr-2 py-0 relative shrink-0 w-6" data-name="SVG:margin">
      <Svg2 />
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex items-center justify-start relative shrink-0 w-full" data-name="Container">
      <SvgMargin2 />
      <div className="flex flex-col font-['Malgun_Gothic:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#99a1af] text-[16px] text-nowrap">
        <p className="leading-[24px] whitespace-pre">24명 지원중</p>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="basis-0 bg-white grow h-8 min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center justify-center relative size-full">
        <div className="box-border content-stretch flex gap-1.5 h-8 items-center justify-center px-[10.667px] py-[0.667px] relative w-full">
          <div className="flex flex-col font-['Malgun_Gothic:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap">
            <p className="leading-[20px] whitespace-pre">지원서 확인</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div className="basis-0 bg-white grow h-8 min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center justify-center relative size-full">
        <div className="box-border content-stretch flex gap-1.5 h-8 items-center justify-center px-[10.667px] py-[0.667px] relative w-full">
          <div className="flex flex-col font-['Malgun_Gothic:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap">
            <p className="leading-[20px] whitespace-pre">평가기준 확인</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Button3() {
  return (
    <div className="basis-0 bg-white grow h-8 min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center justify-center relative size-full">
        <div className="box-border content-stretch flex gap-1.5 h-8 items-center justify-center px-[10.667px] py-[0.667px] relative w-full">
          <div className="flex flex-col font-['Malgun_Gothic:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap">
            <p className="leading-[20px] whitespace-pre">링크 복사</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex gap-[7.99px] items-start justify-center relative shrink-0 w-full" data-name="Container">
      <Button1 />
      <Button2 />
      <Button3 />
    </div>
  );
}

function Container10() {
  return (
    <div className="content-stretch flex flex-col gap-3 items-start justify-start relative shrink-0 w-full" data-name="Container">
      <Container7 />
      <Container8 />
      <div className="bg-[rgba(0,0,0,0.1)] h-px shrink-0 w-full" data-name="Horizontal Divider" />
      <Container9 />
    </div>
  );
}

function Container11() {
  return (
    <div className="absolute box-border content-stretch flex flex-col items-start justify-start left-[0.67px] pb-6 pt-0 px-6 right-[0.67px] top-[94.67px]" data-name="Container">
      <Container10 />
    </div>
  );
}

function BackgroundBorder() {
  return (
    <div className="absolute bg-[#1e2939] bottom-[0.33px] left-0 right-[683.67px] rounded-[14px] top-0" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[#364153] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <Container6 />
      <Container11 />
      <div className="absolute flex flex-col font-['Malgun_Gothic:Regular',_sans-serif] justify-center leading-[0] left-7 not-italic text-[#99a1af] text-[16px] text-nowrap top-[71px] translate-y-[-50%]">
        <p className="leading-[24px] whitespace-pre">25.09.01 - 25.09.15</p>
      </div>
    </div>
  );
}

function Heading5() {
  return (
    <div className="content-stretch flex flex-col items-start justify-start relative shrink-0" data-name="Heading 4">
      <div className="flex flex-col font-['Malgun_Gothic:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[18px] text-nowrap text-white">
        <p className="leading-[28px] whitespace-pre">FE 신입사원 모집</p>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex gap-[83px] items-center justify-start pl-0 pr-[0.01px] py-0 relative w-full">
          <Heading5 />
        </div>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="absolute box-border content-stretch flex flex-col items-start justify-start left-[0.67px] pb-[18px] pt-6 px-6 right-[0.67px] top-[0.67px]" data-name="Container">
      <Container12 />
    </div>
  );
}

function Component4() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-4" data-name="Component 1">
      <div className="absolute inset-[8.33%_16.67%]" data-name="Vector">
        <div className="absolute inset-[-5%_-6.25%]" style={{ "--stroke-0": "rgba(153, 161, 175, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 15">
            <path d={svgPaths.peb0b480} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[29.17%_37.5%_45.83%_37.5%]" data-name="Vector">
        <div className="absolute inset-[-16.667%]" style={{ "--stroke-0": "rgba(153, 161, 175, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 6">
            <path d={svgPaths.pafef4f0} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Svg3() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center overflow-clip relative shrink-0 size-4" data-name="SVG">
      <Component4 />
    </div>
  );
}

function SvgMargin3() {
  return (
    <div className="box-border content-stretch flex flex-col h-4 items-start justify-start pl-0 pr-2 py-0 relative shrink-0 w-6" data-name="SVG:margin">
      <Svg3 />
    </div>
  );
}

function Container14() {
  return (
    <div className="content-stretch flex items-center justify-start relative shrink-0 w-full" data-name="Container">
      <SvgMargin3 />
      <div className="flex flex-col font-['Malgun_Gothic:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#99a1af] text-[16px] text-nowrap">
        <p className="leading-[24px] whitespace-pre">AI 2팀, FE 개발자</p>
      </div>
    </div>
  );
}

function Component5() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-4" data-name="Component 1">
      <div className="absolute inset-[62.5%_33.33%_12.5%_8.33%]" data-name="Vector">
        <div className="absolute inset-[-16.67%_-7.14%]" style={{ "--stroke-0": "rgba(153, 161, 175, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 6">
            <path d={svgPaths.p35e5980} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[13.03%_20.85%_54.7%_66.67%]" data-name="Vector">
        <div className="absolute inset-[-12.92%_-33.38%]" style={{ "--stroke-0": "rgba(153, 161, 175, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 7">
            <path d={svgPaths.p157f1f40} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[63.04%_8.33%_12.5%_79.17%]" data-name="Vector">
        <div className="absolute inset-[-17.04%_-33.33%_-17.04%_-33.34%]" style={{ "--stroke-0": "rgba(153, 161, 175, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 6">
            <path d={svgPaths.p34b3df00} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[12.5%_45.83%_54.17%_20.83%]" data-name="Vector">
        <div className="absolute inset-[-12.5%]" style={{ "--stroke-0": "rgba(153, 161, 175, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7 7">
            <path d={svgPaths.p36280080} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Svg4() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center overflow-clip relative shrink-0 size-4" data-name="SVG">
      <Component5 />
    </div>
  );
}

function SvgMargin4() {
  return (
    <div className="box-border content-stretch flex flex-col h-4 items-start justify-start pl-0 pr-2 py-0 relative shrink-0 w-6" data-name="SVG:margin">
      <Svg4 />
    </div>
  );
}

function Container15() {
  return (
    <div className="content-stretch flex items-center justify-start relative shrink-0 w-full" data-name="Container">
      <SvgMargin4 />
      <div className="flex flex-col font-['Malgun_Gothic:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#99a1af] text-[16px] text-nowrap">
        <p className="leading-[24px] whitespace-pre">5명 지원중</p>
      </div>
    </div>
  );
}

function Button4() {
  return (
    <div className="basis-0 bg-white grow h-8 min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center justify-center relative size-full">
        <div className="box-border content-stretch flex gap-1.5 h-8 items-center justify-center px-[10.667px] py-[0.667px] relative w-full">
          <div className="flex flex-col font-['Malgun_Gothic:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap">
            <p className="leading-[20px] whitespace-pre">지원서 확인</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Button5() {
  return (
    <div className="basis-0 bg-white grow h-8 min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center justify-center relative size-full">
        <div className="box-border content-stretch flex gap-1.5 h-8 items-center justify-center px-[10.667px] py-[0.667px] relative w-full">
          <div className="flex flex-col font-['Malgun_Gothic:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap">
            <p className="leading-[20px] whitespace-pre">평가기준 확인</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Button6() {
  return (
    <div className="basis-0 bg-white grow h-8 min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center justify-center relative size-full">
        <div className="box-border content-stretch flex gap-1.5 h-8 items-center justify-center px-[10.667px] py-[0.667px] relative w-full">
          <div className="flex flex-col font-['Malgun_Gothic:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap">
            <p className="leading-[20px] whitespace-pre">링크 복사</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="content-stretch flex gap-[7.99px] items-start justify-center relative shrink-0 w-full" data-name="Container">
      <Button4 />
      <Button5 />
      <Button6 />
    </div>
  );
}

function Container17() {
  return (
    <div className="content-stretch flex flex-col gap-3 items-start justify-start relative shrink-0 w-full" data-name="Container">
      <Container14 />
      <Container15 />
      <div className="bg-[rgba(0,0,0,0.1)] h-px shrink-0 w-full" data-name="Horizontal Divider" />
      <Container16 />
    </div>
  );
}

function Container18() {
  return (
    <div className="absolute box-border content-stretch flex flex-col items-start justify-start left-[0.67px] pb-6 pt-0 px-6 right-[0.67px] top-[94.67px]" data-name="Container">
      <Container17 />
    </div>
  );
}

function BackgroundBorder1() {
  return (
    <div className="absolute bg-[#1e2939] bottom-[0.33px] left-[477px] right-[206.67px] rounded-[14px] top-0" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[#364153] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <Container13 />
      <Container18 />
      <div className="absolute flex flex-col font-['Malgun_Gothic:Regular',_sans-serif] justify-center leading-[0] left-7 not-italic text-[#99a1af] text-[16px] text-nowrap top-[71px] translate-y-[-50%]">
        <p className="leading-[24px] whitespace-pre">25.09.03 - 25.09.12</p>
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="h-[236.333px] relative shrink-0 w-full" data-name="Container">
      <BackgroundBorder />
      <BackgroundBorder1 />
    </div>
  );
}

function Container20() {
  return (
    <div className="absolute box-border content-stretch flex flex-col gap-6 items-start justify-start left-64 p-[32px] right-0 top-0" data-name="Container">
      <Container4 />
      <Container19 />
    </div>
  );
}

function Container21() {
  return (
    <div className="absolute content-stretch flex flex-col items-start justify-start left-[292px] top-[682px] w-[359px]" data-name="Container">
      <div className="flex flex-col font-['Malgun_Gothic:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#99a1af] text-[16px] text-nowrap">
        <p className="leading-[24px] whitespace-pre">모집완료</p>
      </div>
    </div>
  );
}

function Heading6() {
  return (
    <div className="content-stretch flex flex-col items-start justify-start relative shrink-0" data-name="Heading 4">
      <div className="flex flex-col font-['Malgun_Gothic:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[18px] text-nowrap text-white">
        <p className="leading-[28px] whitespace-pre">UI/U,X 디자이너 모집 (경력)</p>
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex gap-[83px] items-center justify-start pl-0 pr-[0.01px] py-0 relative w-full">
          <Heading6 />
        </div>
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div className="absolute box-border content-stretch flex flex-col items-start justify-start left-[0.67px] pb-[18px] pt-6 px-6 right-[0.67px] top-[0.67px]" data-name="Container">
      <Container22 />
    </div>
  );
}

function Component6() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-4" data-name="Component 1">
      <div className="absolute inset-[8.33%_16.67%]" data-name="Vector">
        <div className="absolute inset-[-5%_-6.25%]" style={{ "--stroke-0": "rgba(153, 161, 175, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 15">
            <path d={svgPaths.peb0b480} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[29.17%_37.5%_45.83%_37.5%]" data-name="Vector">
        <div className="absolute inset-[-16.667%]" style={{ "--stroke-0": "rgba(153, 161, 175, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 6">
            <path d={svgPaths.pafef4f0} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Svg5() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center overflow-clip relative shrink-0 size-4" data-name="SVG">
      <Component6 />
    </div>
  );
}

function SvgMargin5() {
  return (
    <div className="box-border content-stretch flex flex-col h-4 items-start justify-start pl-0 pr-2 py-0 relative shrink-0 w-6" data-name="SVG:margin">
      <Svg5 />
    </div>
  );
}

function Container24() {
  return (
    <div className="content-stretch flex items-center justify-start relative shrink-0 w-full" data-name="Container">
      <SvgMargin5 />
      <div className="flex flex-col font-['Malgun_Gothic:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#99a1af] text-[16px] text-nowrap">
        <p className="leading-[24px] whitespace-pre">개발지원팀, UI/UX 디자이너</p>
      </div>
    </div>
  );
}

function Button7() {
  return (
    <div className="basis-0 bg-white grow h-8 min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center justify-center relative size-full">
        <div className="box-border content-stretch flex gap-1.5 h-8 items-center justify-center px-[10.667px] py-[0.667px] relative w-full">
          <div className="flex flex-col font-['Malgun_Gothic:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap">
            <p className="leading-[20px] whitespace-pre">지원서 확인</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Button8() {
  return (
    <div className="basis-0 bg-white grow h-8 min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center justify-center relative size-full">
        <div className="box-border content-stretch flex gap-1.5 h-8 items-center justify-center px-[10.667px] py-[0.667px] relative w-full">
          <div className="flex flex-col font-['Malgun_Gothic:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap">
            <p className="leading-[20px] whitespace-pre">평가기준 확인</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Button9() {
  return (
    <div className="basis-0 bg-white grow h-8 min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center justify-center relative size-full">
        <div className="box-border content-stretch flex gap-1.5 h-8 items-center justify-center px-[10.667px] py-[0.667px] relative w-full">
          <div className="flex flex-col font-['Malgun_Gothic:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap">
            <p className="leading-[20px] whitespace-pre">링크 복사</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container25() {
  return (
    <div className="content-stretch flex gap-[7.99px] items-start justify-center relative shrink-0 w-full" data-name="Container">
      <Button7 />
      <Button8 />
      <Button9 />
    </div>
  );
}

function Container26() {
  return (
    <div className="content-stretch flex flex-col gap-3 items-start justify-start relative shrink-0 w-full" data-name="Container">
      <Container24 />
      <div className="bg-[rgba(0,0,0,0.1)] h-px shrink-0 w-full" data-name="Horizontal Divider" />
      <Container25 />
    </div>
  );
}

function Container27() {
  return (
    <div className="absolute box-border content-stretch flex flex-col items-start justify-start left-[0.67px] pb-6 pt-0 px-6 right-[0.67px] top-[94.67px]" data-name="Container">
      <Container26 />
    </div>
  );
}

function BackgroundBorder2() {
  return (
    <div className="absolute bg-[#1e2939] inset-[453px_714.67px_303px_289px] rounded-[14px]" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[#364153] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <Container23 />
      <Container27 />
      <div className="absolute flex flex-col font-['Malgun_Gothic:Regular',_sans-serif] justify-center leading-[0] left-7 not-italic text-[#99a1af] text-[16px] text-nowrap top-[71px] translate-y-[-50%]">
        <p className="leading-[24px] whitespace-pre">25.10.03 - 25.10.08</p>
      </div>
    </div>
  );
}

function Heading7() {
  return (
    <div className="content-stretch flex flex-col items-start justify-start relative shrink-0" data-name="Heading 4">
      <div className="flex flex-col font-['Malgun_Gothic:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[18px] text-nowrap text-white">
        <p className="leading-[28px] whitespace-pre">믿:음 AI 기획 담당자 채용 (PM/PO)</p>
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex gap-[83px] items-center justify-start pl-0 pr-[0.01px] py-0 relative w-full">
          <Heading7 />
        </div>
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div className="absolute box-border content-stretch flex flex-col items-start justify-start left-[0.67px] pb-[18px] pt-6 px-6 right-[0.67px] top-[0.67px]" data-name="Container">
      <Container28 />
    </div>
  );
}

function Component7() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-4" data-name="Component 1">
      <div className="absolute inset-[8.33%_16.67%]" data-name="Vector">
        <div className="absolute inset-[-5%_-6.25%]" style={{ "--stroke-0": "rgba(153, 161, 175, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 15">
            <path d={svgPaths.peb0b480} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[29.17%_37.5%_45.83%_37.5%]" data-name="Vector">
        <div className="absolute inset-[-16.667%]" style={{ "--stroke-0": "rgba(153, 161, 175, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 6">
            <path d={svgPaths.pafef4f0} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Svg6() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center overflow-clip relative shrink-0 size-4" data-name="SVG">
      <Component7 />
    </div>
  );
}

function SvgMargin6() {
  return (
    <div className="box-border content-stretch flex flex-col h-4 items-start justify-start pl-0 pr-2 py-0 relative shrink-0 w-6" data-name="SVG:margin">
      <Svg6 />
    </div>
  );
}

function Container30() {
  return (
    <div className="content-stretch flex items-center justify-start relative shrink-0 w-full" data-name="Container">
      <SvgMargin6 />
      <div className="flex flex-col font-['Malgun_Gothic:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#99a1af] text-[16px] text-nowrap">
        <p className="leading-[24px] whitespace-pre">개발지원팀, PM</p>
      </div>
    </div>
  );
}

function Button10() {
  return (
    <div className="basis-0 bg-white grow h-8 min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center justify-center relative size-full">
        <div className="box-border content-stretch flex gap-1.5 h-8 items-center justify-center px-[10.667px] py-[0.667px] relative w-full">
          <div className="flex flex-col font-['Malgun_Gothic:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap">
            <p className="leading-[20px] whitespace-pre">지원서 확인</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Button11() {
  return (
    <div className="basis-0 bg-white grow h-8 min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center justify-center relative size-full">
        <div className="box-border content-stretch flex gap-1.5 h-8 items-center justify-center px-[10.667px] py-[0.667px] relative w-full">
          <div className="flex flex-col font-['Malgun_Gothic:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap">
            <p className="leading-[20px] whitespace-pre">평가기준 확인</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Button12() {
  return (
    <div className="basis-0 bg-white grow h-8 min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center justify-center relative size-full">
        <div className="box-border content-stretch flex gap-1.5 h-8 items-center justify-center px-[10.667px] py-[0.667px] relative w-full">
          <div className="flex flex-col font-['Malgun_Gothic:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap">
            <p className="leading-[20px] whitespace-pre">링크 복사</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container31() {
  return (
    <div className="content-stretch flex gap-[7.99px] items-start justify-center relative shrink-0 w-full" data-name="Container">
      <Button10 />
      <Button11 />
      <Button12 />
    </div>
  );
}

function Container32() {
  return (
    <div className="content-stretch flex flex-col gap-3 items-start justify-start relative shrink-0 w-full" data-name="Container">
      <Container30 />
      <div className="bg-[rgba(0,0,0,0.1)] h-px shrink-0 w-full" data-name="Horizontal Divider" />
      <Container31 />
    </div>
  );
}

function Container33() {
  return (
    <div className="absolute box-border content-stretch flex flex-col items-start justify-start left-[0.67px] pb-6 pt-0 px-6 right-[0.67px] top-[94.67px]" data-name="Container">
      <Container32 />
    </div>
  );
}

function BackgroundBorder3() {
  return (
    <div className="absolute bg-[#1e2939] inset-[725px_716.67px_31px_287px] rounded-[14px]" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[#364153] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <Container29 />
      <Container33 />
      <div className="absolute flex flex-col font-['Malgun_Gothic:Regular',_sans-serif] justify-center leading-[0] left-7 not-italic text-[#99a1af] text-[16px] text-nowrap top-[71px] translate-y-[-50%]">
        <p className="leading-[24px] whitespace-pre">25.08.25 - 25.08.31</p>
      </div>
    </div>
  );
}

function Frame28() {
  return <div className="absolute h-6 left-72 top-[466px] w-[70px]" />;
}

function Background() {
  return (
    <div className="bg-[#101828] h-[956.003px] min-h-[900px] relative shrink-0 w-full" data-name="Background">
      <Container20 />
      <Container21 />
      <BackgroundBorder2 />
      <BackgroundBorder3 />
      <Frame28 />
      <div className="absolute flex flex-col font-['Malgun_Gothic:Regular',_sans-serif] justify-center leading-[0] left-72 not-italic text-[#99a1af] text-[16px] text-nowrap top-[422px] translate-y-[-50%]">
        <p className="leading-[24px] whitespace-pre">모집 예정</p>
      </div>
    </div>
  );
}

function Container34() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative shrink-0 w-full" data-name="Container">
      <Background />
    </div>
  );
}

function Component8() {
  return (
    <div className="relative shrink-0 size-5" data-name="Component 1">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Component 1">
          <path d={svgPaths.p37143280} id="Vector" stroke="var(--stroke-0, #51A2FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p1d7f0000} id="Vector_2" stroke="var(--stroke-0, #51A2FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p2b722f80} id="Vector_3" stroke="var(--stroke-0, #51A2FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M8.33333 5H11.6667" id="Vector_4" stroke="var(--stroke-0, #51A2FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M8.33333 8.33333H11.6667" id="Vector_5" stroke="var(--stroke-0, #51A2FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M8.33333 11.6667H11.6667" id="Vector_6" stroke="var(--stroke-0, #51A2FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M8.33333 15H11.6667" id="Vector_7" stroke="var(--stroke-0, #51A2FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Heading2() {
  return (
    <div className="content-stretch flex flex-col items-start justify-start relative shrink-0 w-full" data-name="Heading 2">
      <div className="flex flex-col font-['Malgun_Gothic:Bold',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[18px] text-nowrap text-white">
        <p className="leading-[28px] whitespace-pre">테크컴퍼니</p>
      </div>
    </div>
  );
}

function Container35() {
  return (
    <div className="content-stretch flex flex-col items-start justify-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Malgun_Gothic:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#99a1af] text-[12px] text-nowrap">
        <p className="leading-[16px] whitespace-pre">Company name</p>
      </div>
    </div>
  );
}

function Container36() {
  return (
    <div className="content-stretch flex flex-col items-start justify-start relative shrink-0" data-name="Container">
      <Heading2 />
      <Container35 />
    </div>
  );
}

function Container37() {
  return (
    <div className="content-stretch flex gap-3 items-center justify-start relative shrink-0 w-full" data-name="Container">
      <Component8 />
      <Container36 />
    </div>
  );
}

function Component9() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-4" data-name="Component 1">
      <div className="absolute inset-[29.17%_8.33%_45.83%_66.67%]" data-name="Vector">
        <div className="absolute inset-[-16.667%]" style={{ "--stroke-0": "rgba(255, 255, 255, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 6">
            <path d="M1 1H5V5" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[29.17%_8.33%]" data-name="Vector">
        <div className="absolute inset-[-10%_-5%]" style={{ "--stroke-0": "rgba(255, 255, 255, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 9">
            <path d={svgPaths.p3a8cdec0} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Svg7() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center overflow-clip relative shrink-0 size-4" data-name="SVG">
      <Component9 />
    </div>
  );
}

function SvgMargin7() {
  return (
    <div className="box-border content-stretch flex flex-col h-4 items-start justify-start pl-0 pr-3 py-0 relative shrink-0 w-7" data-name="SVG:margin">
      <Svg7 />
    </div>
  );
}

function Button13() {
  return (
    <div className="h-9 relative rounded-[8px] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex gap-2 h-9 items-center justify-start px-3 py-2 relative w-full">
          <SvgMargin7 />
          <div className="flex flex-col font-['Malgun_Gothic:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-nowrap text-white">
            <p className="leading-[20px] whitespace-pre">전체 대시보드</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Component10() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-4" data-name="Component 1">
      <div className="absolute inset-[8.33%_16.67%]" data-name="Vector">
        <div className="absolute inset-[-5%_-6.25%]" style={{ "--stroke-0": "rgba(3, 2, 19, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 15">
            <path d={svgPaths.peb0b480} id="Vector" stroke="var(--stroke-0, #030213)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[29.17%_37.5%_45.83%_37.5%]" data-name="Vector">
        <div className="absolute inset-[-16.667%]" style={{ "--stroke-0": "rgba(3, 2, 19, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 6">
            <path d={svgPaths.pafef4f0} id="Vector" stroke="var(--stroke-0, #030213)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Svg8() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center overflow-clip relative shrink-0 size-4" data-name="SVG">
      <Component10 />
    </div>
  );
}

function SvgMargin8() {
  return (
    <div className="box-border content-stretch flex flex-col h-4 items-start justify-start pl-0 pr-3 py-0 relative shrink-0 w-7" data-name="SVG:margin">
      <Svg8 />
    </div>
  );
}

function Button14() {
  return (
    <div className="bg-[#eceef2] h-9 relative rounded-[8px] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex gap-2 h-9 items-center justify-start px-3 py-2 relative w-full">
          <SvgMargin8 />
          <div className="flex flex-col font-['Malgun_Gothic:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#030213] text-[14px] text-nowrap">
            <p className="leading-[20px] whitespace-pre">워크스페이스 관리</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Component11() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-4" data-name="Component 1">
      <div className="absolute inset-[8.33%_16.67%]" data-name="Vector">
        <div className="absolute inset-[-5%_-6.25%]" style={{ "--stroke-0": "rgba(255, 255, 255, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 15">
            <path d={svgPaths.p2ddad400} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[8.33%_16.67%_66.67%_58.33%]" data-name="Vector">
        <div className="absolute inset-[-16.667%]" style={{ "--stroke-0": "rgba(255, 255, 255, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 6">
            <path d="M1 1H5V5" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[37.5%_58.33%_62.5%_33.33%]" data-name="Vector">
        <div className="absolute inset-[-0.67px_-50%]" style={{ "--stroke-0": "rgba(255, 255, 255, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 2">
            <path d="M2.33333 1H1" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[54.17%_33.33%_45.83%_33.33%]" data-name="Vector">
        <div className="absolute inset-[-0.67px_-12.5%]" style={{ "--stroke-0": "rgba(255, 255, 255, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7 2">
            <path d="M6.33333 1H1" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[70.83%_33.33%_29.17%_33.33%]" data-name="Vector">
        <div className="absolute inset-[-0.67px_-12.5%]" style={{ "--stroke-0": "rgba(255, 255, 255, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7 2">
            <path d="M6.33333 1H1" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Svg9() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center overflow-clip relative shrink-0 size-4" data-name="SVG">
      <Component11 />
    </div>
  );
}

function SvgMargin9() {
  return (
    <div className="box-border content-stretch flex flex-col h-4 items-start justify-start pl-0 pr-3 py-0 relative shrink-0 w-7" data-name="SVG:margin">
      <Svg9 />
    </div>
  );
}

function Button15() {
  return (
    <div className="h-9 relative rounded-[8px] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex gap-2 h-9 items-center justify-start px-3 py-2 relative w-full">
          <SvgMargin9 />
          <div className="flex flex-col font-['Malgun_Gothic:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-nowrap text-white">
            <p className="leading-[20px] whitespace-pre">자기소개서 평가</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Component12() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-4" data-name="Component 1">
      <div className="absolute inset-[62.5%_33.33%_12.5%_8.33%]" data-name="Vector">
        <div className="absolute inset-[-16.67%_-7.14%]" style={{ "--stroke-0": "rgba(255, 255, 255, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 6">
            <path d={svgPaths.p35e5980} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[13.03%_20.85%_54.7%_66.67%]" data-name="Vector">
        <div className="absolute inset-[-12.92%_-33.38%]" style={{ "--stroke-0": "rgba(255, 255, 255, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 7">
            <path d={svgPaths.p157f1f40} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[63.04%_8.33%_12.5%_79.17%]" data-name="Vector">
        <div className="absolute inset-[-17.04%_-33.33%_-17.04%_-33.34%]" style={{ "--stroke-0": "rgba(255, 255, 255, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 6">
            <path d={svgPaths.p34b3df00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[12.5%_45.83%_54.17%_20.83%]" data-name="Vector">
        <div className="absolute inset-[-12.5%]" style={{ "--stroke-0": "rgba(255, 255, 255, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7 7">
            <path d={svgPaths.p36280080} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Svg10() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center overflow-clip relative shrink-0 size-4" data-name="SVG">
      <Component12 />
    </div>
  );
}

function SvgMargin10() {
  return (
    <div className="box-border content-stretch flex flex-col h-4 items-start justify-start pl-0 pr-3 py-0 relative shrink-0 w-7" data-name="SVG:margin">
      <Svg10 />
    </div>
  );
}

function Button16() {
  return (
    <div className="h-9 relative rounded-[8px] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex gap-2 h-9 items-center justify-start px-3 py-2 relative w-full">
          <SvgMargin10 />
          <div className="flex flex-col font-['Malgun_Gothic:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-nowrap text-white">
            <p className="leading-[20px] whitespace-pre">지원자 통계</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Component13() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-4" data-name="Component 1">
      <div className="absolute inset-[8.61%_8.57%_37.48%_41.67%]" data-name="Vector">
        <div className="absolute inset-[-7.73%_-8.37%]" style={{ "--stroke-0": "rgba(255, 255, 255, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 11">
            <path d={svgPaths.p2f5e5780} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[37.48%_41.67%_8.61%_8.57%]" data-name="Vector">
        <div className="absolute inset-[-7.73%_-8.37%]" style={{ "--stroke-0": "rgba(255, 255, 255, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 11">
            <path d={svgPaths.p2431900} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Svg11() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center overflow-clip relative shrink-0 size-4" data-name="SVG">
      <Component13 />
    </div>
  );
}

function SvgMargin11() {
  return (
    <div className="box-border content-stretch flex flex-col h-4 items-start justify-start pl-0 pr-3 py-0 relative shrink-0 w-7" data-name="SVG:margin">
      <Svg11 />
    </div>
  );
}

function Button17() {
  return (
    <div className="box-border content-stretch flex gap-2 h-9 items-center justify-start px-3 py-2 relative rounded-[8px] shrink-0 w-[216.77px]" data-name="Button">
      <SvgMargin11 />
      <div className="flex flex-col font-['Malgun_Gothic:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-nowrap text-white">
        <p className="leading-[20px] whitespace-pre">자기소개서 작성 링크 생성</p>
      </div>
    </div>
  );
}

function Nav() {
  return (
    <div className="content-stretch flex flex-col gap-2 items-start justify-start relative shrink-0 w-full" data-name="Nav">
      <Button13 />
      <Button14 />
      <Button15 />
      <Button16 />
      <Button17 />
    </div>
  );
}

function Container38() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-col gap-8 items-start justify-start p-[24px] relative w-full">
          <Container37 />
          <Nav />
        </div>
      </div>
    </div>
  );
}

function BackgroundVerticalBorder() {
  return (
    <div className="absolute bg-[#1e2939] box-border content-stretch flex flex-col h-[852px] items-start justify-start left-0 pl-0 pr-[0.667px] py-0 top-0 w-64" data-name="Background+VerticalBorder">
      <div aria-hidden="true" className="absolute border-[#364153] border-[0px_0.667px_0px_0px] border-solid inset-0 pointer-events-none" />
      <Container38 />
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

function Margin() {
  return (
    <div className="box-border content-stretch flex flex-col h-8 items-start justify-start pl-0 pr-3 py-0 relative shrink-0 w-11" data-name="Margin">
      <OverlayBorder />
    </div>
  );
}

function Container39() {
  return (
    <div className="content-stretch flex flex-col items-start justify-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Malgun_Gothic:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[13.672px] text-nowrap text-white">
        <p className="leading-[20px] whitespace-pre">Pick-ple</p>
      </div>
    </div>
  );
}

function Container40() {
  return (
    <div className="box-border content-stretch flex h-full items-center justify-start pl-4 pr-0 py-0 relative shrink-0" data-name="Container">
      <Margin />
      <Container39 />
    </div>
  );
}

function Component14() {
  return (
    <div className="relative shrink-0 size-4" data-name="Component 1">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Component 1">
          <path d="M3.33333 8H12.6667" id="Vector" stroke="var(--stroke-0, #D1D5DC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button18() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 size-12" data-name="Button">
      <Component14 />
    </div>
  );
}

function Component15() {
  return (
    <div className="relative shrink-0 size-3" data-name="Component 1">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Component 1">
          <path d={svgPaths.p2471b880} id="Vector" stroke="var(--stroke-0, #D1D5DC)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Button19() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 size-12" data-name="Button">
      <Component15 />
    </div>
  );
}

function Component16() {
  return (
    <div className="relative shrink-0 size-4" data-name="Component 1">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Component 1">
          <path d="M12 4L4 12" id="Vector" stroke="var(--stroke-0, #D1D5DC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M4 4L12 12" id="Vector_2" stroke="var(--stroke-0, #D1D5DC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button20() {
  return (
    <div className="content-stretch flex items-center justify-center relative rounded-tr-[10px] shrink-0 size-12" data-name="Button">
      <Component16 />
    </div>
  );
}

function Container41() {
  return (
    <div className="content-stretch flex h-full items-start justify-start relative shrink-0" data-name="Container">
      <Button18 />
      <Button19 />
      <Button20 />
    </div>
  );
}

function BackgroundHorizontalBorder() {
  return (
    <div className="absolute bg-[#1e2939] box-border content-stretch flex h-12 items-center justify-between left-0 pb-[0.667px] pt-0 px-0 top-[-48px] w-[1424.67px]" data-name="Background+HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[#364153] border-[0px_0px_0.667px] border-solid inset-0 pointer-events-none" />
      <Container40 />
      <Container41 />
    </div>
  );
}

export default function Component() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start justify-center relative size-full" data-name="워크스페이스관리">
      <BackgroundVerticalBorder />
      <BackgroundHorizontalBorder />
      <Container34 />
    </div>
  );
}