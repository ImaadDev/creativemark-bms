"use client";

import { forwardRef } from 'react';

const SummaryStat = forwardRef(({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color = 'blue',
  trend,
  className = '',
  ...props 
}, ref) => {
  const colorClasses = {
    blue: 'from-blue-50 to-blue-100 border-blue-200 text-blue-700',
    purple: 'from-purple-50 to-purple-100 border-purple-200 text-purple-700',
    green: 'from-green-50 to-green-100 border-green-200 text-green-700',
    orange: 'from-orange-50 to-orange-100 border-orange-200 text-orange-700',
    red: 'from-red-50 to-red-100 border-red-200 text-red-700',
    emerald: 'from-emerald-50 to-emerald-100 border-emerald-200 text-emerald-700',
    indigo: 'from-indigo-50 to-indigo-100 border-indigo-200 text-indigo-700',
    gray: 'from-gray-50 to-gray-100 border-gray-200 text-gray-700'
  };

  const iconColorClasses = {
    blue: 'text-blue-600',
    purple: 'text-purple-600',
    green: 'text-green-600',
    orange: 'text-orange-600',
    red: 'text-red-600',
    emerald: 'text-emerald-600',
    indigo: 'text-indigo-600',
    gray: 'text-gray-600'
  };

  return (
    <div 
      ref={ref}
      className={`bg-gradient-to-br ${colorClasses[color]} border rounded-xl p-6 hover:shadow-lg transition-all duration-200 group ${className}`}
      {...props}
    >
      <div className="flex items-center justify-between mb-4">
        {Icon && (
          <div className={`p-3 rounded-lg bg-white/50 ${iconColorClasses[color]} group-hover:scale-110 transition-transform duration-200`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
        {trend && (
          <div className={`text-sm font-medium ${trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-600'}`}>
            {trend > 0 ? '↗' : trend < 0 ? '↘' : '→'} {Math.abs(trend)}%
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <div className="text-2xl font-bold text-gray-900">
          {value}
        </div>
        <div className="text-sm font-medium text-gray-600">
          {title}
        </div>
        {subtitle && (
          <div className="text-xs text-gray-500">
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
});

SummaryStat.displayName = 'SummaryStat';

export default SummaryStat;
