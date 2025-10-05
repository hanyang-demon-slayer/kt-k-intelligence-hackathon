import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: "blue" | "green" | "purple" | "orange" | "yellow";
  onClick?: () => void;
}

const colorConfig = {
  blue: {
    bg: "bg-blue-50",
    text: "text-blue-600",
    iconBg: "bg-blue-100",
    iconText: "text-blue-600"
  },
  green: {
    bg: "bg-green-50", 
    text: "text-green-600",
    iconBg: "bg-green-100",
    iconText: "text-green-600"
  },
  purple: {
    bg: "bg-purple-50",
    text: "text-purple-600", 
    iconBg: "bg-purple-100",
    iconText: "text-purple-600"
  },
  orange: {
    bg: "bg-gray-50",
    text: "text-gray-600",
    iconBg: "bg-gray-100", 
    iconText: "text-gray-600"
  },
  yellow: {
    bg: "bg-yellow-50",
    text: "text-yellow-600",
    iconBg: "bg-yellow-100", 
    iconText: "text-yellow-600"
  }
};

export function StatCard({ title, value, icon: Icon, color, onClick }: StatCardProps) {
  const config = colorConfig[color];
  
  return (
    <div 
      className={`${config.bg} rounded-xl p-6 border border-gray-200/50 shadow-sm hover:shadow-md transition-all duration-200 ${onClick ? 'cursor-pointer hover:scale-105' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className={`text-sm ${config.text} mb-1`}>{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`${config.iconBg} p-3 rounded-lg`}>
          <Icon className={`size-6 ${config.iconText}`} />
        </div>
      </div>
    </div>
  );
}