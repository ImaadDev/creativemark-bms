"use client";

import { forwardRef } from 'react';

const Section = forwardRef(({ 
  title, 
  subtitle,
  icon: Icon, 
  color = 'gray',
  children, 
  className = '',
  headerClassName = '',
  contentClassName = '',
  ...props 
}, ref) => {
  const colorClasses = {
    blue: 'from-blue-50 to-indigo-50 border-blue-200',
    purple: 'from-purple-50 to-pink-50 border-purple-200',
    green: 'from-green-50 to-emerald-50 border-green-200',
    orange: 'from-orange-50 to-yellow-50 border-orange-200',
    red: 'from-red-50 to-pink-50 border-red-200',
    emerald: 'from-emerald-50 to-green-50 border-emerald-200',
    indigo: 'from-indigo-50 to-purple-50 border-indigo-200',
    amber: 'from-amber-50 to-yellow-50 border-amber-200',
    gray: 'from-gray-50 to-gray-100 border-gray-200'
  };

  const iconColorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    green: 'bg-green-100 text-green-600',
    orange: 'bg-orange-100 text-orange-600',
    red: 'bg-red-100 text-red-600',
    emerald: 'bg-emerald-100 text-emerald-600',
    indigo: 'bg-indigo-100 text-indigo-600',
    amber: 'bg-amber-100 text-amber-600',
    gray: 'bg-gray-100 text-gray-600'
  };

  return (
    <div 
      ref={ref}
      className={`bg-white/80 backdrop-blur-sm shadow-xl border border-white/20 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 group ${className}`}
      {...props}
    >
      {(title || Icon) && (
        <div className={`px-8 py-6 bg-gradient-to-r ${colorClasses[color]} border-b ${colorClasses[color].replace('from-', 'border-').replace(' to-', '-')}/50 ${headerClassName}`}>
          <div className="flex items-center space-x-3">
            {Icon && (
              <div className={`p-2 rounded-lg ${iconColorClasses[color]} group-hover:scale-110 transition-transform duration-200`}>
                <Icon className="w-5 h-5" />
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
              {subtitle && (
                <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
              )}
            </div>
          </div>
        </div>
      )}
      
      <div className={`p-8 ${contentClassName}`}>
        {children}
      </div>
    </div>
  );
});

Section.displayName = 'Section';

export default Section;
