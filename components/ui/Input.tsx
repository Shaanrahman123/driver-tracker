import { cn } from "@/lib/utils";
import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, ...props }, ref) => {
        return (
            <div className="space-y-1">
                {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
                <input
                    ref={ref}
                    className={cn(
                        "w-full px-4 py-3 text-gray-900 transition-all duration-200 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-gray-400",
                        error && "border-red-500 focus:ring-red-500",
                        className
                    )}
                    {...props}
                />
                {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
        );
    }
);
Input.displayName = "Input";
