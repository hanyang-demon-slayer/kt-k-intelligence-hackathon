import { Building2, BarChart3, Users, Settings, FileCheck } from "lucide-react";
import svgPaths from "../imports/svg-l2ezoveix7";
import imgPickPleLogo from "figma:asset/68ef30948d03254f653ed7463b0a1de5e0d29006.png";
import ktLogo from "figma:asset/033a40190147e69e972521a68e2e3dcaa25d53d0.png";

function Component5() {
  return (
    <div className="relative shrink-0 size-5" data-name="Component 1">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Component 1">
          <path d={svgPaths.p37143280} id="Vector" stroke="var(--stroke-0, #3B82F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p1d7f0000} id="Vector_2" stroke="var(--stroke-0, #3B82F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p2b722f80} id="Vector_3" stroke="var(--stroke-0, #3B82F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M8.33333 5H11.6667" id="Vector_4" stroke="var(--stroke-0, #3B82F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M8.33333 8.33333H11.6667" id="Vector_5" stroke="var(--stroke-0, #3B82F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M8.33333 11.6667H11.6667" id="Vector_6" stroke="var(--stroke-0, #3B82F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M8.33333 15H11.6667" id="Vector_7" stroke="var(--stroke-0, #3B82F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

interface SidebarProps {
  activeMenu: string;
  onMenuChange: (menu: string) => void;
}

export function Sidebar({ activeMenu, onMenuChange }: SidebarProps) {
  return (
    <div className="h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="h-12 flex items-center px-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="size-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center">
            <div className="bg-no-repeat bg-size-[100%_100%] bg-top-left size-5" style={{ backgroundImage: `url('${imgPickPleLogo}')` }} />
          </div>
          <span className="text-gray-900 font-medium">픽플 (Pick-ple)</span>
        </div>
      </div>

      {/* Company Info */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 flex items-center justify-center">
              <img src={ktLogo} alt="KT Logo" className="w-7 h-7 object-contain" />
            </div>
            <div>
              <h3 className="text-gray-900 font-semibold text-sm">KT</h3>
              <p className="text-gray-500 text-xs">K-Intelligence</p>
            </div>
          </div>
          <button 
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
            title="관리자 설정"
          >
            <Settings size={16} />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 py-6 flex flex-col">
        <nav className="space-y-2 flex-1">
          <button 
            onClick={() => onMenuChange('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              activeMenu === 'dashboard' 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <BarChart3 size={16} />
            <span>전체 대시보드</span>
          </button>
          <button 
            onClick={() => onMenuChange('workspace')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              activeMenu === 'workspace' 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Building2 size={16} />
            <span>채용 공고 관리</span>
          </button>
          <button 
            onClick={() => onMenuChange('evaluation')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              activeMenu === 'evaluation' 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FileCheck size={16} />
            <span>지원서 평가</span>
          </button>
          <button 
            onClick={() => onMenuChange('applicants')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              activeMenu === 'applicants' 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Users size={16} />
            <span>지원자 통계</span>
          </button>
        </nav>
        
        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">by 믿:음 2.0 LLM</span>
            <span className="text-xs text-gray-400">version 1.0.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}