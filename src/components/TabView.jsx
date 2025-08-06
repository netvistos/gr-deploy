'use client';

import { useState } from 'react';

export function TabView({ children, tabs, defaultTab = 0, onTabChange }) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabClick = (index) => {
    setActiveTab(index);
    if (onTabChange) {
      onTabChange(index);
    }
  };

  return (
    <div className='w-full'>
      {/* Tab Headers */}
      <div className='flex border-b border-gray-200 mb-6'>
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => handleTabClick(index)}
            className={`px-6 py-3 font-medium text-sm transition-colors duration-200 border-b-2 ${
              activeTab === index
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <span className='flex items-center space-x-2'>
              {tab.icon && <span>{tab.icon}</span>}
              <span>{tab.label}</span>
            </span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className='tab-content'>{children[activeTab]}</div>
    </div>
  );
}

// Hook para usar tabs de forma mais simples
export function useTabs(initialTab = 0) {
  const [activeTab, setActiveTab] = useState(initialTab);

  const switchTab = (index) => {
    setActiveTab(index);
  };

  return {
    activeTab,
    switchTab,
    isActive: (index) => activeTab === index,
  };
}
