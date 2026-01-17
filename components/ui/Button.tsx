import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', isLoading, children, ...props }, ref) => {
        const variants = {
            primary: "bg-linear-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30",
            secondary: "bg-white text-gray-900 hover:bg-gray-50 border border-gray-200 shadow-sm",
            outline: "border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50",
            ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
        };

        return (
            <button
                ref={ref}
                className={cn(
                    "relative inline-flex items-center justify-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed",
                    variants[variant],
                    className
                )}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {children}
            </button>
        );
    }
);
Button.displayName = "Button";
