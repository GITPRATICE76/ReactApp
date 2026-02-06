import React from "react";

type DashboardCardProps = {
  title?: string;
  subtitle?: string;
  rightContent?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export default function CardComp({
  title,
  subtitle,
  rightContent,
  children,
  className = "",
}: DashboardCardProps) {
  return (
    <div
      className={`
        bg-white rounded-2xl border border-gray-200
        shadow-[0_2px_8px_rgba(0,0,0,0.04)]
        p-5 w-full max-w-sm h-[380px]
        flex flex-col
        ${className}
      `}
    >
      {(title || rightContent) && (
        <div className="flex items-start justify-between mb-5">
          <div>
            {title && (
              <h2 className="text-xl font-semibold text-gray-900 leading-tight">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
        </div>
      )}

      <div className="space-y-4 overflow-y-auto">{children}</div>
    </div>
  );
}
