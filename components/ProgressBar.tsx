interface ProgressBarProps {
    value: number;
    max?: number;
    label?: string;
    showPercentage?: boolean;
    variant?: "default" | "success" | "warning" | "danger" | "premium";
    size?: "sm" | "md" | "lg";
}

export default function ProgressBar({
    value,
    max = 100,
    label,
    showPercentage = true,
    variant = "success",
    size = "md"
}: ProgressBarProps) {
    const percentage = Math.min((value / max) * 100, 100);

    const sizeStyles = {
        sm: "h-1.5",
        md: "h-2",
        lg: "h-3"
    };

    const variantStyles = {
        default: "from-gray-600 to-gray-400",
        success: "from-chrome-600 to-chrome-400",
        warning: "from-yellow-600 to-yellow-400",
        danger: "from-red-600 to-red-400",
        premium: "from-yellow-600 via-orange-500 to-yellow-400"
    };

    return (
        <div className="w-full">
            {(label || showPercentage) && (
                <div className="flex items-center justify-between mb-2">
                    {label && <span className="text-sm text-gray-400">{label}</span>}
                    {showPercentage && (
                        <span className="text-sm font-semibold text-chrome-400">
                            {percentage.toFixed(0)}%
                        </span>
                    )}
                </div>
            )}
            <div className={`progress-bar ${sizeStyles[size]}`}>
                <div
                    className={`progress-fill bg-gradient-to-r ${variantStyles[variant]}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}
