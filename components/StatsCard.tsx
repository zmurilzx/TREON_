import { LucideIcon } from "lucide-react";

interface StatsCardProps {
    label: string;
    value: string | number;
    icon: LucideIcon;
    trend?: {
        value: string;
        positive: boolean;
    };
    variant?: "default" | "success" | "danger" | "warning" | "premium";
}

export default function StatsCard({ label, value, icon: Icon, trend, variant = "default" }: StatsCardProps) {
    const variantStyles = {
        default: "border-white/10",
        success: "border-chrome-500/30 shadow-chrome-sm",
        danger: "border-red-500/30 shadow-danger-glow",
        warning: "border-yellow-500/30 shadow-warning-glow",
        premium: "border-yellow-500/30 shadow-premium-glow bg-gradient-to-br from-yellow-500/5 to-orange-500/5"
    };

    const iconVariantStyles = {
        default: "bg-white/5 text-gray-400",
        success: "bg-chrome-500/10 text-chrome-400",
        danger: "bg-red-500/10 text-red-400",
        warning: "bg-yellow-500/10 text-yellow-400",
        premium: "bg-gradient-to-br from-yellow-500/20 to-orange-500/20 text-yellow-400"
    };

    return (
        <div className={`stats-card ${variantStyles[variant]}`}>
            <div className="flex items-start justify-between mb-3">
                <div className={`p-3 rounded-xl ${iconVariantStyles[variant]}`}>
                    <Icon className="w-6 h-6" />
                </div>
                {trend && (
                    <div className={`stats-trend ${trend.positive ? 'stat-positive' : 'stat-negative'}`}>
                        <span>{trend.positive ? '↑' : '↓'}</span>
                        <span>{trend.value}</span>
                    </div>
                )}
            </div>
            <div className="stats-value">{value}</div>
            <div className="stats-label">{label}</div>
        </div>
    );
}
