"use client";

import { forwardRef, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const Tabs = forwardRef(({ 
  tabs, 
  defaultTab,
  className = '',
  tabClassName = '',
  activeTabClassName = '',
  contentClassName = '',
  onTabChange,
  ...props 
}, ref) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || '');

  // Sync with URL query parameter
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && tabs.find(tab => tab.id === tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams, tabs]);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    
    // Update URL with tab parameter
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tabId);
    router.push(`?${params.toString()}`, { scroll: false });
    
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  const activeTabData = tabs.find(tab => tab.id === activeTab) || tabs[0];

  return (
    <div ref={ref} className={className} {...props}>
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab;
            const Icon = tab.icon;
            
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`
                  group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 whitespace-nowrap
                  ${isActive 
                    ? 'border-emerald-500 text-emerald-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                  ${tabClassName}
                  ${isActive ? activeTabClassName : ''}
                `}
                aria-current={isActive ? 'page' : undefined}
                aria-label={tab.label}
              >
                {Icon && (
                  <Icon 
                    className={`
                      mr-3 w-5 h-5 transition-colors duration-200
                      ${isActive ? 'text-emerald-500' : 'text-gray-400 group-hover:text-gray-500'}
                    `} 
                  />
                )}
                {tab.label}
                {tab.badge && (
                  <span className={`
                    ml-2 px-2 py-0.5 rounded-full text-xs font-medium
                    ${isActive 
                      ? 'bg-emerald-100 text-emerald-600' 
                      : 'bg-gray-100 text-gray-600'
                    }
                  `}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className={contentClassName}>
        {activeTabData?.content}
      </div>
    </div>
  );
});

Tabs.displayName = 'Tabs';

export default Tabs;
