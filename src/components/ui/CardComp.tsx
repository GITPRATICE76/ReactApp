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
      className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-5 ${className}`}
    >
      {(title || rightContent) && (
        <div className="flex items-start justify-between mb-4">
          <div>
            {title && (
              <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
            )}
            {subtitle && (
              <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>

          {rightContent && <div>{rightContent}</div>}
        </div>
      )}

      <div>{children}</div>
    </div>
  );
}
